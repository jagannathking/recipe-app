import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen mt-[75px] mb-[-40px]" >
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">About RecipeApp</h1>
        <p className="mt-2 text-lg">Discover, Save, and Share Delicious Recipes!</p>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose RecipeApp?</h2>
        <ul className="space-y-4 text-gray-700">
          <li>✅ Search for thousands of delicious recipes</li>
          <li>✅ Save your favorite recipes for later</li>
          <li>✅ Get detailed ingredients & step-by-step instructions</li>
          <li>✅ Filter recipes based on cuisine, diet, and preferences</li>
          <li>✅ Share your favorite recipes with friends</li>
        </ul>
      </div>

      {/* How It Works */}
      <div className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg">1. Search Recipes</h3>
              <p className="text-gray-600 mt-2">Enter a dish name or ingredient to find recipes.</p>
            </div>
            <div className="p-6 bg-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg">2. Save Favorites</h3>
              <p className="text-gray-600 mt-2">Click the save button to keep track of your best finds.</p>
            </div>
            <div className="p-6 bg-gray-200 rounded-lg">
              <h3 className="font-semibold text-lg">3. Cook & Enjoy</h3>
              <p className="text-gray-600 mt-2">Follow easy step-by-step instructions to prepare meals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12 bg-green-600 text-white">
        <h2 className="text-2xl font-bold">Start Your Culinary Journey Today!</h2>
        <p className="mt-2">Explore thousands of recipes and save your favorites.</p>
        <button className="mt-4 px-6 py-2 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
