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
// COLLECTION (3 collections)
// -----------------------------------------------------------
export const collections: Collection[] = [
  {
    CollectionID: 1,
    Name: 'Shadow Archive',
    ReleaseDate: '2025-09-15',
    Season: 'Fall/Winter 2025',
    Theme: 'Urban Noir',
  },
  {
    CollectionID: 2,
    Name: 'Chrome Series',
    ReleaseDate: '2026-02-01',
    Season: 'Spring/Summer 2026',
    Theme: 'Industrial Futurism',
  },
  {
    CollectionID: 3,
    Name: 'Ivory Edit',
    ReleaseDate: '2026-06-10',
    Season: 'Resort 2026',
    Theme: 'Minimal Elegance',
  },
];

// -----------------------------------------------------------
// PRODUCT (10 products across 3 collections)
// -----------------------------------------------------------
export const products: Product[] = [
  // Shadow Archive (CollectionID: 1)
  { ProductID: 1, CollectionID: 1, Name: 'Noir Cargo Jacket', Size: 'L', Color: 'Black', RetailPrice: 350, ImageUrl: 'https://images.pexels.com/photos/983497/pexels-photo-983497.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 2, CollectionID: 1, Name: 'Eclipse Oversized Hoodie', Size: 'M', Color: 'Charcoal', RetailPrice: 195, ImageUrl: 'https://images.pexels.com/photos/32430590/pexels-photo-32430590.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 3, CollectionID: 1, Name: 'Shadow Utility Pants', Size: 'M', Color: 'Black', RetailPrice: 210, ImageUrl: 'https://images.pexels.com/photos/19461561/pexels-photo-19461561.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 4, CollectionID: 1, Name: 'Midnight Bomber', Size: 'L', Color: 'Navy', RetailPrice: 420, ImageUrl: 'https://images.pexels.com/photos/12797871/pexels-photo-12797871.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  // Chrome Series (CollectionID: 2)
  { ProductID: 5, CollectionID: 2, Name: 'Chrome Logo Tee', Size: 'S', Color: 'White', RetailPrice: 95, ImageUrl: 'https://images.pexels.com/photos/6786616/pexels-photo-6786616.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 6, CollectionID: 2, Name: 'Signal Mesh Jersey', Size: 'M', Color: 'Silver', RetailPrice: 85, ImageUrl: 'https://images.pexels.com/photos/2344601/pexels-photo-2344601.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 7, CollectionID: 2, Name: 'Concrete Wide-Leg Denim', Size: 'L', Color: 'Gray', RetailPrice: 240, ImageUrl: 'https://images.pexels.com/photos/2272244/pexels-photo-2272244.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  // Ivory Edit (CollectionID: 3)
  { ProductID: 8, CollectionID: 3, Name: 'Ivory Knit Sweater', Size: 'M', Color: 'Cream', RetailPrice: 185, ImageUrl: 'https://images.pexels.com/photos/6788926/pexels-photo-6788926.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 9, CollectionID: 3, Name: 'Linen Relaxed Trousers', Size: 'L', Color: 'Sand', RetailPrice: 195, ImageUrl: 'https://images.pexels.com/photos/7576509/pexels-photo-7576509.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
  { ProductID: 10, CollectionID: 3, Name: 'Cashmere Zip Hoodie', Size: 'S', Color: 'Ivory', RetailPrice: 220, ImageUrl: 'https://images.pexels.com/photos/8217415/pexels-photo-8217415.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop' },
];

// -----------------------------------------------------------
// SUPPLIER (4 suppliers)
// -----------------------------------------------------------
export const suppliers: Supplier[] = [
  { SupplierID: 1, CompanyName: 'Tessuti Milano', Country: 'Italy', ContactInfo: 'info@tessuti.it', MaterialType: 'Premium Cotton' },
  { SupplierID: 2, CompanyName: 'Kyoto Textiles Co.', Country: 'Japan', ContactInfo: 'sales@kyototex.jp', MaterialType: 'Technical Nylon' },
  { SupplierID: 3, CompanyName: 'Lyon Silk House', Country: 'France', ContactInfo: 'contact@lyonsilk.fr', MaterialType: 'Silk Blend' },
  { SupplierID: 4, CompanyName: 'Anatolian Denim Works', Country: 'Turkey', ContactInfo: 'orders@anatoliandenim.com', MaterialType: 'Raw Denim' },
];

// -----------------------------------------------------------
// MANUFACTURER (3 manufacturers)
// -----------------------------------------------------------
export const manufacturers: Manufacturer[] = [
  { ManufacturerID: 1, Name: 'Atelier Vanguard', Location: 'Lisbon, Portugal', ProductionCapacity: 5000 },
  { ManufacturerID: 2, Name: 'Nakamura Craft Studio', Location: 'Osaka, Japan', ProductionCapacity: 3000 },
  { ManufacturerID: 3, Name: 'Savile & Co. Manufacturing', Location: 'London, UK', ProductionCapacity: 4000 },
];

// -----------------------------------------------------------
// WAREHOUSE (3 warehouses)
// -----------------------------------------------------------
export const warehouses: Warehouse[] = [
  { WarehouseID: 1, Location: 'Los Angeles, CA', StorageCapacity: 20000 },
  { WarehouseID: 2, Location: 'New York, NY', StorageCapacity: 15000 },
  { WarehouseID: 3, Location: 'Dallas, TX', StorageCapacity: 12000 },
];

// -----------------------------------------------------------
// CUSTOMER (5 customers)
// -----------------------------------------------------------
export const customers: Customer[] = [
  { CustomerID: 1, Name: 'Marcus Chen', Email: 'marcus@email.com', ShippingAddress: '450 Broadway, New York, NY 10013', RegistrationDate: '2025-03-12' },
  { CustomerID: 2, Name: 'Sophia Laurent', Email: 'sophia@email.com', ShippingAddress: '8721 Melrose Ave, Los Angeles, CA 90069', RegistrationDate: '2025-05-20' },
  { CustomerID: 3, Name: 'James Okafor', Email: 'james@email.com', ShippingAddress: '1200 Main St, Dallas, TX 75201', RegistrationDate: '2025-07-04' },
  { CustomerID: 4, Name: 'Elena Vasquez', Email: 'elena@email.com', ShippingAddress: '333 Michigan Ave, Chicago, IL 60601', RegistrationDate: '2025-09-15' },
  { CustomerID: 5, Name: 'Kai Nakamura', Email: 'kai@email.com', ShippingAddress: '55 Post St, San Francisco, CA 94104', RegistrationDate: '2025-11-01' },
];

// -----------------------------------------------------------
// PRODUCT_SUPPLIER (many-to-many links)
// -----------------------------------------------------------
export const productSuppliers: ProductSupplier[] = [
  { ProductID: 1, SupplierID: 2 },  // Noir Cargo Jacket ← Kyoto Textiles (Technical Nylon)
  { ProductID: 2, SupplierID: 1 },  // Eclipse Hoodie ← Tessuti Milano (Premium Cotton)
  { ProductID: 3, SupplierID: 2 },  // Shadow Pants ← Kyoto Textiles
  { ProductID: 4, SupplierID: 2 },  // Midnight Bomber ← Kyoto Textiles
  { ProductID: 4, SupplierID: 3 },  // Midnight Bomber ← Lyon Silk (lining)
  { ProductID: 5, SupplierID: 1 },  // Chrome Logo Tee ← Tessuti Milano
  { ProductID: 6, SupplierID: 1 },  // Signal Mesh Jersey ← Tessuti Milano
  { ProductID: 7, SupplierID: 4 },  // Concrete Denim ← Anatolian Denim Works
  { ProductID: 8, SupplierID: 3 },  // Ivory Knit Sweater ← Lyon Silk
  { ProductID: 9, SupplierID: 1 },  // Linen Trousers ← Tessuti Milano
  { ProductID: 10, SupplierID: 3 }, // Cashmere Zip Hoodie ← Lyon Silk
];

// -----------------------------------------------------------
// PRODUCTION_BATCH
// -----------------------------------------------------------
export const productionBatches: ProductionBatch[] = [
  { BatchID: 1, ProductID: 1, ManufacturerID: 1, ProductionDate: '2025-07-10', QuantityProduced: 200, CostPerUnit: 120 },
  { BatchID: 2, ProductID: 2, ManufacturerID: 1, ProductionDate: '2025-07-15', QuantityProduced: 350, CostPerUnit: 65 },
  { BatchID: 3, ProductID: 3, ManufacturerID: 2, ProductionDate: '2025-07-20', QuantityProduced: 300, CostPerUnit: 70 },
  { BatchID: 4, ProductID: 4, ManufacturerID: 3, ProductionDate: '2025-08-01', QuantityProduced: 150, CostPerUnit: 155 },
  { BatchID: 5, ProductID: 5, ManufacturerID: 1, ProductionDate: '2025-12-01', QuantityProduced: 500, CostPerUnit: 25 },
  { BatchID: 6, ProductID: 6, ManufacturerID: 2, ProductionDate: '2025-12-10', QuantityProduced: 400, CostPerUnit: 22 },
  { BatchID: 7, ProductID: 7, ManufacturerID: 2, ProductionDate: '2025-12-20', QuantityProduced: 250, CostPerUnit: 80 },
  { BatchID: 8, ProductID: 8, ManufacturerID: 3, ProductionDate: '2026-03-01', QuantityProduced: 200, CostPerUnit: 60 },
  { BatchID: 9, ProductID: 9, ManufacturerID: 1, ProductionDate: '2026-03-15', QuantityProduced: 300, CostPerUnit: 55 },
  { BatchID: 10, ProductID: 10, ManufacturerID: 3, ProductionDate: '2026-04-01', QuantityProduced: 180, CostPerUnit: 75 },
];

// -----------------------------------------------------------
// INVENTORY (products across warehouses)
// -----------------------------------------------------------
export const inventory: Inventory[] = [
  // Warehouse 1 – LA
  { ProductID: 1, WarehouseID: 1, Quantity: 45 },
  { ProductID: 2, WarehouseID: 1, Quantity: 80 },
  { ProductID: 5, WarehouseID: 1, Quantity: 120 },
  { ProductID: 8, WarehouseID: 1, Quantity: 30 },
  // Warehouse 2 – NY
  { ProductID: 1, WarehouseID: 2, Quantity: 35 },
  { ProductID: 3, WarehouseID: 2, Quantity: 60 },
  { ProductID: 4, WarehouseID: 2, Quantity: 25 },
  { ProductID: 6, WarehouseID: 2, Quantity: 90 },
  { ProductID: 9, WarehouseID: 2, Quantity: 55 },
  // Warehouse 3 – Dallas
  { ProductID: 2, WarehouseID: 3, Quantity: 70 },
  { ProductID: 7, WarehouseID: 3, Quantity: 40 },
  { ProductID: 10, WarehouseID: 3, Quantity: 5 },  // low stock!
  { ProductID: 3, WarehouseID: 3, Quantity: 8 },   // low stock!
];

// -----------------------------------------------------------
// ORDER (existing orders)
// -----------------------------------------------------------
export const orders: Order[] = [
  { OrderID: 1, CustomerID: 1, OrderDate: '2025-10-05', TotalAmount: 755, PaymentStatus: 'Paid' },
  { OrderID: 2, CustomerID: 2, OrderDate: '2025-10-12', TotalAmount: 420, PaymentStatus: 'Paid' },
  { OrderID: 3, CustomerID: 3, OrderDate: '2025-11-03', TotalAmount: 305, PaymentStatus: 'Paid' },
  { OrderID: 4, CustomerID: 4, OrderDate: '2026-02-18', TotalAmount: 555, PaymentStatus: 'Paid' },
  { OrderID: 5, CustomerID: 5, OrderDate: '2026-03-25', TotalAmount: 280, PaymentStatus: 'Pending' },
];

// -----------------------------------------------------------
// ORDER_LINE
// -----------------------------------------------------------
export const orderLines: OrderLine[] = [
  // Order 1 – Marcus: Noir Cargo Jacket + Eclipse Hoodie + Shadow Pants
  { OrderID: 1, ProductID: 1, Quantity: 1, SalePrice: 350 },
  { OrderID: 1, ProductID: 2, Quantity: 1, SalePrice: 195 },
  { OrderID: 1, ProductID: 3, Quantity: 1, SalePrice: 210 },
  // Order 2 – Sophia: Midnight Bomber
  { OrderID: 2, ProductID: 4, Quantity: 1, SalePrice: 420 },
  // Order 3 – James: Chrome Logo Tee + Shadow Utility Pants
  { OrderID: 3, ProductID: 5, Quantity: 1, SalePrice: 95 },
  { OrderID: 3, ProductID: 3, Quantity: 1, SalePrice: 210 },
  // Order 4 – Elena: Concrete Denim + Chrome Tee + Cashmere Zip Hoodie
  { OrderID: 4, ProductID: 7, Quantity: 1, SalePrice: 240 },
  { OrderID: 4, ProductID: 5, Quantity: 1, SalePrice: 95 },
  { OrderID: 4, ProductID: 10, Quantity: 1, SalePrice: 220 },
  // Order 5 – Kai: Signal Mesh Jersey + Linen Trousers  (total recalculated = 280)
  { OrderID: 5, ProductID: 6, Quantity: 1, SalePrice: 85 },
  { OrderID: 5, ProductID: 9, Quantity: 1, SalePrice: 195 },
];
