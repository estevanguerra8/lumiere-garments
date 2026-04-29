// ============================================================
// Lumière Garments — Server-Side Shared Database
// A singleton MockDatabase stored on globalThis so all clients
// share the same in-memory state. Persists across requests
// within the same server process; survives hot-reload in dev.
// ============================================================

import type { MockDatabase } from '@/repositories/mockRepository';
import {
  collections, products, suppliers, manufacturers,
  warehouses, customers, productSuppliers,
  productionBatches, inventory, orders, orderLines,
} from '@/data/mockDb';

function createFreshDb(): MockDatabase {
  return {
    collections: structuredClone(collections),
    products: structuredClone(products),
    suppliers: structuredClone(suppliers),
    manufacturers: structuredClone(manufacturers),
    warehouses: structuredClone(warehouses),
    customers: structuredClone(customers),
    productSuppliers: structuredClone(productSuppliers),
    productionBatches: structuredClone(productionBatches),
    inventory: structuredClone(inventory),
    orders: structuredClone(orders),
    orderLines: structuredClone(orderLines),
  };
}

const globalForDb = globalThis as unknown as {
  __lumiereDb: MockDatabase;
  __lumiereDbVersion: number;
};

if (!globalForDb.__lumiereDb) {
  globalForDb.__lumiereDb = createFreshDb();
  globalForDb.__lumiereDbVersion = 0;
}

export const db = globalForDb.__lumiereDb;

export function getVersion(): number {
  return globalForDb.__lumiereDbVersion;
}

export function bumpVersion(): number {
  globalForDb.__lumiereDbVersion += 1;
  return globalForDb.__lumiereDbVersion;
}
