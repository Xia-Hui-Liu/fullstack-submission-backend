const blogsRouter = require("./controller/blogs");
const config = require("./utils/config");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const usersRouter = require("./controller/users");
const loginRouter = require("./controller/login");

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
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"));

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);


module.exports = app;