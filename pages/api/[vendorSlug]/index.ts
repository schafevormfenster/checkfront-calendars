// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line import/extensions
import { getCategoriesAsCalendars } from '../../../src/checkfront/checkfrontClient';
import initVendor from '../../../src/checkfront/initVendor';
import { Vendor } from '../../../src/types/Vendor';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { vendorSlug } = req.query;
  const vendor: Vendor = initVendor(vendorSlug.toString());
  vendor.calendars = await getCategoriesAsCalendars(vendor);
  res.status(200).json({ name: 'Checkfront', ...vendor });
}
