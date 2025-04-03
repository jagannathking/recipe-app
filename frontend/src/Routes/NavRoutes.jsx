import React from "react";
import { Route, Routes, Navigate } from "react-router-dom"; // Import Navigate here

// Import Pages
import HomePage from "../Pages/HomePage";
import RegisterPage from "../Pages/RegisterPage";
import LoginPage from "../Pages/LoginPage";
import SavePage from "../Pages/SavePage";
import AboutPage from "../Pages/AboutPage";
import ContactPage from "../Pages/ContactPage";
import ProfilePage from "../Pages/ProfilePage"; // <-- Import ProfilePage

// Import ProtectedRoute
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from "../Context/AuthContext"; // <-- Import useAuth

const NavRoutes = () => {
  const { user } = useAuth(); // <-- Get user status

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Routes hidden when logged in */}
        <Route
            path="/register"
            element={!user ? <RegisterPage /> : <Navigate to="/profile" replace />} // Redirect if logged in
        />
        <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/profile" replace />} // Redirect if logged in
        />

        {/* Protected Routes (Require Login) */}
        <Route
          path="/save-recipe"
          element={
            <ProtectedRoute>
              <SavePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile" // <-- Add Profile Route
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Added replace */}
      </Routes>
    </>
  );
};

export default NavRoutes;