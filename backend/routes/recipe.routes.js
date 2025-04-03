const express = require('express');
const { searchRecipe, saveRecipe, getSavedRecipes, removeSavedRecipe } = require('../controllers/recipe.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public route - Search recipes from Spoonacular
router.get("/search", searchRecipe); // No auth needed

// Protected routes - Require user to be logged in
router.get("/all-recipes", authMiddleware, getSavedRecipes);
router.post("/save-recipe", authMiddleware, saveRecipe);

// --- CORRECTION HERE: Corrected typo "detele" to "delete" ---
// --- CORRECTION HERE: Changed route to accept recipeId as a URL parameter ---
router.delete("/delete-recipe/:recipeId", authMiddleware, removeSavedRecipe);

// Example usage reminder:
// GET http://localhost:5000/api/recipes/search?query=pasta
// GET http://localhost:5000/api/recipes/all-recipes (Requires Auth Header: Bearer <token>)
// POST http://localhost:5000/api/recipes/save-recipe (Requires Auth Header: Bearer <token>, Body: { recipeId, title, image })
// DELETE http://localhost:5000/api/recipes/delete-recipe/12345 (Requires Auth Header: Bearer <token>, where 12345 is the recipeId)

module.exports = router;