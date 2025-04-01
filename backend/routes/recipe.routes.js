const express = require("express");
const { saveRecipe, getSavedRecipes, searchRecipes } = require("../controllers/recipe.controller");

const router = express.Router();

router.get("/search", searchRecipes);
router.post("/save", saveRecipe);
router.get("/saved/:userId", getSavedRecipes);

module.exports = router;
