'use client';

import { useData } from '@/providers/DataProvider';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

export default function ProductionPage() {
  const { getProductionSchedule, version } = useData();
  void version;

  const schedule = getProductionSchedule();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Production Schedule</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Production batches ordered by date — JOIN: PRODUCTION_BATCH + PRODUCT + MANUFACTURER
        </p>
      </div>

      {/* SQL reference */}
      <div className="bg-charcoal text-white rounded-xl p-5 mb-8 font-mono text-xs overflow-x-auto">
        <p className="text-gray-400 mb-1">-- Production schedule query:</p>
        <p className="text-green-300">SELECT BatchID, ProductionDate, QuantityProduced</p>
        <p className="text-green-300">FROM PRODUCTION_BATCH</p>
        <p className="text-green-300">ORDER BY ProductionDate;</p>
      </div>

      {/* Schedule Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Batch ID</th>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">Manufacturer</th>
                <th className="text-left px-5 py-3">Production Date</th>
                <th className="text-right px-5 py-3">Qty Produced</th>
                <th className="text-right px-5 py-3">Cost/Unit</th>
                <th className="text-right px-5 py-3">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(batch => (
                <tr key={batch.BatchID} className="border-b border-gray-50 hover:bg-smoke/50">
                  <td className="px-5 py-3 font-mono text-gold-600">#{batch.BatchID}</td>
                  <td className="px-5 py-3 font-medium">{batch.ProductName}</td>
                  <td className="px-5 py-3 text-gray-500">{batch.ManufacturerName}</td>
                  <td className="px-5 py-3">{batch.ProductionDate}</td>
                  <td className="px-5 py-3 text-right font-mono">{batch.QuantityProduced}</td>
                  <td className="px-5 py-3 text-right">{formatCurrency(batch.CostPerUnit)}</td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {formatCurrency(batch.QuantityProduced * batch.CostPerUnit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-5 py-3 text-xs text-gray-400 flex justify-between">
          <span>{schedule.length} batches</span>
          <span>
            Total production cost:{' '}
            <span className="font-semibold text-charcoal">
              {formatCurrency(schedule.reduce((s, b) => s + b.QuantityProduced * b.CostPerUnit, 0))}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
