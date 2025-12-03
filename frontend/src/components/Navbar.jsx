import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Smart Yojana Advisor
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-600">Home</Link>

        {user && (
          <>
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/eligibility" className="hover:text-blue-600">Check Eligibility</Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
