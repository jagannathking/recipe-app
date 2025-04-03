const express = require('express');
const cors = require('cors')


const database = require('./config/database');
const userRouter = require('./routes/user.routes')
const recipeRouter = require("./routes/recipe.routes")

const app = express();


// connect database
database()


// middlewares
app.use(express.json());
app.use(cors());


// test routes
app.get("/", (req, res) => {
    res.status(200).json({message: "Healthy"})
})


// all routes
app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);

module.exports = app;