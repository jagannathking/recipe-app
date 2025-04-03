const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Added unique constraint for email
        lowercase: true // Store emails consistently
    },
    password: {
        type: String,
        required: true
    },
    // This stores an array of Spoonacular recipe IDs as strings
    savedRecipes: [{ type: String }]
}, { timestamps: true }); // Added timestamps

const User = mongoose.model('User', userSchema);

module.exports = User;