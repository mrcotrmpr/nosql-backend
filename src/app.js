const express = require('express')

// this catches an exception in a route handler and calls next with it,
// so express' error middleware can deal with it
// saves us a try catch in each route handler
require('express-async-errors')

const app = express()

// helmet sets headers to avoid common security risks
const helmet = require('helmet')
app.use(helmet())

// use morgan for logging
const morgan = require('morgan')
app.use(morgan('dev'))

// parse json body of incoming request
app.use(express.json())

const userRoutes = require('./routes/user.routes')
app.use('/user', userRoutes)

// catch all not found response
app.use('*', function(_, res) {
    res.status(404).end()
})

// error responses
app.use('*', function(err, req, res, next) {
    console.error(`${err.name}: ${err.message}`)
    // console.error(err)
    next(err)
})

app.use('*', function(err, req, res, next) {
    res.status(500).json({
        message: 'something really unexpected happened'
    })
})

// export the app object for use elsewhere
module.exports = app