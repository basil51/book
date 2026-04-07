// src/businesses/dto/business-response.dto.ts
import { Business } from 'src/entities/business.entity';

export class BusinessWithRatingDto {
  id: number;
  name: string;
  description?: string;
  status: string;
  logo_url?: string;
  created_at: Date;
  rating: number;
  reviewCount: number;
  image: string;
  serviceNames: string[];
  categories?: any[];
  services?: any[];
}

export class TopBusinessDto {
  id: number;
  name: string;
  bookings: number;
  revenue: number;
}

export class BusinessStatsDto {
  totalBookings: number;
  totalRevenue: number;
  activeBusinesses: number;
  totalCustomers: number;
  bookingsTrend: number[];
  revenueTrend: number[];
  topBusinesses: TopBusinessDto[];
}

export class RevenueDataDto {
  name: string;
  revenue: number;
  bookings: number;
}

export class BusinessStatusDataDto {
  name: string;
  value: number;
  color: string;
}

export class RecentActivityDto {
  id: number;
  type: string;
  message: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export class DashboardStatsDto {
  totalBusinesses: number;
  activeBusinesses: number;
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export class DashboardResponseDto {
  stats: DashboardStatsDto;
  revenueData: RevenueDataDto[];
  businessStatusData: BusinessStatusDataDto[];
  recentActivity: RecentActivityDto[];
  topBusinesses: TopBusinessDto[];
}

export class CalculateStatsDto {
  totalBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  activeStaff: number;
}