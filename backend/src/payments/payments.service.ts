// payments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Payment } from '@/entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentStatus } from '@my-app/shared';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async create(createDto: CreatePaymentDto) {
    const payment = this.paymentRepo.create({
      business: { id: createDto.businessId },
      user: { id: createDto.userId },
      booking: createDto.bookingId ? { id: createDto.bookingId } : undefined,
      amount: createDto.amount,
      payment_method: createDto.payment_method,
      status: createDto.status,
      transaction_reference: createDto.transaction_reference
    });
    return this.paymentRepo.save(payment);
  }

  async findAll(filters?: {
    businessId?: number;
    userId?: number;
    bookingId?: number;
    status?: string;
  }) {
    const where: FindOptionsWhere<Payment> = {};
    
    if (filters?.businessId) where.business = { id: filters.businessId };
    if (filters?.userId) where.user = { id: filters.userId };
    if (filters?.bookingId) where.booking = { id: filters.bookingId };
    if (filters?.status) where.status = filters.status as PaymentStatus;
    
    return this.paymentRepo.find({ 
      where,
      relations: ['business', 'user', 'booking']
    });
  }

  async findOne(id: number) {
    return this.paymentRepo.findOne({
      where: { id },
      relations: ['business', 'user', 'booking']
    });
  }

  async update(id: number, updateDto: UpdatePaymentDto) {
    await this.paymentRepo.update(id, updateDto);
    return this.findOne(id);
  }

  async findUserPayments(userId: number) {
    return this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ['business'],
      order: { created_at: 'DESC' }
    });
  }

  async findBusinessPayments(businessId: number) {
    return this.paymentRepo.find({
      where: { business: { id: businessId } },
      relations: ['user', 'booking'],
      order: { created_at: 'DESC' }
    });
  }
}