// ============================================================
// Lumière Garments — MySQL Repository (Placeholder)
//
// This file shows how to replace the mock repository with a
// real MySQL connection using mysql2/promise.
//
// To activate:
// 1. npm install mysql2
// 2. Create .env.local with your DB credentials
// 3. Update the DataProvider to use these functions instead
//    of the mock repository functions.
// ============================================================

// TODO: Uncomment and configure when connecting to MySQL
//
// import mysql from 'mysql2/promise';
//
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'lumiere_garments',
//   port: Number(process.env.DB_PORT) || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// -----------------------------------------------------------
// Example: Get all products
// -----------------------------------------------------------
// export async function getAllProducts() {
//   const [rows] = await pool.execute(
//     'SELECT ProductID, CollectionID, Name, Size, Color, RetailPrice FROM PRODUCT ORDER BY Name'
//   );
//   return rows;
// }

// -----------------------------------------------------------
// Example: Get products with inventory (JOIN)
// -----------------------------------------------------------
// export async function getProductsWithInventory() {
//   const [rows] = await pool.execute(`
//     SELECT p.ProductID, p.CollectionID, p.Name, p.Size, p.Color, p.RetailPrice,
//            c.Name AS collectionName,
//            COALESCE(SUM(i.Quantity), 0) AS totalInventory
//     FROM PRODUCT p
//     JOIN COLLECTION c ON p.CollectionID = c.CollectionID
//     LEFT JOIN INVENTORY i ON p.ProductID = i.ProductID
//     GROUP BY p.ProductID, p.CollectionID, p.Name, p.Size, p.Color, p.RetailPrice, c.Name
//     ORDER BY p.Name
//   `);
//   return rows;
// }

// -----------------------------------------------------------
// Example: Place an order (INSERT + UPDATE in transaction)
// -----------------------------------------------------------
// export async function placeOrder(
//   customerId: number,
//   items: { ProductID: number; Quantity: number; SalePrice: number }[]
// ) {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
//
//     const totalAmount = items.reduce((sum, item) => sum + item.Quantity * item.SalePrice, 0);
//
//     const [orderResult] = await connection.execute(
//       'INSERT INTO `ORDER` (CustomerID, OrderDate, TotalAmount, PaymentStatus) VALUES (?, CURDATE(), ?, ?)',
//       [customerId, totalAmount, 'Paid']
//     );
//     const orderId = (orderResult as any).insertId;
//
//     for (const item of items) {
//       await connection.execute(
//         'INSERT INTO ORDER_LINE (OrderID, ProductID, Quantity, SalePrice) VALUES (?, ?, ?, ?)',
//         [orderId, item.ProductID, item.Quantity, item.SalePrice]
//       );
//
//       // Decrement inventory from the first warehouse with stock
//       await connection.execute(
//         `UPDATE INVENTORY
//          SET Quantity = Quantity - ?
//          WHERE ProductID = ?
//            AND Quantity >= ?
//          LIMIT 1`,
//         [item.Quantity, item.ProductID, item.Quantity]
//       );
//     }
//
//     await connection.commit();
//     return { orderId, totalAmount };
//   } catch (error) {
//     await connection.rollback();
//     throw error;
//   } finally {
//     connection.release();
//   }
// }

// -----------------------------------------------------------
// Example: Get order details with JOIN
// -----------------------------------------------------------
// export async function getOrdersWithDetails() {
//   const [rows] = await pool.execute(`
//     SELECT c.Name AS CustomerName,
//            o.OrderID,
//            o.OrderDate,
//            p.Name AS ProductName,
//            ol.Quantity,
//            ol.SalePrice
//     FROM CUSTOMER c
//     JOIN \`ORDER\` o ON c.CustomerID = o.CustomerID
//     JOIN ORDER_LINE ol ON o.OrderID = ol.OrderID
//     JOIN PRODUCT p ON ol.ProductID = p.ProductID
//     ORDER BY o.OrderDate DESC
//   `);
//   return rows;
// }

// -----------------------------------------------------------
// Example: Get total revenue (AGGREGATE)
// -----------------------------------------------------------
// export async function getTotalRevenue() {
//   const [rows] = await pool.execute(
//     'SELECT SUM(Quantity * SalePrice) AS TotalRevenue FROM ORDER_LINE'
//   );
//   return (rows as any)[0].TotalRevenue || 0;
// }

// -----------------------------------------------------------
// Example: Update inventory (UPDATE)
// -----------------------------------------------------------
// export async function updateInventory(
//   productId: number,
//   warehouseId: number,
//   newQuantity: number
// ) {
//   const [result] = await pool.execute(
//     'UPDATE INVENTORY SET Quantity = ? WHERE ProductID = ? AND WarehouseID = ?',
//     [newQuantity, productId, warehouseId]
//   );
//   return (result as any).affectedRows > 0;
// }

// -----------------------------------------------------------
// Example: Get production schedule
// -----------------------------------------------------------
// export async function getProductionSchedule() {
//   const [rows] = await pool.execute(`
//     SELECT pb.BatchID,
//            p.Name AS ProductName,
//            m.Name AS ManufacturerName,
//            pb.ProductionDate,
//            pb.QuantityProduced,
//            pb.CostPerUnit
//     FROM PRODUCTION_BATCH pb
//     JOIN PRODUCT p ON pb.ProductID = p.ProductID
//     JOIN MANUFACTURER m ON pb.ManufacturerID = m.ManufacturerID
//     ORDER BY pb.ProductionDate
//   `);
//   return rows;
// }

export {};
