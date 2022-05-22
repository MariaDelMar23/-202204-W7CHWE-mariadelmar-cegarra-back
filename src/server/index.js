require("dotenv").config();
const cors = require("cors");
const debug = require("debug")("redSocial:server");
const chalk = require("chalk");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { notFoundError, generalError } = require("./middlewares/errors");
const userRouter = require("./routers/UserRouter");

const app = express();

const startServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.yellow(`Server listening on http://localhost:${port}`));
      resolve();
    });

    server.on("error", (error) => {
      reject(error);
    });
  });

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("uploads"));

app.use("/user", userRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = startServer;
