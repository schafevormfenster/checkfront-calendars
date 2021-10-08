/**
 * Event.
 */
export interface Event {
  uid: string;
  title: string;
  description?: string;
  bookingLink: string | null;
  start: Date;
  end?: Date;
  allday?: boolean;
  cancelled?: boolean;
  availability: number;
  location: string;
  imageUrl: string | null;
  organizer: { name: string; email?: string };
  categories?: string[];
  created: Date;
  updated: Date;
}
