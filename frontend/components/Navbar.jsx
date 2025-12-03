// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Smart Yojana Advisor</Link>
      <span style={{ marginLeft: '1rem' }}>
        <Link to="/">Home</Link>
      </span>
      {user ? (
        <>
          <span style={{ marginLeft: '1rem' }}>
            <Link to="/dashboard">Dashboard</Link>
          </span>
          <button
            style={{ marginLeft: '1rem' }}
            onClick={logout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <span style={{ marginLeft: '1rem' }}>
            <Link to="/login">Login</Link>
          </span>
          <span style={{ marginLeft: '1rem' }}>
            <Link to="/register">Register</Link>
          </span>
        </>
      )}
    </nav>
  );
};

export default Navbar;
