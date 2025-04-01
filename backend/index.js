const app = require('./app');






// server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is runing on PORT ${PORT}`)
})


