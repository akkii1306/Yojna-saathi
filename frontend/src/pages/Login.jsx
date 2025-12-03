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
    await login(form.email, form.password);
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center mt-16">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white shadow-lg p-8 rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <input
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
