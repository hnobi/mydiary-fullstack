import MockAdapter from 'axios-mock-adapter';
import { api } from '../../app/services/apiRequest';
import { getAuthToken } from '../../app/services/AuthToken';
import { NETWORK_ERROR_MESSAGE } from '../../app/services/errorMessage';
import { makeStore } from '../../app/redux/store';
import userLogin from '../../app/redux/actions/login';

const mock = new MockAdapter(api);

describe('userLogin', () => {
  afterEach(() => mock.reset());

  const credentials = { username: 'hammed', password: 'Pass1111' };

  it('stores the user and token on success', async () => {
    mock.onPost('/auth/signin', credentials).reply(200, {
      status: 'Success',
      message: 'successfull login',
      data: { id: 7, username: 'hammed', email: 'h@example.com' },
      token: 'jwt-token'
    });
    const store = makeStore();

    await expect(store.dispatch(userLogin(credentials))).resolves.toBe(true);

    expect(getAuthToken()).toBe('jwt-token');
    expect(store.getState().loginData).toMatchObject({ loading: false, status: 'success', token: 'jwt-token' });
    expect(store.getState().authenticatedUser).toMatchObject({ userId: 7, token: 'jwt-token' });
  });

  it('records the API error message on failure', async () => {
    mock.onPost('/auth/signin').reply(400, { status: 'Failed', message: 'invalid username or password' });
    const store = makeStore();

    await expect(store.dispatch(userLogin(credentials))).resolves.toBe(false);

    expect(getAuthToken()).toBeNull();
    expect(store.getState().loginData).toMatchObject({ loading: false, status: 'error' });
  });

  it('handles a network failure', async () => {
    mock.onPost('/auth/signin').networkError();
    const store = makeStore();
    const dispatched = [];
    const unsubscribe = store.subscribe(() => dispatched.push(store.getState().loginData.status));

    await expect(store.dispatch(userLogin(credentials))).resolves.toBe(false);
    unsubscribe();

    expect(dispatched.at(-1)).toBe('error');
  });
});

describe('getErrorMessage', async () => {
  const { getErrorMessage } = await import('../../app/services/errorMessage');

  it('prefers the API message, then the first validation error, then the network message', () => {
    expect(getErrorMessage({ response: { data: { message: 'nope' } } })).toBe('nope');
    expect(getErrorMessage({ response: { data: { errors: { title: 'bad title' } } } })).toBe('bad title');
    expect(getErrorMessage(new Error('Network Error'))).toBe(NETWORK_ERROR_MESSAGE);
  });
});
