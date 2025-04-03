import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from 'axios'; // Import axios
import { useAuth } from "../Context/AuthContext"; // Import useAuth
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import { Search, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'; // Import icons

// Define API URL (use environment variables in a real app)
const API_BASE_URL = "https://recipe-app-eight-psi.vercel.app/api";

const images = [
  "/header-bannder-im-1.jpg",
  "/header-banner-im-2.jpg",
  "/header-banner-image-3.jpg",
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState({}); // To track save status per recipe ID

  const { user } = useAuth(); // Get user authentication status and token
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to get current location (for redirect state)

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults([]);
    setSaveStatus({}); // Reset save statuses on new search

    try {
      // Use the public /api/recipes/search endpoint
      const response = await axios.get(`${API_BASE_URL}/recipes/search`, {
        params: { query: searchQuery },
      });
      if (response.data && response.data.success) {
        setSearchResults(response.data.data || []); // Ensure data is an array
        if (response.data.data.length === 0) {
            setError("No recipes found for your query.");
        }
      } else {
         setError(response.data.message || "Failed to fetch recipes.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || "An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    if (!user) {
      // If user is not logged in, redirect to login page
      // Pass the current location so user can be redirected back after login
      navigate('/login', { state: { from: location } });
      return;
    }

    // Set status to 'saving' for this specific recipe
    setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: 'saving' }));
    setError(""); // Clear general errors

    try {
      // Prepare data and headers for the protected /api/recipes/save-recipe endpoint
      const payload = {
        recipeId: recipe.recipeId, // Ensure this matches the backend expectation
        title: recipe.title,
        image: recipe.image,
      };
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(`${API_BASE_URL}/recipes/save-recipe`, payload, config);

      if (response.data && response.data.success) {
        // Set status to 'saved'
        setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: 'saved' }));
      } else {
        // Should not happen if backend returns correct success flag
        setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: 'error' }));
        setError(response.data.message || "Failed to save recipe.");
      }
    } catch (err) {
      console.error("Save recipe error:", err);
      let status = 'error';
      let errorMessage = err.response?.data?.message || "An error occurred while saving.";

      // Handle specific error cases from backend
      if (err.response?.status === 409) { // Conflict - Recipe already saved
        status = 'already_saved';
        errorMessage = "Recipe is already in your saved list.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
          errorMessage = "Authentication error. Please log in again.";
          // Optionally force logout here: logout(); navigate('/login');
      }

      setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: status }));
      setError(errorMessage); // Show specific error message
    }
  };

  // Helper to render save button based on status
  const renderSaveButton = (recipe) => {
    const status = saveStatus[recipe.recipeId];

    if (status === 'saving') {
      return (
        <button className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed" disabled>
          <Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
        </button>
      );
    }

    if (status === 'saved') {
      return (
        <button className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-md cursor-not-allowed" disabled>
          <CheckCircle className="mr-2 h-4 w-4" /> Saved
        </button>
      );
    }

     if (status === 'already_saved') {
       return (
         <button className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md cursor-not-allowed" disabled>
           <CheckCircle className="mr-2 h-4 w-4" /> Already Saved
         </button>
       );
     }

    if (status === 'error') {
       return (
         <button
            onClick={() => handleSaveRecipe(recipe)} // Allow retry on error
            className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-150 ease-in-out"
         >
           <AlertCircle className="mr-2 h-4 w-4" /> Error! Retry Save
         </button>
       );
     }


    // Default button
    return (
      <button
        onClick={() => handleSaveRecipe(recipe)}
        className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-150 ease-in-out"
      >
        <Save className="mr-2 h-4 w-4" /> Save Recipe
      </button>
    );
  }

  return (
    <div className="pt-[70px] pb-10"> {/* Add padding top for fixed navbar */}
      {/* Swiper Banner */}
      <div className="w-full h-[300px] md:h-[400px] mb-8">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          className="w-full h-full rounded-lg overflow-hidden"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover" // Removed rounded-lg from here
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
          Find Your Next Favorite Recipe
        </h2>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for recipes (e.g., pasta, chicken, vegan)"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
            ) : (
                <Search className="mr-2 h-5 w-5" />
            )}
            Search
          </button>
        </form>

        {/* Error Display */}
        {error && !loading && ( // Show general error only if not loading
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
             {error}
          </div>
        )}


        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-10">
             <Loader2 className="animate-spin inline-block h-8 w-8 text-green-600" />
             <p className="mt-2 text-gray-600">Searching for recipes...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && searchResults.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Search Results:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((recipe) => (
                 // Ensure recipe has a unique ID. Use recipe.recipeId which should be the Spoonacular ID
                <div key={recipe.recipeId} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.png" }} // Basic image fallback
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-md font-semibold text-gray-800 mb-2 flex-grow">
                        {recipe.title}
                    </h4>
                    {/* Conditional Save Button */}
                    {renderSaveButton(recipe)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;