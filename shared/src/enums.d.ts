export declare enum UserRole {
    MANAGER = "manager",
    OWNER = "owner",
    ADMIN = "admin",
    STAFF = "staff",
    CLIENT = "client"
}
export declare enum PermissionAction {
    VIEW = "view",
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export declare enum AppModule {
    USERS = "users",
    BOOKINGS = "bookings",
    PAYMENTS = "payments",
    NOTIFICATIONS = "notifications",
    BUSINESSES = "businesses",
    REPORTS = "reports",
    SETTINGS = "settings"
}
export declare enum BusinessStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    SUSPENDED = "suspended"
}
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
export declare enum NotificationStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read",
    FAILED = "failed",
    CANCELLED = "cancelled",
    SCHEDULED = "scheduled"
}
export declare enum PaymentMethod {
    CARD = "card",
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer"
}
export declare enum NotificationMethod {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push"
}
export declare enum NotificationType {
    BOOKING = "booking",
    PAYMENT = "payment",
    SYSTEM = "system",
    MARKETING = "marketing",
    REMINDER = "reminder",
    ALERT = "alert"
}
