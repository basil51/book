import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '@my-app/shared';

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
