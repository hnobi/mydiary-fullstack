import { Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import Home from './components/Home';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import AddEntry from './components/AddEntry';
import Entries from './components/Entries';
import SingleEntry from './components/SingleEntry';
import EditEntry from './components/EditEntry';
import Logout from './components/Logout';
import UserProfile from './components/UserProfile';
import RequireAuth from './components/RequireAuth';
import './assets/css/main.css';

const App = () => (
  <>
    <Toaster position="top-center" richColors />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/logout" element={<Logout />} />
      <Route element={<RequireAuth />}>
        <Route path="/add-entry" element={<AddEntry />} />
        <Route path="/entries" element={<Entries />} />
        <Route path="/entries/:entryId" element={<SingleEntry />} />
        <Route path="/entries/edit/:entryId" element={<EditEntry />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default App;
