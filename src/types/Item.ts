/**
 * Item as base interface for an event.
 */
export interface Item {
  uid: number;
  sku: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
}
