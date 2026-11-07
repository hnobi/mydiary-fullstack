import { FETCH_USER_PROFILE_SUCCESS } from '../constant/actionTypes';
import { fetchUserProfile } from '../../services/apiRequest';

const getUserProfile = () => async (dispatch) => {
  const response = await fetchUserProfile();
  dispatch({
    type: FETCH_USER_PROFILE_SUCCESS,
    userDatails: response.data.data
  });
};

export default getUserProfile;
