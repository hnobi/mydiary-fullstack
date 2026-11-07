import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import userLogin from '../redux/actions/login';
import logout from '../redux/actions/logout';
import Spinner from './Spinner';
import Footer from './Footer';
import '../assets/css/form.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(state => state.loginData.loading);
  const [form, setForm] = useState({ username: '', password: '' });

  // Opening the login page signs out whoever was signed in.
  useEffect(() => { dispatch(logout()); }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await dispatch(userLogin(form))) navigate('/add-entry');
  };

  return (
    <div>
      <nav>
        <div id="logo">
          <Link to="/signup">Login</Link>
        </div>
      </nav>
      <main>
        <h2>Sign in</h2>
        <div className="Sign-in-out">
          <form id="signin" onSubmit={handleSubmit}>
            <label className="label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="username"
              required
              onChange={handleChange}
              value={form.username}
            />

            <label className="label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="secret password"
              required
              onChange={handleChange}
              value={form.password}
            />
            <button type="submit" className={loading ? 'loading' : ''} disabled={loading}>
              {loading ? <Spinner /> : 'Login'}
            </button>
          </form>
          <p>
            dont have an Account ? <Link to="/signup"> Sign up</Link>
          </p>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default LoginForm;
