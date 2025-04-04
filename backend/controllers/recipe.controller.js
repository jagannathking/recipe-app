const axios = require('axios');
const Recipe = require('../models/recipe.model');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

// Search for Recipes
exports.searchRecipe = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Query parameter is required' });
        }

        const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
            params: { query, apiKey: process.env.SPOONACULAR_API_KEY },
        });

        // Assuming response.data.results contains objects with id, title, image
        const recipes = response.data.results.map(recipe => ({
             recipeId: recipe.id, // Make sure the frontend receives 'recipeId' consistently
             title: recipe.title,
             image: recipe.image
        }));

        res.status(200).json({ success: true, data: recipes }); // Send mapped data

    } catch (error) {
        console.error("Error fetching recipes:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            message: "Failed to fetch recipes. Try again later.",
            error: error.response?.data || error.message
        });
    }
};

// Get Saved Recipes for a User 
exports.getSavedRecipes = async (req, res) => {
    try {
        if (!req.user || (!req.user.id && !req.user._id)) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        const userId = req.user.id?.toString() || req.user._id?.toString();
        // Use lean() for read-only operation, slightly more performant
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.savedRecipes || user.savedRecipes.length === 0) {
            return res.status(200).json({ success: true, message: "No saved recipes found.", data: [] });
        }

        // Fetch full recipe details from Recipe collection using the correct field 'apiId'
        // --- CORRECTION HERE ---
        const savedRecipesDetails = await Recipe.find({ apiId: { $in: user.savedRecipes } }).lean();

        // Optional: Map to ensure consistency if needed, especially if frontend expects 'recipeId'
         const responseData = savedRecipesDetails.map(recipe => ({
             recipeId: recipe.apiId, // Map apiId back to recipeId for frontend if necessary
             title: recipe.title,
             image: recipe.image,
             _id: recipe._id // Include the internal MongoDB _id if needed
         }));


        res.status(200).json({ success: true, data: responseData }); // Send the mapped data

    } catch (error) {
        console.error("Error retrieving saved recipes:", error.message);
        res.status(500).json({ success: false, message: "Error retrieving saved recipes.", error: error.message });
    }
};

// Save a Recipe (Stores in Recipe Schema + User Saved List)
exports.saveRecipe = async (req, res) => {
    try {
        if (!req.user || (!req.user.id && !req.user._id)) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        const userId = req.user.id?.toString() || req.user._id?.toString();
        // 'recipeId' here refers to the Spoonacular ID coming from the frontend request body
        const { recipeId, title, image } = req.body;

        if (!recipeId || !title || !image) {
            return res.status(400).json({ success: false, message: "Recipe ID, title, and image are required." });
        }

        // Ensure recipeId is treated as a string for consistency
        const recipeIdStr = recipeId.toString();

        // Check if the recipe exists in the Recipe collection using 'apiId'
        let existingRecipe = await Recipe.findOne({ apiId: recipeIdStr });

        // If recipe does not exist, create and save it
        if (!existingRecipe) {
            existingRecipe = new Recipe({
                apiId: recipeIdStr, 
                title,
                image
                // Note: We are not linking users here in the Recipe model based on current logic
            });
            await existingRecipe.save();
        }

        // Find the user (not using lean() because we need to save changes)
        let user = await User.findById(userId);
        if (!user) {
            // Should ideally not happen if authMiddleware works, but good practice to check
             await Recipe.deleteOne({ apiId: recipeIdStr }); // Clean up orphaned recipe if user not found somehow
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the recipe ID (string) is already saved
        if (user.savedRecipes.includes(recipeIdStr)) {
            return res.status(409).json({ success: false, message: "Recipe already saved." });
        }

        // Save recipe ID (string) to the user's savedRecipes array
        user.savedRecipes.push(recipeIdStr);
        await user.save();

        res.status(200).json({ success: true, message: "Recipe saved successfully.", savedRecipe: { recipeId: recipeIdStr, title, image } });

    } catch (error) {
        console.error("Error saving recipe:", error.message);
        // Handle potential duplicate key error if somehow findOne check fails concurrently (rare)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.apiId) {
             // If duplicate error on Recipe, try to add to user anyway if not already added
             try {
                let user = await User.findById(req.user.id?.toString() || req.user._id?.toString());
                const recipeIdStr = req.body.recipeId.toString();
                if (user && !user.savedRecipes.includes(recipeIdStr)) {
                     user.savedRecipes.push(recipeIdStr);
                     await user.save();
                     return res.status(200).json({ success: true, message: "Recipe saved successfully (was already in db)." });
                } else if (user && user.savedRecipes.includes(recipeIdStr)) {
                     return res.status(409).json({ success: false, message: "Recipe already saved." });
                }
             } catch (innerError) {
                 console.error("Error handling duplicate recipe save:", innerError.message);
             }
        }
        res.status(500).json({ success: false, message: "Error saving recipe.", error: error.message });
    }
};


// 📌 Remove a Saved Recipe
exports.removeSavedRecipe = async (req, res) => {
    try {
        if (!req.user || (!req.user.id && !req.user._id)) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
        }

        const userId = req.user.id?.toString() || req.user._id?.toString();
        // --- CORRECTION HERE: Get recipeId from req.params ---
        const { recipeId } = req.params;

        if (!recipeId) {
            // This check might be redundant if route requires parameter, but good practice
            return res.status(400).json({ success: false, message: "Recipe ID is required in URL path." });
        }

        // Ensure recipeId is treated as a string
        const recipeIdStr = recipeId.toString();

        // Find the user (not using lean() because we need to save changes)
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the recipe ID (string) exists in the user's saved list
        if (!user.savedRecipes.includes(recipeIdStr)) {
            return res.status(404).json({ success: false, message: "Recipe not found in your saved list." });
        }

        // Remove recipe ID (string) from user's saved list
        user.savedRecipes = user.savedRecipes.filter(id => id !== recipeIdStr);
        await user.save();

        // Optional: Clean up Recipe from Recipe collection if no other user has it saved.
        // This check can be resource-intensive if you have many users.
        // Consider if you really need to delete from the main Recipe collection.
        // If you keep it, it acts as a cache. If you delete, it saves space.

        // Check if any other user has this recipe saved (using the string ID)
        const otherUsersCount = await User.countDocuments({
            _id: { $ne: userId }, // Exclude the current user
            savedRecipes: recipeIdStr
        });

        // If no other user has it saved, remove from Recipe collection using 'apiId'
        if (otherUsersCount === 0) {
            // --- CORRECTION HERE ---
            await Recipe.deleteOne({ apiId: recipeIdStr });
             console.log(`Recipe with apiId ${recipeIdStr} deleted as no users have it saved.`);
        } else {
             console.log(`Recipe with apiId ${recipeIdStr} kept as ${otherUsersCount} other users have it saved.`);
        }

        res.status(200).json({ success: true, message: "Recipe removed successfully from your list." });

    } catch (error) {
        console.error("Error removing saved recipe:", error.message);
        res.status(500).json({ success: false, message: "Error removing saved recipe.", error: error.message });
    }
};