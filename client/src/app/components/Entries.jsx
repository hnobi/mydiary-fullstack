import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import fetchEntries from '../redux/actions/entries';
import { formatDate } from '../utils/formatDate';
import AppNav from './AppNav';
import Footer from './Footer';

const preview = text => `${text.split(' ').slice(0, 4).join(' ')} . . .`;

const Entries = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allEntries: entries, loading, error } = useSelector(state => state.entries);

  useEffect(() => { dispatch(fetchEntries()); }, [dispatch]);

  let content;
  if (error) {
    content = <p role="alert">{error}</p>;
  } else if (loading && entries.length === 0) {
    content = <p>Loading entries...</p>;
  } else if (entries.length === 0) {
    content = 'There are no entries available';
  } else {
    content = (
      <table id="entries-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Title</th>
            <th>Entry</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {entries.map((item, index) => (
            <tr className="entry-row" key={item.id}>
              <td>{index + 1}</td>
              <td>{formatDate(item.date)}</td>
              <td>{item.title}</td>
              <td>{preview(item.entry)}</td>
              <td>
                <button
                  type="button"
                  className="view-button"
                  onClick={() => navigate(`/entries/${item.id}`)}
                >
                  View Entry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <AppNav links={[{ to: '/add-entry', label: 'Add Entry' }, { to: '/logout', label: 'Logout' }]} />
      <section>
        <h2 className="heading">My Entries</h2>
        {content}
      </section>
      <div className="push" />
      <Footer />
    </div>
  );
};

export default Entries;
