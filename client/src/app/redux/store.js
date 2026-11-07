import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

/**
 * Creates a store. Tests call this to get a fresh store with optional preloaded state.
 * configureStore adds redux-thunk and Redux DevTools support.
 * @param {object} [preloadedState]
 */
export const makeStore = preloadedState => configureStore({
  reducer: rootReducer,
  preloadedState,
});

const store = makeStore();

export default store;
