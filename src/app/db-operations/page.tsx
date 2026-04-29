'use client';

import { useData } from '@/providers/DataProvider';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US');
}

const operations = [
  {
    type: 'SELECT',
    title: 'View Data (SELECT)',
    description: 'Browsing products, customers, and orders in the UI triggers SELECT queries.',
    sql: `SELECT ProductID, Name, Size, Color, RetailPrice
FROM PRODUCT
ORDER BY Name;`,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    type: 'COUNT',
    title: 'Count Records (SELECT COUNT)',
    description: 'The dashboard shows the total number of orders using an aggregate count.',
    sql: `SELECT COUNT(*) AS TotalOrderCount FROM \`ORDER\`;`,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    type: 'INSERT',
    title: 'Place Order (INSERT)',
    description: 'When a customer places an order, we INSERT into ORDER and ORDER_LINE tables.',
    sql: `INSERT INTO \`ORDER\`
  (CustomerID, OrderDate, TotalAmount, PaymentStatus)
VALUES (1, '2026-04-27', 365.00, 'Paid');

INSERT INTO ORDER_LINE
  (OrderID, ProductID, Quantity, SalePrice)
VALUES (4, 1, 1, 220.00),
       (4, 3, 1, 145.00);`,
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  {
    type: 'UPDATE',
    title: 'Adjust Inventory (UPDATE)',
    description: 'After an order is placed, inventory decreases. Manual stock adjustments also use UPDATE.',
    sql: `UPDATE INVENTORY
SET Quantity = Quantity - 1
WHERE ProductID = 1
  AND WarehouseID = 1;`,
    color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  },
  {
    type: 'DELETE',
    title: 'Remove Record (DELETE)',
    description: 'Removing a customer or cancelling an order can demonstrate DELETE operations.',
    sql: `DELETE FROM CUSTOMER
WHERE CustomerID = 3;`,
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    type: 'JOIN',
    title: 'Customer Order History (JOIN)',
    description: 'The Orders page joins CUSTOMER, ORDER, ORDER_LINE, and PRODUCT to show full order history.',
    sql: `SELECT c.Name AS CustomerName,
       o.OrderID,
       o.OrderDate,
       p.Name AS ProductName,
       ol.Quantity,
       ol.SalePrice
FROM CUSTOMER c
JOIN \`ORDER\` o ON c.CustomerID = o.CustomerID
JOIN ORDER_LINE ol ON o.OrderID = ol.OrderID
JOIN PRODUCT p ON ol.ProductID = p.ProductID;`,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    type: 'AGGREGATE',
    title: 'Total Revenue (AGGREGATE)',
    description: 'Revenue is calculated live from ORDER_LINE using SUM(Quantity * SalePrice).',
    sql: `SELECT SUM(Quantity * SalePrice) AS TotalRevenue
FROM ORDER_LINE;`,
    color: 'bg-gold-50 text-gold-700 border-gold-200',
  },
];

export default function DbOperationsPage() {
  const { getDashboardStats, getProductsWithInventory, getOrdersWithCustomerAndProductDetails, version } = useData();
  void version;

  const stats = getDashboardStats();
  const products = getProductsWithInventory();
  const orderDetails = getOrdersWithCustomerAndProductDetails();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Database Operations Demo</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Each UI action maps to a SQL/database operation. Below are the equivalent queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {operations.map(op => (
          <div
            key={op.type}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className={`px-5 py-3 border-b ${op.color}`}>
              <span className="text-xs font-bold uppercase tracking-wider">{op.type}</span>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-charcoal mb-1">{op.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{op.description}</p>

              {/* SQL Snippet */}
              <div className="bg-charcoal rounded-lg p-4 font-mono text-xs text-green-300 overflow-x-auto whitespace-pre">
                {op.sql}
              </div>

              {/* Live Result */}
              <div className="mt-4 p-3 bg-smoke rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Live Result</p>
                {op.type === 'SELECT' && (
                  <p className="text-sm text-charcoal">
                    {products.length} products returned
                  </p>
                )}
                {op.type === 'COUNT' && (
                  <p className="text-sm font-bold text-charcoal">
                    TotalOrderCount = {stats.totalOrders}
                  </p>
                )}
                {op.type === 'INSERT' && (
                  <p className="text-sm text-charcoal">
                    {stats.totalOrders} orders in database. Place a new order from the{' '}
                    <a href="/cart" className="text-gold-600 underline">Cart page</a>.
                  </p>
                )}
                {op.type === 'UPDATE' && (
                  <p className="text-sm text-charcoal">
                    {stats.totalInventoryUnits.toLocaleString()} total inventory units. Edit from the{' '}
                    <a href="/inventory" className="text-gold-600 underline">Inventory page</a>.
                  </p>
                )}
                {op.type === 'DELETE' && (
                  <p className="text-sm text-charcoal">
                    {stats.totalCustomers} customers in database.
                  </p>
                )}
                {op.type === 'JOIN' && (
                  <p className="text-sm text-charcoal">
                    {orderDetails.length} rows from 4-table join. View on the{' '}
                    <a href="/orders" className="text-gold-600 underline">Orders page</a>.
                  </p>
                )}
                {op.type === 'AGGREGATE' && (
                  <p className="text-sm font-bold text-charcoal">
                    TotalRevenue = {formatCurrency(stats.totalRevenue)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture note */}
      <div className="mt-10 bg-charcoal text-white rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gold-400 mb-3">Architecture Note</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          This application uses a <strong>repository pattern</strong> with a mock in-memory data layer.
          All UI components call service functions (e.g., <code className="text-gold-300">getDashboardStats()</code>,{' '}
          <code className="text-gold-300">placeOrder()</code>) which internally call the mock repository.
          To connect to a real MySQL database, swap the mock repository implementation with a MySQL repository
          using <code className="text-gold-300">mysql2/promise</code> — no UI changes required.
        </p>
      </div>
    </div>
  );
}
