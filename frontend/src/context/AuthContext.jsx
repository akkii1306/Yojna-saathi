import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("yojana_user")) || null
  );

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    localStorage.setItem("yojana_user", JSON.stringify(res.data));
    setUser(res.data);
  };

  const registerUser = async (data) => {
    const res = await axios.post("http://localhost:5000/api/auth/register", data);
    localStorage.setItem("yojana_user", JSON.stringify(res.data));
    setUser(res.data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("yojana_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
