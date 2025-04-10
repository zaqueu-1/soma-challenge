'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types/product';
import type { Size } from '@/utils/product';
import { getAvailableSizes, getSizeOrder } from '@/utils/product';

interface AddToCartPopoverProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  position?: 'up' | 'bottom';
}

export function AddToCartPopover({ 
  product, 
  isOpen, 
  onClose,
  position = 'up' 
}: AddToCartPopoverProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const { addItem } = useCart();
  
  const availableSizes = getAvailableSizes(product)
    .sort((a, b) => getSizeOrder(a) - getSizeOrder(b));

  const handleAddToCart = () => {
    if (selectedSize && availableSizes.includes(selectedSize)) {
      addItem(product, selectedSize);
      onClose();
      setSelectedSize(null);
    }
  };

  const isSizeAvailable = (size: Size) => availableSizes.includes(size);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: position === 'up' ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'up' ? 10 : -10 }}
          transition={{ duration: 0.1 }}
          className={`
            absolute ${position === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} 
            left-0 bg-white shadow-lg border border-gray-100 p-4 z-20 w-[250px]
          `}
        >
          <div className="mb-4 flex flex-col items-center">
            <p className="text-xs font-bold mb-2">SELECIONE O TAMANHO</p>
            <div className="flex gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    flex items-center justify-center
                    px-4
                    w-1 h-10 text-xs
                    border ${selectedSize === size 
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

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || !isSizeAvailable(selectedSize)}
            className={`
              w-full py-3 text-xs uppercase tracking-wider
              ${selectedSize && isSizeAvailable(selectedSize)
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
              transition-colors
            `}
          >
            Adicionar ao Carrinho
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 