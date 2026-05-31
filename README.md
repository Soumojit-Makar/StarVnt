# ⭐ StarVnt Vendor Booking Dashboard

A production-ready vendor management dashboard built for event and entertainment booking companies. Vendors can log in, manage their profile, handle event inquiries, update booking statuses, and track performance analytics.

---

## ✨ Features

- **🔐 Authentication** — Secure email/password login with NextAuth.js, JWT sessions, bcrypt hashing
- **📊 Dashboard Analytics** — Real-time stats: total inquiries, new requests, confirmed bookings, upcoming events
- **📋 Inquiry Management** — Full listing with filter by status, sortable table, paginated results
- **🔍 Inquiry Detail** — Complete client info view with one-click status updates
- **👤 Vendor Profile** — Editable profile with name, category, location, contact, bio, and image
- **📱 Fully Responsive** — Sidebar on desktop, drawer on mobile, optimised for all screen sizes
- **⚡ Server Actions** — Type-safe, validated server actions for all mutations
- **🎨 Modern Dark UI** — Custom design with Syne font, brand orange accent, animated transitions
- **🔔 Toast Notifications** — Success/error feedback for all user actions
- **💾 Seed Data** — 10 realistic sample inquiries and activity logs for testing

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v5 (Auth.js) |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | Zod |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| Deployment | Vercel |

---

## 🗄 Database Schema

```
User
├── id, email, password, name
├── VendorProfile (1:1)
│   ├── vendorName, category, location, phone
│   ├── description, imageUrl, rating, totalEvents
├── EventInquiry (1:many)
│   ├── clientName, clientEmail, clientPhone
│   ├── eventType, eventDate, eventLocation
│   ├── guestCount, budget, message
│   └── status: NEW | CONTACTED | CONFIRMED | REJECTED
└── ActivityLog (1:many)
    ├── action, description, metadata
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/starvnt-dashboard.git
cd starvnt-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/starvnt_db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 4. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate
```

### 5. Seed Demo Data

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Email | `vendor@starvnt.com` |
| Password | `Vendor@123` |

---

## 📁 Project Structure

```
starvnt-dashboard/
├── app/
│   ├── api/auth/[...nextauth]/   # Auth.js route handler
│   ├── login/                    # Login page
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard shell (sidebar + topnav)
│   │   ├── page.tsx              # Overview / analytics
│   │   ├── loading.tsx           # Skeleton loader
│   │   ├── profile/
│   │   │   └── page.tsx          # Vendor profile editor
│   │   └── inquiries/
│   │       ├── page.tsx          # Inquiry list with filters
│   │       └── [id]/
│   │           └── page.tsx      # Inquiry detail + status update
│   ├── globals.css
│   ├── layout.tsx                # Root layout with fonts + toaster
│   └── not-found.tsx
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx
│   └── dashboard/
│       ├── Sidebar.tsx
│       ├── TopNav.tsx
│       ├── WelcomeBanner.tsx
│       ├── StatsGrid.tsx
│       ├── RecentActivity.tsx
│       ├── QuickActions.tsx
│       ├── InquiriesFilter.tsx
│       ├── InquiriesTable.tsx
│       ├── TablePagination.tsx
│       ├── InquiryDetail.tsx
│       ├── ProfileCard.tsx
│       └── ProfileForm.tsx
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client singleton
│   ├── actions.ts                # Server actions
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # Helper functions
├── prisma/
│   ├── schema.prisma             # Database models
│   └── seed.ts                   # Demo data seeder
├── types/
│   └── next-auth.d.ts            # Session type augmentation
├── middleware.ts                  # Route protection
├── next.config.ts
├── tailwind.config.ts
├── vercel.json
└── .env.example
```

---

## 🔧 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema (no migration history)
npm run db:migrate   # Create and apply migration
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio
```

---

## 🌐 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/starvnt-dashboard.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` — your production PostgreSQL URL
   - `NEXTAUTH_SECRET` — a secure random string
   - `NEXTAUTH_URL` — your production domain (e.g. `https://starvnt.vercel.app`)

### 3. Database Options

- **Vercel Postgres** — `vercel postgres create`
- **Supabase** — free tier, great for hobby projects
- **Neon** — serverless Postgres, generous free tier
- **Railway** — simple setup with free tier

### 4. Post-Deploy

After deploy, run migrations on production:
```bash
npx prisma migrate deploy
npm run db:seed  # optional: seed demo data
```

---

## 📸 Screenshots

> Add screenshots of:
> - Login page
> - Dashboard overview
> - Inquiries list
> - Inquiry detail with status update
> - Vendor profile page
> - Mobile responsive views

---

## 📄 License

MIT © StarVnt 2024
