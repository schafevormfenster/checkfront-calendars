import { Event } from './Event';

/**
 * Calendar head data based on checkfront vendor and/or category.
 */
export interface Calendar {
  uid: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  events: Event[] | null;
  apiPath: string;
}
