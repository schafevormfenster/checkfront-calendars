import { Vendor } from '../types/Vendor';

const initVendor = (vendorSlug: string): Vendor => {
  return {
    uid: vendorSlug.toString(),
    title: vendorSlug.toString(),
    description: null,
    apiUrl: `https://${vendorSlug}.checkfront.com/api/3.0/category`,
    calendars: null,
  };
};

export default initVendor;
