// src/entities/permission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { UserRole, PermissionAction, AppModule } from '@my-app/shared';

@Entity('permissions')
@Index(['role', 'module', 'action'], { unique: true }) // Prevent duplicate permissions
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: AppModule
  })
  module: AppModule;

  @Column({
    type: 'enum',
    enum: PermissionAction
  })
  action: PermissionAction;

  @Column({ type: 'boolean', default: true })
  isAllowed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}