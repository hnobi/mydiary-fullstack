import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import newEntry from '../redux/actions/addEntry';
import AppNav from './AppNav';

const EMPTY_FORM = { title: '', date: '', entry: '' };

const AddEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(state => state.newEntryData.loading);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await dispatch(newEntry(form))) {
      setForm(EMPTY_FORM);
      navigate('/entries');
    }
  };

  return (
    <div>
      <AppNav links={[{ to: '/entries', label: 'View Entries' }, { to: '/logout', label: 'Logout' }]} />
      <section>
        <h2 className="heading">Add Entry</h2>
        <div className="container">
          <form id="add-entry" onSubmit={handleSubmit}>
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
            <input type="submit" value="Submit" disabled={loading} />
          </form>
        </div>
      </section>
      <div className="push" />
    </div>
  );
};

export default AddEntry;
