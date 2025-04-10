'use client';

import Link from 'next/link';
import { Icons } from './Icons';
import { useCart } from '@/contexts/CartContext';
import { CartPopover } from './CartPopover';

interface MobileHeaderProps {
  showCart: boolean;
  onCartToggle: () => void;
  onCartClose: () => void;
}

export function MobileHeader({ showCart, onCartToggle, onCartClose }: MobileHeaderProps) {
  const { itemsCount } = useCart();

  return (
    <div className="h-[40px] p-4 md:hidden">
      <div className="h-full flex items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <button 
            className="flex flex-col gap-1 items-center" 
            aria-label="Abrir Menu"
          >
            <Icons name="menu" />
            <span className="text-[8px] font-bold">MENU</span>
          </button>
        </div>

        <Link href="/" className="flex justify-center items-start w-full">
          <Icons name="logo" />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/search" aria-label="search">
            <Icons name="search" />
          </Link>
          <div className="relative">
            <button 
              onClick={onCartToggle}
              className="relative p-2 hover:opacity-70"
            >
              <Icons name="bag" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {itemsCount}
                </span>
              )}
            </button>

            <CartPopover 
              isOpen={showCart}
              onClose={onCartClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 