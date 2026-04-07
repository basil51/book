// src/businesses/businesses.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { Between, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { BusinessAdmin } from 'src/entities/business-admin.entity';
import { Booking } from 'src/entities/booking.entity';
import { Review } from 'src/entities/review.entity';
import { BookingStatus } from '@my-app/shared';
import { BusinessStatus, UserRole } from '@my-app/shared';
import {
  BusinessWithRatingDto,
  BusinessStatsDto,
  TopBusinessDto,
  DashboardResponseDto,
  CalculateStatsDto,
  BusinessStatusDataDto,
  RecentActivityDto,
} from './dto/business-response.dto';

// Constants for better maintainability
const TIME_RANGES = {
  '24h': 1,
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
} as const;

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessAdmin)
    private readonly businessAdminRepo: Repository<BusinessAdmin>,
    @InjectRepository(Booking)
    private readonly bookingsRepo: Repository<Booking>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async getBusinessesForUser(user: User): Promise<Business[]> {
    if (!user?.id) {
      throw new BadRequestException('Valid user is required');
    }

    const adminEntries = await this.businessAdminRepo.find({
      where: { user: { id: user.id } },
      relations: ['business'],
      select: {
        business: {
          id: true,
          name: true,
          description: true,
          status: true,
          logo_url: true,
          created_at: true,
        },
      },
    });
    return adminEntries.map((entry) => entry.business);
  }

  async findByNameWithServices(name: string): Promise<Business> {
    if (!name?.trim()) {
      throw new BadRequestException('Business name is required');
    }

    const business = await this.businessRepository.findOne({
      where: { name: name.trim() },
      relations: ['services', 'categories'],
    });

    if (!business) {
      throw new NotFoundException(`Business with name "${name}" not found`);
    }

    return business;
  }

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    // Check if business name already exists
    const existingBusiness = await this.businessRepository.findOne({
      where: { name: createBusinessDto.name },
    });

    if (existingBusiness) {
      throw new ConflictException(
        `Business with name "${createBusinessDto.name}" already exists`,
      );
    }

    const business = this.businessRepository.create(createBusinessDto);
    return this.businessRepository.save(business);
  }

  /**
   * Public booking flow: resolve by numeric id or by slug (hyphenated name, case-insensitive).
   */
  async findOnePublic(identifier: string): Promise<Business> {
    const trimmed = identifier?.trim();
    if (!trimmed) {
      throw new BadRequestException('Business identifier is required');
    }

    if (/^\d+$/.test(trimmed)) {
      const id = parseInt(trimmed, 10);
      const business = await this.businessRepository.findOne({
        where: { id },
        relations: ['services', 'categories'],
      });
      if (!business) {
        throw new NotFoundException(`Business "${identifier}" not found`);
      }
      return business;
    }

    const business = await this.businessRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.services', 'services')
      .leftJoinAndSelect('b.categories', 'categories')
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

  async findAll(): Promise<BusinessWithRatingDto[]> {
    // Use query builder for better performance with aggregations
    const businesses = await this.businessRepository
      .createQueryBuilder('business')
      .leftJoinAndSelect('business.categories', 'categories')
      .leftJoinAndSelect('business.services', 'services')
      .leftJoin('business.reviews', 'reviews')
      .addSelect([
        'COALESCE(AVG(CAST(reviews.rating AS DECIMAL)), 0) AS avgRating',
        'COUNT(reviews.id) AS reviewCount',
      ])
      .groupBy('business.id')
      .addGroupBy('categories.id')
      .addGroupBy('services.id')
      .getRawAndEntities();

    return businesses.entities.map((business, index) => {
      const raw = businesses.raw[index];
      const avgRating = parseFloat(raw.avgRating) || 0;
      const reviewCount = parseInt(raw.reviewCount) || 0;

      return {
        ...business,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount,
        image: business.logo_url
          ? `/uploads/${business.logo_url}`
          : '/uploads/logo.jpg',
        serviceNames: business.services?.map((service) => service.name) || [],
      };
    });
  }

  async findOne(id: number): Promise<Business> {
    if (!id || id <= 0) {
      throw new BadRequestException('Valid business ID is required');
    }

    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['users', 'services'],
    });

    if (!business) {
      throw new NotFoundException(`Business #${id} not found`);
    }

    return business;
  }

  async update(
    id: number,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    if (!id || id <= 0) {
      throw new BadRequestException('Valid business ID is required');
    }

    const business = await this.businessRepository.findOne({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID "${id}" not found`);
    }

    // Check for name conflicts only if name is being updated
    if (updateBusinessDto.name && updateBusinessDto.name !== business.name) {
      const existingBusiness = await this.businessRepository.findOne({
        where: { name: updateBusinessDto.name },
      });

      if (existingBusiness) {
        throw new ConflictException(
          `Business with name "${updateBusinessDto.name}" already exists`,
        );
      }
    }

    // Use merge for better performance
    const updatedBusiness = this.businessRepository.merge(
      business,
      updateBusinessDto,
    );
    return this.businessRepository.save(updatedBusiness);
  }

  async remove(id: number): Promise<Business> {
    if (!id || id <= 0) {
      throw new BadRequestException('Valid business ID is required');
    }

    const business = await this.businessRepository.findOne({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException(`Business with ID "${id}" not found`);
    }

    return this.businessRepository.remove(business);
  }

  async calculateStats(): Promise<CalculateStatsDto> {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Use Promise.all for parallel execution
    const [totalBookings, pendingBookings, revenueResult, activeStaff] =
      await Promise.all([
        this.bookingsRepo.count({
          where: {
            scheduled_at: Between(last30Days, new Date()),
          },
        }),
        this.bookingsRepo.count({
          where: {
            status: BookingStatus.PENDING,
            scheduled_at: Between(last30Days, new Date()),
          },
        }),
        this.bookingsRepo
          .createQueryBuilder('booking')
          .leftJoin('booking.service', 'service')
          .select('COALESCE(SUM(service.price), 0)', 'sum')
          .where('booking.status = :status', {
            status: BookingStatus.COMPLETED,
          })
          .andWhere('booking.scheduled_at BETWEEN :start AND :end', {
            start: last30Days,
            end: new Date(),
          })
          .getRawOne(),
        this.usersRepo
          .createQueryBuilder('user')
          .innerJoin('user.bookings', 'booking')
          .where('user.role = :role', { role: UserRole.STAFF })
          .getCount(),
      ]);

    return {
      totalBookings,
      pendingBookings,
      totalRevenue: parseFloat(revenueResult.sum) || 0,
      activeStaff,
    };
  }

  async getSettings(): Promise<Business | null> {
    return this.businessRepository.findOne({ where: { id: 1 } });
  }

  async updateSettings(settings: Partial<Business>): Promise<Business | null> {
    await this.businessRepository.update(1, settings);
    return this.getSettings();
  }

  async getBusinessStats(timeRange: string): Promise<BusinessStatsDto> {
    this.validateTimeRange(timeRange);

    const dateRange = this.getDateRange(timeRange);

    // Use Promise.all for parallel execution
    const [bookings, activeBusinesses, totalCustomers] = await Promise.all([
      this.bookingsRepo.find({
        where: {
          created_at: Between(dateRange.start, dateRange.end),
        },
        relations: ['payment', 'business'],
        order: { created_at: 'ASC' },
      }),
      this.businessRepository.count({
        where: {
          status: BusinessStatus.ACTIVE,
        },
      }),
      this.usersRepo.count({
        where: {
          role: UserRole.CLIENT,
        },
      }),
    ]);

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => {
      return (
        sum + (parseFloat(booking.payment?.amount?.toString() || '0') || 0)
      );
    }, 0);

    // Generate trends and top businesses
    const { bookingsTrend, revenueTrend } = this.generateTrends(bookings);
    const topBusinesses = this.generateTopBusinesses(bookings);

    return {
      totalBookings,
      totalRevenue,
      activeBusinesses,
      totalCustomers,
      bookingsTrend,
      revenueTrend,
      topBusinesses,
    };
  }

  async exportBusinessStats(timeRange: string): Promise<string[][]> {
    const stats = await this.getBusinessStats(timeRange);

    return [
      ['Business Reports', ''],
      ['Time Range', timeRange],
      [''],
      ['Summary', ''],
      ['Total Bookings', stats.totalBookings.toString()],
      ['Total Revenue', stats.totalRevenue.toString()],
      ['Active Businesses', stats.activeBusinesses.toString()],
      ['Total Customers', stats.totalCustomers.toString()],
      [''],
      ['Top Performing Businesses', ''],
      ['Business Name', 'Total Bookings', 'Revenue'],
      ...stats.topBusinesses.map((business) => [
        business.name,
        business.bookings.toString(),
        business.revenue.toString(),
      ]),
    ];
  }

  async getDashboardStats(timeRange: string): Promise<DashboardResponseDto> {
    this.validateTimeRange(timeRange);

    const [currentStats, businessStatus, recentActivity, pendingBookings] =
      await Promise.all([
        this.getBusinessStats(timeRange),
        this.getBusinessStatusDistribution(),
        this.getRecentActivity(),
        this.getPendingBookingsCount(),
      ]);

    const revenueData = currentStats.revenueTrend.map((revenue, index) => ({
      name: this.getMonthName(index),
      revenue,
      bookings: currentStats.bookingsTrend[index] || 0,
    }));

    return {
      stats: {
        totalBusinesses: currentStats.activeBusinesses,
        activeBusinesses: currentStats.activeBusinesses,
        totalUsers: currentStats.totalCustomers,
        totalBookings: currentStats.totalBookings,
        pendingBookings,
        totalRevenue: currentStats.totalRevenue,
        monthlyGrowth: 0, // You may want to implement this properly
      },
      revenueData,
      businessStatusData: businessStatus,
      recentActivity,
      topBusinesses: currentStats.topBusinesses,
    };
  }

  // Private helper methods
  private validateTimeRange(timeRange: string): void {
    if (!TIME_RANGES[timeRange as keyof typeof TIME_RANGES]) {
      throw new BadRequestException(`Invalid time range: ${timeRange}`);
    }
  }

  private getDateRange(timeRange: string): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    const days = TIME_RANGES[timeRange as keyof typeof TIME_RANGES] || 7;

    if (timeRange === '1y') {
      start.setFullYear(end.getFullYear() - 1);
    } else {
      start.setDate(end.getDate() - days);
    }

    return { start, end };
  }

  private generateTrends(bookings: Booking[]): {
    bookingsTrend: number[];
    revenueTrend: number[];
  } {
    const bookingsByDay = new Map<string, number>();
    const revenueByDay = new Map<string, number>();

    bookings.forEach((booking) => {
      const dateStr = booking.created_at.toISOString().split('T')[0];

      // Bookings trend
      bookingsByDay.set(dateStr, (bookingsByDay.get(dateStr) || 0) + 1);

      // Revenue trend
      const revenue =
        parseFloat(booking.payment?.amount?.toString() || '0') || 0;
      revenueByDay.set(dateStr, (revenueByDay.get(dateStr) || 0) + revenue);
    });

    return {
      bookingsTrend: Array.from(bookingsByDay.values()),
      revenueTrend: Array.from(revenueByDay.values()),
    };
  }

  private generateTopBusinesses(bookings: Booking[]): TopBusinessDto[] {
    const businessStats = new Map<
      number,
      { name: string; bookings: number; revenue: number }
    >();

    bookings.forEach((booking) => {
      if (!booking.business) return;

      const stats = businessStats.get(booking.business.id) || {
        name: booking.business.name,
        bookings: 0,
        revenue: 0,
      };

      stats.bookings += 1;
      stats.revenue +=
        parseFloat(booking.payment?.amount?.toString() || '0') || 0;
      businessStats.set(booking.business.id, stats);
    });

    return Array.from(businessStats.entries())
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  private async getBusinessStatusDistribution(): Promise<
    BusinessStatusDataDto[]
  > {
    const businessStatus = await this.businessRepository
      .createQueryBuilder('business')
      .select('business.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('business.status')
      .getRawMany();

    return businessStatus.map((status) => ({
      name: status.status,
      value: parseInt(status.count, 10),
      color: this.getStatusColor(status.status),
    }));
  }

  private getStatusColor(status: string): string {
    switch (status as BusinessStatus) {
      case BusinessStatus.ACTIVE:
        return '#10b981';
      case BusinessStatus.PAUSED:
        return '#f59e0b';
      default:
        return '#ef4444';
    }
  }

  private async getPendingBookingsCount(): Promise<number> {
    return this.bookingsRepo.count({
      where: { status: BookingStatus.PENDING },
    });
  }

  private async getRecentActivity(): Promise<RecentActivityDto[]> {
    const recentBookings = await this.bookingsRepo.find({
      order: { created_at: 'DESC' },
      take: 5,
      relations: ['business', 'user', 'payment'],
    });

    return recentBookings.map((booking) => ({
      id: booking.id,
      type: 'booking',
      message: `New booking created at ${booking.business?.name || 'Unknown Business'}`,
      time: this.getTimeAgo(booking.created_at),
      status: booking.payment ? 'success' : 'warning',
    }));
  }

  private getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }

  private getMonthName(index: number): string {
    const currentMonth = new Date().getMonth();
    return MONTH_NAMES[(currentMonth - index + 12) % 12];
  }
}
