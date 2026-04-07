import apiClient from '@/lib/api';
import { UserRole, AppModule, PermissionAction } from '@my-app/shared';

export interface PermissionMatrix {
  [role: string]: {
    [module: string]: {
      [action: string]: boolean;
    };
  };
}

export interface RolePermission {
  module: AppModule;
  action: PermissionAction;
  isAllowed: boolean;
}

class PermissionsService {
  private readonly baseUrl = '/permissions';

  async getPermissionMatrix(): Promise<PermissionMatrix> {
    const response = await apiClient.get(`${this.baseUrl}/matrix`);
    return response.data;
  }

  async getPermissionsByRole(role: UserRole): Promise<RolePermission[]> {
    const response = await apiClient.get(`${this.baseUrl}/role/${role}`);
    return response.data;
  }

  async updateRolePermissions(
    role: UserRole,
    permissions: RolePermission[]
  ): Promise<RolePermission[]> {
    const response = await apiClient.put(`${this.baseUrl}/role/${role}`, permissions);
    return response.data;
  }
}

export const permissionsService = new PermissionsService(); 