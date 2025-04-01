const axios = require("axios");
const Recipe = require("../models/recipe.model");
const User = require("../models/user.model");

exports.saveRecipe = async (req, res) => {
    try {
        const { userId, recipeData } = req.body;

        // Check if the recipe already exists in the database
        let recipe = await Recipe.findOne({ apiId: recipeData.id });

        if (!recipe) {
            recipe = new Recipe({
                title: recipeData.title,
                image: recipeData.image,
                summary: recipeData.summary,
                ingredients: recipeData.ingredients || [],
                instructions: recipeData.instructions || "",
                apiId: recipeData.id
            });

            await recipe.save();
        }

        // Add recipe to the user's saved recipes if not already saved
        const user = await User.findById(userId);
        if (!user.savedRecipes.includes(recipe._id)) {
            user.savedRecipes.push(recipe._id);
            await user.save();
        }

        res.json({ message: "Recipe saved successfully", recipe });
    } catch (error) {
        res.status(500).json({ error: "Error saving recipe" });
    }
};

exports.getSavedRecipes = async (req, res) => {
    try {
        const { userId } = req.params;

        // Populate saved recipes from database
        const user = await User.findById(userId).populate("savedRecipes");
        res.json(user.savedRecipes);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving saved recipes" });
    }
};
