import { Link } from 'react-router';
import PublicNav from './PublicNav';
import Footer from './Footer';

const Home = () => (
  <div className="body-image">
    <PublicNav />
    <div className="banner">
      <div className="banner-text trasparent-bg">
        <h2>Your Online Journal Application</h2>
        <p>Pen down your thoughts and feelings on the go.</p>
        <Link to="/signup">
          <button type="button" className="submit-btn">Get Started</button>
        </Link>
      </div>
    </div>
    <Footer />
  </div>
);

export default Home;
