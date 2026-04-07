import { IsInt, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStripeIntentDto {
  @IsInt()
  @Min(50)
  amountCents: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;
}
