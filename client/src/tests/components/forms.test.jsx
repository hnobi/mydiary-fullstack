import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import { api } from '../../app/services/apiRequest';
import { getAuthToken, saveAuthToken } from '../../app/services/AuthToken';
import { renderApp } from '../renderWithProviders';

const mock = new MockAdapter(api);

describe('forms', () => {
  afterEach(() => mock.reset());

  it('opening the login page clears any saved token', () => {
    saveAuthToken('old-token');
    renderApp('/login');
    expect(getAuthToken()).toBeNull();
  });

  it('logs in and goes to the add-entry page', async () => {
    const user = userEvent.setup();
    mock.onPost('/auth/signin', { username: 'hnobi', password: 'Pass1111' }).reply(200, {
      message: 'successfull login', data: { id: 1, username: 'hnobi' }, token: 'new-token'
    });
    renderApp('/login');

    await user.type(screen.getByLabelText('Username'), 'hnobi');
    await user.type(screen.getByLabelText('Password'), 'Pass1111');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByRole('heading', { name: 'Add Entry' })).toBeInTheDocument();
    expect(getAuthToken()).toBe('new-token');
  });

  it('stays on the login page when the password is wrong', async () => {
    const user = userEvent.setup();
    mock.onPost('/auth/signin').reply(400, { message: 'invalid username or password' });
    const { store } = renderApp('/login');

    await user.type(screen.getByLabelText('Username'), 'hnobi');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(store.getState().loginData.status).toBe('error'));
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('signs up and goes to the login page', async () => {
    const user = userEvent.setup();
    const body = {
      fullname: 'Hammed Noibi', email: 'h@example.com', username: 'hnobi', password: 'Pass1111'
    };
    mock.onPost('/auth/signup', body).reply(201, {
      message: 'Successfully created myDiary account', data: { id: 1, username: 'hnobi' }, token: 't'
    });
    renderApp('/signup');

    await user.type(screen.getByLabelText('Fullname'), body.fullname);
    await user.type(screen.getByLabelText('Email'), body.email);
    await user.type(screen.getByLabelText('Username'), body.username);
    await user.type(screen.getByLabelText('Password'), body.password);
    await user.click(screen.getByRole('button', { name: 'Signup' }));

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('adds an entry and shows it in the list', async () => {
    const user = userEvent.setup();
    saveAuthToken('token');
    const created = {
      id: 9, title: 'New thoughts', entry: 'something worth writing down', date: '2018-09-10T00:00:00.000Z'
    };
    mock.onPost('/entries').reply(201, { message: 'Successfully added new entry', data: created });
    mock.onGet('/entries').reply(200, { status: 'Success', entries: [created] });
    renderApp('/add-entry');

    await user.type(screen.getByLabelText('Entry title'), created.title);
    await user.type(screen.getByLabelText('Entry'), created.entry);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByRole('heading', { name: 'My Entries' })).toBeInTheDocument();
    expect(await screen.findByText('New thoughts')).toBeInTheDocument();
    expect(JSON.parse(mock.history.post[0].data)).toMatchObject({ title: created.title, entry: created.entry });
  });

  it('loads an entry into the edit form and saves changes', async () => {
    const user = userEvent.setup();
    saveAuthToken('token');
    const entry = {
      id: 3, title: 'Old title', entry: 'the original body text', date: '2018-09-10T00:00:00.000Z'
    };
    mock.onGet('/entries/3').reply(200, { data: entry });
    mock.onPut('/entries/3').reply(200, { message: 'Successfully updated  your entry', data: entry });
    renderApp('/entries/edit/3');

    const title = await screen.findByLabelText('Entry title');
    expect(title).toHaveValue('Old title');
    expect(screen.getByLabelText('Date')).toHaveValue('2018-09-10');

    await user.clear(title);
    await user.type(title, 'New title');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mock.history.put).toHaveLength(1));
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      title: 'New title', date: '2018-09-10', entry: 'the original body text'
    });
    expect(await screen.findByRole('heading', { name: 'Entry information' })).toBeInTheDocument();
  });
});
