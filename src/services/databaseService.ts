// ============================================================
// Lumière Garments — Database Service Layer
// Contains all business logic. Calls repository functions.
// UI components should call these functions, never access
// data arrays directly.
// ============================================================

import type {
  DashboardStats, ProductWithInventory, OrderDetail,
  ProductionScheduleRow, CartItem, InventoryRow,
  Order, OrderLine,
} from '@/data/types';
import type { MockDatabase } from '@/repositories/mockRepository';
import * as repo from '@/repositories/mockRepository';

// -----------------------------------------------------------
// Dashboard
// -----------------------------------------------------------
export function getDashboardStats(db: MockDatabase): DashboardStats {
  const totalRevenue = getTotalRevenue(db);
  const totalOrders = db.orders.length;
  const totalCustomers = db.customers.length;
  const totalProducts = db.products.length;
  const totalInventoryUnits = db.inventory.reduce((s, i) => s + i.Quantity, 0);

  // Products with total inventory <= 10
  const lowStockProducts = db.products
    .map(p => ({
      ProductID: p.ProductID,
      Name: p.Name,
      totalQty: repo.getTotalInventoryForProduct(db, p.ProductID),
    }))
    .filter(p => p.totalQty <= 10);

  const recentOrders = [...db.orders]
    .sort((a, b) => b.OrderDate.localeCompare(a.OrderDate))
    .slice(0, 5)
    .map(o => {
      const customer = repo.getCustomerById(db, o.CustomerID);
      return { ...o, CustomerName: customer?.Name ?? 'Unknown' };
    });

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    totalInventoryUnits,
    lowStockProducts,
    recentOrders,
  };
}

// -----------------------------------------------------------
// Revenue — SUM(Quantity × SalePrice) from ORDER_LINE
// -----------------------------------------------------------
export function getTotalRevenue(db: MockDatabase): number {
  return db.orderLines.reduce(
    (sum, ol) => sum + ol.Quantity * ol.SalePrice,
    0
  );
}

// -----------------------------------------------------------
// Products with inventory (JOIN Product + Collection + Inventory)
// -----------------------------------------------------------
export function getProductsWithInventory(db: MockDatabase): ProductWithInventory[] {
  return db.products.map(p => {
    const collection = repo.getCollectionById(db, p.CollectionID);
    const totalInventory = repo.getTotalInventoryForProduct(db, p.ProductID);
    return {
      ...p,
      collectionName: collection?.Name ?? 'Unknown',
      totalInventory,
    };
  });
}

// -----------------------------------------------------------
// Order details (4-table JOIN: Customer + Order + OrderLine + Product)
// -----------------------------------------------------------
export function getOrdersWithCustomerAndProductDetails(db: MockDatabase): OrderDetail[] {
  const details: OrderDetail[] = [];

  for (const order of db.orders) {
    const customer = repo.getCustomerById(db, order.CustomerID);
    const lines = repo.getOrderLinesByOrder(db, order.OrderID);

    for (const line of lines) {
      const product = repo.getProductById(db, line.ProductID);
      details.push({
        CustomerName: customer?.Name ?? 'Unknown',
        OrderID: order.OrderID,
        OrderDate: order.OrderDate,
        ProductName: product?.Name ?? 'Unknown',
        Quantity: line.Quantity,
        SalePrice: line.SalePrice,
      });
    }
  }

  return details.sort((a, b) => b.OrderDate.localeCompare(a.OrderDate));
}

// -----------------------------------------------------------
// Place Order
// Business rules enforced:
//   - Inventory check (cannot sell if stock insufficient)
//   - TotalAmount = SUM(Quantity × SalePrice)
//   - Inventory decreases after purchase
// -----------------------------------------------------------
export function placeOrder(
  db: MockDatabase,
  customerId: number,
  items: CartItem[]
): { success: true; order: Order } | { success: false; error: string } {
  // Validate customer exists
  const customer = repo.getCustomerById(db, customerId);
  if (!customer) {
    return { success: false, error: 'Customer not found.' };
  }

  // Validate inventory for each item
  for (const item of items) {
    const available = repo.getTotalInventoryForProduct(db, item.ProductID);
    const product = repo.getProductById(db, item.ProductID);
    if (available < item.Quantity) {
      return {
        success: false,
        error: `Insufficient inventory for ${product?.Name ?? 'Product ' + item.ProductID}. Available: ${available}, Requested: ${item.Quantity}.`,
      };
    }
  }

  // Calculate total: SUM(Quantity × SalePrice)
  const totalAmount = items.reduce(
    (sum, item) => sum + item.Quantity * item.SalePrice,
    0
  );

  // Create the ORDER record
  const orderId = repo.getNextOrderId(db);
  const order: Order = {
    OrderID: orderId,
    CustomerID: customerId,
    OrderDate: new Date().toISOString().split('T')[0],
    TotalAmount: totalAmount,
    PaymentStatus: 'Paid',
  };
  repo.insertOrder(db, order);

  // Create ORDER_LINE records and decrement inventory
  for (const item of items) {
    const line: OrderLine = {
      OrderID: orderId,
      ProductID: item.ProductID,
      Quantity: item.Quantity,
      SalePrice: item.SalePrice,
    };
    repo.insertOrderLine(db, line);
    repo.decrementInventory(db, item.ProductID, item.Quantity);
  }

  return { success: true, order };
}

// -----------------------------------------------------------
// Inventory with product & warehouse names
// -----------------------------------------------------------
export function getInventoryWithDetails(db: MockDatabase): InventoryRow[] {
  return db.inventory.map(inv => {
    const product = repo.getProductById(db, inv.ProductID);
    const warehouse = db.warehouses.find(w => w.WarehouseID === inv.WarehouseID);
    return {
      ...inv,
      ProductName: product?.Name ?? 'Unknown',
      WarehouseLocation: warehouse?.Location ?? 'Unknown',
    };
  });
}

// -----------------------------------------------------------
// Update inventory quantity (UPDATE demo)
// -----------------------------------------------------------
export function updateInventory(
  db: MockDatabase,
  productId: number,
  warehouseId: number,
  newQuantity: number
): boolean {
  if (newQuantity < 0) return false;
  return repo.updateInventoryQuantity(db, productId, warehouseId, newQuantity);
}

// -----------------------------------------------------------
// Production schedule (JOIN ProductionBatch + Product + Manufacturer)
// -----------------------------------------------------------
export function getProductionSchedule(db: MockDatabase): ProductionScheduleRow[] {
  return db.productionBatches
    .map(batch => {
      const product = repo.getProductById(db, batch.ProductID);
      const manufacturer = repo.getManufacturerById(db, batch.ManufacturerID);
      return {
        BatchID: batch.BatchID,
        ProductName: product?.Name ?? 'Unknown',
        ManufacturerName: manufacturer?.Name ?? 'Unknown',
        ProductionDate: batch.ProductionDate,
        QuantityProduced: batch.QuantityProduced,
        CostPerUnit: batch.CostPerUnit,
      };
    })
    .sort((a, b) => a.ProductionDate.localeCompare(b.ProductionDate));
}
