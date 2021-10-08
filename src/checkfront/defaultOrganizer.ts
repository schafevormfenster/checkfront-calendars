// eslint-disable-next-line import/prefer-default-export

export interface DefaultOrganizer {
  vendor: string;
  category: number;
  name: string;
  email: string;
}

// eslint-disable-next-line import/prefer-default-export
export const defaultOrganizers: DefaultOrganizer[] = [
  {
    vendor: 'localtour',
    category: 97,
    name: 'Alpaka Idylle Hasener',
    email: 'erlebnis@alpaka-idylle.de',
  },
  {
    vendor: 'localtour',
    category: 57,
    name: 'Wildbeobachtung mit dem Förster',
    email: 'info@localtour.de',
  },
  {
    vendor: 'localtour',
    category: 140,
    name: 'Seminar- und Landhaus Schönbeck',
    email: 'szeszkat1@gmx.de',
  },
];
