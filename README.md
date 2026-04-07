# AppointPro - Healthcare Appointment Management System

A comprehensive full-stack appointment booking and management system designed specifically for healthcare providers. Built with modern technologies including Next.js frontend, NestJS backend, PostgreSQL database, and shared TypeScript utilities.

## 🏥 Project Overview

AppointPro is a sophisticated healthcare appointment management platform that enables:
- **Multi-role user management** (Admin, Manager, Owner, Staff, Client)
- **Business management** for healthcare practices  
- **Service catalog** with pricing and duration
- **Appointment booking** with availability management
- **Staff scheduling** and workload distribution
- **Payment processing** and financial tracking
- **Notification system** for reminders and updates
- **Role-based permissions** for secure access control
- **Analytics and reporting** for business insights

## 🛠 Technology Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Radix UI** components library
- **React Query** for state management
- **Axios** for API communication
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend
- **NestJS** with TypeScript
- **PostgreSQL** database
- **TypeORM** for database management
- **JWT** authentication with Passport
- **bcrypt** for password hashing
- **Swagger** API documentation
- **Multer** for file uploads
- **Class Validator** for data validation

### Shared
- **TypeScript** enums and types
- **Common utilities** and constants
- **Role definitions** and permissions

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v10.12.4 or higher)
- **PostgreSQL** (v13 or higher)

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Clone the repository and install dependencies
git clone <repository-url>
cd Appointment
pnpm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb appointment

# Update database configuration in backend/.env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=appointment
JWT_SECRET=your_jwt_secret
```

### 3. Environment Configuration
```bash
# Backend environment (use a local secrets file that is git-ignored)
# See local.secrets.env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=basel
DATABASE_PASSWORD=your_password
DATABASE_NAME=appointment
JWT_SECRET=your_super_secret_key

# Frontend environment (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### 4. Database Seeding
```bash
cd backend
pnpm seed
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:frontend  # Frontend on http://localhost:3001
pnpm dev:backend   # Backend on http://localhost:4001
```

### Production Mode
```bash
# Build all packages
pnpm build

# Start production servers
cd frontend && pnpm start
cd backend && pnpm start:prod
```

## 🏗 Project Structure

```
appointment/
├── frontend/                 # Next.js React application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── admin/       # Admin dashboard & management
│   │   │   ├── manager/     # Manager dashboard
│   │   │   ├── book/        # Public booking pages
│   │   │   ├── businesses/  # Business directory
│   │   │   └── login/       # Authentication
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API clients
│   │   └── types/           # TypeScript definitions
│   └── public/              # Static assets
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── entities/       # Database entities
│   │   ├── users/          # User management
│   │   ├── businesses/     # Business management
│   │   ├── bookings/       # Appointment booking
│   │   ├── services/       # Service catalog
│   │   ├── payments/       # Payment processing
│   │   ├── notifications/  # Notification system
│   │   ├── staff/          # Staff management
│   │   └── permissions/    # Role-based access control
│   └── uploads/            # File storage
├── shared/                 # Shared TypeScript utilities
│   └── src/
│       ├── enums.ts        # Common enumerations
│       └── index.ts        # Exported types
└── docs/                   # Documentation
```

## 👥 User Roles & Permissions

### Admin
- **System administration**
- **Business management** (create, update, delete)
- **User management** across all roles
- **System analytics** and reporting
- **Permission management**

### Manager  
- **Business operations** oversight
- **Staff management** within business
- **Appointment management**
- **Business analytics**
- **Service management**

### Owner
- **Business profile** management
- **Staff hiring** and management
- **Financial** overview
- **Service** configuration

### Staff
- **Personal schedule** management
- **Assigned appointments**
- **Client interactions**
- **Service delivery**

### Client
- **Appointment booking**
- **Profile management**
- **Booking history**
- **Reviews and ratings**

## 🔐 Authentication & Security

- **JWT-based authentication** with secure token storage
- **Role-based access control** (RBAC) with granular permissions
- **Route protection** with middleware guards
- **Password hashing** using bcrypt
- **Input validation** with class-validator
- **CORS protection** for API security

## 📊 Key Features

### ✅ Completed Features
- **User Authentication** - Login, registration, JWT tokens
- **Role Management** - Admin, Manager, Owner, Staff, Client roles
- **Business Directory** - Public business listing with search/filter
- **Service Catalog** - Business services with pricing
- **Basic Booking** - Public appointment booking
- **User Management** - CRUD operations for users
- **Database Schema** - Complete entity relationships
- **API Documentation** - Swagger integration
- **File Uploads** - Business logos and images
- **Permission System** - Role-based access control

### 🚧 In Development
- **Staff Scheduling** - Advanced calendar integration
- **Payment Processing** - Stripe/PayPal integration
- **Notification System** - Email/SMS reminders
- **Advanced Analytics** - Business performance metrics
- **Review System** - Client feedback and ratings
- **Availability Management** - Dynamic slot generation

### 📱 Frontend Pages Status

#### ✅ Implemented & Connected
- **Login/Registration** - Fully functional with backend
- **Business Directory** - Connected to businesses API
- **Public Booking** - Connected to bookings API
- **Admin Dashboard** - Connected to dashboard APIs
- **Manager Dashboard** - Advanced analytics dashboard

#### 🔧 Partially Implemented
- **Admin Management** - UI created, some API connections pending
- **Business Forms** - Frontend ready, backend integration partial
- **Staff Management** - Basic structure, needs API integration

#### 📋 Planned
- **Client Dashboard** - Personal appointment management
- **Staff Dashboard** - Schedule and task management
- **Payment Pages** - Transaction history and processing
- **Notification Center** - Message and alert management

## 🔗 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `GET /auth/me` - Get current user

### Businesses
- `GET /businesses` - List all businesses
- `POST /businesses` - Create business (Admin only)
- `GET /businesses/:id` - Get business details
- `PATCH /businesses/:id` - Update business
- `DELETE /businesses/:id` - Delete business

### Bookings
- `GET /bookings` - List bookings with filters
- `POST /bookings/public` - Create public booking
- `GET /bookings/availability` - Get available time slots
- `PATCH /bookings/:id` - Update booking status

### Users
- `GET /users` - List all users
- `GET /users/staff` - List staff members
- `PATCH /users/:id/status` - Update user status

### Services
- `GET /services` - List services
- `POST /services` - Create service
- `PATCH /services/:id` - Update service

## 🧪 Testing

```bash
# Backend tests
cd backend
pnpm test        # Unit tests
pnpm test:e2e    # End-to-end tests
pnpm test:cov    # Coverage report

# Frontend tests
cd frontend
pnpm test        # Jest tests
pnpm test:watch  # Watch mode
```

## 📦 Package Manager

This project uses **pnpm** for efficient dependency management:

- **Workspace management** for monorepo structure
- **Shared dependencies** across packages
- **Fast installation** with content-addressable storage
- **Strict dependency management** preventing phantom dependencies

## 🚀 Deployment

### Production Build
```bash
# Build all packages
pnpm build

# Build individual packages
pnpm build:shared
pnpm build:frontend
pnpm build:backend
```

### Docker and Traefik

See **[DEPLOY.md](DEPLOY.md)** for Traefik, Compose profiles, and exact commands for local and production (`book.sparkco.localhost` / `book.sparkco.vip`).

## 📈 Performance Optimization

- **Next.js optimizations** - SSG, ISR, and code splitting
- **Database indexing** for faster queries
- **Image optimization** with Next.js Image component
- **API response caching** where appropriate
- **Bundle size optimization** with tree shaking

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Issues**: Create a GitHub issue
- **Documentation**: Check the `/docs` folder
- **Email**: [Add support email]

## 🔮 Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed development plans and [STATUS.md](STATUS.md) for current production status.
