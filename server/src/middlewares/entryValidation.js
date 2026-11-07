import validator from 'validator';
import {
  isBlank, hasDigit, anyUndefined, respondWithErrors, missingFieldsResponse
} from './validationHelpers.js';

const checkEntryText = (entry, errors) => {
  if (!validator.isLength(String(entry), { min: 10, max: 500 })) {
    errors.entry = 'Diary entry provided must be between 10 to 500 characters';
  }
};

/**
 * Validates POST /entries
 */
export const addEntryValidation = (req, res, next) => {
  const { title, entry } = req.body ?? {};
  if (anyUndefined(title, entry)) return missingFieldsResponse(res);

  const errors = {};
  if (isBlank(title)) errors.title = 'Title of entry is required';
  else if (hasDigit(title)) errors.title = 'Entry title must not contain numbers';

  if (isBlank(entry)) errors.entry = 'Diary entry is required';
  else checkEntryText(entry, errors);

  return respondWithErrors(res, errors, next);
};

/**
 * Validates PUT /entries/:entryId
 */
export const modifyEntryValidation = (req, res, next) => {
  const { title, entry, date } = req.body ?? {};
  if (anyUndefined(title, entry, date)) return missingFieldsResponse(res);

  const errors = {};
  if (title && hasDigit(title)) errors.title = 'Entry title must not contain numbers';
  if (entry) checkEntryText(entry, errors);

  return respondWithErrors(res, errors, next);
};

/**
 * Rejects non-numeric :entryId params with a 404 instead of a database error.
 */
export const entryIdParam = (req, res, next) => {
  if (!/^\d+$/.test(req.params.entryId)) {
    return res.status(404).json({ status: 'Failed', message: 'Entry not found' });
  }
  next();
};
