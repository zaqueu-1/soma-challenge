'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/product';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CartPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartPopover({ isOpen, onClose }: CartPopoverProps) {
  const cartRef = useClickOutside(() => {
    if (isOpen) onClose();
  });

  const { items, removeItem, updateQuantity, total } = useCart();

  const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId, size);
    } else {
      updateQuantity(productId, size, newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={cartRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.1 }}
          className="absolute top-full right-0 mt-2 w-[400px] bg-white shadow-lg border border-gray-100 p-4 z-50"
        >
          <div className="px-4 py-2 text-xs font-bold border-b border-gray-100 flex justify-between items-center">
            <span>Carrinho</span>
          </div>

          {items.length > 0 ? (
            <>
              <div className="max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <div 
                    key={`${item.product.id}-${item.size}`}
                    className="p-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex gap-4">
                      <Image 
                        src={item.product.items[0].images[0].imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={80}
                        className="object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xs font-light mb-1">{item.product.name}</h3>
                        <p className="text-[10px] text-gray-500 mb-2">Tamanho: {item.size}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 border border-gray-200">
                            <button 
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity - 1)}
                              className="px-2 py-1 text-xs hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity + 1)}
                              className="px-2 py-1 text-xs hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-xs font-bold">
                            R${formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs">Total</span>
                  <span className="text-sm font-bold">R${formatPrice(total)}</span>
                </div>
                <button 
                  className="w-full py-3 text-xs uppercase tracking-wider bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  Finalizar Compra
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">Seu carrinho está vazio</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
} 