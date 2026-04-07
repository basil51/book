// src/entities/notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Booking } from './booking.entity';
import { Payment } from './payment.entity';
import {
  NotificationMethod,
  NotificationStatus,
  NotificationType,
} from '@my-app/shared';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  recipientUser: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({
    type: 'enum',
    enum: NotificationMethod,
    default: NotificationMethod.EMAIL,
  })
  NotificationMethod: NotificationMethod;

  @CreateDateColumn()
  sent_at: Date;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.SENT,
  })
  status: NotificationStatus;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @ManyToOne(() => Booking, { nullable: true })
  booking: Booking | null;

  @ManyToOne(() => Payment, { nullable: true })
  payment: Payment | null;
}
