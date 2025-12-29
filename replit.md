# AnalogFilmDB

## Overview

AnalogFilmDB is a web application for managing an inventory of analog film rolls. Users can track their film stock, log when rolls are loaded into cameras, and monitor expiration dates. The app provides a dashboard overview, full inventory management, and a logbook for tracking film usage history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React Context for global app state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **File Uploads**: Uppy with AWS S3 presigned URL support

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful JSON API under `/api` prefix
- **Build Tool**: Vite for frontend, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit with `db:push` command
- **Object Storage**: Google Cloud Storage via Replit's sidecar integration for file uploads

### Key Data Models
- **Film Rolls**: Core inventory items with manufacturer, film type, size, ISO, expiration date, quantity, and optional images
- **Film Logs**: Track when rolls are loaded into cameras and finished, with camera info and notes

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components
    pages/        # Route pages (dashboard, inventory, cameras)
    lib/          # Utilities, API client, context providers
    shared/       # Shared types between frontend modules
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Database access layer
  replit_integrations/  # Object storage integration
shared/           # Shared code between client and server
  schema.ts       # Drizzle database schema
db/               # Database connection setup
```

## External Dependencies

### Database
- PostgreSQL (requires `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database queries

### Cloud Services
- Google Cloud Storage for file uploads (via Replit sidecar at `127.0.0.1:1106`)
- Presigned URL flow for direct client-to-storage uploads

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@uppy/core` / `@uppy/aws-s3`: File upload handling
- `zod`: Schema validation (shared between client and server)
- `recharts`: Dashboard charts and visualizations
- `date-fns`: Date formatting and manipulation