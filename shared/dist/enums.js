"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationType = exports.NotificationMethod = exports.PaymentMethod = exports.NotificationStatus = exports.PaymentStatus = exports.BookingStatus = exports.BusinessStatus = exports.AppModule = exports.PermissionAction = exports.UserRole = void 0;
// src/types/enums.d    .ts
// shared/enums/user-role.enum.ts
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["OWNER"] = "owner";
    UserRole["STAFF"] = "staff";
    UserRole["CLIENT"] = "client";
})(UserRole || (exports.UserRole = UserRole = {}));
// shared/enums/permission-action.enum.ts
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["VIEW"] = "view";
    PermissionAction["CREATE"] = "create";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["DELETE"] = "delete";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
// shared/enums/app-module.enum.ts
var AppModule;
(function (AppModule) {
    AppModule["USERS"] = "users";
    AppModule["BOOKINGS"] = "bookings";
    AppModule["PAYMENTS"] = "payments";
    AppModule["NOTIFICATIONS"] = "notifications";
    AppModule["BUSINESSES"] = "businesses";
    AppModule["REPORTS"] = "reports";
    AppModule["SETTINGS"] = "settings";
})(AppModule || (exports.AppModule = AppModule = {}));
var BusinessStatus;
(function (BusinessStatus) {
    BusinessStatus["ACTIVE"] = "active";
    BusinessStatus["PAUSED"] = "paused";
    BusinessStatus["SUSPENDED"] = "suspended";
})(BusinessStatus || (exports.BusinessStatus = BusinessStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["DELIVERED"] = "delivered";
    NotificationStatus["READ"] = "read";
    NotificationStatus["FAILED"] = "failed";
    NotificationStatus["CANCELLED"] = "cancelled";
    NotificationStatus["SCHEDULED"] = "scheduled";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "card";
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var NotificationMethod;
(function (NotificationMethod) {
    NotificationMethod["EMAIL"] = "email";
    NotificationMethod["SMS"] = "sms";
    NotificationMethod["PUSH"] = "push";
})(NotificationMethod || (exports.NotificationMethod = NotificationMethod = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["BOOKING"] = "booking";
    NotificationType["PAYMENT"] = "payment";
    NotificationType["SYSTEM"] = "system";
    NotificationType["MARKETING"] = "marketing";
    NotificationType["REMINDER"] = "reminder";
    NotificationType["ALERT"] = "alert";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
//# sourceMappingURL=enums.js.map