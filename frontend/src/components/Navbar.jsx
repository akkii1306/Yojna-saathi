// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-semibold text-indigo-600 tracking-tight"
        >
          Smart Yojana Advisor
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-md bg-rose-500 text-white hover:bg-rose-600 text-xs md:text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-xs md:text-sm transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
