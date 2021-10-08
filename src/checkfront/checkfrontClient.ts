/* eslint-disable func-names */
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { findKey, forEach, forOwn, sortBy } from 'lodash';
import { Calendar } from '../types/Calendar';
import { Event } from '../types/Event';
import { Item } from '../types/Item';
import { Vendor } from '../types/Vendor';
import { defaultAddresses } from './defaultAddresses';
import { defaultOrganizer } from './defaultOrganizer';
/**
 * Retrieve a list of the available categories (tourist vendors) from checkfront api.
 * See http://api.checkfront.com/ref/category.html#get--api-3.0-category
 * @param vendor usually a serious tourist vendor or a local booking agency
 * @param categoryId usually an offering like a specific tour
 * @returns
 */
export async function getCategoriesAsCalendars(vendor: Vendor) {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : '/';

  if (!vendor) throw new Error('No vendor given');
  let apiData = null;
  const calendarData: Calendar[] = [];
  try {
    const response = await axios.get(vendor.apiUrl);
    apiData = response?.data?.category;
    if (!apiData) throw new Error('Invalid response');
  } catch (error) {
    throw new Error(`Error while fetching data from checkfront by url: ${vendor.apiUrl}`);
  }

  await forEach(apiData, function (jsonObj: any, key: number) {
    const calendarItem: Calendar = {
      uid: jsonObj.category_id,
      title: jsonObj.name,
      description: jsonObj.description?.length > 0 ? jsonObj.description : null,
      imageUrl: jsonObj?.image_url?.length > 0 ? jsonObj?.image_url : null,
      events: null,
      apiPath: `/api/${vendor.uid}/${jsonObj.category_id}`,
      apiUrl: `${baseUrl}/api/${vendor.uid}/${jsonObj.category_id}`,
      icsPath: `/api/${vendor.uid}/${jsonObj.category_id}?format=ical`,
      icsUrl: `${baseUrl}/api/${vendor.uid}/${jsonObj.category_id}?format=ical`,
    };
    calendarData.push(calendarItem);
  });

  return calendarData;
}

async function getItems(vendor: Vendor, categoryId: number) {
  if (!vendor) throw new Error('No vendor given');
  if (!categoryId) throw new Error('No vendcategoryIdr given');
  let apiData = null;
  const itemData: Item[] = [];
  const apiUrl = `https://${vendor.uid}.checkfront.com/api/3.0/item?category_id=${categoryId}`;

  try {
    const response = await axios.get(apiUrl);
    apiData = response?.data?.items;
    if (!apiData) throw new Error('Invalid response');
  } catch (error) {
    throw new Error(`Error while fetching data from checkfront by url: ${apiUrl}`);
  }

  await forEach(apiData, function (jsonObj: any, key: number) {
    const imgKey = findKey(jsonObj.image, 'url');
    const imgStr = jsonObj.image[imgKey]?.url || '';
    const item: Item = {
      uid: jsonObj.item_id,
      sku: jsonObj.sku,
      title: jsonObj.name,
      description: jsonObj?.summary || '',
      location: defaultAddresses?.[vendor.uid]?.[categoryId]?.[jsonObj.item_id] || null,
      imageUrl: imgStr || null,
    };
    itemData.push(item);
  });

  return itemData;
}

/**
 * Retrieve calendar availability for a single item (offer/tours) filtered by availability.
 * See http://api.checkfront.com/ref/item.html#get--api-3.0-item-item_id-cal
 * @param vendor
 * @param itemId
 * @returns
 */
async function getCalendarAvailability(vendor: Vendor, itemId: number) {
  //
  const now = new Date();
  now.setDate(now.getDate() + 90);
  const endDateAsString = `${now.getFullYear()}${now.getMonth()}${now.getDate()}`;
  const url = `https://${vendor.uid}.checkfront.com/api/3.0/item/${itemId}/cal?end_date=${endDateAsString}`;

  try {
    const response = await axios.get(url);
    return response?.data?.item?.cal;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieve a list of the items (offers/tours) per category (tourist vendor).
 * See http://api.checkfront.com/ref/item.html#get--api-3.0-item
 * @param vendor usually a serious tourist vendor or a local booking agency
 * @param categoryId usually an offering like a specific tour
 * @returns
 */
export async function getItemsWithAvailabilityAsEvents(vendor: Vendor, categoryId: number) {
  const items: Item[] = await getItems(vendor, categoryId);
  const eventData: Event[] = [];

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < items.length; index++) {
    const item: Item = items[index];
    const cal = await getCalendarAvailability(vendor, item.uid);
    forOwn(cal, function (value, key) {
      if (key.match(/20[0-9]\w+/)) {
        const dateStr = `${key.substr(0, 4)}-${key.substr(4, 2)}-${key.substr(6, 2)}`;
        const idStr = `checkfront-${vendor.uid}-${categoryId}-${item.uid}-${dateStr}`;
        const urlStr = `https://${vendor.uid}.checkfront.com/reserve/?category_id=${categoryId}&item_id=${item.uid}&start_date=${dateStr}`;
        const tmpEvent: Event = {
          uid: idStr,
          title: item.title,
          start: new Date(dateStr),
          cancelled: value === 0,
          availability: value,
          allday: true,
          location: item.location,
          description: item.description,
          imageUrl: item.imageUrl || null,
          bookingLink: urlStr,
          created: new Date(),
          updated: new Date(),
          organizer: {
            name: defaultOrganizer?.[vendor.uid]?.[categoryId]?.name || null,
            email: defaultOrganizer?.[vendor.uid]?.[categoryId]?.email || null,
          },
        };
        eventData.push(tmpEvent);
      }
    });
  }

  return sortBy(eventData, ['start']);
}
