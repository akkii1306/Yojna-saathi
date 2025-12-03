import { useState } from "react";
import { api } from "../services/api";

const EligibilityForm = () => {
  const [form, setForm] = useState({
    age: "",
    occupation: "",
    gender: "",
    state: "",
    category: "",
    income: "",
    disability: false,
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/schemes/recommend", form);
    setResults(res.data.matched);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Check Eligibility
      </h2>

      <form
        onSubmit={submit}
        className="bg-white shadow-lg p-6 rounded-lg space-y-4"
      >
        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Age"
          name="age"
          value={form.age}
          onChange={handleChange}
        />

        <select
          name="occupation"
          value={form.occupation}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option>Select Occupation</option>
          <option value="farmer">Farmer</option>
          <option value="student">Student</option>
          <option value="women">Women</option>
          <option value="entrepreneur">Entrepreneur</option>
        </select>

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="State"
          name="state"
          value={form.state}
          onChange={handleChange}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option>Select Category</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>

        <input
          className="w-full border px-4 py-2 rounded"
          placeholder="Annual Income"
          name="income"
          value={form.income}
          onChange={handleChange}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="disability"
            checked={form.disability}
            onChange={handleChange}
          />
          Disabled
        </label>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Get Recommendations
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {results.map((s) => (
          <div key={s._id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold text-lg">{s.title}</h3>
            <p className="text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EligibilityForm;
