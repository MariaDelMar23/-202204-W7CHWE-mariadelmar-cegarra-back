const express = require("express");
const { loginUser, registerUser } = require("../controllers/UserControllers");

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);

module.exports = userRouter;
