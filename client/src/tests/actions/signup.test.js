import MockAdapter from 'axios-mock-adapter';
import { api } from '../../app/services/apiRequest';
import { makeStore } from '../../app/redux/store';
import userSignup from '../../app/redux/actions/signUp';

const mock = new MockAdapter(api);

describe('userSignup', () => {
  afterEach(() => mock.reset());

  const data = {
    fullname: 'hammed', username: 'hammed', email: 'email@wss.com', password: 'Pass1111'
  };

  it('saves the new account on success', async () => {
    mock.onPost('/auth/signup', data).reply(201, {
      status: 'Success',
      message: 'Successfully created myDiary account',
      data: { id: 1, username: 'hammed', email: 'email@wss.com' },
      token: 'jwt'
    });
    const store = makeStore();

    await expect(store.dispatch(userSignup(data))).resolves.toBe(true);
    expect(store.getState().signupData).toMatchObject({
      loading: false, status: 'success', data: { username: 'hammed' }
    });
  });

  it('marks the signup as failed on a 409', async () => {
    mock.onPost('/auth/signup').reply(409, { status: 'Failed', message: 'User already exist' });
    const store = makeStore();

    await expect(store.dispatch(userSignup(data))).resolves.toBe(false);
    expect(store.getState().signupData).toMatchObject({ loading: false, status: 'error' });
  });

  it('marks the signup as failed on a network error', async () => {
    mock.onPost('/auth/signup').networkError();
    const store = makeStore();

    await expect(store.dispatch(userSignup(data))).resolves.toBe(false);
    expect(store.getState().signupData.status).toBe('error');
  });
});
