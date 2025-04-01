const express = require('express');
const connectData = require('./config/database')
const cors = require('cors')
const userRoutes = require('./routes/user.routes')
const recipeRoutes = require('./routes/recipe.routes')


const app = express();


// connect database
connectData();


// middlewares
app.use(express.json())
app.use(cors)


// test routes
app.get("/", (req, res) => {
 res.status(200).json({message: "Healthy"})
})


// all routes
app.use('/api/users',userRoutes)
app.use('/api/recipes',recipeRoutes)


module.exports = app;