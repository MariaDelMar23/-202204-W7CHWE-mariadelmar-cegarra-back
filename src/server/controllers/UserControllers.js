require("dotenv").config();
const debug = require("debug")("redSocial:server:middlewares:loginUser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const path = require("path");
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

const registerUser = async (req, res, next) => {
  const { name, username, password } = req.body;
  const { file } = req;
  const user = await User.findOne({ username });

  if (user) {
    debug(chalk.red("User already exists"));
    const error = new Error("User already exists");
    error.statusCode = 409;

    next(error);
  }
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    let newUserData = {
      name,
      username,
      password: encryptedPassword,
    };

    if (file) {
      debug(file.originalname);
      const newFileName = `${file.originalname.split(".")[0]}-${Date.now()}.${
        file.originalname.split(".")[1]
      }`;
      debug(newFileName);
      fs.rename(
        path.join("uploads", "images", file.filename),
        path.join("uploads", "images", newFileName),
        (error) => {
          if (error) {
            debug(chalk.red(error.message));
            const customError = new Error();
            customError.statusCode = 409;
            customError.customMessage = "Could not rename image";

            next(customError);
          }
        }
      );
      newUserData = { ...newUserData, image: path.join(newFileName) };
    }
    const newUser = await User.create(newUserData);

    res.status(201).json({ newUser });
  } catch (error) {
    error.customMessage = "Couldn't create user";
    error.statusCode = 409;

    next(error);
  }
};

module.exports = { loginUser, registerUser };
