import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Business } from '../entities/business.entity';
import { Staff } from '../entities/staff.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
    const business = await this.businessRepository.findOne({
      where: { id: createReviewDto.businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let staff: Staff | null = null;
    if (createReviewDto.staffId) {
      staff = await this.staffRepository.findOne({
        where: { id: createReviewDto.staffId },
      });
      if (!staff) {
        throw new NotFoundException('Staff not found');
      }
    }

    const review = new Review();
    review.rating = createReviewDto.rating;
    review.comment = createReviewDto.comment || '';
    review.business = business;
    review.user = user;
    if (staff) {
      review.staff = staff;
    }
    review.is_verified = createReviewDto.is_verified ?? true;

    return this.reviewsRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewsRepository.find({
      relations: ['business', 'user', 'staff'],
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['business', 'user', 'staff'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async findByBusiness(businessId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { business: { id: businessId } },
      relations: ['user', 'staff'],
    });
  }

  async findByStaff(staffId: number): Promise<Review[]> {
    return this.reviewsRepository.find({
      where: { staff: { id: staffId } },
      relations: ['business', 'user'],
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.reviewsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Review not found');
    }
  }
} 