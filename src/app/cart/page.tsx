'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/providers/CartProvider';
import { useData } from '@/providers/DataProvider';
import Link from 'next/link';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US');
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { getProductsWithInventory, getCustomers, placeOrder, version } = useData();
  void version;

  const products = getProductsWithInventory();
  const customers = getCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState<number>(0);
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  function getProduct(productId: number) {
    return products.find(p => p.ProductID === productId);
  }

  function handleCheckout() {
    if (!selectedCustomer) {
      setOrderResult({ success: false, message: 'Please select a customer.' });
      return;
    }
    if (items.length === 0) {
      setOrderResult({ success: false, message: 'Cart is empty.' });
      return;
    }

    setProcessing(true);
    setOrderResult(null);

    // Simulate a brief processing delay for demo effect
    setTimeout(() => {
      const result = placeOrder(selectedCustomer, items);
      if (result.success) {
        setOrderResult({
          success: true,
          message: `Order #${result.order.OrderID} placed successfully! Total: ${formatCurrency(result.order.TotalAmount)}`,
        });
        clearCart();
        setSelectedCustomer(0);
      } else {
        setOrderResult({ success: false, message: result.error });
      }
      setProcessing(false);
    }, 600);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cart & Checkout</h1>
        <p className="text-gray-500 mt-1 text-sm">Review your items and place an order.</p>
      </div>

      {/* Order result message */}
      {orderResult && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          orderResult.success
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {orderResult.message}
          {orderResult.success && (
            <div className="mt-2">
              <Link href="/orders" className="text-green-700 underline text-xs">
                View Orders &rarr;
              </Link>
            </div>
          )}
        </div>
      )}

      {items.length === 0 && !orderResult?.success ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <Link
            href="/catalog"
            className="inline-block px-6 py-2.5 bg-charcoal text-white text-sm rounded-lg hover:bg-charcoal/90"
          >
            Browse Catalog
          </Link>
        </div>
      ) : items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => {
              const product = getProduct(item.ProductID);
              if (!product) return null;
              return (
                <div
                  key={item.ProductID}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4"
                >
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image
                      src={product.ImageUrl}
                      alt={product.Name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{product.Name}</h3>
                    <p className="text-xs text-gray-400">
                      {product.Size} / {product.Color} &middot; {product.totalInventory} in stock
                    </p>
                    <p className="text-sm font-bold mt-1">{formatCurrency(item.SalePrice)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.ProductID, item.Quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.Quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.ProductID, item.Quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatCurrency(item.Quantity * item.SalePrice)}
                    </p>
                    <button
                      onClick={() => removeItem(item.ProductID)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4">Checkout</h2>

            {/* Customer Select */}
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
              Select Customer
            </label>
            <select
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-gold-400/50 bg-white"
            >
              <option value={0}>Choose a customer...</option>
              {customers.map(c => (
                <option key={c.CustomerID} value={c.CustomerID}>
                  {c.Name} ({c.Email})
                </option>
              ))}
            </select>

            {/* Order Summary */}
            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
              {items.map(item => {
                const product = getProduct(item.ProductID);
                return (
                  <div key={item.ProductID} className="flex justify-between text-sm text-gray-600">
                    <span>{product?.Name} x{item.Quantity}</span>
                    <span>{formatCurrency(item.Quantity * item.SalePrice)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-[10px] text-gold-600 font-mono">
                = SUM(Quantity x SalePrice) from ORDER_LINE
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full py-3 bg-gold-500 text-white rounded-lg font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Place Order'}
            </button>

            <p className="text-[10px] text-gray-400 mt-3 text-center">
              This will INSERT into ORDER &amp; ORDER_LINE, then UPDATE INVENTORY.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
