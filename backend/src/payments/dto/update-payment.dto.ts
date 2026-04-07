// update-payment.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { IsOptional } from 'class-validator';
import { PaymentStatus } from '@my-app/shared';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {

  @IsOptional()
  status?: PaymentStatus;

}