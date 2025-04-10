'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icons } from './Icons';
import DropdownMenu from './DropdownMenu';
import menuItems from '@/data/menu.json';
import { MobileHeader } from './MobileHeader';
import { useCart } from '@/contexts/CartContext';
import { CartPopover } from './CartPopover';

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const { itemsCount } = useCart();

  const handleMouseEnter = (label: string) => {
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleCartToggle = () => {
    setShowCart(!showCart);
  };

  const handleCartClose = () => {
    setShowCart(false);
  };

  return (
    <>
      <header 
        className="bg-white fixed md:min-h-[130px] w-full top-0 z-50 py-[24px] border-b-1 border-gray-200" 
        role="banner"
        data-testid="fs-navbar"
      >
        <MobileHeader 
          showCart={showCart}
          onCartToggle={handleCartToggle}
          onCartClose={handleCartClose}
        />

        <div className="hidden md:block px-14 h-[42px]">
          <div className="flex justify-between">
            <div className="flex items-end gap-2 lg:gap-4">
              <button aria-label="Pin" className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-100">
                <Icons name="pin" />
              </button>
              <button aria-label="WhatsApp" className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-100">
                <Icons name="whatsapp" />
              </button>
            </div>

            <nav className="flex flex-col justify-center items-center">
              <Link href="/">
                <Icons name="logo" />
              </Link>
              <ul className="flex items-center gap-5 lg:gap-12">
                {menuItems.map((item) => (
                  <li 
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                  >
                    <Link 
                      href={item.href}
                      className="pb-7 text-[9px] lg:text-[12px] text-black tracking-[0.48px] hover:border-b-2 hover:border-black"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button aria-label="Signature">
                    <Icons name="sign" />
                  </button>
                </li>
              </ul>
            </nav>

            <div className="flex items-end gap-2 lg:gap-4">
              <button 
                aria-label="User" 
                className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-100"
              >
                <Icons name="user" />
              </button>
              <div className="relative">
                <button 
                  onClick={handleCartToggle}
                  aria-label="Bag" 
                  className="h-[40px] w-[40px] relative flex items-center justify-center hover:bg-gray-100"
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
                  onClose={handleCartClose}
                />
              </div>
              <button 
                aria-label="Search" 
                className="h-[40px] w-[40px] flex items-center justify-center hover:bg-gray-100"
              >
                <Icons name="search" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {activeMenu && menuItems.find(item => item.label === activeMenu)?.categories && (
        <div 
          onMouseEnter={() => handleMouseEnter(activeMenu)}
          onMouseLeave={handleMouseLeave}
        >
          <DropdownMenu 
            categories={menuItems.find(item => item.label === activeMenu)?.categories || []}
            isOpen={true}
          />
        </div>
      )}
    </>
  );
} 