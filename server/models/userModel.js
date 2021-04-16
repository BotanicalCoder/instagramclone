const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema, ObjectId } = mongoose;

const userSchema = new Schema({
  name: String,
  username: { type: String, unique: true, uniqueCaseSensitive: true },
  password: String,
  email: { type: String, unique: true, uniqueCaseSensitive: true },
  profilePic: {
    type: String,
    default:
      "https://res.cloudinary.com/botanicalcoder/image/upload/v1610622401/user_yq9gcr.jpg",
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "post" }],
  following: [{ type: Schema.Types.ObjectId, ref: "user" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "user" }],
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("user", userSchema);

module.exports = User;
