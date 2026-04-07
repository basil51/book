// src/availability-slots/entities/availability-slot.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Business } from './business.entity';
import { Service } from './service.entity';
import { Staff } from './staff.entity';

@Entity()
export class AvailabilitySlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.availabilitySlots)
  business: Business;

  @Column('int')
  weekday: number; // 0-6 (Sunday-Saturday)

  @Column('time')
  start_time: string;

  @Column('time')
  end_time: string;

  @ManyToOne(() => Service, (service) => service.availabilitySlots, {
    nullable: true,
  })
  service: Service;

  @ManyToOne(() => Staff, (staff) => staff.availabilitySlots, {
    nullable: true,
  })
  staff: Staff;
}
