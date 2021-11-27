# MongoDB / Mongoose backend

### About

This is a backend which uses a combination of MongoDB and Neo4j. 

![image](https://user-images.githubusercontent.com/55551559/143718416-8af39e7c-4603-4f8d-b012-ef75b2d0c355.png)

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
