# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
# Creatoros

## Local PostgreSQL + Adminer (Docker)

This project includes a local Docker setup for PostgreSQL and Adminer.

### 1) Configure environment

Make sure your `.env.local` includes:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_PORT=5432
ADMINER_PORT=8080
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

### 2) Start services

```bash
docker compose up -d
```

### 3) Open Adminer

- URL: `http://localhost:8080` (or your `ADMINER_PORT`)
- System: `PostgreSQL`
- Server: `postgres` (inside Docker network)
- Username: value of `POSTGRES_USER`
- Password: value of `POSTGRES_PASSWORD`
- Database: value of `POSTGRES_DB`

### 4) Stop services

```bash
docker compose down
```

### 5) Reset database data (destructive)

```bash
docker compose down -v
```
