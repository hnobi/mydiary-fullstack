import {
  FETCH_ENTRY_REQUEST,
  FETCH_ENTRY_SUCCESS,
  FETCH_ENTRY_FAILURE
} from '../constant/actionTypes';
import { fetchEntryRequest } from '../../services/apiRequest';
import { getErrorMessage } from '../../services/errorMessage';

/**
 * @param {string|number} entryId
 */
const fetchEntry = entryId => async (dispatch) => {
  dispatch({ type: FETCH_ENTRY_REQUEST, payload: entryId });
  try {
    const response = await fetchEntryRequest(entryId);
    dispatch({ type: FETCH_ENTRY_SUCCESS, payload: response.data.data });
  } catch (error) {
    dispatch({ type: FETCH_ENTRY_FAILURE, payload: getErrorMessage(error) });
  }
};

export default fetchEntry;
