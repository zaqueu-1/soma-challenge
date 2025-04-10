import productsData from '@/data/products.json';
import type { Product } from '@/types/product';

const ITEMS_PER_PAGE = 30;

const productsCache = new Map<number, {
  products: Product[];
  hasMore: boolean;
}>();

const validProducts = productsData.filter(product => {
  const price = product.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
  return price && price > 0;
});

export function getProducts(page: number = 1): {
  products: Product[];
  hasMore: boolean;
} {
  const cachedResult = productsCache.get(page);
  if (cachedResult) {
    return cachedResult;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  const paginatedProducts = validProducts
    .slice(start, end)
    .map(product => ({
      id: product.productId,
      name: product.productName,
      price: product.items[0].sellers[0].commertialOffer.Price,
      description: product.description,
      categories: product.categories,
      items: product.items.map(item => ({
        itemId: item.itemId,
        name: item.name,
        images: item.images.map(img => ({
          imageUrl: img.imageUrl,
          imageLabel: img.imageLabel
        })),
        sellers: item.sellers.map(seller => ({
          commertialOffer: {
            Price: seller.commertialOffer.Price,
            ListPrice: seller.commertialOffer.ListPrice || seller.commertialOffer.Price,
            Installments: seller.commertialOffer.Installments.map(inst => ({
              Value: inst.Value,
              InterestRate: inst.InterestRate,
              NumberOfInstallments: inst.NumberOfInstallments,
              PaymentSystemName: inst.PaymentSystemName
            }))
          }
        }))
      }))
    }));

  const result = {
    products: paginatedProducts,
    hasMore: end < validProducts.length
  };

  productsCache.set(page, result);

  return result;
}

export function clearProductsCache() {
  productsCache.clear();
}

export const getProductById = (id: string): Product | undefined => {
  const product = productsData.find(product => product.productId === id);
  
  if (!product) return undefined;

  const price = product.items?.[0]?.sellers?.[0]?.commertialOffer?.Price;
  if (!price || price <= 0) return undefined;

  return {
    id: product.productId,
    name: product.productName,
    price: product.items[0].sellers[0].commertialOffer.Price,
    description: product.description,
    categories: product.categories,
    items: product.items.map(item => ({
      itemId: item.itemId,
      name: item.name,
      images: item.images.map(img => ({
        imageUrl: img.imageUrl,
        imageLabel: img.imageLabel
      })),
      sellers: item.sellers.map(seller => ({
        commertialOffer: {
          Price: seller.commertialOffer.Price,
          ListPrice: seller.commertialOffer.ListPrice || seller.commertialOffer.Price,
          Installments: seller.commertialOffer.Installments.map(inst => ({
            Value: inst.Value,
            InterestRate: inst.InterestRate,
            NumberOfInstallments: inst.NumberOfInstallments,
            PaymentSystemName: inst.PaymentSystemName
          }))
        }
      }))
    }))
  };
}; 