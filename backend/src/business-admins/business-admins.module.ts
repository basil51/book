import { Module } from '@nestjs/common';
import { BusinessAdminsService } from './business-admins.service';
import { BusinessAdminsController } from './business-admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessAdmin } from 'src/entities/business-admin.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessAdmin, User])
  ],
  providers: [BusinessAdminsService],
  controllers: [BusinessAdminsController],
  exports: [BusinessAdminsService]
})
export class BusinessAdminsModule {}
