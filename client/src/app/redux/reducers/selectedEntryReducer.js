import {
  SET_SELECTED_ENTRY, FETCH_ENTRY_REQUEST, FETCH_ENTRY_SUCCESS, FETCH_ENTRY_FAILURE
} from '../constant/actionTypes';

const initialState = {
  currentId: 0,
  data: {},
  loading: false,
  error: null
};

const selectedEntryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_ENTRY:
      return { ...state, currentId: action.payload };
    case FETCH_ENTRY_REQUEST:
      // Clear the previous entry so it does not flash while the next one loads.
      return {
        ...state, data: {}, loading: true, error: null
      };
    case FETCH_ENTRY_SUCCESS:
      return { ...state, data: action.payload, loading: false };
    case FETCH_ENTRY_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default selectedEntryReducer;
