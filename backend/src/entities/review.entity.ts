import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { User } from './user.entity';
import { Staff } from './staff.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Business, (business) => business.reviews)
  business: Business;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @ManyToOne(() => Staff, (staff) => staff.reviews, { nullable: true })
  staff: Staff;

  @Column('decimal', { precision: 2, scale: 1, default: 1.0 })
  rating: number; // Rating from 1.0 to 5.0

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ default: true })
  is_verified: boolean; // Whether the review is from a verified customer

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
