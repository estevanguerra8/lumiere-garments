'use client';

import { useState } from 'react';
import { useData } from '@/providers/DataProvider';

export default function InventoryPage() {
  const { getInventoryWithDetails, getProductsWithInventory, updateInventory, version } = useData();
  void version;

  const inventory = getInventoryWithDetails();
  const products = getProductsWithInventory();

  const [editing, setEditing] = useState<{ productId: number; warehouseId: number } | null>(null);
  const [editQty, setEditQty] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // Aggregate total stock per product
  const productTotals = products.map(p => ({
    id: p.ProductID,
    name: `${p.Name} (${p.Size})`,
    total: p.totalInventory,
  }));

  function startEdit(productId: number, warehouseId: number, currentQty: number) {
    setEditing({ productId, warehouseId });
    setEditQty(String(currentQty));
    setMessage(null);
  }

  async function saveEdit() {
    if (!editing) return;
    const qty = parseInt(editQty, 10);
    if (isNaN(qty) || qty < 0) {
      setMessage('Quantity must be a non-negative number.');
      return;
    }
    const ok = await updateInventory(editing.productId, editing.warehouseId, qty);
    if (ok) {
      setMessage(`Inventory updated: Product #${editing.productId}, Warehouse #${editing.warehouseId} set to ${qty}.`);
    } else {
      setMessage('Update failed.');
    }
    setEditing(null);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Stock levels across warehouses. Click &quot;Edit&quot; to demonstrate UPDATE behavior.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-blue-50 text-blue-800 border border-blue-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">
                  <th className="text-left px-2.5 sm:px-5 py-2 sm:py-3">Product</th>
                  <th className="text-left px-2.5 sm:px-5 py-2 sm:py-3">Warehouse</th>
                  <th className="text-right px-2.5 sm:px-5 py-2 sm:py-3">Qty</th>
                  <th className="text-left px-2.5 sm:px-5 py-2 sm:py-3">Status</th>
                  <th className="text-right px-2.5 sm:px-5 py-2 sm:py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(inv => {
                  const isEditing =
                    editing?.productId === inv.ProductID &&
                    editing?.warehouseId === inv.WarehouseID;
                  return (
                    <tr
                      key={`${inv.ProductID}-${inv.WarehouseID}`}
                      className="border-b border-gray-50 hover:bg-smoke/50"
                    >
                      <td className="px-2.5 sm:px-5 py-2 sm:py-3 font-medium">{inv.ProductName}</td>
                      <td className="px-2.5 sm:px-5 py-2 sm:py-3 text-gray-500">{inv.WarehouseLocation}</td>
                      <td className="px-2.5 sm:px-5 py-2 sm:py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            value={editQty}
                            onChange={e => setEditQty(e.target.value)}
                            className="w-16 sm:w-20 border border-gray-300 rounded px-2 py-1 text-xs sm:text-sm text-right focus:outline-none focus:ring-2 focus:ring-gold-400/50"
                            autoFocus
                          />
                        ) : (
                          <span className="font-mono">{inv.Quantity}</span>
                        )}
                      </td>
                      <td className="px-2.5 sm:px-5 py-2 sm:py-3">
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                          inv.Quantity === 0
                            ? 'bg-red-50 text-red-700'
                            : inv.Quantity <= 10
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {inv.Quantity === 0 ? 'Out' : inv.Quantity <= 10 ? 'Low' : 'OK'}
                        </span>
                      </td>
                      <td className="px-2.5 sm:px-5 py-2 sm:py-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1.5 sm:gap-2">
                            <button
                              onClick={saveEdit}
                              className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 bg-gold-500 text-white rounded hover:bg-gold-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(inv.ProductID, inv.WarehouseID, inv.Quantity)}
                            className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Stock Per Product */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Total Stock per Product</h2>
          <ul className="space-y-3">
            {productTotals.map(p => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate mr-2">{p.name}</span>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                  p.total === 0
                    ? 'bg-red-50 text-red-700'
                    : p.total <= 10
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-green-50 text-green-700'
                }`}>
                  {p.total}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-[10px] font-mono text-gray-500">
            UPDATE INVENTORY<br />
            SET Quantity = ?<br />
            WHERE ProductID = ?<br />
            AND WarehouseID = ?;
          </div>
        </div>
      </div>
    </div>
  );
}
