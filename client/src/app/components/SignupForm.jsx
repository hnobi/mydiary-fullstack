import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import userSignup from '../redux/actions/signUp';
import Spinner from './Spinner';
import '../assets/css/form.css';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(state => state.signupData.loading);
  const [form, setForm] = useState({
    fullname: '', email: '', username: '', password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await dispatch(userSignup(form))) navigate('/login');
  };

  return (
    <div>
      <nav>
        <div id="logo">
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <main>
        <h2>Sign up</h2>
        <div className="Sign-in-out">
          <form id="signup" onSubmit={handleSubmit}>
            <p>
              Already have an Account ?<Link to="/login">Sign in</Link>
            </p>
            <label className="label" htmlFor="fullname">Fullname</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Your fullname..."
              required
              onChange={handleChange}
              value={form.fullname}
            />
            <label className="label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address..."
              required
              onChange={handleChange}
              value={form.email}
            />

            <label className="label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder=" username..."
              required
              pattern="[A-Za-z0-9]{2,15}"
              title="Username may only contain letters or numbers and must be between 2 and 15 characters"
              onChange={handleChange}
              value={form.username}
            />

            <label className="label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              pattern="(?=.*[0-9])(?=.*[a-zA-Z]).{8,12}"
              title="Password must contain atleast one number and one letter and must be between 8 to 12 characters "
              required
              onChange={handleChange}
              value={form.password}
            />

            <button type="submit" className={loading ? 'loading' : ''} disabled={loading}>
              {loading ? <Spinner /> : 'Signup'}
            </button>
          </form>
        </div>
        <div className="push" />
      </main>
      <p className="footer">
        copyright © 2018. &nbsp;MyDiary @ Andela.&nbsp; By &nbsp;
        <small>Hammed Noibi.</small>
      </p>
    </div>
  );
};

export default SignupForm;
