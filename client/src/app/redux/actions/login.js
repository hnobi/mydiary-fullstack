import { toast } from 'sonner';
import { loginRequest } from '../../services/apiRequest';
import { saveAuthToken } from '../../services/AuthToken';
import { getErrorMessage } from '../../services/errorMessage';
import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST
} from '../constant/actionTypes';

/**
 * @param {{ username: string, password: string }} data
 * @returns {Function} thunk resolving to true on success, false on failure
 */
const userLogin = data => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST });
  try {
    const response = await loginRequest(data);
    saveAuthToken(response.data.token);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: response.data });
    toast.success(response.data.message);
    return true;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch({ type: USER_LOGIN_FAILURE, payload: message });
    toast.error(message);
    return false;
  }
};

export default userLogin;
