import { combineReducers } from 'redux';
import signupReducer from './signupReducer';
import loginReducer from './loginReducer';
import newEntryReducer from './newEntryReducer';
import authenticatedUserReducer from './authenticatedUserReducer';
import entriesReducer from './entriesReducer';
import selectedEntryReducer from './selectedEntryReducer';
import updateEntryReducer from './updateEntryReducer';
import userProfileReducer from './userDetailsReducer';
import { USER_LOGOUT } from '../constant/actionTypes';

const appReducer = combineReducers({
  signupData: signupReducer,
  loginData: loginReducer,
  newEntryData: newEntryReducer,
  authenticatedUser: authenticatedUserReducer,
  entries: entriesReducer,
  selectedEntry: selectedEntryReducer,
  updateEntryData: updateEntryReducer,
  userProfile: userProfileReducer
});

// Logging out clears everything so the next user never sees the previous user's data.
const rootReducer = (state, action) => appReducer(
  action.type === USER_LOGOUT ? undefined : state,
  action
);

export default rootReducer;
