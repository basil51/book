import { IsString, IsOptional, IsEmail, IsUrl, IsEnum, IsObject } from 'class-validator';
import { BusinessStatus } from '@my-app/shared';

export class CreateBusinessDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({ require_tld: false }) // allows localhost
  @IsOptional()
  logo_url?: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  timezone: string;

  /** Flexible JSON: arrays per day, `{ open, close }`, or admin UI shape `{ slots, isHoliday }` per day. */
  @IsObject()
  @IsOptional()
  working_hours?: Record<string, unknown>;

  @IsEnum(BusinessStatus)
  @IsOptional()
  status?: BusinessStatus;
}
