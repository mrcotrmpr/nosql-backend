// reads the .env file and stores it as environment variables, use for config
require('dotenv').config()

const app = require('./src/app')

const port = process.env.PORT
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
