// src/types/enums.d    .ts
// shared/enums/user-role.enum.ts
export enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    OWNER = "owner",
    STAFF = "staff",
    CLIENT = "client"
}
// shared/enums/permission-action.enum.ts
export enum PermissionAction {
    VIEW = 'view',
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete'
  }

// shared/enums/app-module.enum.ts
export enum AppModule {
    USERS = 'users',
    BOOKINGS = 'bookings',
    PAYMENTS = 'payments',
    NOTIFICATIONS = 'notifications',
    BUSINESSES = 'businesses',
    REPORTS = 'reports',
    SETTINGS = 'settings'
  }

export enum BusinessStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    SUSPENDED = "suspended"
}
export enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export enum NotificationStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed",
    CANCELLED = "cancelled",
    SCHEDULED = "scheduled"
}
export enum PaymentMethod {
    CARD = "card",
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer"
}
export enum NotificationMethod {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push"
}
export enum NotificationType {
    BOOKING = "booking",
    PAYMENT = "payment",
    SYSTEM = "system",
    MARKETING = "marketing",
    REMINDER = "reminder",
    ALERT = "alert"
}
