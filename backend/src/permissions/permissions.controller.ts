// src/modules/permissions/permissions.controller.ts
import { Controller, Get, Put, Body, Param, UseGuards, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UserRole, PermissionAction, AppModule } from '@my-app/shared';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator'

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('matrix')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async getPermissionMatrix() {
    return this.permissionsService.getPermissionMatrix();
  }

  @Get('role/:role')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async getPermissionsByRole(@Param('role') role: UserRole) {
    return this.permissionsService.getPermissionsByRole(role);
  }

  @Put('role/:role')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  async updateRolePermissions(
    @Param('role') role: UserRole,
    @Body() permissions: Array<{
      module: AppModule;
      action: PermissionAction;
      isAllowed: boolean;
    }>
  ) {
    return this.permissionsService.updateRolePermissions(role, permissions);
  }

  @Post('initialize')
  @Roles(UserRole.ADMIN)
  async initializeDefaultPermissions() {
    await this.permissionsService.initializeDefaultPermissions();
    return { message: 'Default permissions initialized successfully' };
  }
}
