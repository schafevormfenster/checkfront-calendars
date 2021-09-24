import axios from 'axios';

/**
 * Retrieve a list of the available categories (tourist vendors) from checkfront api.
 * See http://api.checkfront.com/ref/category.html#get--api-3.0-category
 * @param vendor usually a serious tourist vendor or a local booking agency
 * @param categoryId usually an offering like a specific tour
 * @returns
 */
export async function getCategories(vendor: string) {
  //
  const url = `https://${vendor}.checkfront.com/api/3.0/category`;

  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    // console.error(error);
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
export async function getItems(vendor: string, categoryId: number) {
  //
  const url = `https://${vendor}.checkfront.com/api/3.0/item?category_id=${categoryId}`;

  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}
/**
 * Retrieve calendar availability for a single item (offer/tours) filtered by availability.
 * See http://api.checkfront.com/ref/item.html#get--api-3.0-item-item_id-cal
 * @param vendor
 * @param itemId
 * @returns
 */
export async function getCalendarAvailability(vendor: string, itemId: number) {
  //
  const now = new Date();
  now.setDate(now.getDate() + 90);
  const endDateAsString = `${now.getFullYear()}${now.getMonth()}${now.getDate()}`;
  const url = `https://${vendor}.checkfront.com/api/3.0/item/${itemId}/cal?end_date=${endDateAsString}`;
  // console.log(url);
  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    // console.error(error);
    return null;
  }
}
