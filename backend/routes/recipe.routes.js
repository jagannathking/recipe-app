const express = require("express");
const { saveRecipe, getSavedRecipes } = require("../controllers/recipe.controller");

const router = express.Router();

router.post("/save", saveRecipe);
router.get("/saved/:userId", getSavedRecipes);

module.exports = router;
