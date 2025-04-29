export interface Supplement {
  id: number;
  name: string;
  priceEuro: number;
  imageUrl: string;
  productUrl: string;
  flavor: string;
  weightVolume: string;
  brand: string;
  category: string;
  goals: string[]; // note: you had goals as a string, but really it looks like an array of strings
}
