import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';
import fetchEntry from '../redux/actions/viewEntry';
import { formatDate } from '../utils/formatDate';
import AppNav from './AppNav';
import Footer from './Footer';

const SingleEntry = () => {
  const dispatch = useDispatch();
  const { entryId } = useParams();
  const { data: entry, loading, error } = useSelector(state => state.selectedEntry);

  useEffect(() => { dispatch(fetchEntry(entryId)); }, [dispatch, entryId]);

  let content;
  if (error) {
    content = <p role="alert">{error}</p>;
  } else if (loading || !entry.id) {
    content = <p>Loading entry...</p>;
  } else {
    content = (
      <div className="container view-entry">
        <div className="title">
          <h3>Entry title</h3>
          <p id="title">{entry.title}</p>
        </div>
        <h3>Entry</h3>
        <div className="entry">
          <p id="content">{entry.entry}</p>
        </div>
        <div className="date">
          <h3>Posted : </h3>
          <p id="date">{formatDate(entry.date)}</p>
        </div>
        <div
          className="div"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            margin: 'auto'
          }}
        >
          <Link to={`/entries/edit/${entry.id}`}>
            <button type="button" className="edit edit-btn">edit</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="body-image">
      <AppNav links={[{ to: '/entries', label: 'View Entries' }, { to: '/logout', label: 'Logout' }]} />
      <section>
        <h2 className="heading">Entry information</h2>
        {content}
      </section>
      <div className="push" />
      <Footer />
    </div>
  );
};

export default SingleEntry;
