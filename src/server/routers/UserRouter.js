const express = require("express");
const loginUser = require("../controllers/UserControllers");

const userRouter = express.Router();

userRouter.post("/login", loginUser);

module.exports = userRouter;
