import { toast } from 'sonner';
import { NEW_ENTRY_REQUEST, NEW_ENTRY_FAILURE, NEW_ENTRY_SUCCESS } from '../constant/actionTypes';
import { newEntryRequest } from '../../services/apiRequest';
import { getErrorMessage } from '../../services/errorMessage';

/**
 * @param {{ title: string, date?: string, entry: string }} data
 * @returns {Function} thunk resolving to true on success, false on failure
 */
const newEntry = data => async (dispatch) => {
  dispatch({ type: NEW_ENTRY_REQUEST });
  try {
    const response = await newEntryRequest(data);
    dispatch({ type: NEW_ENTRY_SUCCESS, payload: response.data });
    toast.success(response.data.message);
    return true;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch({ type: NEW_ENTRY_FAILURE, payload: message });
    toast.error(message);
    return false;
  }
};

export default newEntry;
