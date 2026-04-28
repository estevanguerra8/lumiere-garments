// ============================================================
// Lumière Garments — Mock Database Seed Data
// This file mirrors the MySQL schema with realistic luxury
// streetwear data. All arrays are mutable during the session.
// ============================================================

import type {
  Collection,
  Product,
  Supplier,
  Manufacturer,
  Warehouse,
  Customer,
  ProductSupplier,
  ProductionBatch,
  Inventory,
  Order,
  OrderLine,
} from './types';

// -----------------------------------------------------------
// COLLECTION (2 collections)
// -----------------------------------------------------------
export const collections: Collection[] = [
  {
    CollectionID: 1,
    Name: 'Winter Noir 2026',
    ReleaseDate: '2026-01-20',
    Season: 'Winter',
    Theme: 'Dark luxury streetwear',
  },
  {
    CollectionID: 2,
    Name: 'Solar Flux 2026',
    ReleaseDate: '2026-04-15',
    Season: 'Spring',
    Theme: 'Futuristic bright aesthetics',
  },
];

// -----------------------------------------------------------
// PRODUCT (6 products across 2 collections)
// -----------------------------------------------------------
export const products: Product[] = [
  { ProductID: 1, CollectionID: 1, Name: 'Oversized Cargo Jacket', Size: 'M', Color: 'Black', RetailPrice: 220, ImageUrl: 'https://images.pexels.com/photos/983497/pexels-photo-983497.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 2, CollectionID: 1, Name: 'Oversized Cargo Jacket', Size: 'L', Color: 'Black', RetailPrice: 220, ImageUrl: 'https://images.pexels.com/photos/1954861/pexels-photo-1954861.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 3, CollectionID: 1, Name: 'Heavyweight Hoodie', Size: 'M', Color: 'Charcoal', RetailPrice: 145, ImageUrl: 'https://images.pexels.com/photos/32430590/pexels-photo-32430590.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 4, CollectionID: 2, Name: 'Boxy Graphic Tee', Size: 'M', Color: 'White', RetailPrice: 85, ImageUrl: 'https://images.pexels.com/photos/6786616/pexels-photo-6786616.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 5, CollectionID: 2, Name: 'Boxy Graphic Tee', Size: 'L', Color: 'Orange', RetailPrice: 85, ImageUrl: 'https://images.pexels.com/photos/2221132/pexels-photo-2221132.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 6, CollectionID: 2, Name: 'Utility Pants', Size: 'M', Color: 'Olive', RetailPrice: 160, ImageUrl: 'https://images.pexels.com/photos/19461561/pexels-photo-19461561.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
];

// -----------------------------------------------------------
// SUPPLIER (3 suppliers)
// -----------------------------------------------------------
export const suppliers: Supplier[] = [
  { SupplierID: 1, CompanyName: 'Tokyo Textile Group', Country: 'Japan', ContactInfo: 'tokyo@email.com', MaterialType: 'Cotton' },
  { SupplierID: 2, CompanyName: 'Milan Dye Works', Country: 'Italy', ContactInfo: 'milan@email.com', MaterialType: 'Dye' },
  { SupplierID: 3, CompanyName: 'Seoul Trim Source', Country: 'South Korea', ContactInfo: 'seoul@email.com', MaterialType: 'Zippers' },
];

// -----------------------------------------------------------
// MANUFACTURER (2 manufacturers)
// -----------------------------------------------------------
export const manufacturers: Manufacturer[] = [
  { ManufacturerID: 1, Name: 'Apex Garment House', Location: 'Los Angeles USA', ProductionCapacity: 12000 },
  { ManufacturerID: 2, Name: 'Nero Manufacturing', Location: 'Portugal', ProductionCapacity: 8500 },
];

// -----------------------------------------------------------
// WAREHOUSE (2 warehouses)
// -----------------------------------------------------------
export const warehouses: Warehouse[] = [
  { WarehouseID: 1, Location: 'Dallas Texas', StorageCapacity: 20000 },
  { WarehouseID: 2, Location: 'Los Angeles California', StorageCapacity: 15000 },
];

// -----------------------------------------------------------
// CUSTOMER (3 customers)
// -----------------------------------------------------------
export const customers: Customer[] = [
  { CustomerID: 1, Name: 'Taylor Phan', Email: 'tayvon@example.com', ShippingAddress: 'Garland TX', RegistrationDate: '2026-02-01' },
  { CustomerID: 2, Name: 'Aastha Tyagi', Email: 'aastha@example.com', ShippingAddress: 'Dallas TX', RegistrationDate: '2026-02-05' },
  { CustomerID: 3, Name: 'Minhao Ni', Email: 'minhao@example.com', ShippingAddress: 'Plano TX', RegistrationDate: '2026-02-12' },
];

// -----------------------------------------------------------
// PRODUCT_SUPPLIER (many-to-many links)
// -----------------------------------------------------------
export const productSuppliers: ProductSupplier[] = [
  { ProductID: 1, SupplierID: 1 },
  { ProductID: 2, SupplierID: 1 },
  { ProductID: 3, SupplierID: 1 },
  { ProductID: 4, SupplierID: 1 },
  { ProductID: 5, SupplierID: 1 },
  { ProductID: 3, SupplierID: 2 },
  { ProductID: 4, SupplierID: 2 },
  { ProductID: 1, SupplierID: 3 },
  { ProductID: 6, SupplierID: 3 },
];

// -----------------------------------------------------------
// PRODUCTION_BATCH
// -----------------------------------------------------------
export const productionBatches: ProductionBatch[] = [
  { BatchID: 1, ProductID: 1, ManufacturerID: 1, ProductionDate: '2026-01-05', QuantityProduced: 300, CostPerUnit: 95 },
  { BatchID: 2, ProductID: 2, ManufacturerID: 1, ProductionDate: '2026-01-06', QuantityProduced: 250, CostPerUnit: 95 },
  { BatchID: 3, ProductID: 3, ManufacturerID: 2, ProductionDate: '2026-01-10', QuantityProduced: 400, CostPerUnit: 52 },
  { BatchID: 4, ProductID: 4, ManufacturerID: 2, ProductionDate: '2026-04-01', QuantityProduced: 500, CostPerUnit: 20 },
  { BatchID: 5, ProductID: 5, ManufacturerID: 2, ProductionDate: '2026-04-02', QuantityProduced: 450, CostPerUnit: 20 },
  { BatchID: 6, ProductID: 6, ManufacturerID: 1, ProductionDate: '2026-04-03', QuantityProduced: 200, CostPerUnit: 70 },
];

// -----------------------------------------------------------
// INVENTORY (products across warehouses)
// -----------------------------------------------------------
export const inventory: Inventory[] = [
  { ProductID: 1, WarehouseID: 1, Quantity: 120 },
  { ProductID: 1, WarehouseID: 2, Quantity: 80 },
  { ProductID: 2, WarehouseID: 1, Quantity: 100 },
  { ProductID: 3, WarehouseID: 1, Quantity: 220 },
  { ProductID: 3, WarehouseID: 2, Quantity: 100 },
  { ProductID: 4, WarehouseID: 1, Quantity: 180 },
  { ProductID: 5, WarehouseID: 2, Quantity: 160 },
  { ProductID: 6, WarehouseID: 1, Quantity: 90 },
];

// -----------------------------------------------------------
// ORDER (existing orders)
// -----------------------------------------------------------
export const orders: Order[] = [
  { OrderID: 1, CustomerID: 1, OrderDate: '2026-04-20', TotalAmount: 245, PaymentStatus: 'Paid' },
  { OrderID: 2, CustomerID: 2, OrderDate: '2026-04-21', TotalAmount: 220, PaymentStatus: 'Paid' },
  { OrderID: 3, CustomerID: 3, OrderDate: '2026-04-22', TotalAmount: 170, PaymentStatus: 'Pending' },
];

// -----------------------------------------------------------
// ORDER_LINE
// -----------------------------------------------------------
export const orderLines: OrderLine[] = [
  // Order 1 – Taylor Phan: Boxy Graphic Tee + Utility Pants
  { OrderID: 1, ProductID: 4, Quantity: 1, SalePrice: 85 },
  { OrderID: 1, ProductID: 6, Quantity: 1, SalePrice: 160 },
  // Order 2 – Aastha Tyagi: Oversized Cargo Jacket (M)
  { OrderID: 2, ProductID: 1, Quantity: 1, SalePrice: 220 },
  // Order 3 – Minhao Ni: 2x Boxy Graphic Tee (L)
  { OrderID: 3, ProductID: 5, Quantity: 2, SalePrice: 85 },
];
