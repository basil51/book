import { Module, Global } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { RolePermissionTemplate } from 'src/entities/role-permission-template.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([
    Permission,
    RolePermissionTemplate
  ])],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService]
})
export class PermissionsModule {}
