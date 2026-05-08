# Installation Guide

This guide walks you through installing and running **NexResto** on your local machine.

---

## Prerequisites

Make sure you have the following installed before starting:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| Node.js | 18.x | https://nodejs.org |
| npm | 9.x (comes with Node) | — |
| PHP | 8.2 | https://php.net |
| Composer | 2.x | https://getcomposer.org |
| MySQL | 8.0 | https://mysql.com |
| Git | Any | https://git-scm.com |

> **SQLite alternative**: You can use SQLite instead of MySQL for local development. See Database Setup below.

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/yourname/nexresto.git
cd nexresto
```

You should see two main folders:
- `nexresto/` — React frontend
- `nexresto-api/` — Laravel backend

---

## Step 2 — Backend Setup

### 2.1 Install PHP dependencies

```bash
cd nexresto-api
composer install
```

### 2.2 Create the environment file

```bash
cp .env.example .env
```

### 2.3 Generate the application key

```bash
php artisan key:generate
```

### 2.4 Configure the database

Open `.env` and fill in your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexresto
DB_USERNAME=root
DB_PASSWORD=your_password
```

> **Using SQLite?** Change `DB_CONNECTION=sqlite` and the file `database/database.sqlite` will be used automatically.

### 2.5 Run migrations and seed demo data

```bash
php artisan migrate --seed
```

This creates all tables and inserts:
- 4 user accounts (Admin, Cashier, Chef, Driver)
- 12 product categories
- 6+ demo products
- Sample orders and deliveries

### 2.6 Create the storage symlink

```bash
php artisan storage:link
```

### 2.7 Start the API server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

---

## Step 3 — Frontend Setup

### 3.1 Install Node dependencies

```bash
cd nexresto
npm install
```

### 3.2 Create the environment file

```bash
cp .env.example .env
```

### 3.3 Configure the API URL

Open `.env` and set your backend URL:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3.4 Start the development server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## Step 4 — Log In

Open your browser and go to `http://localhost:5173/login`.

Use one of the demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexresto.com | password |
| Cashier | cashier@nexresto.com | password |
| Chef | chef@nexresto.com | password |
| Driver | driver@nexresto.com | password |

---

## Environment Variables Reference

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Base URL of the Laravel API (no trailing slash) |
| `VITE_APP_NAME` | ❌ | Display name (defaults to NexResto) |

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `APP_NAME` | ✅ | Application name |
| `APP_KEY` | ✅ | Laravel app key (auto-generated) |
| `APP_DEBUG` | ✅ | Set to `false` in production |
| `APP_URL` | ✅ | Backend URL |
| `FRONTEND_URL` | ✅ | Frontend URL (for CORS) |
| `DB_*` | ✅ | Database connection details |
| `SANCTUM_STATEFUL_DOMAINS` | ✅ | Frontend domain(s) for Sanctum |

---

## Common Issues

### ❌ "CORS error" in the browser

Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly (no trailing slash).

Also check `SANCTUM_STATEFUL_DOMAINS` includes your frontend host:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### ❌ "No application encryption key has been specified"

Run: `php artisan key:generate`

### ❌ Images not loading

Run: `php artisan storage:link`

### ❌ "Database connection refused"

- Check MySQL is running
- Verify DB credentials in `.env`
- Make sure the database exists: `CREATE DATABASE nexresto;`

### ❌ Vite cannot find modules

Run: `npm install` again to restore missing dependencies.

### ❌ "php artisan" command not found

Make sure PHP is in your system PATH. Test with: `php --version`
