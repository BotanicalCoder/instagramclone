const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  title: { type: String },
  body: { type: String },
  postedBy: { type: Schema.Types.ObjectId, ref: "user" },
  media: { default: "", type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
  comments: [
    {
      comment: { type: String },
      postedBy: { type: Schema.Types.ObjectId, ref: "user" },
    },
  ],
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;
