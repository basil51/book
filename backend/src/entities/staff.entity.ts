import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Business } from './business.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
import { AvailabilitySlot } from './availability-slot.entity';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.staff)
  user: User;

  @ManyToOne(() => Business, (business) => business.staff)
  business: Business;

  @Column({ nullable: true })
  position: string; // e.g., "Hair Stylist", "Massage Therapist", etc.

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'json', nullable: true })
  specializations: string[]; // Array of service specializations

  @Column({ type: 'json', nullable: true })
  working_hours: any; // Staff-specific working hours

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Booking, (booking) => booking.staff)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.staff)
  reviews: Review[];

  @OneToMany(() => AvailabilitySlot, (slot) => slot.staff)
  availabilitySlots: AvailabilitySlot[];
} 