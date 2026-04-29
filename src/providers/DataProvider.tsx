'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type {
  DashboardStats, ProductWithInventory, OrderDetail,
  ProductionScheduleRow, CartItem, InventoryRow,
  Order, Collection, Customer,
} from '@/data/types';

interface ServerState {
  version: number;
  dashboardStats: DashboardStats;
  productsWithInventory: ProductWithInventory[];
  orderDetails: OrderDetail[];
  productionSchedule: ProductionScheduleRow[];
  inventoryWithDetails: InventoryRow[];
  collections: Collection[];
  customers: Customer[];
}

const emptyStats: DashboardStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  totalInventoryUnits: 0,
  lowStockProducts: [],
  recentOrders: [],
};

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

  // Mutations (now async — they call the server)
  placeOrder: (customerId: number, items: CartItem[]) => Promise<{ success: true; order: Order } | { success: false; error: string }>;
  updateInventory: (productId: number, warehouseId: number, newQuantity: number) => Promise<boolean>;
  deleteCustomer: (customerId: number) => Promise<boolean>;

  // Version counter — changes when server state changes
  version: number;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

const POLL_INTERVAL = 2000; // 2 seconds

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ServerState | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/db');
      if (!res.ok) return;
      const data: ServerState = await res.json();
      if (mountedRef.current) {
        setState(data);
        setLoading(false);
      }
    } catch {
      // Network error — skip this poll cycle
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchState();
    const interval = setInterval(fetchState, POLL_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchState]);

  const ctx: DataContextType = {
    version: state?.version ?? 0,
    loading,

    getDashboardStats: () => state?.dashboardStats ?? emptyStats,
    getProductsWithInventory: () => state?.productsWithInventory ?? [],
    getOrdersWithCustomerAndProductDetails: () => state?.orderDetails ?? [],
    getProductionSchedule: () => state?.productionSchedule ?? [],
    getTotalRevenue: () => state?.dashboardStats?.totalRevenue ?? 0,
    getInventoryWithDetails: () => state?.inventoryWithDetails ?? [],
    getCollections: () => state?.collections ?? [],
    getCustomers: () => state?.customers ?? [],

    placeOrder: async (customerId, items) => {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'placeOrder', customerId, items }),
      });
      const result = await res.json();
      if (result.success) fetchState();
      return result;
    },

    updateInventory: async (productId, warehouseId, newQuantity) => {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateInventory', productId, warehouseId, newQuantity }),
      });
      const result = await res.json();
      if (result.success) fetchState();
      return result.success;
    },

    deleteCustomer: async (customerId) => {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteCustomer', customerId }),
      });
      const result = await res.json();
      if (result.success) fetchState();
      return result.success;
    },
  };

  return <DataContext.Provider value={ctx}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within <DataProvider>');
  return ctx;
}
