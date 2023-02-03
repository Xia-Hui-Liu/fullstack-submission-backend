# Blog API App
A RESTful API for a blog application, built with Node.js, Express, and MongoDB.

## Third Party libraries/modules
The app uses the following modules:
- cors for enabling CORS
- express for creating the server
- mongoose for connecting to the MongoDB database
- morgan for logging HTTP requests
- nodemon for restarting the server when changes are made
- eslint for linting the code
- jest for testing the code
- lodash for utility functions

### How it works
The app uses the following routes:
- /api/blogs: GET, POST
- /api/blogs/:id: GET, PUT, DELETE

#### Environment Variables
The app uses the following environment variables:

- PORT: The port number for the server
- MONGODB_URI: The URI for the MongoDB database

##### How to run
- Make sure you have Node.js and npm installed
- Clone the repository and navigate to the project directory
- Run npm install to install the necessary dependencies
- Create a .env file in the root of the project and set the environment variables
- Run node index.js/npm start/npm run dev to start the app