import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Business } from '../entities/business.entity';
import { User } from '../entities/user.entity';
import { BusinessAdmin } from '../entities/business-admin.entity';
import { Service } from '../entities/service.entity';
import { Booking } from '../entities/booking.entity';
import { Payment } from '../entities/payment.entity';
import { Notification } from '../entities/notification.entity';
import { Category } from '../entities/category.entity';
import { Review } from '../entities/review.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermissionTemplate } from '../entities/role-permission-template.entity';
import { Staff } from '../entities/staff.entity';
import {
  UserRole,
  BusinessStatus,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  NotificationMethod,
  NotificationType,
  NotificationStatus,
  AppModule,
  PermissionAction,
} from '@my-app/shared';

export const seed = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);
  const businessRepo = dataSource.getRepository(Business);
  const adminRepo = dataSource.getRepository(BusinessAdmin);
  const serviceRepo = dataSource.getRepository(Service);
  const bookingRepo = dataSource.getRepository(Booking);
  const paymentRepo = dataSource.getRepository(Payment);
  const notificationRepo = dataSource.getRepository(Notification);
  const categoryRepo = dataSource.getRepository(Category);
  const reviewRepo = dataSource.getRepository(Review);
  const permissionRepo = dataSource.getRepository(Permission);
  const templateRepo = dataSource.getRepository(RolePermissionTemplate);
  const staffRepo = dataSource.getRepository(Staff);

  // Hash password function
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  // 1. Initialize Permissions
  console.log('🌱 Initializing permissions...');
  const defaultPermissions = [
    // Admin has all permissions
    ...Object.values(AppModule).flatMap((module) =>
      Object.values(PermissionAction).map((action) => ({
        role: UserRole.ADMIN,
        module,
        action,
        isAllowed: true,
      })),
    ),
    // Manager permissions
    ...Object.values(AppModule).flatMap((module) =>
      Object.values(PermissionAction).map((action) => ({
        role: UserRole.MANAGER,
        module,
        action,
        isAllowed:
          module !== AppModule.USERS || action === PermissionAction.VIEW,
      })),
    ),
    // Owner permissions
    ...Object.values(AppModule).flatMap((module) =>
      Object.values(PermissionAction).map((action) => ({
        role: UserRole.OWNER,
        module,
        action,
        isAllowed: [
          AppModule.BUSINESSES,
          AppModule.BOOKINGS,
          AppModule.PAYMENTS,
        ].includes(module),
      })),
    ),
    // Staff permissions
    ...Object.values(AppModule).flatMap((module) =>
      Object.values(PermissionAction).map((action) => ({
        role: UserRole.STAFF,
        module,
        action,
        isAllowed:
          [AppModule.BOOKINGS, AppModule.USERS].includes(module) &&
          (action === PermissionAction.VIEW ||
            action === PermissionAction.UPDATE),
      })),
    ),
    // Client permissions
    ...Object.values(AppModule).flatMap((module) =>
      Object.values(PermissionAction).map((action) => ({
        role: UserRole.CLIENT,
        module,
        action,
        isAllowed:
          [AppModule.BOOKINGS].includes(module) &&
          [PermissionAction.VIEW, PermissionAction.CREATE].includes(action),
      })),
    ),
  ];

  await permissionRepo.save(defaultPermissions);

  // 2. Initialize Role Permission Templates
  console.log('🌱 Initializing role permission templates...');
  const templates = [
    {
      role: UserRole.ADMIN,
      templateName: 'Full Access',
      description: 'Complete system access with all permissions',
      permissions: Object.values(AppModule).map((module) => ({
        module,
        actions: Object.values(PermissionAction).reduce(
          (acc, action) => ({
            ...acc,
            [action]: true,
          }),
          {},
        ),
      })),
    },
    {
      role: UserRole.MANAGER,
      templateName: 'Business Management',
      description: 'Access to manage businesses and view users',
      permissions: Object.values(AppModule).map((module) => ({
        module,
        actions: Object.values(PermissionAction).reduce(
          (acc, action) => ({
            ...acc,
            [action]:
              module !== AppModule.USERS || action === PermissionAction.VIEW,
          }),
          {},
        ),
      })),
    },
  ];

  await templateRepo.save(templates);

  // 3. Categories
  console.log('🌱 Creating categories...');
  const categories = await categoryRepo.save([
    {
      name: 'Hair Salon',
      description: 'Professional hair care and styling services',
      icon_url: 'hair-salon.svg',
      is_active: true,
    },
    {
      name: 'Spa & Wellness',
      description: 'Relaxation and wellness services',
      icon_url: 'spa.svg',
      is_active: true,
    },
    {
      name: 'Nail Salon',
      description: 'Nail care and beauty services',
      icon_url: 'nail-salon.svg',
      is_active: true,
    },
    {
      name: 'Barber Shop',
      description: 'Traditional barber services',
      icon_url: 'barber.svg',
      is_active: true,
    },
  ]);

  // 4. Users
  console.log('🌱 Creating users...');
  const users = {
    admin: await userRepo.save(
      userRepo.create({
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+1234567890',
        password: await hashPassword('Admin123!'),
        role: UserRole.ADMIN,
      }),
    ),
    manager: await userRepo.save(
      userRepo.create({
        name: 'Manager User',
        email: 'manager@example.com',
        phone: '+1234567891',
        password: await hashPassword('Manager123!'),
        role: UserRole.MANAGER,
      }),
    ),
    owner: await userRepo.save(
      userRepo.create({
        name: 'Business Owner',
        email: 'owner@example.com',
        phone: '+1234567892',
        password: await hashPassword('Owner123!'),
        role: UserRole.OWNER,
      }),
    ),
    staff1: await userRepo.save(
      userRepo.create({
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1234567893',
        password: await hashPassword('Staff123!'),
        role: UserRole.STAFF,
      }),
    ),
    staff2: await userRepo.save(
      userRepo.create({
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1234567894',
        password: await hashPassword('Staff123!'),
        role: UserRole.STAFF,
      }),
    ),
    staff3: await userRepo.save(
      userRepo.create({
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '+1234567897',
        password: await hashPassword('Staff123!'),
        role: UserRole.STAFF,
      }),
    ),
    staff4: await userRepo.save(
      userRepo.create({
        name: 'Alex Rodriguez',
        email: 'alex@example.com',
        phone: '+1234567898',
        password: await hashPassword('Staff123!'),
        role: UserRole.STAFF,
      }),
    ),
    client1: await userRepo.save(
      userRepo.create({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567895',
        password: await hashPassword('Client123!'),
        role: UserRole.CLIENT,
      }),
    ),
    client2: await userRepo.save(
      userRepo.create({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567896',
        password: await hashPassword('Client123!'),
        role: UserRole.CLIENT,
      }),
    ),
  };

  // 5. Businesses
  console.log('🌱 Creating businesses...');
  const businesses = await Promise.all([
    businessRepo.save(
      businessRepo.create({
        name: 'Elite Hair Salon',
        description: 'Premium hair styling and care services',
        logo_url: undefined,
        address: '123 Fashion Street, Downtown',
        phone: '+1234567001',
        email: 'contact@elitehair.com',
        timezone: 'America/New_York',
        status: BusinessStatus.ACTIVE,
        working_hours: {
          monday: { open: '09:00', close: '20:00' },
          tuesday: { open: '09:00', close: '20:00' },
          wednesday: { open: '09:00', close: '20:00' },
          thursday: { open: '09:00', close: '20:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '10:00', close: '18:00' },
          sunday: { open: '10:00', close: '16:00' },
        },
        categories: [categories[0], categories[3]],
      }),
    ),
    businessRepo.save(
      businessRepo.create({
        name: 'Serenity Spa',
        description: 'Luxury spa and wellness center',
        logo_url: undefined,
        address: '456 Wellness Avenue, Uptown',
        phone: '+1234567002',
        email: 'info@serenityspa.com',
        timezone: 'America/New_York',
        status: BusinessStatus.ACTIVE,
        working_hours: {
          monday: { open: '10:00', close: '19:00' },
          tuesday: { open: '10:00', close: '19:00' },
          wednesday: { open: '10:00', close: '19:00' },
          thursday: { open: '10:00', close: '19:00' },
          friday: { open: '10:00', close: '19:00' },
          saturday: { open: '11:00', close: '17:00' },
          sunday: { open: '11:00', close: '16:00' },
        },
        categories: [categories[1]],
      }),
    ),
  ]);

  // 6. Business Admins
  console.log('🌱 Assigning business admins...');
  await Promise.all([
    adminRepo.save(
      adminRepo.create({
        user: users.owner,
        business: businesses[0],
        is_owner: true,
      }),
    ),
    adminRepo.save(
      adminRepo.create({
        user: users.owner,
        business: businesses[1],
        is_owner: true,
      }),
    ),
  ]);

  // 7. Staff
  console.log('🌱 Creating staff profiles...');
  const staffMembers = await Promise.all([
    staffRepo.save(
      staffRepo.create({
        user: users.staff1,
        business: businesses[0],
        position: 'Senior Hair Stylist',
        bio: 'Experienced hair stylist with 8+ years in the industry. Specializes in modern cuts and color techniques.',
        avatar_url: 'sarah-avatar.jpg',
        specializations: ['Hair Coloring', 'Modern Cuts', 'Styling'],
        working_hours: {
          monday: [{ open: '09:00', close: '17:00' }],
          tuesday: [{ open: '09:00', close: '17:00' }],
          wednesday: [{ open: '09:00', close: '17:00' }],
          thursday: [{ open: '09:00', close: '17:00' }],
          friday: [{ open: '09:00', close: '17:00' }],
          saturday: [{ open: '10:00', close: '16:00' }],
        },
        is_active: true,
      }),
    ),
    staffRepo.save(
      staffRepo.create({
        user: users.staff2,
        business: businesses[0],
        position: 'Barber',
        bio: 'Traditional barber with expertise in classic cuts and beard grooming.',
        avatar_url: 'mike-avatar.jpg',
        specializations: ['Classic Cuts', 'Beard Grooming', 'Fades'],
        working_hours: {
          monday: [{ open: '09:00', close: '17:00' }],
          tuesday: [{ open: '09:00', close: '17:00' }],
          wednesday: [{ open: '09:00', close: '17:00' }],
          thursday: [{ open: '09:00', close: '17:00' }],
          friday: [{ open: '09:00', close: '17:00' }],
          saturday: [{ open: '10:00', close: '16:00' }],
        },
        is_active: true,
      }),
    ),
    staffRepo.save(
      staffRepo.create({
        user: users.staff3,
        business: businesses[1],
        position: 'Massage Therapist',
        bio: 'Certified massage therapist specializing in Swedish and deep tissue massage.',
        avatar_url: 'emma-avatar.jpg',
        specializations: ['Swedish Massage', 'Deep Tissue', 'Hot Stone'],
        working_hours: {
          monday: [{ open: '10:00', close: '18:00' }],
          tuesday: [{ open: '10:00', close: '18:00' }],
          wednesday: [{ open: '10:00', close: '18:00' }],
          thursday: [{ open: '10:00', close: '18:00' }],
          friday: [{ open: '10:00', close: '18:00' }],
          saturday: [{ open: '11:00', close: '16:00' }],
        },
        is_active: true,
      }),
    ),
    staffRepo.save(
      staffRepo.create({
        user: users.staff4,
        business: businesses[1],
        position: 'Esthetician',
        bio: 'Licensed esthetician with expertise in facial treatments and skincare.',
        avatar_url: 'alex-avatar.jpg',
        specializations: ['Facial Treatments', 'Skincare', 'Anti-aging'],
        working_hours: {
          monday: [{ open: '10:00', close: '18:00' }],
          tuesday: [{ open: '10:00', close: '18:00' }],
          wednesday: [{ open: '10:00', close: '18:00' }],
          thursday: [{ open: '10:00', close: '18:00' }],
          friday: [{ open: '10:00', close: '18:00' }],
          saturday: [{ open: '11:00', close: '16:00' }],
        },
        is_active: true,
      }),
    ),
  ]);

  // 8. Services
  console.log('🌱 Creating services...');
  const services = await Promise.all([
    // Hair Salon Services
    serviceRepo.save(
      serviceRepo.create({
        name: 'Haircut & Styling',
        description: 'Professional haircut and styling service',
        duration_minutes: 60,
        price: 45.0,
        business: businesses[0],
        is_active: true,
      }),
    ),
    serviceRepo.save(
      serviceRepo.create({
        name: 'Hair Coloring',
        description: 'Professional hair coloring service',
        duration_minutes: 120,
        price: 85.0,
        business: businesses[0],
        is_active: true,
      }),
    ),
    // Spa Services
    serviceRepo.save(
      serviceRepo.create({
        name: 'Swedish Massage',
        description: 'Relaxing full-body massage',
        duration_minutes: 60,
        price: 75.0,
        business: businesses[1],
        is_active: true,
      }),
    ),
    serviceRepo.save(
      serviceRepo.create({
        name: 'Facial Treatment',
        description: 'Rejuvenating facial treatment',
        duration_minutes: 90,
        price: 95.0,
        business: businesses[1],
        is_active: true,
      }),
    ),
  ]);

  // 9. Availability Slots (Updated to use staff instead of users)
  console.log('🌱 Creating availability slots...');

  // 10. Bookings and Payments (Updated to include staff)
  console.log('🌱 Creating bookings and payments...');
  const bookings = await Promise.all([
    // Hair Salon Bookings
    bookingRepo.save(
      bookingRepo.create({
        user: users.client1,
        business: businesses[0],
        staff: staffMembers[0], // Sarah Johnson
        service: services[0],
        scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: BookingStatus.CONFIRMED,
        notes: 'First time visit',
      }),
    ),
    bookingRepo.save(
      bookingRepo.create({
        user: users.client2,
        business: businesses[0],
        staff: staffMembers[1], // Mike Chen
        service: services[1],
        scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        status: BookingStatus.PENDING,
        notes: 'Regular customer',
      }),
    ),
    // Spa Bookings
    bookingRepo.save(
      bookingRepo.create({
        user: users.client1,
        business: businesses[1],
        staff: staffMembers[2], // Emma Davis
        service: services[2],
        scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: BookingStatus.CONFIRMED,
        notes: 'Birthday treat',
      }),
    ),
    bookingRepo.save(
      bookingRepo.create({
        user: users.client2,
        business: businesses[1],
        staff: staffMembers[3], // Alex Rodriguez
        service: services[3],
        scheduled_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: BookingStatus.PENDING,
        notes: 'Regular monthly treatment',
      }),
    ),
  ]);

  // Create payments for confirmed bookings
  await Promise.all(
    bookings
      .filter((booking) => booking.status === BookingStatus.CONFIRMED)
      .map((booking) =>
        paymentRepo.save(
          paymentRepo.create({
            user: booking.user,
            business: booking.business,
            booking: booking,
            amount: booking.service.price,
            status: PaymentStatus.COMPLETED,
            payment_method: PaymentMethod.CARD,
            transaction_reference: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          }),
        ),
      ),
  );

  // 11. Reviews
  console.log('🌱 Creating reviews...');
  await Promise.all([
    reviewRepo.save(
      reviewRepo.create({
        business: businesses[0],
        user: users.client1,
        staff: staffMembers[0],
        rating: 5.0,
        comment: 'Excellent service! Sarah is very professional and skilled.',
        is_verified: true,
      }),
    ),
    reviewRepo.save(
      reviewRepo.create({
        business: businesses[1],
        user: users.client2,
        staff: staffMembers[2],
        rating: 4.5,
        comment: 'Great massage experience. Emma is very attentive.',
        is_verified: true,
      }),
    ),
  ]);

  // 12. Notifications
  console.log('🌱 Creating notifications...');
  await Promise.all([
    notificationRepo.save(
      notificationRepo.create({
        recipientUser: users.client1,
        type: NotificationType.BOOKING,
        title: 'Booking Confirmed',
        message: 'Your appointment at Elite Hair Salon has been confirmed.',
        status: NotificationStatus.SENT,
        NotificationMethod: NotificationMethod.EMAIL,
      }),
    ),
    notificationRepo.save(
      notificationRepo.create({
        recipientUser: users.client2,
        type: NotificationType.REMINDER,
        title: 'Upcoming Appointment',
        message: 'Reminder: You have an appointment at Serenity Spa tomorrow.',
        status: NotificationStatus.SENT,
        NotificationMethod: NotificationMethod.SMS,
      }),
    ),
  ]);

  console.log('✅ Seed completed successfully!');
};
