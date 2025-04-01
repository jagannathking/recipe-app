import React from "react";
import { NavLink } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react"; // Social Icons

const FooterPage = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo & Description */}
          <div>
            <h2 className="text-2xl font-bold text-white">RecipeApp</h2>
            <p className="text-sm mt-2">
              Your go-to platform for discovering and saving delicious recipes.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <NavLink to="/" className="hover:text-green-400 transition">
              Home
            </NavLink>
            <NavLink to="/save-recipe" className="hover:text-green-400 transition">
              Saved Recipes
            </NavLink>
            <NavLink to="/about" className="hover:text-green-400 transition">
              About
            </NavLink>
            <NavLink to="/contact" className="hover:text-green-400 transition">
              Contact
            </NavLink>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-green-400 transition">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-green-400 transition">
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
          © {new Date().getFullYear()} RecipeApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
