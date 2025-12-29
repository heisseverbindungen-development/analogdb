# AnalogFilmDB

A web application for managing your analog film inventory. Track your film stock, log when rolls are loaded into cameras, and monitor expiration dates.

## Features

- **Dashboard**: Overview of your film inventory with statistics and charts
- **Film Inventory**: Manage your film stock with detailed information (manufacturer, type, ISO, expiry date)
- **Film Logbook**: Track which films are loaded in cameras and their usage history
- **Image Uploads**: Add custom images to your film rolls (auto-compressed to 300x300 WebP thumbnails)
- **Mobile Responsive**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Image Processing**: Sharp (automatic thumbnail compression)
- **Build Tool**: Vite

---

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your server
- Git (optional, for cloning the repository)

### Quick Start

1. **Clone the repository** (or copy the files to your server):
   ```bash
   git clone <your-repository-url>
   cd analogfilmdb
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables** in `.env`:
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password_here
   POSTGRES_DB=analogfilmdb
   POSTGRES_PORT=5432
   APP_PORT=5000
   ```

4. **Build and start the containers**:
   ```bash
   docker-compose up --build -d
   ```

5. **Verify the deployment**:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

6. **Access the application** at `http://your-server-ip:5000`

---

## Image Upload System

The application includes a local image upload system optimized for storage efficiency:

### How It Works

1. **Upload**: When you add an image to a film roll, it's uploaded via `POST /api/local-uploads`
2. **Processing**: The image is automatically:
   - Resized to 300x300 pixels (thumbnail size)
   - Converted to WebP format (30-50% smaller than JPEG)
   - Saved with a unique UUID filename
3. **Storage**: Images are stored in the `uploads/` directory
4. **Serving**: Images are served via `GET /local-uploads/:filename` with 1-year cache headers

### Storage Persistence

In Docker, uploaded images are persisted using a named volume:
```yaml
volumes:
  - uploads_data:/app/uploads
```

This ensures images survive container restarts and updates.

### Backup Images

```bash
# Copy uploads from container to host
docker cp analogfilmdb-app:/app/uploads ./uploads-backup

# Restore uploads to container
docker cp ./uploads-backup/. analogfilmdb-app:/app/uploads/
```

---

## Portainer Deployment

### Method 1: Deploy from Git Repository

1. **Access Portainer** (usually at `http://your-server:9000`)

2. **Navigate to**: Stacks → Add Stack

3. **Configure the stack**:
   - **Name**: `analogfilmdb`
   - **Build method**: Repository

4. **Repository settings**:
   - **Repository URL**: Your Git repository URL
   - **Compose path**: `docker-compose.yml`
   - **Branch**: `main` (or your default branch)

5. **Add environment variables**:
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_DB=analogfilmdb
   APP_PORT=5000
   ```

6. **Click "Deploy the stack"**

### Method 2: Deploy via Web Editor

1. **Access Portainer** → Stacks → Add Stack

2. **Select "Web editor"** as the build method

3. **Paste the docker-compose.yml content**:
   ```yaml
   version: '3.8'

   services:
     postgres:
       image: postgres:16-alpine
       container_name: analogfilmdb-postgres
       restart: unless-stopped
       environment:
         POSTGRES_USER: ${POSTGRES_USER:-postgres}
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
         POSTGRES_DB: ${POSTGRES_DB:-analogfilmdb}
       ports:
         - "${POSTGRES_PORT:-5432}:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
       networks:
         - app-network
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
         interval: 10s
         timeout: 5s
         retries: 5

     app:
       build:
         context: .
         dockerfile: Dockerfile
       container_name: analogfilmdb-app
       restart: unless-stopped
       environment:
         NODE_ENV: production
         PORT: 5000
         DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-changeme}@postgres:5432/${POSTGRES_DB:-analogfilmdb}
       ports:
         - "${APP_PORT:-5000}:5000"
       depends_on:
         postgres:
           condition: service_healthy
       networks:
         - app-network

   volumes:
     postgres_data:
       driver: local

   networks:
     app-network:
       driver: bridge
   ```

4. **Add environment variables** below the editor

5. **Click "Deploy the stack"**

### Method 3: Using Pre-built Image

If you've pushed your image to a container registry:

1. Build and push the image:
   ```bash
   docker build -t your-registry/analogfilmdb:latest .
   docker push your-registry/analogfilmdb:latest
   ```

2. Update `docker-compose.yml` to use the image:
   ```yaml
   app:
     image: your-registry/analogfilmdb:latest
     # Remove the build section
   ```

3. Deploy in Portainer as described above

---

## Docker Commands Reference

### Container Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Rebuilding

```bash
# Rebuild and restart
docker-compose up --build -d

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Database Operations

```bash
# Access PostgreSQL shell
docker exec -it analogfilmdb-postgres psql -U postgres -d analogfilmdb

# Create database backup
docker exec analogfilmdb-postgres pg_dump -U postgres analogfilmdb > backup.sql

# Restore database backup
docker exec -i analogfilmdb-postgres psql -U postgres -d analogfilmdb < backup.sql
```

### Troubleshooting

```bash
# Check container health
docker inspect analogfilmdb-postgres | grep -A 10 Health

# View container resource usage
docker stats

# Shell into app container
docker exec -it analogfilmdb-app sh

# Check environment variables
docker exec analogfilmdb-app env
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `changeme` |
| `POSTGRES_DB` | Database name | `analogfilmdb` |
| `POSTGRES_PORT` | PostgreSQL external port | `5432` |
| `APP_PORT` | Application external port | `5000` |
| `NODE_ENV` | Node environment | `production` |

### Changing Ports

To change the application port, update `.env`:
```env
APP_PORT=8080
```

Then restart:
```bash
docker-compose down
docker-compose up -d
```

### Using with Reverse Proxy (Nginx/Traefik)

For production deployments behind a reverse proxy:

1. Remove the port mapping from `docker-compose.yml`:
   ```yaml
   app:
     # Remove or comment out:
     # ports:
     #   - "${APP_PORT:-5000}:5000"
   ```

2. Connect to your proxy network:
   ```yaml
   networks:
     - app-network
     - proxy-network  # Your reverse proxy network
   ```

3. Configure your reverse proxy to forward to `analogfilmdb-app:5000`

---

## Data Persistence

Database data is stored in a Docker volume named `postgres_data`. This persists across container restarts and rebuilds.

### Backup Strategy

It's recommended to regularly backup your database:

```bash
# Create a backup script
#!/bin/bash
BACKUP_DIR=/path/to/backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
docker exec analogfilmdb-postgres pg_dump -U postgres analogfilmdb > $BACKUP_DIR/backup_$TIMESTAMP.sql
```

### Removing All Data

**Warning**: This will delete all your film inventory data!

```bash
docker-compose down -v
```

---

## Updating the Application

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild and restart:
   ```bash
   docker-compose up --build -d
   ```

The entrypoint script will automatically run any new database migrations.

---

## License

MIT License
