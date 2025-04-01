import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for menu toggle

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src="/recipe-logo.png" alt="logo" className="w-12 h-12" />
            <span className="text-xl font-bold ml-2 text-gray-800">
              RecipeApp
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 hover:text-green-600 transition ${
                  isActive ? "font-bold border-b-2 border-green-600" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/save-recipe"
              className={({ isActive }) =>
                `text-gray-700 hover:text-green-600 transition ${
                  isActive ? "font-bold border-b-2 border-green-600" : ""
                }`
              }
            >
              Save Recipe
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `text-gray-700 hover:text-green-600 transition ${
                  isActive ? "font-bold border-b-2 border-green-600" : ""
                }`
              }
            >
              Register
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col items-center pb-4">
            <NavLink
              to="/"
              className="block py-2 text-gray-700 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/save-recipe"
              className="block py-2 text-gray-700 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Save Recipe
            </NavLink>
            <NavLink
              to="/register"
              className="block py-2 text-gray-700 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
