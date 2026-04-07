import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { BusinessAdmin } from 'src/entities/business-admin.entity';
import { Service } from 'src/entities/service.entity';
import { User } from 'src/entities/user.entity';
import { Booking } from 'src/entities/booking.entity';
import { Business } from 'src/entities/business.entity';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BookingUtilsService } from './utils/booking-utils.service';
import { BookingStatus, UserRole } from '@my-app/shared';
import {
  getOpenCloseForDay,
  weekdayKeyFromYmd,
} from './utils/working-hours.util';
import { NotificationsService } from '../notifications/notifications.service';
import { FindAllBookingsParams } from './dto/find-bookings.dto';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Business) private businessRepo: Repository<Business>,
    @InjectRepository(BusinessAdmin)
    private businessAdminRepo: Repository<BusinessAdmin>,
    private jwtService: JwtService,
    private readonly utils: BookingUtilsService,
    private readonly notifications: NotificationsService,
  ) {}

  private async resolveBusinessBySlugOrId(identifier: string): Promise<Business> {
    const trimmed = identifier?.trim();
    if (!trimmed) {
      throw new BadRequestException('Business slug is required');
    }

    if (/^\d+$/.test(trimmed)) {
      const id = parseInt(trimmed, 10);
      const business = await this.businessRepo.findOne({
        where: { id },
        relations: ['services', 'availabilitySlots'],
      });
      if (!business) {
        throw new NotFoundException(`Business "${identifier}" not found`);
      }
      return business;
    }

    const business = await this.businessRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.services', 'services')
      .leftJoinAndSelect('b.availabilitySlots', 'availabilitySlots')
      .where(
        "LOWER(REPLACE(TRIM(b.name), ' ', '-')) = LOWER(:slug)",
        { slug: decodeURIComponent(trimmed) },
      )
      .getOne();

    if (!business) {
      throw new NotFoundException(`Business "${identifier}" not found`);
    }
    return business;
  }

  async createPublic(dto: CreatePublicBookingDto) {
    const business = await this.resolveBusinessBySlugOrId(dto.slug);

    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
      relations: ['business'],
    });

    if (!service || service.business.id !== business.id) {
      throw new BadRequestException('Invalid service for this business');
    }

    const customerName = dto.customerName ?? dto.name;
    const customerEmail = dto.customerEmail ?? dto.email;
    const customerPhone = dto.customerPhone ?? dto.phone;

    if (!customerName?.trim()) {
      throw new BadRequestException('Customer name is required');
    }
    if (!customerEmail?.trim()) {
      throw new BadRequestException('Customer email is required');
    }
    if (!customerPhone?.trim()) {
      throw new BadRequestException('Customer phone is required');
    }

    let user = await this.userRepo.findOneBy({ email: customerEmail.trim() });

    if (!user) {
      const randomPassword = randomBytes(12).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = this.userRepo.create({
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone.trim(),
        password: hashedPassword,
      });
      user = await this.userRepo.save(user);

      this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
        },
        {
          expiresIn: '1d',
        },
      );
    }

    const requestedStart = new Date(dto.scheduled_at);
    if (Number.isNaN(requestedStart.getTime())) {
      throw new BadRequestException('Invalid scheduled time');
    }
    const requestedEnd = new Date(
      requestedStart.getTime() + service.duration_minutes * 60_000,
    );

    await this.utils.assertNoOverlap(service, requestedStart, requestedEnd);

    const booking = this.bookingRepo.create({
      business,
      service,
      user,
      scheduled_at: requestedStart,
      status: BookingStatus.PENDING,
      notes: dto.notes,
    });

    const savedBooking = await this.bookingRepo.save(booking);

    const whenLocal = requestedStart.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    try {
      if (user.email) {
        await this.notifications.sendBookingConfirmation(
          user.email,
          `Your appointment at ${business.name}`,
          `
            <p>Hello ${user.name},</p>
            <p>Your booking for <strong>${service.name}</strong> is scheduled for <strong>${whenLocal}</strong>.</p>
            <p>${business.name}</p>
          `,
        );
      }
      if (business.email?.trim()) {
        await this.notifications.sendBookingConfirmationToBusiness(
          business.email.trim(),
          {
            businessName: business.name,
            customerName: user.name,
            customerEmail: user.email ?? customerEmail.trim(),
            serviceName: service.name,
            whenLocal,
          },
        );
      }
    } catch (error) {
      this.logger.warn(
        `Notification send failed for booking ${savedBooking.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    return savedBooking;
  }

  async updateWithPermissions(
    id: number,
    dto: UpdateBookingDto,
    user: User,
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'service', 'service.business'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    const isStaff =
      user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
    const isOwner = booking.user?.id === user.id;

    if (dto.notes !== undefined && dto.notes !== null) {
      if (!isStaff && !isOwner) {
        throw new ForbiddenException('Cannot update notes');
      }
      booking.notes = dto.notes;
    }

    if (dto.status !== undefined && dto.status !== null) {
      if (isStaff) {
        return this.updateStatus(id, dto.status, user) as Promise<Booking>;
      }
      if (isOwner && dto.status === BookingStatus.CANCELLED) {
        booking.status = BookingStatus.CANCELLED;
        return this.bookingRepo.save(booking);
      }
      throw new ForbiddenException('Cannot update booking status');
    }

    return this.bookingRepo.save(booking);
  }

  async create(dto: CreateBookingDto, user: User) {
    const business = await this.businessRepo.findOne({
      where: { id: dto.businessId },
      relations: ['services'],
    });

    if (!business) {
      throw new NotFoundException(
        `Business with ID ${dto.businessId} not found`,
      );
    }

    const service = business.services.find((s) => s.id === dto.serviceId);
    if (!service) {
      throw new NotFoundException(
        `Service with ID ${dto.serviceId} not found for business ${dto.businessId}`,
      );
    }

    const requestedStart = new Date(dto.scheduled_at);
    const requestedEnd = new Date(
      requestedStart.getTime() + service.duration_minutes * 60_000,
    );
    await this.utils.assertNoOverlap(service, requestedStart, requestedEnd);

    const booking = this.bookingRepo.create({
      business,
      service,
      user,
      scheduled_at: requestedStart,
      notes: dto.notes,
    });

    return this.bookingRepo.save(booking);
  }

  async findRecentBookings() {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    return this.bookingRepo.find({
      where: {
        scheduled_at: Between(last30Days, new Date()), // Last 30 days
      },
      relations: ['user', 'service'], // Include user & service data
      order: { scheduled_at: 'DESC' }, // Newest first
      take: 10, // Limit to 10 recent bookings
    });
  }

  // Get bookings for the logged-in client
  async findForClient(user: User) {
    return this.bookingRepo.find({
      where: { user: { id: user.id } },
      relations: ['service', 'service.business'],
      order: { scheduled_at: 'ASC' },
    });
  }

  async findForAdmin(user: User) {
    const adminRows = await this.businessAdminRepo.find({
      where: { user: { id: user.id } },
      relations: ['business'],
    });
    const businessIds = adminRows.map((r) => r.business.id);
    if (businessIds.length === 0) {
      return [];
    }
    return this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('service.business', 'business')
      .where('business.id IN (:...ids)', { ids: businessIds })
      .orderBy('booking.scheduled_at', 'DESC')
      .getMany();
  }

  async findAll(params: FindAllBookingsParams = {}): Promise<{
    items: Booking[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { search, status, fromDate, toDate, page = 1, limit = 10 } = params;

    const query = this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.service', 'service')
      .leftJoinAndSelect('service.business', 'business')
      .leftJoinAndSelect('booking.staff', 'staff')
      .where('1 = 1');

    if (search) {
      query.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR service.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('booking.status = :status', { status });
    }

    // Date range filter
    if (fromDate && toDate) {
      query.andWhere('booking.scheduled_at BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    } else if (fromDate) {
      query.andWhere('booking.scheduled_at >= :fromDate', { fromDate });
    } else if (toDate) {
      query.andWhere('booking.scheduled_at <= :toDate', { toDate });
    }

    // Pagination
    const [items, totalItems] = await query
      .orderBy('booking.scheduled_at', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async updateBookingStatus(
    id: number,
    status: BookingStatus,
  ): Promise<Booking | null> {
    await this.bookingRepo.update(id, { status });
    return this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'service'],
    });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'service'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    return booking;
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.bookingRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    return { message: `Booking #${id} removed` };
  }

  async getAvailability(
    businessSlug: string,
    date: string,
    serviceId?: number,
  ) {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Invalid date (use YYYY-MM-DD)');
    }

    const business = await this.resolveBusinessBySlugOrId(businessSlug);

    const parts = date.split('-').map(Number);
    const dayStart = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    const dayEnd = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);

    const bookings = await this.bookingRepo.find({
      where: {
        service: { business: { id: business.id } },
        scheduled_at: Between(dayStart, dayEnd),
        status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
      },
      relations: ['service'],
    });

    const weekdayKey = weekdayKeyFromYmd(date);
    const hours = getOpenCloseForDay(business.working_hours, weekdayKey);
    if (!hours) {
      return { slots: [] };
    }

    const service = serviceId
      ? business.services?.find((s) => s.id === serviceId)
      : business.services?.[0];

    if (!service?.duration_minutes) {
      throw new BadRequestException('No valid service for availability check');
    }

    const [startHour, startMinute] = hours.open.split(':').map(Number);
    const [endHour, endMinute] = hours.close.split(':').map(Number);

    const slots: string[] = [];
    const slotStart = new Date(
      parts[0],
      parts[1] - 1,
      parts[2],
      startHour,
      startMinute,
      0,
      0,
    );
    const slotEndLimit = new Date(
      parts[0],
      parts[1] - 1,
      parts[2],
      endHour,
      endMinute,
      0,
      0,
    );

    while (slotStart < slotEndLimit) {
      const slotEnd = new Date(
        slotStart.getTime() + service.duration_minutes * 60_000,
      );

      const hasConflict = bookings.some((b) => {
        const bStart = new Date(b.scheduled_at);
        const bEnd = new Date(
          bStart.getTime() + (b.service.duration_minutes || 0) * 60_000,
        );
        return slotStart < bEnd && slotEnd > bStart;
      });

      if (!hasConflict) {
        slots.push(slotStart.toISOString());
      }

      slotStart.setTime(
        slotStart.getTime() + service.duration_minutes * 60_000,
      );
    }

    return { slots };
  }

  async updateStatus(id: number, status: BookingStatus, _user: User) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'service', 'service.business'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }

    booking.status = status;
    const saved = await this.bookingRepo.save(booking);

    if (status === BookingStatus.CONFIRMED) {
      const dateStr = saved.scheduled_at.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      const serviceName = booking.service.name;
      if (booking.user.phone) {
        try {
          const msg = `Hi ${booking.user.name}, your appointment for "${serviceName}" on ${dateStr} has been confirmed. See you soon!`;
          await this.notifications.sendWhatsApp(booking.user.phone, msg);
        } catch (e) {
          this.logger.warn(
            `WhatsApp notify failed for booking ${saved.id}`,
            e instanceof Error ? e.message : String(e),
          );
        }
      }
      if (booking.user.email) {
        try {
          await this.notifications.sendBookingConfirmation(
            booking.user.email,
            `Confirmed — ${booking.service.business?.name ?? 'Your appointment'}`,
            `<p>Hi ${booking.user.name},</p><p>Your <strong>${serviceName}</strong> on <strong>${dateStr}</strong> is confirmed.</p>`,
          );
        } catch (e) {
          this.logger.warn(
            `Confirmation email failed for booking ${saved.id}`,
            e instanceof Error ? e.message : String(e),
          );
        }
      }
    }
    return saved;
  }
}
