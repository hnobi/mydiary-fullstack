import { FETCH_ENTRIES_REQUEST, FETCH_ENTRIES_SUCCESS, FETCH_ENTRIES_FAILURE } from '../constant/actionTypes';
import { fetchEntriesRequest } from '../../services/apiRequest';
import { getErrorMessage } from '../../services/errorMessage';

const fetchEntries = () => async (dispatch) => {
  dispatch({ type: FETCH_ENTRIES_REQUEST });
  try {
    const response = await fetchEntriesRequest();
    dispatch({ type: FETCH_ENTRIES_SUCCESS, payload: response.data.entries ?? [] });
  } catch (error) {
    dispatch({ type: FETCH_ENTRIES_FAILURE, payload: getErrorMessage(error) });
  }
};

export default fetchEntries;
