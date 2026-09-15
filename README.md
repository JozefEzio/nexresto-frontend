# NexResto — Restaurant Management System

<p align="center">
  <img src="public/chef.svg" alt="NexResto Logo" width="80" />
</p>

<h3 align="center">NexResto</h3>
<p align="center">A full-stack, role-based restaurant management platform with POS, Kitchen Display System, Delivery tracking, and Admin dashboard.</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Sanctum-Auth-orange" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## ✨ Features

- 🧾 **Point of Sale (POS)** — Take orders, manage cart, choose payment method, delivery or dine-in
- 👨‍🍳 **Kitchen Display System (KDS)** — Real-time order queue with status management
- 🚴 **Delivery Management** — Track deliveries by driver with status progression
- 📊 **Admin Dashboard** — Revenue charts, order analytics, top products, and downloadable reports
- 👥 **Role-Based Access** — Admin, Cashier, Chef, Driver roles with dedicated dashboards
- ⚙️ **Settings Panel** — Products, categories, users, general restaurant config, and password management
- 🔄 **Auto-refresh** — KDS and Deliveries refresh every 30 seconds automatically
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile
- 🔐 **Secure Auth** — Laravel Sanctum token-based authentication

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, TailwindCSS 4 |
| Backend API | Laravel 11, PHP 8.3 |
| Authentication | Laravel Sanctum (token-based) |
| Database | MySQL (or SQLite for local dev) |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP Client | Axios (centralized instance) |
| PDF/Print | jsPDF + html2canvas |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **PHP** ≥ 8.2
- **Composer** ≥ 2
- **MySQL** ≥ 8 (or SQLite for local dev)

### 1. Clone the repository

```bash
git clone https://github.com/yourname/nexresto.git
cd nexresto
```

### 2. Setup Backend (API)

```bash
cd nexresto-api
composer install
cp .env.example .env
php artisan key:generate
# Edit .env with your database credentials
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### 3. Setup Frontend

```bash
cd nexresto
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL
npm run dev
```

---

## 🔑 Demo Credentials

After running `php artisan migrate --seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexresto.com | password |
| Cashier | cashier@nexresto.com | password |
| Chef | chef@nexresto.com | password |
| Driver | driver@nexresto.com | password |

---

## 🌐 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=NexResto
```

### Backend (`.env`)

```env
APP_NAME=NexResto
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
DB_CONNECTION=mysql
DB_DATABASE=nexresto
DB_USERNAME=root
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

---

## 📁 Folder Structure

```
nexresto/                  # Frontend (React + Vite)
├── src/
│   ├── components/
│   │   ├── home/          # Dashboard widgets per role
│   │   ├── kds/           # Kitchen display components
│   │   ├── pos/           # POS system components + cart
│   │   └── settings/      # Settings panels + modals
│   ├── config/            # Color tokens, category icons
│   ├── context/           # Auth, Cart, Toast contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Axios instance
│   └── pages/             # Route-level pages
├── public/
└── .env.example

nexresto-api/              # Backend (Laravel 11)
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   ├── Middleware/
│   │   └── Requests/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── .env.example
```

---

## 🔨 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📦 Artisan Commands

| Command | Description |
|---------|-------------|
| `php artisan migrate --seed` | Fresh database with demo data |
| `php artisan migrate:fresh --seed` | Drop all tables and re-seed |
| `php artisan storage:link` | Create the storage symlink |
| `php artisan serve` | Start the dev API server |

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full production deployment instructions.

---

## 📖 Documentation

- [INSTALLATION.md](INSTALLATION.md) — Step-by-step setup guide
- [FEATURES.md](FEATURES.md) — Full feature documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production deployment guide

---

## 📄 License

MIT License — free to use for personal and commercial projects.
