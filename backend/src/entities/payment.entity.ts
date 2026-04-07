// src/payments/entities/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Business } from './business.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { PaymentStatus, PaymentMethod } from '@my-app/shared';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.payments)
  business: Business;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @ManyToOne(() => Booking, (booking) => booking.payment, { nullable: true })
  booking: Booking;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  transaction_reference: string;

  @CreateDateColumn()
  created_at: Date;
}