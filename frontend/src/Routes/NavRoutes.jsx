import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import RegisterPage from "../Pages/RegisterPage";
import LoginPage from "../Pages/LoginPage";
import SavePage from "../Pages/SavePage";
import AboutPage from "../Pages/AboutPage";
import ContactPage from "../Pages/ContactPage";
import ProtectedRoute from './ProtectedRoute'
import { Navigate } from "react-router-dom";


const NavRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
  
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />


        <Route
        path="/save-recipe"
        element={
          <ProtectedRoute>
            <SavePage />
          </ProtectedRoute>
        }
      />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default NavRoutes;
