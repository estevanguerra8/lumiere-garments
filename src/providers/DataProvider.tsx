'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  DashboardStats, ProductWithInventory, OrderDetail,
  ProductionScheduleRow, CartItem, InventoryRow,
  Order, Collection, Customer,
} from '@/data/types';
import type { MockDatabase } from '@/repositories/mockRepository';
import * as service from '@/services/databaseService';

// Import seed data
import {
  collections as seedCollections,
  products as seedProducts,
  suppliers as seedSuppliers,
  manufacturers as seedManufacturers,
  warehouses as seedWarehouses,
  customers as seedCustomers,
  productSuppliers as seedProductSuppliers,
  productionBatches as seedProductionBatches,
  inventory as seedInventory,
  orders as seedOrders,
  orderLines as seedOrderLines,
} from '@/data/mockDb';

function createFreshDb(): MockDatabase {
  return {
    collections: structuredClone(seedCollections),
    products: structuredClone(seedProducts),
    suppliers: structuredClone(seedSuppliers),
    manufacturers: structuredClone(seedManufacturers),
    warehouses: structuredClone(seedWarehouses),
    customers: structuredClone(seedCustomers),
    productSuppliers: structuredClone(seedProductSuppliers),
    productionBatches: structuredClone(seedProductionBatches),
    inventory: structuredClone(seedInventory),
    orders: structuredClone(seedOrders),
    orderLines: structuredClone(seedOrderLines),
  };
}

interface DataContextType {
  // Queries
  getDashboardStats: () => DashboardStats;
  getProductsWithInventory: () => ProductWithInventory[];
  getOrdersWithCustomerAndProductDetails: () => OrderDetail[];
  getProductionSchedule: () => ProductionScheduleRow[];
  getTotalRevenue: () => number;
  getInventoryWithDetails: () => InventoryRow[];
  getCollections: () => Collection[];
  getCustomers: () => Customer[];

  // Mutations
  placeOrder: (customerId: number, items: CartItem[]) => { success: true; order: Order } | { success: false; error: string };
  updateInventory: (productId: number, warehouseId: number, newQuantity: number) => boolean;
  deleteCustomer: (customerId: number) => boolean;

  // Version counter — increments on every mutation to trigger re-renders
  version: number;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [db] = useState<MockDatabase>(createFreshDb);
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion(v => v + 1), []);

  const ctx: DataContextType = {
    version,

    getDashboardStats: () => service.getDashboardStats(db),
    getProductsWithInventory: () => service.getProductsWithInventory(db),
    getOrdersWithCustomerAndProductDetails: () => service.getOrdersWithCustomerAndProductDetails(db),
    getProductionSchedule: () => service.getProductionSchedule(db),
    getTotalRevenue: () => service.getTotalRevenue(db),
    getInventoryWithDetails: () => service.getInventoryWithDetails(db),
    getCollections: () => db.collections,
    getCustomers: () => db.customers,

    placeOrder: (customerId, items) => {
      const result = service.placeOrder(db, customerId, items);
      if (result.success) bump();
      return result;
    },

    updateInventory: (productId, warehouseId, newQuantity) => {
      const ok = service.updateInventory(db, productId, warehouseId, newQuantity);
      if (ok) bump();
      return ok;
    },

    deleteCustomer: (customerId) => {
      const idx = db.customers.findIndex(c => c.CustomerID === customerId);
      if (idx === -1) return false;
      db.customers.splice(idx, 1);
      bump();
      return true;
    },
  };

  return <DataContext.Provider value={ctx}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within <DataProvider>');
  return ctx;
}
