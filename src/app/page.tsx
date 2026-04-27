'use client';

import { useData } from '@/providers/DataProvider';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

export default function DashboardPage() {
  const { getDashboardStats, version } = useData();
  const stats = getDashboardStats();
  void version; // subscribe to updates

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), sub: 'SUM(Quantity x SalePrice)' },
    { label: 'Total Orders', value: stats.totalOrders, sub: 'COUNT(*) FROM ORDER' },
    { label: 'Total Customers', value: stats.totalCustomers, sub: 'Registered accounts' },
    { label: 'Total Products', value: stats.totalProducts, sub: 'Unique SKUs' },
    { label: 'Inventory Units', value: stats.totalInventoryUnits.toLocaleString(), sub: 'Across all warehouses' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm tracking-wide">
          Lumiere Garments &mdash; A Database for Luxury Streetwear
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-charcoal">{kpi.value}</p>
            <p className="text-[11px] text-gold-600 mt-1 font-mono">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">Order</th>
                  <th className="text-left py-2 pr-4">Customer</th>
                  <th className="text-left py-2 pr-4">Date</th>
                  <th className="text-right py-2 pr-4">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.OrderID} className="border-b border-gray-50 hover:bg-smoke/50">
                    <td className="py-3 pr-4 font-mono text-gold-600">#{order.OrderID}</td>
                    <td className="py-3 pr-4">{order.CustomerName}</td>
                    <td className="py-3 pr-4 text-gray-500">{order.OrderDate}</td>
                    <td className="py-3 pr-4 text-right font-semibold">{formatCurrency(order.TotalAmount)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.PaymentStatus === 'Paid'
                          ? 'bg-green-50 text-green-700'
                          : order.PaymentStatus === 'Pending'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {order.PaymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock + Revenue Formula */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Low Stock Alert</h2>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-400 text-sm">All products sufficiently stocked.</p>
            ) : (
              <ul className="space-y-2">
                {stats.lowStockProducts.map(p => (
                  <li key={p.ProductID} className="flex items-center justify-between text-sm">
                    <span>{p.Name}</span>
                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {p.totalQty} units
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-charcoal text-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-gold-400">Revenue Calculation</h2>
            <div className="font-mono text-xs bg-black/30 rounded-lg p-4 text-green-300">
              <p className="text-gray-400 mb-1">-- Live from ORDER_LINE</p>
              <p>SELECT SUM(Quantity * SalePrice)</p>
              <p className="ml-2">AS TotalRevenue</p>
              <p>FROM ORDER_LINE;</p>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-gold-400 font-sans text-sm font-bold">
                  Result: {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
