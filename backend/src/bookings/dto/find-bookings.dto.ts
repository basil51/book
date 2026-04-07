// src/bookings/dto/find-bookings.dto.ts
import { BookingStatus } from '@my-app/shared';
import { IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class FindAllBookingsParams {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: Date;

  @IsOptional()
  @IsDateString()
  toDate?: Date;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}