const express = require("express");
const multer = require("multer");
const path = require("path");
const { loginUser, registerUser } = require("../controllers/UserControllers");
const { getUsers } = require("../controllers/UsersControllers");
const auth = require("../middlewares/auth");

const userRouter = express.Router();
const uploads = multer({ dest: path.join("uploads", "images") });

userRouter.post("/login", loginUser);
userRouter.post("/register", uploads.single("image"), registerUser);
userRouter.get("/users", auth, getUsers);

module.exports = userRouter;
