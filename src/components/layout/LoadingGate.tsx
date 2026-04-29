'use client';

import { useData } from '@/providers/DataProvider';

export default function LoadingGate({ children }: { children: React.ReactNode }) {
  const { loading } = useData();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gold-500 text-2xl font-bold tracking-wider mb-2">LUMIERE</p>
          <p className="text-gray-400 text-sm tracking-wide">Loading storefront...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
