import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { User } from '../entities/user.entity';
import { Business } from '../entities/business.entity';
import { Review } from '../entities/review.entity';
import { UserRole } from '@my-app/shared';

export interface CreateStaffDto {
  userId: number;
  businessId: number;
  position?: string;
  bio?: string;
  avatar_url?: string;
  specializations?: string[];
  working_hours?: Record<string, { start: string; end: string }>;
}

export interface UpdateStaffDto {
  position?: string;
  bio?: string;
  avatar_url?: string;
  specializations?: string[];
  working_hours?: any;
  is_active?: boolean;
}

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const user = await this.userRepository.findOne({
      where: { id: createStaffDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.STAFF) {
      throw new BadRequestException('User must have STAFF role');
    }

    const business = await this.businessRepository.findOne({
      where: { id: createStaffDto.businessId },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Check if staff already exists for this user and business
    const existingStaff = await this.staffRepository.findOne({
      where: {
        user: { id: createStaffDto.userId },
        business: { id: createStaffDto.businessId },
      },
    });

    if (existingStaff) {
      throw new BadRequestException(
        'Staff already exists for this user and business',
      );
    }

    const staff = this.staffRepository.create({
      user,
      business,
      position: createStaffDto.position,
      bio: createStaffDto.bio,
      avatar_url: createStaffDto.avatar_url,
      specializations: createStaffDto.specializations,
      working_hours: createStaffDto.working_hours,
    });

    return this.staffRepository.save(staff);
  }

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find({
      relations: ['user', 'business'],
    });
  }

  async findByBusiness(businessId: number): Promise<Staff[]> {
    return this.staffRepository.find({
      where: { business: { id: businessId } },
      relations: ['user', 'business'],
    });
  }

  async findOne(id: number): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user', 'business'],
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return staff;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);
    Object.assign(staff, updateStaffDto);
    return this.staffRepository.save(staff);
  }

  async remove(id: number): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepository.remove(staff);
  }

  async getStaffRating(staffId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    reviews: Review[];
  }> {
    await this.findOne(staffId);
    const reviews = await this.reviewRepository.find({
      where: { staff: { id: staffId } },
      relations: ['user'],
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      };
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0,
    );
    const averageRating = totalRating / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      reviews,
    };
  }

  async getBusinessStaffRatings(businessId: number): Promise<
    Array<{
      staff: Staff;
      rating: {
        averageRating: number;
        totalReviews: number;
      };
    }>
  > {
    const staffMembers = await this.findByBusiness(businessId);
    const staffRatings: Array<{
      staff: Staff;
      rating: {
        averageRating: number;
        totalReviews: number;
      };
    }> = [];

    for (const staff of staffMembers) {
      const rating = await this.getStaffRating(staff.id);
      staffRatings.push({
        staff,
        rating: {
          averageRating: rating.averageRating,
          totalReviews: rating.totalReviews,
        },
      });
    }

    return staffRatings;
  }
}
