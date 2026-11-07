const ordinal = (day) => {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th';
  return { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] ?? 'th';
};

/**
 * Formats a date like "September 10th 2018". Uses UTC so the day matches what was picked
 * in the date input, whatever the viewer's time zone.
 * @param {string|Date} value
 * @returns {string}
 */
export const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();
  return `${month} ${day}${ordinal(day)} ${date.getUTCFullYear()}`;
};

/**
 * Converts an API date to the YYYY-MM-DD value a date input expects.
 * @param {string|Date} value
 * @returns {string}
 */
export const toInputDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};
