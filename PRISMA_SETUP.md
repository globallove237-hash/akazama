# Database Setup with Prisma and SQLite

This project uses Prisma with SQLite for data persistence. Here's how to set it up and manage it.

## Setup

1. Install dependencies:
   ```bash
   pnpm add prisma @prisma/client
   pnpm add -D prisma
   ```

2. Initialize Prisma:
   ```bash
   pnpm dlx prisma init
   ```

3. Configure Prisma for SQLite in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

4. Define your models in `prisma/schema.prisma`

5. Create and apply migrations:
   ```bash
   pnpm dlx prisma migrate dev --name init
   ```

6. Generate the Prisma client:
   ```bash
   pnpm dlx prisma generate
   ```

## Database Schema

The current schema includes a `WaitingList` model for managing user registrations:

```prisma
model WaitingList {
  id        Int       @id @default(autoincrement())
  fullName  String
  age       String?
  city      String?
  whatsapp  String
  email     String?
  gender    String?
  bio       String?
  notes     String?
  invitedAt DateTime?
  joinedAt  DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

## Server Actions

Server actions are used to interact with the database:

- `actions/waiting-list.ts` - Add new entries to the waiting list
- `actions/admin-waiting-list.ts` - Manage existing entries (invite, add notes, delete)

## Admin Interface

Admin pages are available at `/admin` to manage the waiting list entries.

## Development

To view the database directly, you can use Prisma Studio:

```bash
pnpm dlx prisma studio
```

This will open a web interface to browse and edit data directly.