// src/entities/business.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Service } from './service.entity';
import { BusinessAdmin } from './business-admin.entity';
import { Booking } from './booking.entity';
import { Payment } from './payment.entity';
import { AvailabilitySlot } from './availability-slot.entity';
import { Category } from './category.entity';
import { Review } from './review.entity';
import { Staff } from './staff.entity';
import { BusinessStatus } from '@my-app/shared';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  timezone: string;

  @Column({ type: 'json', nullable: true })
  working_hours: any;

  @Column({
    type: 'enum',
    enum: BusinessStatus,
    default: BusinessStatus.ACTIVE,
  })
  status: BusinessStatus;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => BusinessAdmin, (businessAdmin) => businessAdmin.business)
  admins: BusinessAdmin[];

  @OneToMany(() => Staff, (staff) => staff.business)
  staff: Staff[];

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @OneToMany(() => Booking, (booking) => booking.business)
  bookings: Booking[];

  @OneToMany(() => Payment, (payment) => payment.business)
  payments: Payment[];

  @OneToMany(() => AvailabilitySlot, (slot) => slot.business)
  availabilitySlots: AvailabilitySlot[];

  @OneToMany(() => Review, (review) => review.business)
  reviews: Review[];

  @ManyToMany(() => Category, (category) => category.businesses)
  @JoinTable({
    name: 'business_categories',
    joinColumn: { name: 'business_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
