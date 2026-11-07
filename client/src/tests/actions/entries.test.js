import MockAdapter from 'axios-mock-adapter';
import { api } from '../../app/services/apiRequest';
import { saveAuthToken } from '../../app/services/AuthToken';
import { makeStore } from '../../app/redux/store';
import fetchEntries from '../../app/redux/actions/entries';
import newEntry from '../../app/redux/actions/addEntry';

const mock = new MockAdapter(api);

describe('entry actions', () => {
  afterEach(() => mock.reset());

  it('sends the saved token in the x-access-token header, not the URL', async () => {
    saveAuthToken('secret-token');
    mock.onGet('/entries').reply((config) => {
      expect(config.headers['x-access-token']).toBe('secret-token');
      expect(config.url).not.toContain('token=');
      return [200, { status: 'Success', entries: [{ id: 1, title: 'first' }] }];
    });
    const store = makeStore();

    await store.dispatch(fetchEntries());

    expect(store.getState().entries).toMatchObject({
      loading: false, error: null, allEntries: [{ id: 1, title: 'first' }]
    });
  });

  it('stores the error when fetching fails', async () => {
    mock.onGet('/entries').reply(401, { message: 'Authentication failed. Token is either invalid or expired' });
    const store = makeStore();

    await store.dispatch(fetchEntries());

    expect(store.getState().entries.error).toBe('Authentication failed. Token is either invalid or expired');
  });

  it('prepends a newly added entry to the list', async () => {
    mock.onPost('/entries').reply(201, {
      status: 'Success', message: 'Successfully added new entry', data: { id: 2, title: 'second' }
    });
    const store = makeStore({ entries: { allEntries: [{ id: 1, title: 'first' }], loading: false, error: null } });

    await expect(store.dispatch(newEntry({ title: 'second', entry: 'some text here' }))).resolves.toBe(true);

    expect(store.getState().entries.allEntries.map(e => e.id)).toEqual([2, 1]);
  });

  it('reports the first validation error when adding fails', async () => {
    mock.onPost('/entries').reply(400, { errors: { title: 'Entry title must not contain numbers' } });
    const store = makeStore();

    await expect(store.dispatch(newEntry({ title: '3rd', entry: 'x' }))).resolves.toBe(false);
    expect(store.getState().newEntryData).toMatchObject({
      status: 'error', message: 'Entry title must not contain numbers'
    });
  });
});
