import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePublicBookingDto {
  /** URL segment: numeric id or slug */
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  businessName?: string;

  @Type(() => Number)
  @IsInt()
  serviceId: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  /** Alias from booking form */
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  scheduled_at: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
