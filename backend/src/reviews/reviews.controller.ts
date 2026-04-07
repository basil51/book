import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Review } from '../entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createReviewDto: CreateReviewDto, @Request() req): Promise<Review> {
    return this.reviewsService.create(createReviewDto, req.user.id);
  }

  @Get()
  findAll(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(+id);
  }

  @Get('business/:businessId')
  findByBusiness(@Param('businessId') businessId: string): Promise<Review[]> {
    return this.reviewsService.findByBusiness(+businessId);
  }

  @Get('staff/:staffId')
  findByStaff(@Param('staffId') staffId: string): Promise<Review[]> {
    return this.reviewsService.findByStaff(+staffId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.reviewsService.remove(+id);
  }
} 