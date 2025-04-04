import React, { useState, useEffect, useCallback } from "react"; // Added useEffect, useCallback
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from 'axios';
import { useAuth } from "../Context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Save, CheckCircle, AlertCircle, Loader2, Soup } from 'lucide-react'; // Added Soup icon

// Use environment variable or fallback
const API_BASE_URL = "https://recipe-app-eight-psi.vercel.app/api";

const images = [
  "/header-bannder-im-1.jpg",
  "/header-banner-im-2.jpg",
  "/header-banner-image-3.jpg",
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false); 
  const [searchError, setSearchError] = useState("");     

  // --- New State for Initial Recipes ---
  const [initialRecipes, setInitialRecipes] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true); 
  const [initialError, setInitialError] = useState("");
  // --- End New State ---

  const [saveStatus, setSaveStatus] = useState({});

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- Fetch Initial Recipes on Mount ---
  const fetchInitialRecipes = useCallback(async () => {
    setLoadingInitial(true);
    setInitialError('');
    try {
      // Example: Fetch recipes for "popular" or another default term
      const response = await axios.get(`${API_BASE_URL}/recipes/search/`, {
        params: { query: 'n', number: 12}, // Fetch 8 pasta recipes initially
      });
      if (response.data && response.data.success) {
        setInitialRecipes(response.data.data || []);
      } else {
        setInitialError(response.data.message || "Failed to load initial recipes.");
      }
    } catch (err) {
      console.error("Initial fetch error:", err);
      setInitialError(err.response?.data?.message || "An error occurred loading initial recipes.");
    } finally {
      setLoadingInitial(false);
    }
  }, []); // Empty dependency array means run once on mount

  useEffect(() => {
    fetchInitialRecipes();
  }, [fetchInitialRecipes]);
  // --- End Fetch Initial Recipes ---

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
     if (!e.target.value.trim()) { // Clear search results if input is cleared
         setSearchResults([]);
         setSearchError("");
     }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError("Please enter something to search for.");
      return;
    }

    setLoadingSearch(true); 
    setSearchError("");     
    setSearchResults([]);   
    setSaveStatus({});

    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/search`, {
        params: { query: searchQuery },
      });
      if (response.data && response.data.success) {
        const results = response.data.data || [];
        setSearchResults(results);
        if (results.length === 0) {
          setSearchError("No recipes found for your query.");
        }
      } else {
        setSearchError(response.data.message || "Failed to fetch recipes.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(err.response?.data?.message || "An error occurred while searching.");
    } finally {
      setLoadingSearch(false); // Use search loading state
    }
  };

  // handleSaveRecipe remains the same...
  const handleSaveRecipe = async (recipe) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: 'saving' }));
    setSearchError(""); // Clear general errors on save attempt

    try {
      const payload = {
        recipeId: recipe.recipeId,
        title: recipe.title,
        image: recipe.image,
      };
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(`${API_BASE_URL}/recipes/save-recipe`, payload, config);

      if (response.data && response.data.success) {
        setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: 'saved' }));
      } else {
        setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: 'error' }));
        // Use setSearchError to display save errors temporarily if needed
        setSearchError(response.data.message || "Failed to save recipe.");
      }
    } catch (err) {
      console.error("Save recipe error:", err);
      let status = 'error';
      let errorMessage = err.response?.data?.message || "An error occurred while saving.";
      if (err.response?.status === 409) {
        status = 'already_saved';
        errorMessage = "Recipe is already in your saved list.";
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = "Authentication error. Please log in again.";
      }
      setSaveStatus(prev => ({ ...prev, [recipe.recipeId]: status }));
      setSearchError(errorMessage);
    }
  };

   // renderSaveButton remains the same...
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
            onClick={() => handleSaveRecipe(recipe)}
            className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-150 ease-in-out"
         >
           <AlertCircle className="mr-2 h-4 w-4" /> Error! Retry Save
         </button>
       );
     }
    return (
      <button
        onClick={() => handleSaveRecipe(recipe)}
        className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-150 ease-in-out"
      >
        <Save className="mr-2 h-4 w-4" /> Save Recipe
      </button>
    );
  }

  // --- Helper to render recipe cards ---
  const renderRecipeGrid = (recipes, gridTitle) => (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{gridTitle}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.recipeId} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src="/placeholder-image.png" }}
            />
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-md font-semibold text-gray-800 mb-2 flex-grow">
                  {recipe.title}
              </h4>
              {renderSaveButton(recipe)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pt-[70px] pb-10">
      {/* Swiper Banner */}
      <div className="w-full h-[300px] md:h-[400px] mb-8">
        {/* Swiper code remains the same */}
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
              <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover"/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search Section */}
      <div className="max-w-[1100px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
          Find Your Next Favorite Recipe
        </h2>
        {/* Search form remains the same */}
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
            disabled={loadingSearch}
          >
            {loadingSearch ? ( <Loader2 className="animate-spin mr-2 h-5 w-5" /> ) : ( <Search className="mr-2 h-5 w-5" /> )}
            Search
          </button>
        </form>

        {/* Display Area: Initial Load, Initial Error, Search Loading, Search Error, Results */}
        <div className="mt-8">
          {/* --- Initial Loading State --- */}
          {loadingInitial && (
            <div className="text-center py-10">
              <Loader2 className="animate-spin inline-block h-8 w-8 text-green-600" />
              <p className="mt-2 text-gray-600">Loading initial recipes...</p>
            </div>
          )}

          {/* --- Initial Error State --- */}
          {!loadingInitial && initialError && initialRecipes.length === 0 && (
             <div className="mb-6 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-center">
                Could not load initial recipes: {initialError}
             </div>
          )}

           {/* --- Search Loading State --- */}
           {loadingSearch && (
              <div className="text-center py-10">
                 <Loader2 className="animate-spin inline-block h-8 w-8 text-green-600" />
                 <p className="mt-2 text-gray-600">Searching...</p>
              </div>
           )}

           {/* --- Search Error State --- */}
           {!loadingSearch && searchError && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                 {searchError}
              </div>
           )}

          {/* --- Display Search Results (if available) --- */}
          {!loadingSearch && searchResults.length > 0 && (
            renderRecipeGrid(searchResults, "Search Results:")
          )}

          {/* --- Display Initial Recipes (if no search results and initial fetch succeeded) --- */}
          {!loadingInitial && !loadingSearch && searchResults.length === 0 && initialRecipes.length > 0 && !searchError && (
             renderRecipeGrid(initialRecipes, "Try These Recipes:")
          )}

           {/* --- Optional: Message if no initial recipes and no search performed --- */}
           {!loadingInitial && !loadingSearch && searchResults.length === 0 && initialRecipes.length === 0 && !initialError && !searchError && (
                <div className="text-center py-10 text-gray-500">
                    <Soup className="mx-auto h-10 w-10 mb-2" />
                    Use the search bar above to find recipes!
                </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default HomePage;