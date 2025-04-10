'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { Size } from '@/utils/product';
import { getSizeOrder } from '@/utils/product';
import menuItems from '@/data/menu.json';

interface FiltersProps {
  selectedSize: Size[] | null;
  onSizeChange: (sizes: Size[] | null) => void;
  availableSizes: Size[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export function Filters({ 
  selectedSize, 
  onSizeChange, 
  availableSizes,
  selectedCategories,
  onCategoryChange 
}: FiltersProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<'size' | 'category'>('size');
  const filterRef = useClickOutside(() => setShowFilter(false));

  const letterSizes: Size[] = ['PP', 'P', 'M', 'G', 'GG'];
  const numericSizes: Size[] = ['34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'];

  const categories = menuItems
    .flatMap(item => item.categories || [])
    .filter(category => category.title !== 'ACESSÓRIOS')
    .flatMap(category => {
      return category.items
        .map(item => item.label)
        .filter(label => ![
          'BOLSAS', 'CALÇADOS', 'CINTO', 'COLAR', 'ANEL', 'BRINCO', `LINGERIE`, `LOUNGEWEAR`
        ].includes(label));
    });

  const handleSizeSelect = (size: Size) => {
    if (!availableSizes.includes(size)) return;
    
    if (!selectedSize) {
      onSizeChange([size]);
    } else {
      const isSelected = selectedSize.includes(size);
      if (isSelected) {
        const newSizes = selectedSize.filter(s => s !== size);
        onSizeChange(newSizes.length > 0 ? newSizes : null);
      } else {
        onSizeChange([...selectedSize, size].sort((a, b) => getSizeOrder(a) - getSizeOrder(b)));
      }
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleClearFilters = () => {
    if (activeTab === 'size') {
      onSizeChange(null);
    } else {
      onCategoryChange([]);
    }
    setShowFilter(false);
  };

  const isSizeSelected = (size: Size) => selectedSize?.includes(size) ?? false;
  const isSizeAvailable = (size: Size) => availableSizes.includes(size);

  const dropdownAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.1 }
  };

  const getFilterLabel = () => {
    const hasSize = selectedSize && selectedSize.length > 0;
    const hasCategories = selectedCategories.length > 0;

    if (hasSize && hasCategories) {
      return `${selectedSize.length} TAM, ${selectedCategories.length} CAT`;
    }
    if (hasSize) {
      return `TAMANHOS (${selectedSize.length})`;
    }
    if (hasCategories) {
      return `${selectedCategories.length} CATEGORIAS`;
    }
    return 'Filtrar';
  };

  return (
    <div className="relative" ref={filterRef}>
      <div 
        onClick={() => setShowFilter(!showFilter)} 
        className="cursor-pointer flex items-center gap-2 hover:underline"
      >
        <span className="text-xs flex items-center justify-center gap-2">
          {getFilterLabel()}
          {((selectedSize && selectedSize.length > 0) || selectedCategories.length > 0) && (
            <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {(selectedSize?.length || 0) + selectedCategories.length}
            </span>
          )}
        </span>
        <button className="cursor-pointer">
          <Icons 
            name={showFilter ? 'chevron-up' : 'chevron-down'}
          />
        </button>
      </div>

      <AnimatePresence>
        {showFilter && (
          <motion.div 
            {...dropdownAnimation}
            className="absolute right-0 top-full mt-2 bg-white shadow-lg border border-gray-100 py-2 z-10 min-w-[280px]"
          >
            <div className="px-4 py-2 text-xs font-bold border-b border-gray-100 flex justify-between items-center">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('size')}
                  className={`${activeTab === 'size' ? 'text-black' : 'text-gray-400'} hover:text-black transition-colors`}
                >
                  Tamanhos
                  {selectedSize && selectedSize.length > 0 && (
                    <span className="ml-1">({selectedSize.length})</span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('category')}
                  className={`${activeTab === 'category' ? 'text-black' : 'text-gray-400'} hover:text-black transition-colors`}
                >
                  Categorias
                  {selectedCategories.length > 0 && <span className="ml-1">({selectedCategories.length})</span>}
                </button>
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'size' ? (
                <>
                  <div className="mb-4">
                    <p className="text-[10px] text-gray-500 mb-2">TAMANHOS</p>
                    <div className="grid grid-cols-5 gap-2">
                      {letterSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          disabled={!isSizeAvailable(size)}
                          className={`
                            flex items-center justify-center
                            w-10 h-10 text-xs
                            border
                            ${!isSizeAvailable(size)
                              ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                              : isSizeSelected(size)
                                ? 'border-black bg-black text-white' 
                                : 'border-gray-200 hover:border-gray-400'
                            }
                            transition-colors
                          `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 mb-2">NUMERAÇÃO</p>
                    <div className="grid grid-cols-5 gap-2">
                      {numericSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          disabled={!isSizeAvailable(size)}
                          className={`
                            flex items-center justify-center
                            w-10 h-10 text-xs
                            border
                            ${!isSizeAvailable(size)
                              ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                              : isSizeSelected(size)
                                ? 'border-black bg-black text-white' 
                                : 'border-gray-200 hover:border-gray-400'
                            }
                            transition-colors
                          `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`
                        text-left px-4 py-2 text-xs
                        ${selectedCategories.includes(category) ? 'font-bold' : ''}
                        hover:bg-gray-50
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedCategories.length > 0 && activeTab === 'category' && (
              <div className="px-4 py-2 border-t border-gray-100 flex flex-wrap gap-2">
                {selectedCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 flex items-center gap-1"
                  >
                    {category}
                    <span className="text-gray-500">×</span>
                  </button>
                ))}
              </div>
            )}

            {((selectedSize && activeTab === 'size') || (selectedCategories.length > 0 && activeTab === 'category')) && (
              <button
                onClick={handleClearFilters}
                className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 border-t border-gray-100"
              >
                Limpar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 