// src/entities/booking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';
import { Business } from './business.entity';
import { Payment } from './payment.entity';
import { Staff } from './staff.entity';
import { BookingStatus } from '@my-app/shared';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Business, (business) => business.bookings)
  business: Business;

  @ManyToOne(() => Staff, (staff) => staff.bookings, { nullable: true })
  staff: Staff;

  @ManyToOne(() => Service, (service) => service.bookings)
  service: Service;

  @Column({ type: 'timestamp' })
  scheduled_at: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Payment, (payment) => payment.booking)
  payment: Payment;
}
