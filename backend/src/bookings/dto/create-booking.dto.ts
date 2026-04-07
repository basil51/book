import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty, IsISO8601, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  businessId: number;

  @IsNumber()
  serviceId: number;

  @IsString()
  scheduled_at: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('PS') // any region
  phone: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
