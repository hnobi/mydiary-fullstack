import {
  FETCH_ENTRIES_REQUEST, FETCH_ENTRIES_SUCCESS, FETCH_ENTRIES_FAILURE, NEW_ENTRY_SUCCESS
} from '../constant/actionTypes';

const initialState = {
  allEntries: [],
  loading: false,
  error: null
};

const entriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENTRIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ENTRIES_SUCCESS:
      return { ...state, loading: false, allEntries: [...action.payload] };
    case FETCH_ENTRIES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case NEW_ENTRY_SUCCESS:
      return { ...state, allEntries: [action.payload.data, ...state.allEntries] };
    default:
      return state;
  }
};

export default entriesReducer;
