# ⚡ КТ#6. Тестирование, контейнеризация, развертывание

<div align="center">

**A production-ready Express.js REST API starter template with TypeScript, JWT authentication, role-based access control (RBAC), Prisma ORM, Redis caching, and comprehensive OpenAPI documentation.**

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.3-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-8.10-1.svg)](https://www.prisma.io/)

</div>

---

## ✨ Features

### 🔐 Authentication & Authorization

-   **JWT Authentication** - Secure access and refresh token system
-   **Role-Based Access Control (RBAC)** - Flexible permission management
-   **Password Security** - Bcrypt hashing with salt rounds
-   **Token Refresh** - Automatic token renewal mechanism

### 🗄️ Database & ORM

-   **Prisma ORM** - Type-safe database queries
-   **PostgreSQL** - Powerful relational database
-   **Database Migrations** - Version control for your schema
-   **Seeding** - Pre-populate database with test data

### ⚡ Performance & Caching

-   **Redis Cache** - Lightning-fast data caching layer
-   **Response Compression** - Gzip compression for responses
-   **Rate Limiting** - Protect API from abuse
-   **Connection Pooling** - Optimized database connections

### 📚 API Documentation

-   **OpenAPI 3.0** - Industry-standard API specification
-   **Scalar UI** - Beautiful interactive API documentation
-   **Auto-generated** - Docs generated from code
-   **Type-safe schemas** - Zod validation schemas

### 🛠️ Developer Experience

-   **TypeScript** - Full type safety and IntelliSense
-   **Hot Reload** - Instant feedback with Tsx
-   **Biome** - Fast linting and formatting
-   **Docker Support** - Containerized development environment
-   **Structured Logging** - Winston logger with rotation

### ✅ Validation & Error Handling

-   **Zod Validation** - Runtime type checking
-   **Global Error Handler** - Consistent error responses
-   **Custom HTTP Exceptions** - Meaningful error messages
-   **Request Validation** - Automatic input sanitization

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v22 or higher)
-   **Docker** & **Docker Compose** (for PostgreSQL & Redis)

### Installation

1. **Install dependencies**
2. **Set up environment variables**
3. **Start PostgreSQL and Redis with Docker**
4. **Generate Prisma Client**
5. **Run database migrations**
6. **Seed the database** (optional)
7. **Start the development server**

---

## 📖 Documentation

### Interactive API Documentation

Once the server is running, visit:

-   **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
-   **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
-   **Landing Page**: [http://localhost:8000/](http://localhost:8000/)


### Available Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`         | Start development server with hot reload |
| `npm run build`       | Build for production                     |
| `npm run start`       | Start production server                  |
| `npm run db:generate` | Generate Prisma Client                   |
| `npm run db:migrate`  | Run database migrations                  |
| `npm run db:push`     | Push schema changes to database          |
| `npm run db:seed`     | Seed database with test data             |
| `npm run format`      | Format code with Biome                   |
| `npm run lint`        | Lint code with Biome                     |

### API Endpoints

#### Authentication

-   `POST /api/auth/register` - Register new user
-   `POST /api/auth/login` - Login user
-   `POST /api/auth/refresh` - Refresh access token
-   `POST /api/auth/logout` - Logout user
-   `GET /api/auth/me` - Get current user

#### Users Management

-   `GET /api/users` - Get all users (paginated)
-   `GET /api/users/:id` - Get user by ID
-   `POST /api/users` - Create new user
-   `PUT /api/users/:id` - Update user
-   `DELETE /api/users/:id` - Delete user

#### Roles & Permissions

-   `GET /api/roles` - Get all roles
-   `POST /api/roles` - Create role
-   `PUT /api/roles/:id` - Update role
-   `DELETE /api/roles/:id` - Delete role
-   `GET /api/permissions` - Get all permissions
-   `POST /api/permissions` - Create permission

---

## 🏗️ Project Structure

```
├── prisma/                  # Prisma schema and migrations
│   ├── migrations/          # Database migration files
│   ├── factory/             # Database seeders
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.ts              # Seed script
├── src/
│   ├── application/         # Application setup
│   │   ├── database.ts      # Prisma client
│   │   ├── env.ts           # Environment validation
│   │   ├── logging.ts       # Winston logger
│   │   ├── redis.ts         # Redis client
│   │   ├── route.ts         # Route registration
│   │   └── scalar.ts        # API documentation
│   ├── generated/           # Generated Prisma client
│   ├── lib/                 # Utility functions
│   │   ├── constants.ts     # App constants
│   │   ├── http-status-codes.ts
│   │   ├── http-status-phrases.ts
│   │   ├── open-api.ts      # OpenAPI helpers
│   │   └── route-utils.ts   # Route utilities
│   ├── middleware/          # Express middleware
│   │   ├── http-logger.ts   # Request logging
│   │   ├── not-found.ts     # 404 handler
│   │   ├── on-error.ts      # Error handler
│   │   ├── rate-limit.ts    # Rate limiting
│   │   └── serve-emoji-favicon.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── home/            # Landing page
│   │   ├── health/          # Health check
│   │   ├── users/           # User management
│   │   ├── roles/           # Role management
│   │   └── permissions/     # Permission management
│   ├── types/               # TypeScript types
│   └── main.ts              # Application entry point
├── storage/logs/            # Application logs
├── .env                     # Environment variables
├── .env.example             # Environment template
├── docker-compose.yml       # Docker services
├── tsconfig.json            # TypeScript configuration
├── biome.json               # Biome configuration
└── package.json             # Dependencies
```

### Module Structure

Each module follows a consistent structure:

```
module/
├── module.controller.ts     # HTTP request handlers
├── module.service.ts        # Business logic
├── module.route.ts          # Route definitions
└── module.validation.ts     # Zod schemas
```

---

## 🛠️ Tech Stack

### Core

-   **[Express.js](https://expressjs.com/)** - Fast, minimalist web framework
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
-   **[Node.js](https://nodejs.org/)** - JavaScript runtime

### Database & ORM

-   **[Prisma](https://www.prisma.io/)** - Next-generation ORM
-   **[PostgreSQL](https://www.postgresql.org/)** - Relational database
-   **[Redis](https://redis.io/)** - In-memory data store

### Authentication & Security

-   **[JWT](https://jwt.io/)** - JSON Web Tokens
-   **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
-   **[Helmet](https://helmetjs.github.io/)** - Security headers
-   **[CORS](https://github.com/expressjs/cors)** - Cross-origin resource sharing

### Validation & Documentation

-   **[Zod](https://zod.dev/)** - Schema validation
-   **[Scalar](https://github.com/scalar/scalar)** - API documentation
-   **[OpenAPI](https://www.openapis.org/)** - API specification

### Development Tools

-   **[Biome](https://biomejs.dev/)** - Linter & formatter
-   **[Docker](https://www.docker.com/)** - Containerization
-   **[Winston](https://github.com/winstonjs/winston)** - Logging

---

## 🐳 Docker Setup

The project includes Docker Compose configuration for PostgreSQL and Redis:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Services

-   **PostgreSQL**: `localhost:5432`
-   **Redis**: `localhost:6379`

---

## 🔧 Configuration

### Environment Variables

| Variable                 | Description                          | Default     |
| ------------------------ | ------------------------------------ | ----------- |
| `NODE_ENV`               | Environment (development/production) | development |
| `PORT`                   | Server port                          | 8000        |
| `LOG_LEVEL`              | Logging level                        | debug       |
| `JWT_SECRET`             | JWT signing secret                   | -           |
| `JWT_EXPIRES_IN`         | Access token expiry                  | 7d          |
| `JWT_REFRESH_SECRET`     | Refresh token secret                 | -           |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry                 | 30d         |
| `REDIS_URL`              | Redis connection string              | -           |

### Database Configuration

Prisma schema is located at `prisma/schema.prisma`. Modify the schema and run migrations:

```bash
npm run db:migrate
npm run db:migrate:deploy
npm run db:migrate:reset
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Update JWT secrets with strong random values
3. Configure production database URL
4. Set up Redis instance
5. Configure CORS allowed origins
6. Set appropriate log level

### Coding Standards

-   Follow TypeScript best practices
-   Use Biome for linting and formatting
-   Write meaningful commit messages
-   Add JSDoc comments for functions
-   Include validation schemas for new endpoints
