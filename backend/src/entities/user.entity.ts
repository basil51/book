// src/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { BusinessAdmin } from './business-admin.entity';
import { Booking } from './booking.entity';
import { Payment } from './payment.entity';
import { Notification } from './notification.entity';
import { Review } from './review.entity';
import { Staff } from './staff.entity';
import { UserRole } from '@my-app/shared';

@Entity()
@Index(['email'], { unique: true, where: 'email IS NOT NULL' }) // Partial unique index for email
@Index(['phone'], { unique: true, where: 'phone IS NOT NULL' }) // Partial unique index for phone
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true, unique: false })
  email: string | null;

  @Column({ type: 'varchar', nullable: true, unique: false })
  phone: string | null;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => BusinessAdmin, (businessAdmin) => businessAdmin.user)
  businessAdmins: BusinessAdmin[];

  @OneToMany(() => Staff, (staff) => staff.user)
  staff: Staff[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Notification, (notification) => notification.recipientUser)
  notifications: Notification[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}