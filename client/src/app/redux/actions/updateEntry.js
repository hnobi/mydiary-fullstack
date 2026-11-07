import { toast } from 'sonner';
import {
  UPDATE_ENTRY_SAVE_INPUT,
  UPDATE_ENTRY_REQUEST,
  UPDATE_ENTRY_SUCCESS,
  UPDATE_ENTRY_FAILURE
} from '../constant/actionTypes';
import { updateEntryRequest } from '../../services/apiRequest';
import { getErrorMessage } from '../../services/errorMessage';

/**
 * @param {{ entryId: string|number, title: string, date: string, entry: string }} data
 * @returns {Function} thunk resolving to true on success, false on failure
 */
const updateEntry = data => async (dispatch) => {
  dispatch({ type: UPDATE_ENTRY_REQUEST });
  try {
    const response = await updateEntryRequest(data);
    dispatch({ type: UPDATE_ENTRY_SUCCESS, payload: response.data.message });
    toast.success('Successfully updated');
    return true;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch({ type: UPDATE_ENTRY_FAILURE, payload: message });
    toast.error(message);
    return false;
  }
};

const saveUpdateInput = (field, value) => ({
  type: UPDATE_ENTRY_SAVE_INPUT,
  payload: { field, value }
});

export { saveUpdateInput, updateEntry };
