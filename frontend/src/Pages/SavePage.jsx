import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Loader2, AlertCircle, HeartCrack } from "lucide-react"; // Import icons

// Define API URL (use environment variables in a real app)
const API_BASE_URL = "https://recipe-app-eight-psi.vercel.app/api";

const SavePage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteStatus, setDeleteStatus] = useState({}); // Tracks status per recipeId: 'deleting', 'error'

  const { user, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();

  // Function to fetch saved recipes
  const fetchSavedRecipes = useCallback(async () => {
    if (!user || !user.token) {
      setError("User not authenticated.");
      setLoading(false);
      return; // Exit if no user/token
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setDeleteStatus({}); // Reset delete statuses on fetch

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Fetch from the protected /all-recipes endpoint
      const response = await axios.get(
        `${API_BASE_URL}/recipes/all-recipes`,
        config
      );

      if (response.data && response.data.success) {
        setSavedRecipes(response.data.data || []); // Ensure data is an array
      } else {
        setError(response.data.message || "Failed to fetch saved recipes.");
      }
    } catch (err) {
      console.error("Fetch saved recipes error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Authentication failed. Please log in again.");
        // Optional: Force logout on auth error
        logout();
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching recipes."
        );
      }
      setSavedRecipes([]); // Clear recipes on error
    } finally {
      setLoading(false);
    }
  }, [user, navigate, logout]); // Include dependencies

  // Fetch recipes when component mounts or user changes
  useEffect(() => {
    fetchSavedRecipes();
  }, [fetchSavedRecipes]); // Use the memoized fetch function

  // Function to handle deleting a recipe
  const handleDeleteRecipe = async (recipeId) => {
    if (!user || !user.token) {
      setError("Cannot delete: User not authenticated.");
      return;
    }
    if (!recipeId) {
      setError("Cannot delete: Invalid recipe ID.");
      return;
    }

    // Set status to 'deleting' for this specific recipe
    setDeleteStatus((prev) => ({ ...prev, [recipeId]: "deleting" }));
    setError(""); // Clear general errors

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Call the protected DELETE endpoint with recipeId in the URL
      await axios.delete(
        `${API_BASE_URL}/recipes/delete-recipe/${recipeId}`,
        config
      );

      // If successful, remove the recipe from the local state
      setSavedRecipes(
        (prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.recipeId !== recipeId) // Assuming state recipes have recipeId
      );
      // Clear status for this recipe (or could set to 'deleted' briefly)
      setDeleteStatus((prev) => {
        const newState = { ...prev };
        delete newState[recipeId];
        return newState;
      });
    } catch (err) {
      console.error("Delete recipe error:", err);
      let errorMessage =
        err.response?.data?.message || "An error occurred while deleting.";
      if (err.response?.status === 401 || err.response?.status === 403) {
        errorMessage = "Authentication error. Please log in again.";
        logout();
        navigate("/login");
      } else if (err.response?.status === 404) {
        errorMessage =
          "Recipe not found in your saved list (maybe already deleted?). Refreshing list...";
        fetchSavedRecipes(); // Re-fetch to sync state if 404
      }
      setDeleteStatus((prev) => ({ ...prev, [recipeId]: "error" }));
      setError(errorMessage); // Show specific error message
    }
  };

  // Helper to render delete button based on status
  const renderDeleteButton = (recipe) => {
    // Need the correct ID for the API call (assuming it's recipe.recipeId)
    const idToDelete = recipe.recipeId;
    if (!idToDelete) return null; // Don't render button if ID is missing

    const status = deleteStatus[idToDelete];

    if (status === "deleting") {
      return (
        <button
          className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
          disabled
        >
          <Loader2 className="animate-spin mr-2 h-4 w-4" /> Deleting...
        </button>
      );
    }

    if (status === "error") {
      return (
        <button
          onClick={() => handleDeleteRecipe(idToDelete)} // Allow retry
          className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-150 ease-in-out"
        >
          <AlertCircle className="mr-2 h-4 w-4" /> Error! Retry Delete
        </button>
      );
    }

    // Default Delete button
    return (
      <button
        onClick={() => handleDeleteRecipe(idToDelete)}
        className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-150 ease-in-out"
        aria-label={`Delete recipe ${recipe.title}`}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete
      </button>
    );
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[70px] pb-10 px-4 bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-green-600" />
        <p className="ml-3 text-gray-600">Loading saved recipes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[90px] pb-10 px-4 bg-gray-50">
      {" "}
      {/* Adjusted padding top */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Your Saved Recipes
        </h2>

        {/* General Error Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        {/* Display Saved Recipes or Empty State */}
        {savedRecipes.length === 0 && !error ? (
          <div className="text-center py-10 px-6 bg-white rounded-lg shadow">
            <HeartCrack className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No saved recipes yet!
            </h3>
            <p className="text-gray-500">
              Go find some delicious recipes on the homepage and save them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedRecipes.map((recipe) => (
              // Use recipe.recipeId if that's the unique Spoonacular ID from backend
              // Or use recipe._id if that's preferred and available
              <div
                key={recipe.recipeId || recipe._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <img
                  // Use recipe.image if available
                  src={recipe.image || "/placeholder-image.png"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.png";
                  }} // Fallback
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="text-md font-semibold text-gray-800 mb-2 flex-grow">
                    {recipe.title || "Untitled Recipe"}
                  </h4>
                  {/* Delete Button */}
                  {renderDeleteButton(recipe)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavePage;
