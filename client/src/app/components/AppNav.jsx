import { Link } from 'react-router';

/**
 * Top navigation used on signed-in pages.
 * @param {{ links: { to: string, label: string }[], avatar?: string }} props
 */
const AppNav = ({ links, avatar }) => (
  <nav className="navcolor">
    <div id="logo" className="nav-logo">
      <Link to="/" style={{ display: 'flex' }} className="nav-logo">
        <img src="/assets/img/logo-small2.png" alt="logo" />
        <span> My Diary</span>
      </Link>
    </div>
    <div style={{ margin: 'auto' }} />
    <div className="menu">
      <ul>
        {links.map(({ to, label }) => (
          <li key={to} id={to === '/logout' ? 'logout' : undefined}>
            <Link to={to}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
    <Link to="/profile" id="user">
      <div className="user">
        <img
          src={avatar || '/assets/img/default-img.png'}
          alt="User"
          width="96"
          height="96"
          id="nav-img"
        />
        <span id="nav-name" />
      </div>
    </Link>
  </nav>
);

export default AppNav;
