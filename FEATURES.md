# Features Documentation

Complete reference of all features included in **NexResto**.

---

## 🔐 Authentication & Roles

### Login / Register
- Secure token-based authentication via Laravel Sanctum
- JWT-less stateless API auth with Bearer tokens stored in `localStorage`
- Form validation on both frontend and backend
- Password visibility toggle
- Toast notifications for success/error feedback

### Role-Based Access Control
NexResto includes 4 staff roles (plus Client for public registration):

| Role | Access |
|------|--------|
| **Admin** | Full access: POS, KDS, Deliveries, Dashboard, Settings |
| **Cashier** | POS system, basic dashboard |
| **Chef** | Kitchen Display System, chef dashboard |
| **Driver** | Delivery management, driver dashboard |
| **Client** | Created on public registration (limited access) |

Each role sees a tailored dashboard and can only access permitted routes.

---

## 🧾 Point of Sale (POS)

The POS screen allows cashiers and admins to build and place orders.

### Features
- **Category filter** — Filter products by category with collapsible grid
- **Product grid** — Browsable product catalog with quantity controls
- **Smart cart** — Live subtotal, tax calculation, and itemized list
- **Notes per item** — Add custom notes to any item (e.g., "no onions")
- **Order type** — Toggle between Dine-in and Delivery
- **Payment methods** — Cash, Credit Card, E-Wallet, Gift Cards
- **Delivery form** — Customer name, address, phone, and driver assignment
- **Recent Orders sidebar** — Today's orders with recall and cancel actions
- **Order recall** — Reload a past order back into the cart
- **Mobile optimized** — Tab-based UI on small screens (Menu / Cart)

### Order Flow
1. Select products → they appear in the cart
2. Choose order type (on-site / delivery)
3. If delivery: fill customer info and assign a driver
4. Choose payment method
5. Click **Place Order** → order is sent to the API and appears in KDS

---

## 👨‍🍳 Kitchen Display System (KDS)

Real-time order board for kitchen staff.

### Features
- **Auto-refresh** — Pulls new orders every 30 seconds
- **Status filter** — Filter by All / New / Preparing / Ready / Shipping
- **Date filter** — View orders for any selected day
- **Order cards** — Show order number, items, notes, and time elapsed
- **One-click status update** — Advance each order through the workflow
- **Optimistic UI** — Status updates instantly before server confirms
- **Empty state** — Friendly message when no orders match the filter

### Order Status Workflow
```
new → preparing → ready → shipping → delivered
                                   ↘ cancelled
```

---

## 🚴 Delivery Management

Track and manage all delivery orders.

### Features
- **Driver filter** (Admin only) — See all deliveries or filter by driver
- **Status filter** — Pending / Picked Up / Delivered tabs with counts
- **Date filter** — Browse deliveries by date
- **Delivery cards** — Show customer name, phone, address, items, and driver
- **Click-to-call** — Tap phone number to call the customer
- **Google Maps link** — Tap address to open in Maps
- **One-click status** — Drivers advance orders (Pending → Picked Up → Delivered)
- **Auto-refresh** — Updates every 30 seconds

### Delivery Status Workflow
```
pending → picked_up → delivered
```
When an order is marked as `delivered`, the linked order record is automatically updated.

---

## 📊 Admin Dashboard

Analytics overview for the admin role.

### Features
- **Date range picker** — Filter all stats by custom date range
- **Stat cards** — Revenue, orders, avg order value, pending, delivered, cancelled, delivery vs dine-in
- **Revenue chart** — Bar chart of revenue over selected period
- **Order status chart** — Pie/donut chart of order status breakdown
- **Recent orders table** — Last 10 orders with status badges
- **Top products** — Most ordered items with count and revenue
- **Quick links** — One-click navigation to POS, KDS, Settings
- **Print / Download** — Browser print report of the dashboard

### Role-Specific Home Dashboards
- **Chef Home** — Active order queue, stats for New/Preparing/Ready
- **Cashier Home** — Today's order summary and quick stats
- **Driver Home** — Assigned deliveries, pending count, delivery stats

---

## ⚙️ Settings

Full admin settings panel with tab navigation.

### Profile Tab
- Update name and email
- Upload avatar (stored in Laravel public storage)
- Role badge displayed (read-only)

### Password Tab
- Change current password with confirmation
- Server-side validation with inline error messages

### User Management Tab *(Admin only)*
- Paginated user table with avatar, name, email, role, join date
- Change user role via inline dropdown
- Add new users with avatar upload
- Edit existing users
- Reset any user's password
- Delete users (cannot delete yourself)

### Products Tab *(Admin only)*
- List all products with category, price, and availability toggle
- Add product with name, description, price, image, category
- Edit existing products
- Delete products

### Categories Tab *(Admin only)*
- View all categories with icon and color
- Add new categories with icon picker (Lucide icon names)
- Edit categories
- Delete categories

### General Settings Tab *(Admin only)*
- Restaurant name, email, phone, address
- Tax rate (%), default currency, default payment method
- Prep time, opening/closing hours
- Receipt header and footer text
- Toggle tax display on receipts

---

## 🖨️ Print & Export

- Dashboard report: Full printable view triggered from the Download Report button
- CSS print rules hide navigation and show only the printable content

---

## 📱 Responsive Design

| Screen | Behavior |
|--------|----------|
| Desktop (>768px) | Full sidebar + content layout |
| Tablet | Collapsed sidebar icons |
| Mobile (<768px) | Bottom mobile nav, tab-based POS |
