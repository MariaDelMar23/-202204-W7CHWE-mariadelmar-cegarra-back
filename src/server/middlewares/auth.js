require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization.includes("Bearer ")) {
      throw new Error();
    }
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch {
    const customError = new Error("Invalid token");
    customError.statusCode = 401;

    next(customError);
  }
};

module.exports = auth;
