/* eslint-disable no-restricted-syntax */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { EventAttributes } from 'ics';
import { getItemsWithAvailabilityAsEvents } from '../../../src/checkfront/checkfrontClient';
// eslint-disable-next-line import/extensions

import initVendor from '../../../src/checkfront/initVendor';
import { Calendar } from '../../../src/types/Calendar';
import { Vendor } from '../../../src/types/Vendor';
import { Event } from '../../../src/types/Event';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ics = require('ics');

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { format = 'json', vendorSlug, categorySlug } = req.query;
  const vendor: Vendor = initVendor(vendorSlug.toString());
  const categoryId: number = parseInt(categorySlug.toString(), 2);
  const events: Event[] = await getItemsWithAvailabilityAsEvents(vendor, categoryId);

  const calendar: Calendar = {
    uid: `checkfront-${vendor.uid}-${categoryId}`,
    title: '',
    description: null,
    imageUrl: null,
    jsonPath: '',
    jsonUrl: null,
    icsPath: '',
    icsUrl: null,
    events: [],
  };

  calendar.events = events;

  if (format === 'ical') {
    const icsEvents: EventAttributes[] = [];
    // eslint-disable-next-line guard-for-in
    for (const index in events) {
      const tmpEvent: Event = events[index];
      const tmpEndDate: Date = tmpEvent.end
        ? tmpEvent.end
        : new Date(new Date(tmpEvent.start).setMinutes(tmpEvent.start.getMinutes() + 30));
      const tmpLink = tmpEvent.bookingLink
        ? `<p><a href="${tmpEvent.bookingLink}" target="_blank">Jetzt buchen</a></p>`
        : '';
      const tmpDescription = tmpEvent.imageUrl
        ? `<p><img src="${tmpEvent.imageUrl}" /></p>${tmpEvent.description}${tmpLink}`
        : `${tmpEvent.description}${tmpLink}`;

      const tmpIcsEvent: EventAttributes = {
        uid: tmpEvent.uid,
        start: [
          tmpEvent.start.getFullYear(),
          tmpEvent.start.getMonth() + 1,
          tmpEvent.start.getDate(),
          tmpEvent.start.getHours(),
          tmpEvent.start.getMinutes(),
        ],
        startInputType: 'local',
        end: [
          tmpEndDate.getFullYear(),
          tmpEndDate.getMonth() + 1,
          tmpEndDate.getDate(),
          tmpEndDate.getHours(),
          tmpEndDate.getMinutes(),
        ],
        endInputType: 'local',
        title: tmpEvent.title,
        description: tmpDescription,
        location: tmpEvent.location,
        created: [
          tmpEvent.created.getFullYear(),
          tmpEvent.created.getMonth() + 1,
          tmpEvent.created.getDate(),
          tmpEvent.created.getHours(),
          tmpEvent.created.getMinutes(),
        ],
        lastModified: [
          tmpEvent.updated.getFullYear(),
          tmpEvent.updated.getMonth() + 1,
          tmpEvent.updated.getDate(),
          tmpEvent.updated.getHours(),
          tmpEvent.updated.getMinutes(),
        ],
      };
      icsEvents.push(tmpIcsEvent);
    }

    const icsBody = ics.createEvents(icsEvents);

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/calendar; charset=utf8');
    // res.setHeader('Content-Type', 'text/plain; charset=utf8');
    res.status(200).send(icsBody.value);
  } else {
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).json({ name: 'Checkfront', ...calendar });
  }
}
