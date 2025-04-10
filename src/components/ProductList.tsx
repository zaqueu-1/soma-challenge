'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { getProducts } from '@/services/products';
import { getInstallments, formatPrice, getProductImages, sortProducts, type SortType, type Size, filterProductsBySize, getAvailableSizes, getSizeOrder } from '@/utils/product';
import { ProductImageCarousel } from './ProductImageCarousel';
import { Filters } from './Filters';
import { SortFilter } from './SortFilter';
import { AddToCartPopover } from './AddToCartPopover';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState<SortType>(null);
  const [selectedSize, setSelectedSize] = useState<Size[] | null>(null);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    loadInitialProducts();
  }, []);

  const loadInitialProducts = async () => {
    const { products: initialProducts, hasMore: more } = getProducts(1);
    setProducts(initialProducts);
    setHasMore(more);
  };

  const loadMoreProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;
    const { products: newProducts, hasMore: more } = getProducts(nextPage);
    
    setProducts(prev => [...prev, ...newProducts]);
    setPage(nextPage);
    setHasMore(more);
    setLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loading, hasMore, loadMoreProducts]);

  const handleSort = (type: SortType) => {
    setSortType(type);
  };

  const handleSizeFilter = (sizes: Size[] | null) => {
    setSelectedSize(sizes);
  };

  const filterProductsByCategories = (products: Product[], categories: string[]) => {
    if (categories.length === 0) return products;
    
    return products.filter(product => {
      const productCategories = product.categories || [];
      const productMaterials = product.materials || [];
      
      return categories.some(category => {
        if (category === 'MATERIAIS') {
          return productMaterials.length > 0;
        }
        
        return productCategories.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        );
      });
    });
  };

  const filteredByCategories = filterProductsByCategories(products, selectedCategories);
  const filteredBySize = filterProductsBySize(filteredByCategories, selectedSize);
  const sortedProducts = sortProducts(filteredBySize, sortType);

  const allAvailableSizes = Array.from(
    new Set(
      products.flatMap(product => getAvailableSizes(product))
    )
  ).sort((a, b) => getSizeOrder(a) - getSizeOrder(b));

  const renderNoProducts = () => (
    <div className="col-span-full py-16 text-center min-h-[500px]">
      <p className="text-gray-500 text-sm mb-2">
        Nenhum produto encontrado
      </p>
      <p className="text-gray-400 text-xs">
        {(selectedSize || selectedCategories.length > 0) ? (
          <>
            {selectedSize?.map(size => (
              <span key={size} className="text-black underline mr-1 hover:opacity-70">
                {size}
              </span>
            ))}
            {selectedCategories.map(category => (
              <span 
                key={category}
                onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                className="text-black underline mr-1 hover:opacity-70 cursor-pointer"
              >
                {category}
              </span>
            ))}
            <button 
              onClick={() => {
                handleSizeFilter(null);
                setSelectedCategories([]);
              }}
              className="text-black underline ml-1 hover:opacity-70"
            >
              Limpar filtros
            </button>
          </>
        ) : (
          'Não há produtos disponíveis.'
        )}
      </p>
    </div>
  );

  return (
    <div className="px-14 mx-auto">
      <div className="flex justify-between items-center mb-6 h-[42px]">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/" className="hover:underline">Coleção</Link>
          <span>•</span>
          <Link href="/novidades" className="hover:underline">Novidades</Link>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Filters 
            selectedSize={selectedSize}
            onSizeChange={handleSizeFilter}
            availableSizes={allAvailableSizes}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
          <SortFilter
            sortType={sortType}
            onSortChange={handleSort}
          />
        </div>
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12`}>
        {(sortedProducts.length > 0 || loading) ? (
          sortedProducts.map((product) => {
            const installments = getInstallments(product);
            const listPrice = product.items?.[0]?.sellers?.[0]?.commertialOffer?.ListPrice;
            const images = getProductImages(product);

            return (
              <div key={product.id} className="group relative">
                <ProductImageCarousel 
                  images={images}
                  productName={product.name}
                />

                <Link href={`/produto/${product.id}`} className="block">
                  <h3 className="text-[12px] md:text-[13px] lg:text-[14px] font-light mb-1 hover:underline">{product.name}</h3>
                  <div className="flex flex-col md:flex-row gap-1 md:gap-2 items-baseline">
                    <div className='flex gap-1 md:gap-2 items-baseline'>
                      <p className="text-[12px] lg:text-[14px] font-bold">
                        R${formatPrice(product.price)}
                      </p>
                      {listPrice && listPrice > product.price && (
                          <p className="text-[10px] lg:text-[12px] text-gray-400 line-through">
                            R${formatPrice(listPrice)}
                          </p>
                        )}
                    </div>
                    {installments && (
                      <p className="text-[10px] lg:text-[12px]">
                        {installments.number}x de R${formatPrice(installments.value)}
                      </p>
                    )}
                  </div>
                </Link>

                <div className="relative">
                  <button 
                    onClick={() => setActivePopover(activePopover === product.id ? null : product.id)}
                    className="cursor-pointer py-0 px-2 text-[8px] md:text-[10px] lg:text-[12px] border-1 border-black uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    SHOP NOW
                  </button>

                  <AddToCartPopover
                    product={product}
                    isOpen={activePopover === product.id}
                    onClose={() => setActivePopover(null)}
                    position="up"
                  />
                </div>
              </div>
            );
          })
        ) : (
          renderNoProducts()
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}