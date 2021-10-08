import { Calendar } from './Calendar';

/**
 * Calendar head data based on checkfront vendor and/or category.
 */
export interface Vendor {
  uid: string;
  apiUrl: string;
  title: string | null;
  description: string | null;
  calendars: Calendar[] | null;
}
