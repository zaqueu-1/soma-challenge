import type { Product } from '@/types/product';

export const getProductImages = (product: Product) => {
  const images = product.items?.[0]?.images || [];
  return images.length > 1 ? images.slice(0, -1) : images;
};

export const getInstallments = (product: Product) => {
  const installments = product.items?.[0]?.sellers?.[0]?.commertialOffer?.Installments;
  
  if (!installments?.length) {
    return null;
  }

  const maxInstallment = installments.reduce((max, current) => {
    if (current.NumberOfInstallments > max.NumberOfInstallments && current.InterestRate === 0) {
      return current;
    }
    return max;
  }, installments[0]);

  if (!maxInstallment?.NumberOfInstallments || !maxInstallment?.Value) {
    return null;
  }

  return {
    number: maxInstallment.NumberOfInstallments,
    value: maxInstallment.Value
  };
};

export const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};

export type SortType = 'highest-price' | 'lowest-price' | 'biggest-discount' | null;

export const sortProducts = (products: Product[], sortType: SortType) => {
  if (!sortType) return products;

  return [...products].sort((a, b) => {
    const priceA = a.items?.[0]?.sellers?.[0]?.commertialOffer?.Price || 0;
    const priceB = b.items?.[0]?.sellers?.[0]?.commertialOffer?.Price || 0;
    const listPriceA = a.items?.[0]?.sellers?.[0]?.commertialOffer?.ListPrice || priceA;
    const listPriceB = b.items?.[0]?.sellers?.[0]?.commertialOffer?.ListPrice || priceB;
    const discountA = ((listPriceA - priceA) / listPriceA) * 100;
    const discountB = ((listPriceB - priceB) / listPriceB) * 100;

    switch (sortType) {
      case 'highest-price':
        return priceB - priceA;
      case 'lowest-price':
        return priceA - priceB;
      case 'biggest-discount':
        return discountB - discountA;
      default:
        return 0;
    }
  });
};

export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 
  '34' | '36' | '38' | '40' | '42' | '44' | '46' | '48' | '50' | '52' | '54' | '56';

export const getAvailableSizes = (product: Product): Size[] => {
  return product.items
    ?.filter(item => {
      const price = item.sellers?.[0]?.commertialOffer?.Price;
      return price && price > 0;
    })
    ?.map(item => {
      const numericMatch = item.name.match(/\b(34|36|38|40|42|44|46|48|50|52|54|56)\b/);
      if (numericMatch) return numericMatch[1] as Size;
      
      const letterMatch = item.name.match(/(PP|P|M|G|GG)/);
      return letterMatch?.[1] as Size;
    })
    ?.filter((size): size is Size => size !== undefined) || [];
};

// Função auxiliar para organizar os tamanhos
export const getSizeOrder = (size: Size): number => {
  const sizeOrder: Record<Size, number> = {
    'PP': 0,
    'P': 1,
    'M': 2,
    'G': 3,
    'GG': 4,
    '34': 5,
    '36': 6,
    '38': 7,
    '40': 8,
    '42': 9,
    '44': 10,
    '46': 11,
    '48': 12,
    '50': 13,
    '52': 14,
    '54': 15,
    '56': 16
  };
  return sizeOrder[size];
};

export const filterProductsBySize = (products: Product[], sizes: Size[] | null) => {
  if (!sizes || sizes.length === 0) return products;

  return products.filter(product => {
    const productSizes = getAvailableSizes(product);
    return sizes.some(size => productSizes.includes(size));
  });
}; 