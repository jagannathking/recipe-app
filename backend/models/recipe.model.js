const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String },
    // This 'apiId' should store the ID from the Spoonacular API (e.g., the 'id' field from their response)
    apiId: { type: String, unique: true, required: true },
    // The 'users' field is currently not used in the save/remove logic.
    // If you wanted to use it, you'd push the user's ObjectId here when saving
    // and pull it when removing. It might be more efficient than querying all users later.
    // users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true }); // Added timestamps for tracking creation/update

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;

// Note: Removed the duplicate 'module.exports = authMiddleware;' line found in the original input.