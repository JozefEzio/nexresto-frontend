# Deployment Guide

This guide covers deploying **NexResto** to a production environment.

---

## Overview

NexResto consists of two separate deployments:
1. **Frontend** — Static React build → host on Vercel, Netlify, or any CDN
2. **Backend API** — Laravel PHP app → host on a VPS, Forge, or shared hosting

---

## Frontend Deployment (Vercel / Netlify)

### 1. Build for production

```bash
cd nexresto
npm run build
```

This generates the `dist/` folder with optimized static assets.

### 2. Set environment variables on your host

In your Vercel / Netlify dashboard, add:

```
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=NexResto
```

### 3. Deploy

**Vercel:**
```bash
npx vercel --prod
```

**Netlify:**
```bash
npx netlify-cli deploy --prod --dir=dist
```

**Manual upload:** Upload the contents of `dist/` to your web root.

### 4. SPA routing

Add a redirect rule so all routes serve `index.html`:

**Vercel** — create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** — create `public/_redirects`:
```
/*  /index.html  200
```

**Apache** — create `public/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Backend Deployment (VPS / Laravel Forge)

### Option A — Laravel Forge (Recommended)

1. Create a new site on Forge pointing to your server
2. Connect your Git repository
3. Set your environment variables in the Forge dashboard
4. Enable the deployment script:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan migrate --force
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Option B — Shared Hosting / VPS Manual Deploy

#### 1. Upload files

Upload the `nexresto-api/` folder to your server (e.g., `/var/www/nexresto-api`).

#### 2. Install dependencies

```bash
cd /var/www/nexresto-api
composer install --no-dev --optimize-autoloader
```

#### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your production values
php artisan key:generate
```

#### 4. Run migrations

```bash
php artisan migrate --force --seed
php artisan storage:link
```

#### 5. Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### 6. Configure web server

**Nginx** — point document root to `/var/www/nexresto-api/public`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/nexresto-api/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## Production Environment Configuration

### Backend `.env` checklist

```env
APP_ENV=production
APP_DEBUG=false          # CRITICAL: always false in production
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=nexresto_prod
DB_USERNAME=nexresto_user
DB_PASSWORD=strong_password_here

LOG_LEVEL=error           # Only log errors in production
BCRYPT_ROUNDS=12
```

### CORS Configuration

In `config/cors.php`, ensure:
```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
```

---

## SSL / HTTPS

Always use HTTPS in production. Use [Let's Encrypt](https://letsencrypt.org/) for free SSL certificates:

```bash
certbot --nginx -d api.yourdomain.com
```

---

## File Storage

Product images and avatars are stored in Laravel's public disk.

- **Local storage**: files stored in `storage/app/public/`, served via `public/storage/` symlink
- **S3 (recommended for production)**: configure `FILESYSTEM_DISK=s3` and fill in AWS credentials in `.env`

---

## Recommended Hosting Platforms

| Service | Frontend | Backend |
|---------|----------|---------|
| **Vercel** | ✅ Excellent | ❌ |
| **Netlify** | ✅ Good | ❌ |
| **Laravel Forge** | ❌ | ✅ Excellent |
| **DigitalOcean App Platform** | ✅ | ✅ |
| **Railway** | ✅ | ✅ |
| **Render** | ✅ | ✅ |
| **Hostinger / cPanel** | ✅ | ✅ (PHP shared) |

---

## Post-Deployment Checklist

- [ ] `APP_DEBUG=false` in backend `.env`
- [ ] SSL certificate installed (HTTPS)
- [ ] Storage symlink created (`php artisan storage:link`)
- [ ] Migrations run (`php artisan migrate --force`)
- [ ] Laravel caches cleared and rebuilt
- [ ] `SANCTUM_STATEFUL_DOMAINS` matches production frontend domain
- [ ] `FRONTEND_URL` set correctly for CORS
- [ ] `VITE_API_URL` set to production API URL in frontend env
- [ ] Login with admin credentials to verify app is working
