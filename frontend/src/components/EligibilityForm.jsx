// frontend/src/components/EligibilityForm.jsx
import { useState } from "react";
import { api } from "../services/api";

const EligibilityForm = ({ onResults, initialState = {} }) => {
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    age: initialState.age || "",
    gender: initialState.gender || "",
    category: initialState.category || "",
    occupation: initialState.occupation || "",
    income: initialState.income || "",
    disability: initialState.disability || "no",
    education: initialState.education || "",
    employmentStatus: initialState.employmentStatus || "",
    state: initialState.state || "",
  });

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/schemes/recommend", profile);
      onResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching recommendations");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Smart Eligibility Form
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Age */}
        <div>
          <label className="block mb-1 text-slate-700">Age</label>
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            placeholder="e.g. 21"
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1 text-slate-700">Gender</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-slate-700">Caste Category</label>
          <select
            name="category"
            value={profile.category}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="ews">EWS</option>
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label className="block mb-1 text-slate-700">Occupation</label>
          <select
            name="occupation"
            value={profile.occupation}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select occupation</option>
            <option value="student">Student</option>
            <option value="farmer">Farmer</option>
            <option value="women">Women (entrepreneur)</option>
            <option value="unemployed">Unemployed</option>
            <option value="business">Business / MSME</option>
            <option value="labour">Daily wage labour</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Monthly Income */}
        <div>
          <label className="block mb-1 text-slate-700">Monthly Income</label>
          <select
            name="income"
            value={profile.income}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select income range</option>
            <option value="<10000">Below ₹10,000</option>
            <option value="10000-25000">₹10,000 – ₹25,000</option>
            <option value="25000-50000">₹25,000 – ₹50,000</option>
            <option value=">50000">Above ₹50,000</option>
          </select>
        </div>

        {/* Disability */}
        <div>
          <label className="block mb-1 text-slate-700">Disability</label>
          <select
            name="disability"
            value={profile.disability}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="no">No</option>
            <option value="yes">Yes (PwD)</option>
          </select>
        </div>

        {/* Education */}
        <div>
          <label className="block mb-1 text-slate-700">Education Level</label>
          <select
            name="education"
            value={profile.education}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select education</option>
            <option value="10th">10th Pass</option>
            <option value="12th">12th Pass</option>
            <option value="graduate">Graduate</option>
            <option value="postgraduate">Post Graduate</option>
            <option value="illiterate">No formal education</option>
          </select>
        </div>

        {/* Employment Status */}
        <div>
          <label className="block mb-1 text-slate-700">Employment Status</label>
          <select
            name="employmentStatus"
            value={profile.employmentStatus}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select status</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="self-employed">Self Employed</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block mb-1 text-slate-700">State</label>
          <input
            type="text"
            name="state"
            placeholder="e.g. Bihar"
            value={profile.state}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Finding best schemes..." : "Get Scheme Recommendations"}
        </button>
      </form>
    </div>
  );
};

export default EligibilityForm;
