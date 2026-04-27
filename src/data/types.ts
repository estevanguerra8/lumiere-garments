// ============================================================
// Lumière Garments — Database Schema Type Definitions
// Maps directly to the 11-table MySQL schema
// ============================================================

export interface Collection {
  CollectionID: number;
  Name: string;
  ReleaseDate: string; // ISO date
  Season: string;
  Theme: string;
}

export interface Product {
  ProductID: number;
  CollectionID: number;
  Name: string;
  Size: string;
  Color: string;
  RetailPrice: number;
  ImageUrl: string;
}

export interface Supplier {
  SupplierID: number;
  CompanyName: string;
  Country: string;
  ContactInfo: string;
  MaterialType: string;
}

export interface Manufacturer {
  ManufacturerID: number;
  Name: string;
  Location: string;
  ProductionCapacity: number;
}

export interface Warehouse {
  WarehouseID: number;
  Location: string;
  StorageCapacity: number;
}

export interface Customer {
  CustomerID: number;
  Name: string;
  Email: string;
  ShippingAddress: string;
  RegistrationDate: string; // ISO date
}

export interface ProductSupplier {
  ProductID: number;
  SupplierID: number;
}

export interface ProductionBatch {
  BatchID: number;
  ProductID: number;
  ManufacturerID: number;
  ProductionDate: string; // ISO date
  QuantityProduced: number;
  CostPerUnit: number;
}

export interface Inventory {
  ProductID: number;
  WarehouseID: number;
  Quantity: number;
}

export interface Order {
  OrderID: number;
  CustomerID: number;
  OrderDate: string; // ISO date
  TotalAmount: number;
  PaymentStatus: 'Paid' | 'Pending' | 'Failed';
}

export interface OrderLine {
  OrderID: number;
  ProductID: number;
  Quantity: number;
  SalePrice: number;
}

// ============================================================
// Derived / Join types used by the UI
// ============================================================

export interface ProductWithInventory extends Product {
  collectionName: string;
  totalInventory: number;
}

export interface OrderDetail {
  CustomerName: string;
  OrderID: number;
  OrderDate: string;
  ProductName: string;
  Quantity: number;
  SalePrice: number;
}

export interface ProductionScheduleRow {
  BatchID: number;
  ProductName: string;
  ManufacturerName: string;
  ProductionDate: string;
  QuantityProduced: number;
  CostPerUnit: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalInventoryUnits: number;
  lowStockProducts: { ProductID: number; Name: string; totalQty: number }[];
  recentOrders: (Order & { CustomerName: string })[];
}

export interface CartItem {
  ProductID: number;
  Quantity: number;
  SalePrice: number;
}

export interface InventoryRow extends Inventory {
  ProductName: string;
  WarehouseLocation: string;
}
