'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useData } from '@/providers/DataProvider';
import { useCart } from '@/providers/CartProvider';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US');
}

export default function CatalogPage() {
  const { getProductsWithInventory, getCollections, version } = useData();
  const { addItem } = useCart();
  void version;

  const products = getProductsWithInventory();
  const collections = getCollections();

  const [filterCollection, setFilterCollection] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState<number | null>(null);

  const sizes = [...new Set(products.map(p => p.Size))].sort();
  const colors = [...new Set(products.map(p => p.Color))].sort();

  const filtered = products.filter(p => {
    if (filterCollection && p.collectionName !== filterCollection) return false;
    if (filterSize && p.Size !== filterSize) return false;
    if (filterColor && p.Color !== filterColor) return false;
    if (search && !p.Name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function handleAdd(productId: number, price: number) {
    addItem(productId, price);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1200);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        <p className="text-gray-500 mt-1 text-sm">Browse our collections and add items to your cart.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 bg-white"
        />
        <select
          value={filterCollection}
          onChange={e => setFilterCollection(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          <option value="">All Collections</option>
          {collections.map(c => (
            <option key={c.CollectionID} value={c.Name}>{c.Name}</option>
          ))}
        </select>
        <select
          value={filterSize}
          onChange={e => setFilterSize(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          <option value="">All Sizes</option>
          {sizes.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterColor}
          onChange={e => setFilterColor(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          <option value="">All Colors</option>
          {colors.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(product => (
          <div
            key={product.ProductID}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Product image */}
            <div className="h-56 relative overflow-hidden bg-gray-100">
              <Image
                src={product.ImageUrl}
                alt={product.Name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-5">
              <p className="text-[10px] text-gold-600 uppercase tracking-widest mb-1">
                {product.collectionName}
              </p>
              <h3 className="font-semibold text-charcoal mb-2">{product.Name}</h3>

              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {product.Size}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {product.Color}
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold">{formatCurrency(product.RetailPrice)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  product.totalInventory === 0
                    ? 'bg-red-50 text-red-700'
                    : product.totalInventory <= 10
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-green-50 text-green-700'
                }`}>
                  {product.totalInventory === 0
                    ? 'Sold Out'
                    : `${product.totalInventory} in stock`}
                </span>
              </div>

              <button
                onClick={() => handleAdd(product.ProductID, product.RetailPrice)}
                disabled={product.totalInventory === 0}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  product.totalInventory === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : addedId === product.ProductID
                    ? 'bg-green-600 text-white'
                    : 'bg-charcoal text-white hover:bg-charcoal/90'
                }`}
              >
                {addedId === product.ProductID
                  ? 'Added!'
                  : product.totalInventory === 0
                  ? 'Sold Out'
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No products match your filters.
        </div>
      )}
    </div>
  );
}
