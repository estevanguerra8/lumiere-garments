import { NextResponse } from 'next/server';
import { db, getVersion, bumpVersion } from '@/lib/database';
import type { CartItem } from '@/data/types';

export const dynamic = 'force-dynamic';

// ================================================================
// GET /api/db — All read queries use real SQL
// ================================================================
export async function GET() {
  // -- SUM(Quantity * SalePrice) FROM ORDER_LINE
  const { totalRevenue } = db.prepare(`
    SELECT COALESCE(SUM(Quantity * SalePrice), 0) AS totalRevenue
    FROM ORDER_LINE
  `).get() as { totalRevenue: number };

  // -- COUNT(*) FROM ORDER
  const { totalOrders } = db.prepare(`
    SELECT COUNT(*) AS totalOrders FROM "ORDER"
  `).get() as { totalOrders: number };

  // -- COUNT(*) FROM CUSTOMER
  const { totalCustomers } = db.prepare(`
    SELECT COUNT(*) AS totalCustomers FROM CUSTOMER
  `).get() as { totalCustomers: number };

  // -- COUNT(*) FROM PRODUCT
  const { totalProducts } = db.prepare(`
    SELECT COUNT(*) AS totalProducts FROM PRODUCT
  `).get() as { totalProducts: number };

  // -- SUM(Quantity) FROM INVENTORY
  const { totalInventoryUnits } = db.prepare(`
    SELECT COALESCE(SUM(Quantity), 0) AS totalInventoryUnits
    FROM INVENTORY
  `).get() as { totalInventoryUnits: number };

  // -- Low stock: GROUP BY product, HAVING total <= 10
  const lowStockProducts = db.prepare(`
    SELECT p.ProductID, p.Name, COALESCE(SUM(i.Quantity), 0) AS totalQty
    FROM PRODUCT p
    LEFT JOIN INVENTORY i ON p.ProductID = i.ProductID
    GROUP BY p.ProductID, p.Name
    HAVING totalQty <= 10
  `).all();

  // -- Recent orders: JOIN ORDER + CUSTOMER, ORDER BY date DESC LIMIT 5
  const recentOrders = db.prepare(`
    SELECT o.OrderID, o.CustomerID, o.OrderDate,
           o.TotalAmount, o.PaymentStatus,
           c.Name AS CustomerName
    FROM "ORDER" o
    JOIN CUSTOMER c ON o.CustomerID = c.CustomerID
    ORDER BY o.OrderDate DESC
    LIMIT 5
  `).all();

  // -- Products with inventory: JOIN PRODUCT + COLLECTION + INVENTORY (aggregate)
  const productsWithInventory = db.prepare(`
    SELECT p.ProductID, p.CollectionID, p.Name, p.Size, p.Color,
           p.RetailPrice, p.ImageUrl,
           c.Name AS collectionName,
           COALESCE(SUM(i.Quantity), 0) AS totalInventory
    FROM PRODUCT p
    JOIN COLLECTION c ON p.CollectionID = c.CollectionID
    LEFT JOIN INVENTORY i ON p.ProductID = i.ProductID
    GROUP BY p.ProductID
  `).all();

  // -- 4-table JOIN: CUSTOMER + ORDER + ORDER_LINE + PRODUCT
  const orderDetails = db.prepare(`
    SELECT c.Name AS CustomerName,
           o.OrderID,
           o.OrderDate,
           p.Name AS ProductName,
           ol.Quantity,
           ol.SalePrice
    FROM CUSTOMER c
    JOIN "ORDER" o    ON c.CustomerID = o.CustomerID
    JOIN ORDER_LINE ol ON o.OrderID   = ol.OrderID
    JOIN PRODUCT p     ON ol.ProductID = p.ProductID
    ORDER BY o.OrderDate DESC
  `).all();

  // -- Production schedule: JOIN PRODUCTION_BATCH + PRODUCT + MANUFACTURER
  const productionSchedule = db.prepare(`
    SELECT pb.BatchID,
           p.Name  AS ProductName,
           m.Name  AS ManufacturerName,
           pb.ProductionDate,
           pb.QuantityProduced,
           pb.CostPerUnit
    FROM PRODUCTION_BATCH pb
    JOIN PRODUCT p      ON pb.ProductID      = p.ProductID
    JOIN MANUFACTURER m ON pb.ManufacturerID = m.ManufacturerID
    ORDER BY pb.ProductionDate
  `).all();

  // -- Inventory with details: JOIN INVENTORY + PRODUCT + WAREHOUSE
  const inventoryWithDetails = db.prepare(`
    SELECT i.ProductID, i.WarehouseID, i.Quantity,
           p.Name     AS ProductName,
           w.Location AS WarehouseLocation
    FROM INVENTORY i
    JOIN PRODUCT   p ON i.ProductID   = p.ProductID
    JOIN WAREHOUSE w ON i.WarehouseID = w.WarehouseID
  `).all();

  // -- Simple SELECTs
  const collections = db.prepare('SELECT * FROM COLLECTION').all();
  const customers   = db.prepare('SELECT * FROM CUSTOMER').all();

  return NextResponse.json({
    version: getVersion(),
    dashboardStats: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      totalInventoryUnits,
      lowStockProducts,
      recentOrders,
    },
    productsWithInventory,
    orderDetails,
    productionSchedule,
    inventoryWithDetails,
    collections,
    customers,
  });
}

// ================================================================
// POST /api/db — Mutations use real SQL (INSERT, UPDATE, DELETE)
// ================================================================
export async function POST(request: Request) {
  const body = await request.json();

  switch (body.action) {
    // ---- INSERT INTO ORDER + ORDER_LINE, UPDATE INVENTORY ----
    case 'placeOrder': {
      const customerId = body.customerId as number;
      const items = body.items as CartItem[];

      // Validate customer exists
      const customer = db.prepare(
        'SELECT CustomerID FROM CUSTOMER WHERE CustomerID = ?'
      ).get(customerId);

      if (!customer) {
        return NextResponse.json({ success: false, error: 'Customer not found.' });
      }

      // Validate inventory for each item
      for (const item of items) {
        const row = db.prepare(`
          SELECT COALESCE(SUM(Quantity), 0) AS available
          FROM INVENTORY
          WHERE ProductID = ?
        `).get(item.ProductID) as { available: number };

        if (row.available < item.Quantity) {
          const prod = db.prepare('SELECT Name FROM PRODUCT WHERE ProductID = ?').get(item.ProductID) as { Name: string } | undefined;
          return NextResponse.json({
            success: false,
            error: `Insufficient inventory for ${prod?.Name ?? 'Product ' + item.ProductID}. Available: ${row.available}, Requested: ${item.Quantity}.`,
          });
        }
      }

      // Run INSERT + UPDATE inside a transaction
      const placeOrderTx = db.transaction(() => {
        // SUM(Quantity * SalePrice)
        const totalAmount = items.reduce(
          (sum, item) => sum + item.Quantity * item.SalePrice, 0
        );
        const today = new Date().toISOString().split('T')[0];

        // INSERT INTO ORDER
        const info = db.prepare(`
          INSERT INTO "ORDER" (CustomerID, OrderDate, TotalAmount, PaymentStatus)
          VALUES (?, ?, ?, 'Paid')
        `).run(customerId, today, totalAmount);

        const orderId = info.lastInsertRowid as number;

        // INSERT INTO ORDER_LINE for each item
        const insLine = db.prepare(`
          INSERT INTO ORDER_LINE (OrderID, ProductID, Quantity, SalePrice)
          VALUES (?, ?, ?, ?)
        `);

        for (const item of items) {
          insLine.run(orderId, item.ProductID, item.Quantity, item.SalePrice);

          // UPDATE INVENTORY — decrement across warehouses
          let remaining = item.Quantity;
          const rows = db.prepare(`
            SELECT WarehouseID, Quantity
            FROM INVENTORY
            WHERE ProductID = ? AND Quantity > 0
            ORDER BY Quantity DESC
          `).all(item.ProductID) as { WarehouseID: number; Quantity: number }[];

          for (const row of rows) {
            if (remaining <= 0) break;
            const deduct = Math.min(row.Quantity, remaining);
            db.prepare(`
              UPDATE INVENTORY
              SET Quantity = Quantity - ?
              WHERE ProductID = ? AND WarehouseID = ?
            `).run(deduct, item.ProductID, row.WarehouseID);
            remaining -= deduct;
          }
        }

        return {
          OrderID: orderId,
          CustomerID: customerId,
          OrderDate: today,
          TotalAmount: totalAmount,
          PaymentStatus: 'Paid' as const,
        };
      });

      const order = placeOrderTx();
      bumpVersion();
      return NextResponse.json({ success: true, order });
    }

    // ---- UPDATE INVENTORY ----
    case 'updateInventory': {
      const { productId, warehouseId, newQuantity } = body;

      const result = db.prepare(`
        UPDATE INVENTORY
        SET Quantity = ?
        WHERE ProductID = ? AND WarehouseID = ?
      `).run(newQuantity, productId, warehouseId);

      const ok = result.changes > 0;
      if (ok) bumpVersion();
      return NextResponse.json({ success: ok });
    }

    // ---- DELETE FROM CUSTOMER ----
    case 'deleteCustomer': {
      const result = db.prepare(`
        DELETE FROM CUSTOMER WHERE CustomerID = ?
      `).run(body.customerId);

      const ok = result.changes > 0;
      if (ok) bumpVersion();
      return NextResponse.json({ success: ok });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
