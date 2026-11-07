import { formatDate, toInputDate } from '../../app/utils/formatDate';

describe('formatDate', () => {
  it.each([
    ['2018-09-10T00:00:00.000Z', 'September 10th 2018'],
    ['2018-05-01T00:00:00.000Z', 'May 1st 2018'],
    ['2018-05-02T00:00:00.000Z', 'May 2nd 2018'],
    ['2018-05-03T00:00:00.000Z', 'May 3rd 2018'],
    ['2018-05-11T00:00:00.000Z', 'May 11th 2018'],
    ['2018-05-22T00:00:00.000Z', 'May 22nd 2018'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatDate(input)).toBe(expected);
  });

  it('returns an empty string for missing or invalid dates', () => {
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('not a date')).toBe('');
  });
});

describe('toInputDate', () => {
  it('returns YYYY-MM-DD', () => {
    expect(toInputDate('2018-09-10T00:00:00.000Z')).toBe('2018-09-10');
    expect(toInputDate('')).toBe('');
  });
});
