import validator from 'validator';

export const isBlank = value => validator.isEmpty(String(value ?? ''), { ignore_whitespace: true });

export const hasDigit = value => /\d/.test(String(value));

export const anyUndefined = (...values) => values.some(value => value === undefined);

export const respondWithErrors = (res, errors, next) => {
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const missingFieldsResponse = res => res.status(400).json({
  message: 'All or some of the field is/are undefined'
});
