import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import fetchEntry from '../redux/actions/viewEntry';
import { updateEntry } from '../redux/actions/updateEntry';
import { toInputDate } from '../utils/formatDate';
import AppNav from './AppNav';
import Footer from './Footer';

const EditEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { entryId } = useParams();
  const { data: entry, error } = useSelector(state => state.selectedEntry);
  const saving = useSelector(state => state.updateEntryData.loading);
  const [form, setForm] = useState(null);

  useEffect(() => { dispatch(fetchEntry(entryId)); }, [dispatch, entryId]);

  // Fill the form once the requested entry has loaded.
  const loadedEntry = String(entry.id) === String(entryId) ? entry : null;
  if (loadedEntry && form === null) {
    setForm({
      title: loadedEntry.title,
      date: toInputDate(loadedEntry.date),
      entry: loadedEntry.entry
    });
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await dispatch(updateEntry({ ...form, entryId }))) navigate(`/entries/${entryId}`);
  };

  let content;
  if (error) {
    content = <p role="alert">{error}</p>;
  } else if (!form) {
    content = <p>Loading entry...</p>;
  } else {
    content = (
      <div className="container">
        <form id="modify-entry" onSubmit={handleSubmit}>
          <label htmlFor="title">Entry title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Your title..."
            required
            onChange={handleChange}
            value={form.title}
          />
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            onChange={handleChange}
            value={form.date}
          />
          <label htmlFor="entry">Entry</label>
          <textarea
            id="entry"
            name="entry"
            placeholder="Your entry..."
            maxLength="500"
            minLength="10"
            rows="20"
            required
            onChange={handleChange}
            value={form.entry}
          />
          <input type="submit" value="Submit" disabled={saving} />
        </form>
      </div>
    );
  }

  return (
    <div>
      <AppNav links={[{ to: '/entries', label: 'View Entries' }, { to: '/logout', label: 'Logout' }]} />
      <section>
        <h2 className="heading">Modify Entry</h2>
        {content}
      </section>
      <div className="push" />
      <Footer />
    </div>
  );
};

export default EditEntry;
