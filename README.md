# MongoDB / Mongoose backend

### About

This is a reddit-like backend which uses a combination of MongoDB and Neo4j. 

### Installing

Run `npm install` in the root directory.

### Running the app

Copy `.env.dist` to a `.env` file and set the variables
The backend can be started with `npm start`. It will start listening and serve your requests.

### Running the tests

To run all tests use `npm test`. There are three kinds of tests:
- unit tests on the schemas
- integration tests on the endpoints
- system tests by walking through a 'user journey'
