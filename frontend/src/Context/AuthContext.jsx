import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

export const AuthContext = createContext();

const BASE_URL = "https://recipe-app-eight-psi.vercel.app/api/users";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password });

      // Decode token to get user details
      const decoded = jwtDecode(res.data.token);

      setUser({ ...decoded, token: res.data.token });
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/register`, formData);

      // Decode token after registration
      const decoded = jwtDecode(res.data.token);

      setUser({ ...decoded, token: res.data.token });
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
