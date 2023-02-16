const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");
// const bodyParser = require("body-parser");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const config = require("./utils/config");
const mongoose = require("mongoose");

const usersRouter = require("./controller/users");
const loginRouter = require("./controller/login");
const blogsRouter = require("./controller/blogs");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.URL);
mongoose.connect(config.URL)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"));

app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);

module.exports = app;