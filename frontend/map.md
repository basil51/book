src/
├── app/                          # App Router directory
│   ├── (auth)/                   # Auth group layout
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (client)/                 # Client group layout
│   │   ├── dashboard/
│   │   ├── bookings/
│   │   └── layout.tsx
│   ├── (business-admin)/         # Business admin group layout
│   │   ├── dashboard/
│   │   ├── staff/
│   │   ├── services/
│   │   └── layout.tsx
│   ├── (global-admin)/           # Global admin group layout
│   │   ├── dashboard/
│   │   ├── businesses/
│   │   └── layout.tsx
│   ├── api/                      # API routes (if using Next.js API routes)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # ShadCN-like UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── shared/                   # Shared components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── BookingCalendar/
│   │   └── ...
│   ├── client/                   # Client-specific components
│   ├── business-admin/           # Business admin components
│   └── global-admin/             # Global admin components
├── config/
│   ├── routes.ts                 # Route configuration
│   └── theme.ts                  # Tailwind theme config
├── contexts/                     # React contexts
│   ├── AuthContext.tsx
│   └── BookingContext.tsx
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   └── useBookings.ts
├── lib/
│   ├── api/                      # API clients
│   │   ├── client.ts             # Axios instance
│   │   ├── bookings.ts
│   │   └── ...
│   └── utils/                    # Utility functions
├── providers.tsx                 # All context providers
├── styles/
│   ├── globals.css               # Global styles
│   └── theme/                    # Tailwind customizations
├── types/
│   ├── booking.ts                # Type definitions
│   └── ...
└── public/                       # Static assets


npx shadcn@latest add dropdown-menu