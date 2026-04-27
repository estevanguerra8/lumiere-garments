// ============================================================
// Lumière Garments — Mock Repository
// Operates on in-memory arrays. All functions are pure data
// access — no business rules here (those live in the service).
// Replace this file with mysqlRepository.ts to connect to MySQL.
// ============================================================

import type {
  Collection, Product, Supplier, Manufacturer, Warehouse,
  Customer, ProductSupplier, ProductionBatch, Inventory,
  Order, OrderLine,
} from '@/data/types';

export interface MockDatabase {
  collections: Collection[];
  products: Product[];
  suppliers: Supplier[];
  manufacturers: Manufacturer[];
  warehouses: Warehouse[];
  customers: Customer[];
  productSuppliers: ProductSupplier[];
  productionBatches: ProductionBatch[];
  inventory: Inventory[];
  orders: Order[];
  orderLines: OrderLine[];
}

// -----------------------------------------------------------
// Collection
// -----------------------------------------------------------
export function getAllCollections(db: MockDatabase): Collection[] {
  return db.collections;
}

export function getCollectionById(db: MockDatabase, id: number): Collection | undefined {
  return db.collections.find(c => c.CollectionID === id);
}

// -----------------------------------------------------------
// Product
// -----------------------------------------------------------
export function getAllProducts(db: MockDatabase): Product[] {
  return db.products;
}

export function getProductById(db: MockDatabase, id: number): Product | undefined {
  return db.products.find(p => p.ProductID === id);
}

export function getProductsByCollection(db: MockDatabase, collectionId: number): Product[] {
  return db.products.filter(p => p.CollectionID === collectionId);
}

// -----------------------------------------------------------
// Supplier
// -----------------------------------------------------------
export function getAllSuppliers(db: MockDatabase): Supplier[] {
  return db.suppliers;
}

export function getSuppliersByProduct(db: MockDatabase, productId: number): Supplier[] {
  const supplierIds = db.productSuppliers
    .filter(ps => ps.ProductID === productId)
    .map(ps => ps.SupplierID);
  return db.suppliers.filter(s => supplierIds.includes(s.SupplierID));
}

// -----------------------------------------------------------
// Manufacturer
// -----------------------------------------------------------
export function getAllManufacturers(db: MockDatabase): Manufacturer[] {
  return db.manufacturers;
}

export function getManufacturerById(db: MockDatabase, id: number): Manufacturer | undefined {
  return db.manufacturers.find(m => m.ManufacturerID === id);
}

// -----------------------------------------------------------
// Warehouse
// -----------------------------------------------------------
export function getAllWarehouses(db: MockDatabase): Warehouse[] {
  return db.warehouses;
}

// -----------------------------------------------------------
// Customer
// -----------------------------------------------------------
export function getAllCustomers(db: MockDatabase): Customer[] {
  return db.customers;
}

export function getCustomerById(db: MockDatabase, id: number): Customer | undefined {
  return db.customers.find(c => c.CustomerID === id);
}

// -----------------------------------------------------------
// Inventory
// -----------------------------------------------------------
export function getAllInventory(db: MockDatabase): Inventory[] {
  return db.inventory;
}

export function getInventoryForProduct(db: MockDatabase, productId: number): Inventory[] {
  return db.inventory.filter(i => i.ProductID === productId);
}

export function getTotalInventoryForProduct(db: MockDatabase, productId: number): number {
  return db.inventory
    .filter(i => i.ProductID === productId)
    .reduce((sum, i) => sum + i.Quantity, 0);
}

export function updateInventoryQuantity(
  db: MockDatabase,
  productId: number,
  warehouseId: number,
  newQuantity: number
): boolean {
  const item = db.inventory.find(
    i => i.ProductID === productId && i.WarehouseID === warehouseId
  );
  if (!item) return false;
  item.Quantity = newQuantity;
  return true;
}

export function decrementInventory(
  db: MockDatabase,
  productId: number,
  quantity: number
): boolean {
  // Decrement from the first warehouse that has enough stock
  for (const item of db.inventory) {
    if (item.ProductID === productId && item.Quantity >= quantity) {
      item.Quantity -= quantity;
      return true;
    }
  }
  // Spread across warehouses if single warehouse doesn't have enough
  let remaining = quantity;
  const items = db.inventory.filter(i => i.ProductID === productId);
  const total = items.reduce((s, i) => s + i.Quantity, 0);
  if (total < quantity) return false;
  for (const item of items) {
    const deduct = Math.min(item.Quantity, remaining);
    item.Quantity -= deduct;
    remaining -= deduct;
    if (remaining <= 0) break;
  }
  return true;
}

// -----------------------------------------------------------
// Order
// -----------------------------------------------------------
export function getAllOrders(db: MockDatabase): Order[] {
  return db.orders;
}

export function getOrderById(db: MockDatabase, id: number): Order | undefined {
  return db.orders.find(o => o.OrderID === id);
}

export function insertOrder(db: MockDatabase, order: Order): void {
  db.orders.push(order);
}

export function getNextOrderId(db: MockDatabase): number {
  return db.orders.length === 0
    ? 1
    : Math.max(...db.orders.map(o => o.OrderID)) + 1;
}

// -----------------------------------------------------------
// OrderLine
// -----------------------------------------------------------
export function getAllOrderLines(db: MockDatabase): OrderLine[] {
  return db.orderLines;
}

export function getOrderLinesByOrder(db: MockDatabase, orderId: number): OrderLine[] {
  return db.orderLines.filter(ol => ol.OrderID === orderId);
}

export function insertOrderLine(db: MockDatabase, line: OrderLine): void {
  db.orderLines.push(line);
}

// -----------------------------------------------------------
// ProductionBatch
// -----------------------------------------------------------
export function getAllProductionBatches(db: MockDatabase): ProductionBatch[] {
  return db.productionBatches;
}

// -----------------------------------------------------------
// ProductSupplier
// -----------------------------------------------------------
export function getAllProductSuppliers(db: MockDatabase): ProductSupplier[] {
  return db.productSuppliers;
}

// -----------------------------------------------------------
// Delete operations (for DB Operations demo)
// -----------------------------------------------------------
export function deleteCustomer(db: MockDatabase, customerId: number): boolean {
  const idx = db.customers.findIndex(c => c.CustomerID === customerId);
  if (idx === -1) return false;
  db.customers.splice(idx, 1);
  return true;
}
