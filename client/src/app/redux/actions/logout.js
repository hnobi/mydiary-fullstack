import { removeAuthToken } from '../../services/AuthToken';
import { USER_LOGOUT } from '../constant/actionTypes';

const logout = () => (dispatch) => {
  removeAuthToken();
  dispatch({ type: USER_LOGOUT });
};

export default logout;
