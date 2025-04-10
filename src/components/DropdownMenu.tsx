'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface MenuItem {
  label: string;
  href: string;
}

interface Category {
  title: string;
  items: MenuItem[];
}

interface DropdownMenuProps {
  categories: Category[];
  isOpen: boolean;
}

export default function DropdownMenu({ categories, isOpen }: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="fixed left-0 right-0 top-[130px] bg-[#F4F4F4] z-50 border-t border-[#00000014]"
    >
      <div className="py-8 px-14">
        <div className="max-w-[1280px] mx-auto">
          <div 
            className="grid grid-cols-4 gap-8"
          >
            {categories.map((category, index) => (
              <div 
                key={index}
                className="flex flex-col"
              >
                <h3 className="text-xs font-medium uppercase mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li 
                      key={idx}
                      className="text-xs text-gray-600 hover:text-black"
                    >
                      <Link 
                        href={item.href}
                        className="text-xs text-gray-600 hover:text-black"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      href={`/${category.title.toLowerCase()}`}
                      className="text-xs text-gray-600 hover:text-black mt-4 inline-block"
                    >
                      VER TUDO →
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 