import { UserRole } from '@my-app/shared';

export const getDashboardUrl = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin';
    case UserRole.MANAGER:
      return '/manager';
    case UserRole.OWNER:
      return '/owner';
    case UserRole.STAFF:
      return '/staff';
    case UserRole.CLIENT:
      return '/client';
    default:
      return '/';
  }
};

export const isNonClientUser = (role: UserRole): boolean => {
  return role !== UserRole.CLIENT;
}; 