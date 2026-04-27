# Lumiere Garments

**A Database for Luxury Streetwear** — CS/SE 4347 Database Systems Project Demo

Lumiere Garments is a luxury streetwear company that sells limited-time clothing drops. This web app demonstrates a full relational database backing a storefront, admin dashboard, and business analytics — currently powered by mock data with a clean swap path to MySQL.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Mock in-memory database** (swappable to MySQL)

## Database Schema (11 Tables)

| Table | Description |
|---|---|
| COLLECTION | Seasonal clothing collections |
| PRODUCT | Individual SKUs (name, size, color, price) |
| SUPPLIER | Raw material suppliers |
| MANUFACTURER | Production facilities |
| WAREHOUSE | Storage locations |
| CUSTOMER | Registered customers |
| PRODUCT_SUPPLIER | Many-to-many: products ↔ suppliers |
| PRODUCTION_BATCH | Manufacturing runs |
| INVENTORY | Stock levels per product per warehouse |
| ORDER | Customer orders |
| ORDER_LINE | Individual items within an order |

## Pages

| Page | Route | What It Demonstrates |
|---|---|---|
| Executive Dashboard | `/` | Aggregates, COUNT, SUM |
| Product Catalog | `/catalog` | SELECT with filters |
| Cart & Checkout | `/cart` | INSERT (order), UPDATE (inventory) |
| Orders | `/orders` | 4-table JOIN |
| Inventory | `/inventory` | UPDATE operations |
| Production Schedule | `/production` | JOIN across batches/products/manufacturers |
| DB Operations | `/db-operations` | SQL snippets mapped to UI actions |

## Architecture

```
UI Components (React)
    ↓ calls
DataProvider (React Context)
    ↓ calls
Service Layer (src/services/databaseService.ts)
    ↓ calls
Repository Layer (src/repositories/mockRepository.ts)
    ↓ operates on
Mock Database (src/data/mockDb.ts)
```

The UI never accesses data arrays directly. All data flows through service functions:

- `getDashboardStats()` — aggregates across all tables
- `getProductsWithInventory()` — JOIN product + collection + inventory
- `getOrdersWithCustomerAndProductDetails()` — 4-table JOIN
- `placeOrder(customerId, cartItems)` — INSERT order + order lines, UPDATE inventory
- `updateInventory(productId, warehouseId, quantity)` — UPDATE demo
- `getProductionSchedule()` — JOIN batches + products + manufacturers
- `getTotalRevenue()` — SUM(Quantity * SalePrice) from ORDER_LINE

## Business Rules (Enforced in Service Layer)

1. Inventory is checked before order placement — cannot sell more than available stock
2. Order TotalAmount = SUM(Quantity * SalePrice) from its order lines
3. Inventory quantity decreases automatically when an order is placed
4. Revenue is calculated live from ORDER_LINE data, not stored

## Demo Flow (7-10 minutes)

1. **Dashboard** — Explain the business model, show KPIs and revenue calculation
2. **Catalog** — Browse products from the database, use filters
3. **Add to Cart** — Select a hoodie or jacket
4. **Checkout** — Select a customer, place the order
5. **Verify** — Show the order appeared in the Orders page (4-table JOIN)
6. **Inventory** — Show that stock decreased after the purchase
7. **Dashboard** — Revenue updated with the new order
8. **Production** — Show manufacturing schedule
9. **DB Operations** — Walk through SQL → UI mapping
10. **Closing** — "Currently backed by mock data, built to connect to MySQL schema"

## Connecting to MySQL

### Step 1: Export the MySQL database

Export your MySQL database from MySQL Workbench as a `.sql` file.

### Step 2: Install MySQL locally

Install MySQL if not already installed.

### Step 3: Import the database

```bash
mysql -u root -p < lumiere_garments.sql
```

### Step 4: Create environment file

Create `.env.local` in the project root:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=lumiere_garments
DB_PORT=3306
```

### Step 5: Install MySQL driver

```bash
npm install mysql2
```

### Step 6: Swap the repository

The file `src/repositories/mysqlRepository.placeholder.ts` contains the full MySQL implementation with TODO comments. To activate:

1. Rename it to `mysqlRepository.ts`
2. Uncomment the `mysql2/promise` import and pool configuration
3. Uncomment all the query functions
4. Update `src/services/databaseService.ts` to import from the MySQL repository
5. Add API routes in `src/app/api/` that call the service layer (since MySQL queries must run server-side)

### Step 7: Run the app

```bash
npm run dev
```

## Project Structure

```
src/
  data/
    types.ts              # TypeScript interfaces for all 11 tables
    mockDb.ts             # Seed data (mutable in-memory)
  repositories/
    mockRepository.ts     # Data access functions (array operations)
    mysqlRepository.placeholder.ts  # MySQL implementation template
  services/
    databaseService.ts    # Business logic layer
  providers/
    DataProvider.tsx       # React Context for database state
    CartProvider.tsx       # React Context for cart state
  components/
    layout/Navbar.tsx     # Navigation bar
  app/
    page.tsx              # Dashboard
    catalog/page.tsx      # Product catalog
    cart/page.tsx          # Cart & checkout
    orders/page.tsx       # Order history (JOIN view)
    inventory/page.tsx    # Inventory management
    production/page.tsx   # Production schedule
    db-operations/page.tsx # SQL operations demo
```
