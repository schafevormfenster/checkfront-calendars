/**
 * Event.
 */
export interface Event {
  uid: string;
  title: string;
  description?: string;
  link?: string;
  start: Date;
  end?: Date;
  allday?: boolean;
  cancelled?: boolean;
  location: string;
  attachment?: {
    url: string;
    title?: string;
  };
  organizer: { name: string; email?: string };
  categories?: string[];
  created: Date;
  updated: Date;
}
