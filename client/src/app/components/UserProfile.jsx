import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import getUserProfile from '../redux/actions/userProfile';
import { getErrorMessage } from '../services/errorMessage';
import AppNav from './AppNav';
import Footer from './Footer';

// Shows the signed-in user's details. Saving changes and uploading a picture are not
// wired up yet, although the API supports both (PUT /user/details, PUT /user/upload).
const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userProfile.data);

  useEffect(() => {
    dispatch(getUserProfile()).catch(error => toast.error(getErrorMessage(error)));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info('Saving profile changes is not available yet');
  };

  return (
    <div>
      <AppNav
        avatar={user.image}
        links={[
          { to: '/add-entry', label: 'Add Entry' },
          { to: '/entries', label: 'My Entries' },
          { to: '/logout', label: 'Logout' }
        ]}
      />
      <section>
        <div>
          <h2 className="heading">User Account</h2>
          <p>Modify your account details</p>
        </div>
        <main id="user-details">
          <div className="profile_picx" style={{ margin: '30px auto' }}>
            <img alt="profile" id="user-image" src={user.image || '/assets/img/default-img.png'} />
            <form id="update-image">
              <input type="file" id="image" accept="image/*" />
            </form>
          </div>
          <div className="container">
            {/* key remounts the form so the defaults update once the profile loads */}
            <form id="update-user" key={user.id ?? 'loading'} onSubmit={handleSubmit}>
              <label htmlFor="fullname">Name</label>
              <input type="text" id="fullname" name="fullname" defaultValue={user.fullname} />
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" defaultValue={user.email} disabled />
              <label htmlFor="username">Diarys name</label>
              <input type="text" id="username" name="username" defaultValue={user.username} />
              <label htmlFor="reminder">Reminder setting (days)</label>
              <input type="number" min="0" max="31" id="reminder" name="reminder" defaultValue={user.reminder} />
              <label htmlFor="password">Change password</label>
              <input
                type="password"
                id="password"
                name="password"
                pattern="(?=.*[0-9])(?=.*[a-zA-Z]).{8,12}"
                title="Password must contain atleast one number and one letter and must be between 8 to 12 characters "
                placeholder="Leave blank to keep your current password"
              />
              <input type="submit" value="Save changes" />
            </form>
          </div>
        </main>
      </section>
      <div className="push" />
      <Footer />
    </div>
  );
};

export default UserProfile;
