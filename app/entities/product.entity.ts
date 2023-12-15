export interface Matches {
  url: string;
  title?: string;
  price?: number;
  rating?: number;
  reviews?: number;
  lastUpdate?: Date;
  matchPercentage?: number;
}

export interface Product {
  _id: string;
  name: string;
  image?: string;
  sku?: string;
  urls?: Matches[];
  properties?: string;
}

export interface PostProduct {
  name: string;
  image?: string;
  sku?: string;
  urls?: Matches[];
  properties?: string;
}
