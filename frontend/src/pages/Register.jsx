import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    state: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center mt-16">
      <form className="w-96 bg-white shadow-lg p-8 rounded-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <input
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="State"
          name="state"
          value={form.state}
          onChange={handleChange}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
