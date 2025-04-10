'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/services/products';
import { getInstallments, formatPrice, getProductImages } from '@/utils/product';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { AddToCartPopover } from '@/components/AddToCartPopover';

export default function ProductPage() {
  const { id } = useParams();
  const [activePopover, setActivePopover] = useState<string | null>(null);
  
  const product = getProductById(id as string);
  
  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  const installments = getInstallments(product);
  const listPrice = product.items?.[0]?.sellers?.[0]?.commertialOffer?.ListPrice;
  const images = getProductImages(product);

  return (
    <main className="pt-[130px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductImageCarousel 
            images={images}
            productName={product.name}
          />
        </div>

        <div className="flex flex-col gap-4 px-16 pb-16 md:py-16">
          <h1 className="text-2xl font-light">{product.name}</h1>
          
          <div className="flex flex-col gap-1 min-w-[316px]">
            <div className="flex gap-2 items-baseline">
              <p className="text-lg font-bold">
                R${formatPrice(product.price)}
              </p>
              {listPrice && listPrice > product.price && (
                <p className="text-sm text-gray-400 line-through">
                  R${formatPrice(listPrice)}
                </p>
              )}
              {installments && (
              <p className="text-sm">
                ou {installments.number}x de R${formatPrice(installments.value)}
              </p>
            )}
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setActivePopover(activePopover === product.id ? null : product.id)}
              className="w-[250px] p-3 text-xs uppercase tracking-wider bg-black text-white hover:bg-gray-900 transition-colors"
            >
              Adicionar à Sacola
            </button>

            <AddToCartPopover
              product={product}
              isOpen={activePopover === product.id}
              onClose={() => setActivePopover(null)}
              position="bottom"
            />
          </div>

          {product.description && (
            <div className="mt-8">
              <h2 className="text-sm font-bold mb-2">Descrição</h2>
              <div 
              className="text-sm text-gray-600 [&_p]:mb-4 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            </div>
          )}

          {product.materials?.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-bold mb-2">Materiais</h2>
              <ul className="text-sm text-gray-600">
                {product.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 