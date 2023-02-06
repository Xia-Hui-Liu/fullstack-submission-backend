require("dotenv").config();

const PORT = process.env.port;
const URL = process.env.NODE_ENV === "test" 
  ? process.env.test_MONGODB_URI
  : process.env.MONGODB_URI;

module.exports = {
  URL,
  PORT
};