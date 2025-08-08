# Bun Elysia Boilerplate

A modern boilerplate for building REST APIs with [Bun](https://bun.sh) and [Elysia](https://elysiajs.com). It ships with authentication, todo management, request validation, error handling, dependency injection, background jobs, and integrations with PostgreSQL, Redis, and BullMQ.

## Features

- 🚀 High-performance Bun runtime and Elysia framework
- 🔐 JWT authentication and optional API key support
- 📝 CRUD endpoints for users and todos
- ✅ Request validation with Joi and TypeScript DTOs
- 📦 Dependency injection via tsyringe
- 🗃️ PostgreSQL and Redis integration using TypeORM
- ⏱️ Background jobs and scheduled tasks with BullMQ
- 🛡️ Centralized error handling and formatted API responses

## Project Structure

```
src/
├── index.ts              # Application entry point
├── modules/
│   ├── auth/             # Login and JWT helpers
│   ├── todo/             # Todo routes, services, and workers
│   └── user/             # User CRUD APIs
└── commons/              # Shared configs, DTOs, and utilities
```

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```
   Requires [Bun](https://bun.sh) to be installed globally.

2. **Set environment variables**

   The server reads configuration from environment variables such as:

   - `PORT` – HTTP port (default `3000`)
   - `HOST_URL` – Base URL of the server
   - `JWT_SECRET` – Secret key for signing tokens
   - `PG_HOST`, `PG_PORT`, `PG_USERNAME`, `PG_PASSWORD`, `PG_DATABASE` – PostgreSQL connection

3. **Run the development server**

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` – Start development server
- `npm test` – Run tests (currently none)
- `npm run lint` – Lint source files
- `npm run format` – Format code with Prettier

## Learn More

Review the `src/modules` folder to understand route modules and explore advanced topics like Elysia plugins, TypeORM entities, tsyringe dependency injection, and BullMQ for background jobs.

