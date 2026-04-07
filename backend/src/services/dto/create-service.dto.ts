// src/services/dto/create-service.dto.ts
import { IsString, IsInt, IsOptional, Min, IsDecimal } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  duration_min: number;

  @IsOptional()
  @IsDecimal()
  price?: number;
}
