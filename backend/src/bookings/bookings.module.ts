import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/entities/booking.entity';
import { Service } from '@/entities/service.entity';
import { User } from '@/entities/user.entity';
import { Business } from 'src/entities/business.entity';
import { BusinessAdmin } from 'src/entities/business-admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '@/notifications/notifications.module';
import { BookingUtilsService } from './utils/booking-utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Service, User, Business, BusinessAdmin]),
   NotificationsModule,
   JwtModule.register({}), // 👈 Add this
],
  controllers: [BookingsController],
  providers: [BookingsService, BookingUtilsService],
  exports: [BookingsService]
})
export class BookingsModule {}
