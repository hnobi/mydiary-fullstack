import { screen } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { api } from '../../app/services/apiRequest';
import { saveAuthToken } from '../../app/services/AuthToken';
import { renderApp } from '../renderWithProviders';

const mock = new MockAdapter(api);

describe('routing', () => {
  afterEach(() => mock.reset());

  it('renders the home page', () => {
    renderApp('/');
    expect(screen.getByText('Your Online Journal Application')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get Started' })).toHaveAttribute('href', '/signup');
  });

  it.each(['/entries', '/add-entry', '/entries/1', '/entries/edit/1', '/profile'])(
    'redirects %s to the login page without a token',
    (route) => {
      renderApp(route);
      expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    }
  );

  it('sends unknown routes to the home page', () => {
    renderApp('/does-not-exist');
    expect(screen.getByText('Your Online Journal Application')).toBeInTheDocument();
  });

  it('lets a signed-in user open their entries', async () => {
    saveAuthToken('token');
    mock.onGet('/entries').reply(200, {
      status: 'Success',
      entries: [{
        id: 5, title: 'A good day', entry: 'the sun was out and it was warm', date: '2018-09-10T00:00:00.000Z'
      }]
    });

    renderApp('/entries');

    expect(await screen.findByText('A good day')).toBeInTheDocument();
    expect(screen.getByText('September 10th 2018')).toBeInTheDocument();
    expect(screen.getByText('the sun was out . . .')).toBeInTheDocument();
  });

  it('shows the empty state when there are no entries', async () => {
    saveAuthToken('token');
    mock.onGet('/entries').reply(200, { status: 'Success', entries: [] });

    renderApp('/entries');

    expect(await screen.findByText('There are no entries available')).toBeInTheDocument();
  });
});
