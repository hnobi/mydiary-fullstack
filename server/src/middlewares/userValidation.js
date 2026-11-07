import validator from 'validator';
import {
  isBlank, hasDigit, anyUndefined, respondWithErrors, missingFieldsResponse
} from './validationHelpers.js';

const PASSWORD_MIN = 8;
const PASSWORD_MESSAGE = 'password must be eight character or more';

/**
 * Validates POST /auth/signup
 */
export const signUpValidation = (req, res, next) => {
  const {
    fullname, username, email, password
  } = req.body ?? {};
  if (anyUndefined(fullname, username, email, password)) return missingFieldsResponse(res);

  const errors = {};
  if (isBlank(fullname)) errors.fullname = 'fullname  is required';
  else if (hasDigit(fullname)) errors.fullname = 'fullname  must not contain numbers';

  if (isBlank(username)) errors.username = 'username  is required';
  else if (!validator.isLength(String(username), { min: 2, max: 15 })) {
    errors.username = 'username must be between 2 to 15 characters';
  }

  if (isBlank(email)) errors.email = 'email is required';
  else if (!validator.isEmail(String(email))) errors.email = 'Enter a valid email address';

  if (isBlank(password)) errors.password = 'password  is required';
  else if (!validator.isLength(String(password), { min: PASSWORD_MIN })) {
    errors.password = PASSWORD_MESSAGE;
  }

  return respondWithErrors(res, errors, next);
};

/**
 * Validates POST /auth/signin
 */
export const signInValidation = (req, res, next) => {
  const { username, password } = req.body ?? {};
  if (anyUndefined(username, password)) return missingFieldsResponse(res);

  const errors = {};
  if (isBlank(username)) errors.username = 'username  is required';
  else if (!validator.isLength(String(username), { min: 2, max: 100 })) {
    errors.username = 'username must be between 2 to 100 characters';
  }
  if (isBlank(password)) errors.password = 'password  is required';

  return respondWithErrors(res, errors, next);
};

/**
 * Validates PUT /user/details. Every field is optional; only the ones sent are checked.
 */
export const updateProfileValidation = (req, res, next) => {
  const {
    fullname, username, email, password, reminder
  } = req.body ?? {};
  const errors = {};

  if (fullname !== undefined && (isBlank(fullname) || hasDigit(fullname))) {
    errors.fullname = 'fullname  is required and must not contain numbers';
  }
  if (username !== undefined && !validator.isLength(String(username), { min: 2, max: 15 })) {
    errors.username = 'username must be between 2 to 15 characters';
  }
  if (email !== undefined && !validator.isEmail(String(email))) {
    errors.email = 'Enter a valid email address';
  }
  if (password !== undefined && password !== ''
    && !validator.isLength(String(password), { min: PASSWORD_MIN })) {
    errors.password = PASSWORD_MESSAGE;
  }
  if (reminder !== undefined && reminder !== ''
    && !validator.isInt(String(reminder), { min: 0, max: 31 })) {
    errors.reminder = 'reminder must be a whole number of days between 0 and 31';
  }

  return respondWithErrors(res, errors, next);
};
