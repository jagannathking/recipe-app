const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    title: String,
    image: String,
    summary: String,
    ingredients: [String],
    instructions: String,
    apiId: { type: String, unique: true }
});

module.exports = mongoose.model("Recipe", RecipeSchema);
