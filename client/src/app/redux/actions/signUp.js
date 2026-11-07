import { toast } from 'sonner';
import { signUpRequest } from '../../services/apiRequest';
import { getErrorMessage } from '../../services/errorMessage';
import {
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAILURE,
  USER_SIGNUP_REQUEST
} from '../constant/actionTypes';

/**
 * @param {{ fullname: string, username: string, email: string, password: string }} data
 * @returns {Function} thunk resolving to true on success, false on failure
 */
const userSignup = data => async (dispatch) => {
  dispatch({ type: USER_SIGNUP_REQUEST });
  try {
    const response = await signUpRequest(data);
    dispatch({ type: USER_SIGNUP_SUCCESS, payload: response.data });
    toast.success(response.data.message);
    return true;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch({ type: USER_SIGNUP_FAILURE, payload: message });
    toast.error(message);
    return false;
  }
};

export default userSignup;
