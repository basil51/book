'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserCheck,
  Users,
  Building2,
  Calendar,
  CreditCard,
  Settings,
  Loader2,
  Bell,
  BarChart
} from 'lucide-react';
import { UserRole, AppModule, PermissionAction } from '@my-app/shared';
import { permissionsService, PermissionMatrix, RolePermission } from '@/services/permissions.service';
import { toast } from 'react-hot-toast';

interface Role {
  name: UserRole;
  description: string;
  userCount: number;
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Full system access with all permissions',
  [UserRole.MANAGER]: 'Administrative access to manage businesses and users',
  [UserRole.OWNER]: 'Business owner with access to business management',
  [UserRole.CLIENT]: 'Basic access to book appointments and manage profile',
  [UserRole.STAFF]: 'Staff member with limited access to manage appointments and customers',
};

const MODULE_ICONS: Record<AppModule, any> = {
  [AppModule.USERS]: Users,
  [AppModule.BUSINESSES]: Building2,
  [AppModule.BOOKINGS]: Calendar,
  [AppModule.PAYMENTS]: CreditCard,
  [AppModule.SETTINGS]: Settings,
  [AppModule.NOTIFICATIONS]: Bell,
  [AppModule.REPORTS]: BarChart,
};

const ACTION_LABELS: Record<PermissionAction, string> = {
  [PermissionAction.VIEW]: 'View',
  [PermissionAction.CREATE]: 'Create',
  [PermissionAction.UPDATE]: 'Update',
  [PermissionAction.DELETE]: 'Delete',
};

export default function UserRolesPage() {
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPermissionMatrix();
  }, []);

  const loadPermissionMatrix = async () => {
    setLoading(true);
    try {
      const matrix = await permissionsService.getPermissionMatrix();
      setPermissionMatrix(matrix);
    } catch (error) {
      console.error('Error loading permission matrix:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (module: AppModule, action: PermissionAction) => {
    if (!selectedRole || !permissionMatrix) return;

    const currentValue = permissionMatrix[selectedRole][module][action];
    const newValue = !currentValue;

    // Optimistically update UI
    setPermissionMatrix(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [module]: {
            ...prev[selectedRole][module],
            [action]: newValue
          }
        }
      };
    });

    // Update backend
    setSaving(true);
    try {
      // Only send the specific permission that was changed
      await permissionsService.updateRolePermissions(selectedRole, [{
        module,
        action,
        isAllowed: newValue
      }]);
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
      // Revert optimistic update
      loadPermissionMatrix();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!permissionMatrix) {
    return null;
  }

  const roles: Role[] = Object.keys(permissionMatrix).map(role => ({
    name: role as UserRole,
    description: ROLE_DESCRIPTIONS[role as UserRole],
    userCount: 0, // TODO: Get actual user count from backend
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Roles</h1>
        <p className="text-gray-500">Manage user roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles</h2>
          <div className="space-y-2">
            {roles.map(role => (
              <button
                key={role.name}
                onClick={() => setSelectedRole(role.name)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                  selectedRole === role.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className={`h-5 w-5 ${
                    selectedRole === role.name ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {role.userCount} users
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Permissions
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {ROLE_DESCRIPTIONS[selectedRole]}
                    </p>
                  </div>
                  {saving && (
                    <div className="flex items-center space-x-2 text-blue-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {Object.entries(AppModule).map(([moduleKey, module]) => {
                  const ModuleIcon = MODULE_ICONS[module];
                  return (
                    <div key={module}>
                      <div className="flex items-center space-x-2 mb-4">
                        <ModuleIcon className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">{module}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.values(PermissionAction).map(action => (
                          <button
                            key={`${module}-${action}`}
                            onClick={() => handlePermissionToggle(module, action)}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              permissionMatrix[selectedRole][module][action]
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <span className="text-sm font-medium text-gray-900">
                              {ACTION_LABELS[action]}
                            </span>
                            {permissionMatrix[selectedRole][module][action] ? (
                              <div className="h-4 w-4 rounded-full bg-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center">
              <p className="text-gray-500">Select a role to manage permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 