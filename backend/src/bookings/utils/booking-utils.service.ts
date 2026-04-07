import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from 'src/entities/service.entity';
import { Repository, Between, In } from 'typeorm';
import { Booking } from 'src/entities/booking.entity';
import { BookingStatus } from '@my-app/shared';

@Injectable()
export class BookingUtilsService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,

    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>
  ) {}

  async getValidServiceAndTime(dto: {
    serviceId: number;
    scheduled_at: string;
  }): Promise<{
    service: Service;
    requestedStart: Date;
    requestedEnd: Date;
  }> {
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
      relations: ['business'],
    });

    if (!service) throw new NotFoundException('Service not found');

    const requestedStart = new Date(dto.scheduled_at);
    if (isNaN(requestedStart.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const requestedEnd = new Date(requestedStart.getTime() + service.duration_minutes * 60000);

    return { service, requestedStart, requestedEnd };
  }

  /**
   * True interval overlap: [start, end) vs existing bookings' [bStart, bEnd).
   */
  async assertNoOverlap(
    service: Service,
    requestedStart: Date,
    requestedEnd: Date,
  ): Promise<void> {
    const dayMs = 24 * 60 * 60 * 1000;
    const windowStart = new Date(requestedStart.getTime() - dayMs);
    const windowEnd = new Date(requestedEnd.getTime() + dayMs);

    const candidates = await this.bookingRepo.find({
      where: {
        service: { id: service.id },
        status: In([
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.COMPLETED,
        ]),
        scheduled_at: Between(windowStart, windowEnd),
      },
      relations: ['service'],
    });

    for (const b of candidates) {
      const bStart = new Date(b.scheduled_at);
      const dur = b.service?.duration_minutes ?? service.duration_minutes;
      const bEnd = new Date(bStart.getTime() + dur * 60_000);
      if (requestedStart < bEnd && requestedEnd > bStart) {
        throw new ConflictException('This time slot is already booked');
      }
    }
  }
}
