'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';
import { useClickOutside } from '@/hooks/useClickOutside';
import type { SortType } from '@/utils/product';

interface SortFilterProps {
  sortType: SortType;
  onSortChange: (type: SortType) => void;
}

export function SortFilter({ sortType, onSortChange }: SortFilterProps) {
  const [showOptions, setShowOptions] = useState(false);
  const sortRef = useClickOutside(() => setShowOptions(false));

  const sortOptions = [
    { label: 'Maior Preço', value: 'highest-price' as const },
    { label: 'Menor Preço', value: 'lowest-price' as const },
    { label: 'Maior Desconto', value: 'biggest-discount' as const }
  ];

  const handleSort = (type: SortType) => {
    onSortChange(type);
    setShowOptions(false);
  };

  const dropdownAnimation = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.1 }
  };

  return (
    <div className="relative" ref={sortRef}>
      <div onClick={() => setShowOptions(!showOptions)} className="cursor-pointer flex items-center gap-2 hover:underline">
        <span className="text-xs">ORDENAR POR</span>
        <button className="cursor-pointer">
          <Icons 
            name={showOptions ? 'chevron-up' : 'chevron-down'}
          />
        </button>
      </div>

      <AnimatePresence>
        {showOptions && (
          <motion.div 
            {...dropdownAnimation}
            className="absolute right-0 top-full mt-2 bg-white shadow-lg border border-gray-100 py-2 z-10 min-w-[160px]"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${
                  sortType === option.value ? 'font-bold' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
            {sortType && (
              <button
                onClick={() => handleSort(null)}
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