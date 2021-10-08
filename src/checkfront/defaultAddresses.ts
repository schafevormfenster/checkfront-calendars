export interface DefaultAddress {
  vendor: string;
  category: number;
  item: number;
  address: string;
}

// eslint-disable-next-line import/prefer-default-export
export const defaultAddresses: DefaultAddress[] = [
  {
    vendor: 'localtour',
    category: 97,
    item: 136,
    address: 'Alpaka Idylle, Anklamer Chaussee 4, 17390 Rubkow',
  },
  {
    vendor: 'localtour',
    category: 140,
    item: 245,
    address: 'Seminar- und Landhaus Schönbeck, Neu Schönbeck, Schönbeck',
  },
  {
    vendor: 'localtour',
    category: 57,
    item: 91,
    address: 'Lübser Landstraße 13, 17375 Mönkebude',
  },
  {
    vendor: 'localtour',
    category: 57,
    item: 92,
    address: 'Lübser Landstraße 13, 17375 Mönkebude',
  },
  {
    vendor: 'localtour',
    category: 2,
    item: 2,
    address: 'Hafengasse, 17375 Altwarp',
  },
];
