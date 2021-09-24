// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line import/extensions
import { map, findKey, forOwn } from 'lodash';
import { getItems, getCalendarAvailability } from '../../../src/checkfront/checkfrontClient';
import { defaultAddresses } from '../../../src/checkfront/defaultAddresses';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { vendor, category } = req.query;
  const items = await getItems(vendor.toString(), parseInt(category.toString()));
  const itemIds = map(items.items, 'item_id');
  const cals: any[] = [];
  for (let index = 0; index < itemIds.length; index++) {
    const itemdId = itemIds[index];
    const item = items.items[itemdId];
    const cal = await getCalendarAvailability(vendor.toString(), itemdId);

    forOwn(cal.item.cal, function (value, key) {
      if (key.match(/20[0-9]\w+/)) {
        const dateStr = `${key.substr(0, 4)}-${key.substr(4, 2)}-${key.substr(6, 2)}`;
        const idStr = `checkfront-${vendor}-${category}-${itemdId}-${dateStr}`;
        const imgKey = findKey(item.image, 'url');
        const imgStr = item.image[imgKey];
        const urlStr = `https://${vendor}.checkfront.com/reserve/?category_id=${category}&item_id=${itemdId}&start_date=${dateStr}`;
        cals.push({
          id: idStr,
          title: item.name,
          start: new Date(dateStr),
          date: dateStr,
          cancelled: value === 0,
          availability: value,
          allday: true,
          location: defaultAddresses[category][itemdId],
          description: item.summary,
          image: imgStr.url,
          url: urlStr,
        });
      }
    });
  }

  res.status(200).json({ vendor, events: cals });
}
