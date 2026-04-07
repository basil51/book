import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  businessId: number;

  @IsNumber()
  @IsOptional()
  staffId?: number;

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}
