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
];
