'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';

interface ProductImageCarouselProps {
  images: { imageUrl: string }[];
  productName: string;
}

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrevImage = () => {
    setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNextImage = () => {
    setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  return (
    <div className="relative aspect-[3/4] mb-4 overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentImage}
          initial={{ x: 100}}
          animate={{ x: 0}}
          exit={{ x: -100}}
          transition={{ duration: 0.15 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentImage]?.imageUrl || ''}
            alt={`${productName} - Imagem ${currentImage + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            quality={90}
            priority={currentImage === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <span className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] tracking-wider">
        NEW IN
      </span>

      <div className="hidden">
        {images.map((img, index) => (
          index !== currentImage && (
            <Image
              key={img.imageUrl}
              src={img.imageUrl}
              alt=""
              width={1}
              height={1}
              priority
            />
          )
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePrevImage();
            }}
            className="cursor-pointer absolute left-0 top-0 bottom-0 w-12 flex items-center justify-start px-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-black/20 to-transparent"
            aria-label="Imagem anterior"
          >
            <Icons name="chevron-left" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNextImage();
            }}
            className="cursor-pointer absolute right-0 top-0 bottom-0 w-12 flex items-center justify-end px-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-l from-black/20 to-transparent"
            aria-label="Próxima imagem"
          >
            <Icons name="chevron-right" />
          </button>
        </>
      )}
    </div>
  );
} 