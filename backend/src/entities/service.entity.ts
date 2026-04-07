
// src/entities/service.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Business } from './business.entity';
import { Booking } from './booking.entity';
import { AvailabilitySlot } from './availability-slot.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
  
  @Column('int')
  duration_minutes: number;

  @Column('decimal', { nullable: true })
  price: number;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Business, (business) => business.services)
  business: Business;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @OneToMany(() => AvailabilitySlot, (slot) => slot.service)
  availabilitySlots: AvailabilitySlot[];
}
