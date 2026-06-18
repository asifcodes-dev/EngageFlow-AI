/** Currencies a subscriber can price products in (INR-first for Indian SMBs). */
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

/**
 * A product a subscriber sells. When an Instagram comment/DM matches one of the
 * product's `keywords`, the automation replies/DMs about this product.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  /** Trigger keywords that map an incoming comment/DM to this product. */
  keywords: string[];
}

/** Payload for create/update — everything except the server-assigned id. */
export type ProductInput = Omit<Product, 'id'>;
