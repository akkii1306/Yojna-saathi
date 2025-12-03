// frontend/src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-indigo-50 via-slate-50 to-sky-50">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Find the <span className="text-indigo-600">right government schemes</span>{" "}
            for you, in one place.
          </h1>
          <p className="text-slate-600 mb-6 text-sm md:text-base">
            Smart Yojana Advisor helps you discover schemes based on your age,
            income, location, and occupation – with a simple, guided experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center px-4 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2.5 rounded-md border border-slate-300 text-sm font-medium text-slate-700 hover:bg-white"
              >
                Already have an account?
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl border border-slate-200 p-5 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3">
            How it works
          </h2>
          <ol className="space-y-3 text-sm text-slate-700">
            <li>
              <span className="font-semibold text-indigo-600">1.</span> Create your
              profile with basic details like age, income, and state.
            </li>
            <li>
              <span className="font-semibold text-indigo-600">2.</span> Get a list of
              central and state schemes you may be eligible for.
            </li>
            <li>
              <span className="font-semibold text-indigo-600">3.</span> View required
              documents, benefits, and official apply links.
            </li>
          </ol>
          <p className="mt-4 text-xs text-slate-500">
            Designed for students, farmers, women, entrepreneurs, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
