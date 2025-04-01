const axios = require("axios");
const Recipe = require("../models/recipe.model");
const User = require("../models/user.model");
const dotenv = require('dotenv')

dotenv.config()


// Search Recipes from Spoonacular API
exports.searchRecipes = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: {
                query,
                apiKey: process.env.SPOONACULAR_API_KEY,
            },
        });

        res.json(response.data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch recipes. Try again later." });
    }
};

// Save a Recipe for a User
exports.saveRecipe = async (req, res) => {
    try {
        const { userId, recipeData } = req.body;

        if (!userId || !recipeData) {
            return res.status(400).json({ error: "User ID and recipe data are required" });
        }

        let recipe = await Recipe.findOne({ apiId: recipeData.id });

        if (!recipe) {
            recipe = new Recipe({
                title: recipeData.title,
                image: recipeData.image,
                summary: recipeData.summary || "",
                ingredients: recipeData.ingredients || [],
                instructions: recipeData.instructions || "",
                apiId: recipeData.id,
            });

            await recipe.save();
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.savedRecipes.includes(recipe._id)) {
            user.savedRecipes.push(recipe._id);
            await user.save();
        }

        res.json({ message: "Recipe saved successfully", recipe });
    } catch (error) {
        console.error("Error saving recipe:", error.message);
        res.status(500).json({ error: "Error saving recipe. Please try again." });
    }
};

// Get Saved Recipes for a User
exports.getSavedRecipes = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("savedRecipes").lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user.savedRecipes);
    } catch (error) {
        console.error("Error retrieving saved recipes:", error.message);
        res.status(500).json({ error: "Error retrieving saved recipes." });
    }
};
