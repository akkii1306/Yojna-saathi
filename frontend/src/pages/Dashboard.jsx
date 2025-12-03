// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    age: "",
    occupation: "",
    income: "",
    gender: "",
    category: "",
    state: user?.state || "",
  });
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  // optional: load all schemes initially
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get("/schemes");
        setSchemes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/schemes/recommend", profile);
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
            Hi, {user?.name}
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            Fill your details to get better Yojana recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-[1.1fr,1.6fr] gap-6 md:gap-8">
          {/* Left: Profile / Eligibility Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Eligibility Profile
            </h3>
            <form onSubmit={handleRecommend} className="space-y-3 text-xs md:text-sm">
              <div>
                <label className="block mb-1 text-slate-700">Age</label>
                <input
                  name="age"
                  type="number"
                  value={profile.age}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 21"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Occupation</label>
                <select
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select occupation</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="women">Women (entrepreneur / self-employed)</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="business">Business / MSME</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">Monthly Income</label>
                <select
                  name="income"
                  value={profile.income}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select income range</option>
                  <option value="<10000">Below ₹10,000</option>
                  <option value="10000-25000">₹10,000 – ₹25,000</option>
                  <option value="25000-50000">₹25,000 – ₹50,000</option>
                  <option value=">50000">Above ₹50,000</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-700">Category</label>
                  <select
                    name="category"
                    value={profile.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="ews">EWS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700">State</label>
                <input
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Bihar"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-md bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Finding schemes..." : "Get Recommendations"}
              </button>
            </form>
          </div>

          {/* Right: Recommended Schemes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Recommended Schemes
              </h3>
              <span className="text-[11px] text-slate-500">
                {schemes.length} result(s)
              </span>
            </div>

            {schemes.length === 0 ? (
              <p className="text-xs md:text-sm text-slate-500">
                No schemes found for the current filters. Try adjusting your details or
                check back later.
              </p>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {schemes.map((s) => (
                  <div
                    key={s._id}
                    className="border border-slate-200 rounded-lg p-3 hover:border-indigo-300 transition-colors"
                  >
                    <h4 className="text-sm font-semibold text-slate-900">
                      {s.title}
                    </h4>
                    {s.state && (
                      <p className="text-[11px] text-slate-500 mb-1">
                        State:{" "}
                        <span className="font-medium text-slate-600">
                          {s.state}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-slate-600 line-clamp-3 mb-1">
                      {s.description}
                    </p>
                    {s.applyLink && (
                      <a
                        href={s.applyLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex mt-1 text-[11px] text-indigo-600 hover:text-indigo-700 underline"
                      >
                        Official apply / details
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
