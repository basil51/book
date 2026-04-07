// src/business-admins/entities/business-admin.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Business } from './business.entity';

@Entity()
export class BusinessAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.businessAdmins)
  user: User;

  @ManyToOne(() => Business, (business) => business.admins)
  business: Business;

  @Column({ default: false })
  is_owner: boolean;

  @CreateDateColumn()
  created_at: Date;
}
