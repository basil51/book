// src/data-source.ts
import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

// Load backend/.env so `pnpm seed` and CLI use the same DB settings as Nest (not hardcoded).
config({ path: resolve(__dirname, '../.env') });
import { Business } from './entities/business.entity';
import { Booking } from './entities/booking.entity';
import { Notification } from './entities/notification.entity';
import { User } from './entities/user.entity';
import { Service } from './entities/service.entity';
import { AvailabilitySlot } from './entities/availability-slot.entity';
import { BusinessAdmin } from './entities/business-admin.entity';
import { Payment } from './entities/payment.entity';
import { Review } from './entities/review.entity';
import { Permission } from './entities/permission.entity';
import { RolePermissionTemplate } from './entities/role-permission-template.entity';
import { Category } from './entities/category.entity';
import { Staff } from './entities/staff.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'appointment',
  synchronize: true,
  logging: false,
  entities: [
    Business,
    Booking,
    Notification,
    User,
    Service,
    BusinessAdmin,
    Payment,
    AvailabilitySlot,
    Review,
    Permission,
    RolePermissionTemplate,
    Category,
    Staff,
  ],
});
