import { Navigate, Outlet } from 'react-router';
import { getAuthToken } from '../services/AuthToken';

/** Route guard: sends visitors without a saved token to /login. */
const RequireAuth = () => (getAuthToken() ? <Outlet /> : <Navigate to="/login" replace />);

export default RequireAuth;
