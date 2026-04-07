// src/entities/role-permission-template.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole, PermissionAction, AppModule } from '@my-app/shared';

@Entity('role_permission_templates')
export class RolePermissionTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255 })
  templateName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json' })
  permissions: {
    module: AppModule;
    actions: {
      [key in PermissionAction]: boolean;
    };
  }[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}