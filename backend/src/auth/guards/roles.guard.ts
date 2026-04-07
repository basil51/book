import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole, PermissionAction, AppModule } from '@my-app/shared';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check required roles
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Check required permission
    const requiredPermission = this.reflector.get<{
      module: AppModule;
      action: PermissionAction;
    }>('permission', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // If roles are required, check if user has one of the required roles
    if (requiredRoles && requiredRoles.length > 0) {
      console.log('User role:', user.role, 'Required roles:', requiredRoles);
      if (!requiredRoles.includes(user.role)) {
        return false;
      }
    }

    // If specific permission is required, check if user has it
    if (requiredPermission) {
      return this.permissionsService.hasPermission(
        user.role,
        requiredPermission.module,
        requiredPermission.action,
      );
    }

    return true;
  }
}
