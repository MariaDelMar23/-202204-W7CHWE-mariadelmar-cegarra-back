require("dotenv").config();
const debug = require("debug")("redSocial:server:middlewares:loginUser");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    debug(chalk.red("Incorrect username"));
    const error = new Error("Incorrect username or password");
    error.statusCode = 403;

    next(error);
  } else {
    const correctPassword = await bcrypt.compare(password, user.password);
    const userData = {
      username: user.username,
      id: user.id,
    };
    if (!correctPassword) {
      debug(chalk.red("Incorrect password"));
      const error = new Error("Incorrect username or password");
      error.statusCode = 403;

      next(error);
    } else {
      const token = jwt.sign(userData, process.env.JWT_SECRET);

      res.status(200).json({ token });
    }
  }
};

module.exports = loginUser;
