import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import App from '../app/App';
import { makeStore } from '../app/redux/store';

/**
 * Renders the whole app at `route` with a fresh store.
 * @param {string} route
 * @param {{ preloadedState?: object }} [options]
 */
export const renderApp = (route, { preloadedState } = {}) => {
  const store = makeStore(preloadedState);
  const utils = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
  return { store, ...utils };
};
