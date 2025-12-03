// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
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

  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState([]);

  // Load all schemes initially (optional)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get("/schemes");
        setSchemes(res.data);
      } catch (err) {
        console.error("Error fetching all schemes", err);
      }
    };

    fetchAll();
  }, []);

  // Input Handler
  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit Handler → AI Recommendations
  const handleRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/schemes/recommend", profile);
      setSchemes(res.data); // AI recommended schemes
    } catch (err) {
      console.error("Recommendation error:", err);
      alert("AI failed to recommend. Check backend logs.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50 py-6">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Hello, {user?.name}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Fill your details for smart Yojana recommendations.
        </p>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-[1.1fr,1.7fr] gap-6">

          {/* LEFT CARD — ELIGIBILITY FORM */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <h2 classname="text-lg font-semibold mb-3">Eligibility Profile</h2>

            <form onSubmit={handleRecommend} className="space-y-4 text-sm">

              {/* Age */}
              <div>
                <label className="block mb-1 font-medium text-slate-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Occupation */}
              <div>
                <label className="block mb-1 font-medium text-slate-700">Occupation</label>
                <select
                  name="occupation"
                  value={profile.occupation}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select occupation</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="women">Women (entrepreneur/self-employed)</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="business">Business / MSME</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Income */}
              <div>
                <label className="block mb-1 font-medium text-slate-700">Monthly Income</label>
                <select
                  name="income"
                  value={profile.income}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select income range</option>
                  <option value="<10000">Below ₹10,000</option>
                  <option value="10000-25000">₹10,000 – ₹25,000</option>
                  <option value="25000-50000">₹25,000 – ₹50,000</option>
                  <option value=">50000">Above ₹50,000</option>
                </select>
              </div>

              {/* Gender + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-slate-700">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-slate-700">Category</label>
                  <select
                    name="category"
                    value={profile.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST</option>
                    <option value="ews">EWS</option>
                  </select>
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block mb-1 font-medium text-slate-700">State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="e.g. Bihar"
                  value={profile.state}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Button */}
              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Finding best schemes..." : "Get AI Recommendations"}
              </button>
            </form>
          </div>

          {/* RIGHT CARD — AI RECOMMENDATIONS */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recommended Schemes</h2>
              <span className="text-xs text-slate-500">{schemes.length} result(s)</span>
            </div>

            {schemes.length === 0 ? (
              <p className="text-sm text-slate-500">
                No schemes found. Fill profile & click “Get Recommendations”.
              </p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">

                {schemes.map((rec, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 p-4 rounded-lg hover:border-indigo-300 transition"
                  >
                    {/* Title */}
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {rec.scheme?.title || "Unknown Scheme"}
                    </h3>

                    {/* Reason */}
                    {rec.match_reason && (
                      <p className="text-sm text-green-700 font-medium mb-2">
                        ✔ {rec.match_reason}
                      </p>
                    )}

                    {/* Benefits */}
                    {rec.benefits_summary && (
                      <p className="text-sm text-slate-700 mb-1">
                        <span className="font-semibold text-slate-900">
                          Benefits:
                        </span>{" "}
                        {rec.benefits_summary}
                      </p>
                    )}

                    {/* Documents */}
                    {rec.required_documents_summary && (
                      <p className="text-sm text-slate-700 mb-2">
                        <span className="font-semibold text-slate-900">
                          Documents:
                        </span>{" "}
                        {rec.required_documents_summary}
                      </p>
                    )}

                    {/* Apply Link */}
                    {rec.scheme?.applyLink && (
                      <a
                        href={rec.scheme.applyLink}
                        target="_blank"
                        className="text-indigo-600 text-sm underline hover:text-indigo-800"
                      >
                        Apply Now
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
