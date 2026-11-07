export const NETWORK_ERROR_MESSAGE = 'An unexpected error occured. please check your internet connection and try again';

/**
 * Turns an axios error into the message to show the user.
 * Uses the API's `message`, else the first validation error, else a network message.
 * @param {unknown} error
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (!error?.response) return NETWORK_ERROR_MESSAGE;
  const { message, errors } = error.response.data ?? {};
  if (message) return message;
  if (errors && Object.keys(errors).length) return Object.values(errors)[0];
  return 'Something went wrong. Please try again';
};
