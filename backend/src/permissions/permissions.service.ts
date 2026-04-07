// src/modules/permissions/permissions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { RolePermissionTemplate } from 'src/entities/role-permission-template.entity';
import { UserRole, PermissionAction, AppModule } from '@my-app/shared';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermissionTemplate)
    private templateRepository: Repository<RolePermissionTemplate>,
  ) {}

  // Check if user has permission
  async hasPermission(
    role: UserRole,
    module: AppModule,
    action: PermissionAction
  ): Promise<boolean> {
    const permission = await this.permissionRepository.findOne({
      where: { role, module, action }
    });

    return permission ? permission.isAllowed : false;
  }

  // Get all permissions for a role
  async getPermissionsByRole(role: UserRole): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { role },
      order: { module: 'ASC', action: 'ASC' }
    });
  }

  // Update permission
  async updatePermission(
    role: UserRole,
    module: AppModule,
    action: PermissionAction,
    isAllowed: boolean
  ): Promise<Permission> {
    let permission = await this.permissionRepository.findOne({
      where: { role, module, action }
    });

    if (!permission) {
      permission = this.permissionRepository.create({
        role,
        module,
        action,
        isAllowed
      });
    } else {
      permission.isAllowed = isAllowed;
    }

    return this.permissionRepository.save(permission);
  }

  // Bulk update permissions for a role
  async updateRolePermissions(
    role: UserRole,
    permissions: Array<{
      module: AppModule;
      action: PermissionAction;
      isAllowed: boolean;
    }>
  ): Promise<Permission[]> {
    const updatedPermissions: Permission[] = [];

    for (const perm of permissions) {
      const updated = await this.updatePermission(
        role,
        perm.module,
        perm.action,
        perm.isAllowed
      );
      updatedPermissions.push(updated);
    }

    return updatedPermissions;
  }

  // Get permission matrix for frontend
  async getPermissionMatrix(): Promise<{
    [role: string]: {
      [module: string]: {
        [action: string]: boolean;
      };
    };
  }> {
    const permissions = await this.permissionRepository.find();
    const matrix: any = {};

    // Initialize matrix
    Object.values(UserRole).forEach(role => {
      matrix[role] = {};
      Object.values(AppModule).forEach(module => {
        matrix[role][module] = {};
        Object.values(PermissionAction).forEach(action => {
          matrix[role][module][action] = false;
        });
      });
    });

    // Fill matrix with actual permissions
    permissions.forEach(permission => {
      matrix[permission.role][permission.module][permission.action] = permission.isAllowed;
    });

    return matrix;
  }

  // Initialize default permissions (run once)
  async initializeDefaultPermissions(): Promise<void> {
    const defaultPermissions = [
      // Admin has all permissions
      ...this.generateRolePermissions(UserRole.ADMIN, true),
      // Manager has most permissions except user management
      ...this.generateRolePermissions(UserRole.MANAGER, true, [AppModule.USERS]),
      // Business Owner has business-related permissions
      ...this.generateModulePermissions(UserRole.OWNER, [
        AppModule.BOOKINGS,
        AppModule.PAYMENTS,
        AppModule.BUSINESSES,
        AppModule.REPORTS
      ]),
      // Client has limited permissions
      ...this.generateModulePermissions(UserRole.CLIENT, [AppModule.BOOKINGS], [PermissionAction.VIEW, PermissionAction.CREATE])
    ];

    for (const perm of defaultPermissions) {
      const exists = await this.permissionRepository.findOne({
        where: {
          role: perm.role,
          module: perm.module,
          action: perm.action
        }
      });

      if (!exists) {
        await this.permissionRepository.save(perm);
      }
    }
  }

  private generateRolePermissions(
    role: UserRole,
    isAllowed: boolean,
    excludeModules: AppModule[] = []
  ) {
    const permissions: Array<{ role: UserRole; module: AppModule; action: PermissionAction; isAllowed: boolean }> = [];
    Object.values(AppModule).forEach(module => {
      if (!excludeModules.includes(module)) {
        Object.values(PermissionAction).forEach(action => {
          permissions.push({ role, module, action, isAllowed });
        });
      }
    });
    return permissions;
  }

  private generateModulePermissions(
    role: UserRole,
    modules: AppModule[],
    actions: PermissionAction[] = Object.values(PermissionAction)
  ) {
    const permissions: Array<{ role: UserRole; module: AppModule; action: PermissionAction; isAllowed: boolean }> = [];
    modules.forEach(module => {
      actions.forEach(action => {
        permissions.push({ role, module, action, isAllowed: true });
      });
    });
    return permissions;
  }
}