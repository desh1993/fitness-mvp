# Fitness MVP

A modern fitness center member management system built with Laravel, React (Inertia.js), TypeScript, and Tailwind CSS.

## Technology Stack

- **Backend**: Laravel 12
- **Frontend**: React 18 with Inertia.js, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL 8.4
- **Development**: Laravel Sail (Docker)
- **Deployment**: Docker Compose on Digital Ocean

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Git](https://git-scm.com/)

## Local Development Setup

### First Time Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd fitness-mvp
    ```

2. **Start Docker containers**

    ```bash
    ./vendor/bin/sail up -d --build
    ```

    Or if you have Sail aliased:

    ```bash
    sail up -d --build
    ```

3. **Seed the database** (first time only)

    ```bash
    ./vendor/bin/sail artisan db:seed
    ```

    Or:

    ```bash
    sail artisan db:seed
    ```

4. **Configure environment**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` file with your configuration (database credentials, app URL, etc.)

5. **Generate application key**

    ```bash
    ./vendor/bin/sail artisan key:generate
    ```

    Or:

    ```bash
    sail artisan key:generate
    ```

6. **Start the development server**

    ```bash
    ./vendor/bin/sail npm run dev
    ```

    Or:

    ```bash
    sail npm run dev
    ```

7. **Access the application**
   Open your browser and navigate to:
    ```
    http://fitness-mvp.localhost
    ```

### Subsequent Runs

For subsequent development sessions:

1. **Start Docker containers**

    ```bash
    ./vendor/bin/sail up -d
    ```

    Or:

    ```bash
    sail up -d
    ```

2. **Start the development server** (if needed)
    ```bash
    ./vendor/bin/sail npm run dev
    ```

## Environment Configuration

The `.env` file contains all environment-specific configuration. Copy `.env.example` to `.env` and update the following key variables:

- `APP_NAME` - Application name
- `APP_URL` - Application URL
- `DB_DATABASE` - Database name
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

**Note**: The `.env` file is gitignored and should never be committed to version control.

## Database Setup

### Seeding

The database seeders create initial data including:

- **UserSeeder**: Creates admin user and test users
- **MemberSeeder**: Creates sample member data

Run seeders with:

```bash
./vendor/bin/sail artisan db:seed
```

Or seed specific classes:

```bash
./vendor/bin/sail artisan db:seed --class=UserSeeder
```

### Migrations

Run migrations with:

```bash
./vendor/bin/sail artisan migrate
```

For a fresh start (drops all tables and re-runs migrations):

```bash
./vendor/bin/sail artisan migrate:fresh --seed
```

## Testing

Run the test suite:

```bash
./vendor/bin/sail artisan test
```

Or:

```bash
sail artisan test
```

The test suite includes:

- Feature tests for authentication, members, and profiles
- Unit tests
- PHPUnit configuration

## Deployment

The application is deployed using Docker Compose on Digital Ocean.

**Production URL**: https://fitness.deshtest.com/

### Production Setup

Production deployment uses `docker-compose.production.yml` which includes:

- Traefik reverse proxy with Let's Encrypt SSL
- MySQL database
- Application service
- Queue worker
- Scheduler service

For production deployment, refer to the `docker-compose.production.yml` file.

## Admin Access

**Default Admin Credentials**:

- **Username**: `admin@fithub.com`
- **Password**: `password`

**⚠️ Security Warning**: Change these credentials immediately in production environments!

## Common Commands

### Docker/Sail Commands

```bash
# Start containers
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail down

# View logs
./vendor/bin/sail logs

# Execute commands in container
./vendor/bin/sail artisan <command>
./vendor/bin/sail npm <command>
./vendor/bin/sail composer <command>
```

### Artisan Commands

```bash
# Database
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan migrate:fresh --seed
./vendor/bin/sail artisan db:seed

# Tinker (interactive shell)
./vendor/bin/sail artisan tinker

# Clear caches
./vendor/bin/sail artisan cache:clear
./vendor/bin/sail artisan config:clear
./vendor/bin/sail artisan route:clear
./vendor/bin/sail artisan view:clear
```

### Frontend Commands

```bash
# Development server
./vendor/bin/sail npm run dev

# Build for production
./vendor/bin/sail npm run build

# Lint code
./vendor/bin/sail npm run lint
```

## Project Structure

```
fitness-mvp/
├── app/
│   ├── Http/Controllers/    # Application controllers
│   ├── Models/              # Eloquent models
│   └── Services/            # Business logic services
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── resources/
│   ├── js/
│   │   ├── Components/      # React components
│   │   ├── Layouts/         # Layout components
│   │   └── Pages/           # Inertia page components
│   └── css/                 # Stylesheets
├── routes/
│   ├── web.php             # Web routes
│   └── api.php             # API routes
└── docker-compose.production.yml  # Production Docker setup
```

## Troubleshooting

### Port Already in Use

If you encounter port conflicts, you can:

1. Stop other services using the ports
2. Change ports in `compose.yaml` or `.env` file

### Database Connection Issues

Ensure:

- MySQL container is running: `./vendor/bin/sail ps`
- Database credentials in `.env` match the Docker configuration
- Run migrations: `./vendor/bin/sail artisan migrate`

### Permission Issues

If you encounter permission issues with storage or cache:

```bash
./vendor/bin/sail artisan storage:link
./vendor/bin/sail chmod -R 775 storage bootstrap/cache
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
