import { Link } from 'react-router';

const PublicNav = () => (
  <nav className="navcolor">
    <div id="logo">
      <Link to="/">My Diary</Link>
    </div>
    <div className="menu">
      <ul>
        <li>
          <Link to="/login">login</Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default PublicNav;
