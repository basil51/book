// components/PermissionMatrix.tsx
import React, { useState, useEffect } from 'react';
import { UserRole, AppModule, PermissionAction } from '@my-app/shared';

interface PermissionMatrix {
  [role: string]: {
    [module: string]: {
      [action: string]: boolean;
    };
  };
}

export const PermissionMatrix = () => {
  const [matrix, setMatrix] = useState<PermissionMatrix>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissionMatrix();
  }, []);

  const fetchPermissionMatrix = async () => {
    try {
      const response = await fetch('/api/permissions/matrix');
      const data = await response.json();
      setMatrix(data);
    } catch (error) {
      console.error('Failed to fetch permission matrix:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (
    role: UserRole,
    module: AppModule,
    action: PermissionAction,
    isAllowed: boolean
  ) => {
    try {
      // Update local state immediately for better UX
      setMatrix(prev => ({
        ...prev,
        [role]: {
          ...prev[role],
          [module]: {
            ...prev[role][module],
            [action]: isAllowed
          }
        }
      }));

      // Send update to backend
      await fetch(`/api/permissions/role/${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ module, action, isAllowed }])
      });
    } catch (error) {
      console.error('Failed to update permission:', error);
      // Revert on error
      fetchPermissionMatrix();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="permission-matrix">
      <h2>Permission Management</h2>
      
      <div className="matrix-table">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Module</th>
              {Object.values(PermissionAction).map(action => (
                <th key={action} className="border border-gray-300 p-2 capitalize">
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(UserRole).map(role => (
              Object.values(AppModule).map(module => (
                <tr key={`${role}-${module}`}>
                  <td className="border border-gray-300 p-2 capitalize font-medium">
                    {role}
                  </td>
                  <td className="border border-gray-300 p-2 capitalize">
                    {module.replace('_', ' ')}
                  </td>
                  {Object.values(PermissionAction).map(action => (
                    <td key={action} className="border border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={matrix[role]?.[module]?.[action] || false}
                        onChange={(e) => updatePermission(
                          role as UserRole,
                          module as AppModule,
                          action as PermissionAction,
                          e.target.checked
                        )}
                        className="w-4 h-4"
                      />
                    </td>
                  ))}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};