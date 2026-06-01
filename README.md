# ⭐ StarVnt Vendor Booking Dashboard

Production-ready vendor management dashboard with full RBAC, manual calendar events, admin panel, and rich analytics.

---

## ✨ Feature Checklist

| Feature | Status |
|---|---|
| Email/password auth with bcrypt | ✅ |
| JWT sessions via NextAuth v5 | ✅ |
| Role-Based Access Control (RBAC) | ✅ |
| Vendor dashboard (overview, stats, activity) | ✅ |
| Inquiry management (list, detail, status update) | ✅ |
| Interactive Event Calendar | ✅ |
| **Manual event add / edit / delete** | ✅ |
| Analytics (charts, KPIs, revenue table) | ✅ |
| Vendor profile editor | ✅ |
| Settings (password, notifications, danger zone) | ✅ |
| Help & Support (FAQ, contact form) | ✅ |
| **Admin panel (vendor management, all inquiries)** | ✅ |
| **Suspended account gate page** | ✅ |
| Fully responsive (mobile drawer + desktop sidebar) | ✅ |
| Loading skeletons for all routes | ✅ |

---

## 🔐 RBAC — Role-Based Access Control

### Roles

| Role | Description |
|---|---|
| `VENDOR` | Default role. Can manage own profile, inquiries, and calendar events. |
| `ADMIN` | Can view all vendors, change account status, view all inquiries, and access `/admin/*`. |

### Account Statuses

| Status | Effect |
|---|---|
| `ACTIVE` | Normal access |
| `PENDING` | Cannot log in until activated |
| `SUSPENDED` | Redirected to `/suspended` page after login |

### Permission Map (`lib/rbac.ts`)

```
inquiry:read:own      → VENDOR, ADMIN
inquiry:update:own    → VENDOR, ADMIN
inquiry:read:all      → ADMIN
inquiry:update:all    → ADMIN
profile:update:own    → VENDOR, ADMIN
event:create          → VENDOR, ADMIN
event:update:own      → VENDOR, ADMIN
event:delete:own      → VENDOR, ADMIN
analytics:own         → VENDOR, ADMIN
user:list             → ADMIN
user:suspend          → ADMIN
admin:access          → ADMIN
```

Every server action calls `requirePermission(session.user.role, "permission")` before executing.

---

## 📅 Manual Calendar Events

Vendors can add personal/operational events directly to the calendar (site visits, meetings, reminders) that are independent of client inquiries.

**From the Calendar page:**
- Click **"+ Add Event"** button (top-right of calendar)
- Click the **"+"** icon in the day detail panel  
- Any day on the calendar grid opens pre-filled with that date

**Each manual event has:**
- Title (required)
- Date + optional End Date
- Location
- Notes/Description
- Color label: Purple · Rose · Sky · Amber

**Edit/Delete:** Click the pencil icon on any manual event in the day panel.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS — dark theme, CSS custom properties |
| Auth | NextAuth.js v5 (JWT strategy) |
| RBAC | Custom permission system (`lib/rbac.ts`) |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | Zod |
| Icons | Lucide React |
| Toasts | React Hot Toast |
| Deployment | Vercel |

---

## 🗄 Database Schema

```
User              role: VENDOR|ADMIN  accountStatus: ACTIVE|SUSPENDED|PENDING
  └── VendorProfile
  └── EventInquiry[]     status: NEW|CONTACTED|CONFIRMED|REJECTED
  └── ManualEvent[]      color: purple|rose|sky|amber
  └── ActivityLog[]
  └── Session[], Account[]
```

---

## 🚀 Setup

### 1. Install
```bash
git clone <repo> && cd starvnt && npm install
```

### 2. Environment
```bash
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
```

### 3. Database
```bash
npm run db:generate
npm run db:push       # or db:migrate for production
npm run db:seed
```

### 4. Run
```bash
npm run dev   # → http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Vendor** | `vendor@starvnt.com` | `Vendor@123` |
| **Admin**  | `admin@starvnt.com`  | `Admin@123`  |

---

## 📁 Structure

```
app/
  login/                  # Public auth page
  suspended/              # Account suspended gate
  dashboard/              # Vendor portal (role=VENDOR)
    page.tsx              # Overview
    inquiries/            # List + [id] detail
    calendar/             # Interactive calendar + manual events
    analytics/            # Charts, KPIs, revenue table
    profile/              # Edit profile
    settings/             # Password, notifications, danger zone
    support/              # FAQ + contact form
  admin/                  # Admin portal (role=ADMIN only)
    page.tsx              # Admin overview
    vendors/              # Vendor management + status control
    inquiries/            # Platform-wide inquiry view

components/
  auth/LoginForm.tsx
  dashboard/              # All vendor portal components
  admin/                  # Admin-specific components

lib/
  auth.ts                 # NextAuth config (role + accountStatus in JWT)
  rbac.ts                 # Permission definitions + requirePermission()
  actions.ts              # Server actions (all RBAC-gated)
  prisma.ts / utils.ts / validations.ts

prisma/
  schema.prisma           # 7 models including ManualEvent
  seed.ts                 # 1 admin + 1 vendor, 16 inquiries, 8 manual events

middleware.ts             # Route protection + role-based redirects
```

---

## 🌐 Deploy to Vercel

1. Push to GitHub → Import at vercel.com
2. Set env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
3. Vercel auto-runs `prisma generate && next build`
4. Post-deploy: `npx prisma migrate deploy && npm run db:seed`

---

## 📄 License
MIT © StarVnt 2024
