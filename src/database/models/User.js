const { Schema, model, SchemaType } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  // friends: [
  //   {
  //     type: SchemaType.ObjectId,
  //     ref: "User",
  //     default: [],
  //   },
  // ],
  // enemies: [
  //   {
  //     type: SchemaType.ObjectId,
  //     ref: "User",
  //     default: [],
  //   },
  // ],
});

const User = model("User", UserSchema, "users");

module.exports = User;
