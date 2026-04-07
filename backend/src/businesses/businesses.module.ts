import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { User } from '@/entities/user.entity';
import { BusinessAdmin } from 'src/entities/business-admin.entity';
import { Booking } from 'src/entities/booking.entity';
import { Review } from 'src/entities/review.entity';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, BusinessAdmin, User, Booking, Review]),
    PermissionsModule
  ],
  controllers: [BusinessesController],
  providers: [BusinessesService],
  exports: [BusinessesService],
})
export class BusinessesModule {}
