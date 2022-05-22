const User = require("../../database/models/User");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.status(200).json({ users });
  } catch (error) {
    error.customMessage = "Could not get any users";
    error.statusCode = 405;

    next(error);
  }
};

module.exports = { getUsers };
