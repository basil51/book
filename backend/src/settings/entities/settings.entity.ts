import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    defaultReminderTime: number;
  };

  @Column('jsonb')
  appointments: {
    minBookingNotice: number;
    maxFutureBooking: number;
    defaultDuration: number;
    allowRescheduling: boolean;
    allowCancellation: boolean;
    cancellationDeadline: number;
  };

  @Column('jsonb')
  payments: {
    currency: string;
    allowedMethods: string[];
    autoCapture: boolean;
    refundWindow: number;
  };

  @Column('jsonb')
  localization: {
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    language: string;
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 