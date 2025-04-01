const app = require('./app');
const dotenv = require('dotenv')

dotenv.config()


// server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is runing on PORT ${PORT}`)
})


