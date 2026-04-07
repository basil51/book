// create-payment.dto.ts
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '@my-app/shared';

export class CreatePaymentDto {
  @IsNumber()
  businessId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  @IsOptional()
  bookingId?: number;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus = PaymentStatus.PENDING;

  @IsString()
  @IsOptional()
  transaction_reference?: string;
}