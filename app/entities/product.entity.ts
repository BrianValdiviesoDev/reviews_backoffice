export interface Matches {
  product: Product;
  percentage: any[];
}

export enum ProductType {
  MANUAL = 'MANUAL',
  SCRAPPED = 'SCRAPPED',
}

export enum MarketPlaces {
  AMAZON = 'AMAZON',
  PCCOMPONENTES = 'PCCOMPONENTES',
  MEDIAMARKT = 'MEDIAMARKT',
  ELCORTEINGLES = 'ELCORTEINGLES',
  ALIEXPRESS = 'ALIEXPRESS',
  MANOMANO = 'MANOMANO',
  EBAY = 'EBAY',
  FNAC = 'FNAC',
}

export interface Product {
  _id: string;
  type: ProductType;
  name: string;
  marketplace?: MarketPlaces;
  image?: string;
  originUrl: string;
  matches?: Matches[];
  properties?: string;
  metadata?: any;
  price?: number;
  rating?: number;
  reviews?: number;
  scrappedReviews?: number;
  generatedReviews?: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface PostProduct {
  type: ProductType;
  name: string;
  originUrl: string;
  marketplace?: MarketPlaces;
  image?: string;
  matches?: Matches[];
  properties?: string;
  metadata?: any;
  price?: number;
  rating?: number;
  reviews?: number;
}
