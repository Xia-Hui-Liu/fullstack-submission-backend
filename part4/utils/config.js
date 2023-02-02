require('dotenv').config()

const PORT = process.env.port
const URL = process.env.MONGODB_URI

module.exports = {
    URL,
    PORT
}