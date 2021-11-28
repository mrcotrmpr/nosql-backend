// reads the .env file and stores it as environment variables, use for config
require('dotenv').config()

const connect = require('./connect')

const User = require('./src/models/user.model')
const Thread = require('./src/models/thread.model')
const Comment = require('./src/models/comment.model')
const Subcomment = require('./src/models/subcomment.model')

// connect to the databases
connect.mongo(process.env.MONGO_TEST_DB)

beforeEach(async () => {
    // drop all collections before each test
    await Promise.all([User.deleteMany(), Thread.deleteMany(), Comment.deleteMany(), Subcomment.deleteMany()])
});