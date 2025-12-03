import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await login(form.email, form.password);
    navigate("/dashboard");   // ✔ correct path
  } catch (err) {
    alert(err.response?.data?.message || "Error logging in");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
