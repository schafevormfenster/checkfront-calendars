// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line import/extensions
import { getCategories } from '../../../src/checkfront/checkfrontClient';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { vendor } = req.query;

  console.log(vendor);

  const categories = await getCategories(vendor.toString());
  console.log(categories);

  // const debug = JSON.stringify(json).toString();
  res.status(200).json({ vendor, categories: categories.category });
}
