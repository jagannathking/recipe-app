import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom"; // Added Link for logo if needed
import { Menu, X } from "lucide-react";
import { useAuth } from "../Context/AuthContext"; // <-- Import useAuth

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // <-- Get user status

  const closeMenu = () => setIsOpen(false); // Helper to close mobile menu

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src="/recipe-logo.png" alt="logo" className="w-12 h-12" />
            <span className="text-xl font-bold ml-2 text-gray-800">
              RecipeApp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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

            {user ? (
              // Links shown when logged IN
              <>
                <NavLink
                  to="/save-recipe"
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-green-600 transition ${
                      isActive ? "font-bold border-b-2 border-green-600" : ""
                    }`
                  }
                >
                  Saved Recipes
                </NavLink>
                <NavLink
                  to="/profile" // <-- Link to Profile
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-green-600 transition ${
                      isActive ? "font-bold border-b-2 border-green-600" : ""
                    }`
                  }
                >
                  Profile
                </NavLink>
                {/* You could add a dedicated logout button here too if desired */}
                {/* <button onClick={handleLogout} className="...">Logout</button> */}
              </>
            ) : (
              // Links shown when logged OUT
              <>
                <NavLink
                  to="/login" // <-- Link to Login
                  className={({ isActive }) =>
                    `py-1 px-3 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition ${
                      isActive ? "bg-green-600 text-white font-semibold" : ""
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register" // <-- Link to Register
                  className={({ isActive }) =>
                    `py-1 px-3 rounded bg-green-600 text-white hover:bg-green-700 transition ${
                      isActive ? "font-bold ring-2 ring-offset-1 ring-green-600" : ""
                    }`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu" // Accessibility
            aria-expanded={isOpen} // Accessibility
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {/* Use a conditional rendering approach for the container as well for transition */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center pb-4 pt-2 space-y-2">
            <NavLink
              to="/"
              className="block py-2 w-full text-center text-gray-700 hover:text-green-600"
              onClick={closeMenu}
            >
              Home
            </NavLink>

            {user ? (
              // Mobile Links - Logged IN
              <>
                <NavLink
                  to="/save-recipe"
                  className="block py-2 w-full text-center text-gray-700 hover:text-green-600"
                  onClick={closeMenu}
                >
                  Saved Recipes
                </NavLink>
                <NavLink
                  to="/profile"
                  className="block py-2 w-full text-center text-gray-700 hover:text-green-600"
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
                {/* Optional: Logout button in mobile menu */}
                {/* <button onClick={() => { handleLogout(); closeMenu(); }} className="...">Logout</button> */}
              </>
            ) : (
              // Mobile Links - Logged OUT
              <>
                <NavLink
                  to="/login"
                  className="block py-2 w-full text-center text-gray-700 hover:text-green-600"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block py-2 w-full text-center rounded bg-green-600 text-white hover:bg-green-700"
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;