'use client';

import { useData } from '@/providers/DataProvider';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US');
}

export default function OrdersPage() {
  const { getOrdersWithCustomerAndProductDetails, version } = useData();
  void version;

  const details = getOrdersWithCustomerAndProductDetails();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-gray-500 mt-1 text-sm">
          4-table JOIN: CUSTOMER + ORDER + ORDER_LINE + PRODUCT
        </p>
      </div>

      {/* SQL reference */}
      <div className="bg-charcoal text-white rounded-xl p-5 mb-8 font-mono text-xs overflow-x-auto">
        <p className="text-gray-400 mb-1">-- This view demonstrates:</p>
        <p className="text-green-300">SELECT c.Name AS CustomerName,</p>
        <p className="text-green-300 ml-7">o.OrderID, o.OrderDate,</p>
        <p className="text-green-300 ml-7">p.Name AS ProductName,</p>
        <p className="text-green-300 ml-7">ol.Quantity, ol.SalePrice</p>
        <p className="text-green-300">FROM CUSTOMER c</p>
        <p className="text-green-300">JOIN `ORDER` o ON c.CustomerID = o.CustomerID</p>
        <p className="text-green-300">JOIN ORDER_LINE ol ON o.OrderID = ol.OrderID</p>
        <p className="text-green-300">JOIN PRODUCT p ON ol.ProductID = p.ProductID;</p>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Order ID</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-right px-5 py-3">Qty</th>
                <th className="text-right px-5 py-3">Sale Price</th>
                <th className="text-right px-5 py-3">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {details.map((row, i) => (
                <tr key={`${row.OrderID}-${row.ProductName}-${i}`} className="border-b border-gray-50 hover:bg-smoke/50">
                  <td className="px-5 py-3 font-medium">{row.CustomerName}</td>
                  <td className="px-5 py-3 font-mono text-gold-600">#{row.OrderID}</td>
                  <td className="px-5 py-3 text-gray-500">{row.OrderDate}</td>
                  <td className="px-5 py-3">{row.ProductName}</td>
                  <td className="px-5 py-3 text-right">{row.Quantity}</td>
                  <td className="px-5 py-3 text-right">{formatCurrency(row.SalePrice)}</td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {formatCurrency(row.Quantity * row.SalePrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-5 py-3 text-xs text-gray-400">
          {details.length} rows returned
        </div>
      </div>
    </div>
  );
}
