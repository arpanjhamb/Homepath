# HomePath IE — MVP

## What is it
Irish B2C home-buying concierge platform. Buyers get a personalised checklist, provider marketplace, and a dedicated Account Executive.

## Tech stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- NextAuth.js (JWT, credentials)
- Radix UI primitives

## User roles
| Role | Access |
|---|---|
| buyer | Onboarding, dashboard, checklist, marketplace, introductions, payment |
| account_executive | AE dashboard, buyer list, introductions queue |
| admin | Full admin: buyers, providers, introductions, commissions, AE management |

## Quick start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/homepath_ie"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
npm run db:push
npm run db:seed
```

### 5. Run the app
```bash
npm run dev
```
Open http://localhost:3000

## Seed accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@homepath.ie | admin123 |
| Account Executive | sarah.murphy@homepath.ie | ae123456 |
| Demo Buyer | demo@buyer.ie | buyer123 |

## Prototypes
Open any file in `prototypes/` directly in your browser — no server needed.

| File | Screen |
|---|---|
| 01-landing.html | Public landing page |
| 02-buyer-dashboard.html | Buyer dashboard |
| 03-marketplace.html | Provider marketplace |
| 04-onboarding.html | Onboarding wizard |
| 05-checklist.html | Buyer checklist |
| 06-ae-dashboard.html | AE dashboard |

## Disclaimer
HomePath IE is not regulated by the Central Bank of Ireland. It does not provide financial, legal, mortgage, or insurance advice. All provider introductions are made for information purposes only.
