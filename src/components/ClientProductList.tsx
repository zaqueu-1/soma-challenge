'use client';

import dynamic from 'next/dynamic';

const ProductList = dynamic(() => import('./ProductList'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
});

export default function ClientProductList() {
  return <ProductList />;
} 