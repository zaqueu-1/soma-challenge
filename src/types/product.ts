export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categories: string[];
  materials: string[];
  items: Array<{
    itemId: string;
    name: string;
    images: Array<{
      imageUrl: string;
      imageLabel: string;
    }>;
    sellers: Array<{
      commertialOffer: {
        Price: number;
        ListPrice: number;
        Installments: Array<{
          Value: number;
          InterestRate: number;
          NumberOfInstallments: number;
          PaymentSystemName: string;
        }>;
      }
    }>;
  }>;
  isNew?: boolean;
} 