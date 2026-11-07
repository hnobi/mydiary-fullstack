import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import logout from '../redux/actions/logout';
import PublicNav from './PublicNav';
import Footer from './Footer';

const REDIRECT_DELAY_MS = 3000;

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    const timer = setTimeout(() => navigate('/', { replace: true }), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div className="body-image">
      <PublicNav />
      <div className="banner">
        <div className="banner-text trasparent-bg">
          <h2>Thank you for your time here</h2>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Logout;
