'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import bannerData from '@/data/banner.json';

export function Banner() {
  const banner = bannerData[0];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`relative w-full h-full ${isMobile ? 'aspect-[7/5] min-h-[300px]' : 'aspect-[7/2] min-h-[380px]'}`}>
      <Link href={banner.link}>
        <Image
          src={isMobile ? banner.mobileImageUrl : banner.imageUrl}
          alt={banner.title}
          fill
          className="object-contain"
          priority
          quality={90}
        />
      </Link>
    </div>
  );
} 