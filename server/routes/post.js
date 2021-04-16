const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
const validateLogin = require("../middleware/validateLogin");
const User = require("../models/userModel");

router.post("/create", validateLogin, (req, res) => {
  const { title, body, media } = req.body;
  if (!title && !body && !media) {
    return res.send("please fill all fields");
  }
  const post = new Post({
    title,
    body,
    postedBy: req.user,
    media,
  });
  post
    .save()
    .then((newPost) => {
      User.findOneAndUpdate(
        { _id: req.user },
        { $push: { posts: newPost._id } },
        { new: true }
      )
        .select("-password")
        .then(() => {
          return res.send("post created");
        })
        .catch((err) => {
          return res.json(err);
        });
    })
    .catch((err) => res.json({ err }));
});

router.put("/like/:postId", validateLogin, (req, res) => {
  const { postId } = req.params;

  if (postId == null || postId == undefined) {
    res.status(401).send("no post id");
  }
  Post.findByIdAndUpdate(postId, { $push: { likes: req.user } }, { new: true })
    .then(() => {
      fetchPost(req, res);
    })
    .catch((err) => console.log(err));
});

router.put("/unlike/:postId", validateLogin, (req, res) => {
  const { postId } = req.params;
  if (postId == null || postId == undefined) {
    res.status(401).send("no post id");
  }
  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: req.user },
    },
    { new: true }
  )
    .then(() => {
      fetchPost(req, res);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/comment/:postId", validateLogin, (req, res) => {
  const { postId } = req.params;

  if (postId == null || postId == undefined) {
    res.status(401).send("no post id");
  }
  Post.findByIdAndUpdate(
    postId,
    { $push: { comments: { comment: req.body.comment, postedBy: req.user } } },
    { new: true }
  )
    .select(" -_id ")
    .populate("postedBy")
    .then(() => fetchPost(req, res))
    .catch((err) => console.log(err));
});

router.put("/uncomment/:postId/:commentId", validateLogin, (req, res) => {
  const { postId, commentId } = req.params;
  if (postId == null || postId == undefined) {
    res.status(401).send("no post id");
  }
  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { comments: { _id: commentId } },
    },

    { new: true }
  )
    .then(() => {
      fetchPost(req, res);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/edit/:postId", validateLogin, (req, res) => {
  let { newTitle, newBody } = req.body;
  const { postId } = req.params;
  if (!newTitle && !newBody) {
    return res.send("input either the title or body");
  }

  Post.findById(postId)
    .select("title body -_id")
    .then((postInReview) => {
      let { title, body } = postInReview;
      if (newTitle === undefined || newTitle === null) {
        newTitle = title;
      }
      if (newBody === undefined || newBody === null) {
        newBody = body;
      }

      Post.findByIdAndUpdate(postId, {
        $set: { title: newTitle, body: newBody },
      })
        .then((editedPost) => {
          return res.send(editedPost);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/delete/:postId", validateLogin, (req, res) => {
  const { postId } = req.params;

  Post.findByIdAndDelete(postId)
    .then(() => {
      User.findOneAndUpdate(
        { _id: req.user },
        { $pull: { posts: postId } },
        { new: true }
      )
        .then(fetchPost(req, res, postId))
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/all", validateLogin, (req, res) => {
  fetchPost(req, res);
});

const fetchPost = (req, res) => {
  return Post.find({})
    .select(" -__v ")
    .populate("postedBy", "username name profilePic")
    .populate("comments.postedBy", "username")
    .sort({ _id: -1 })
    .then((posts) => {
      res.json({ message: "done", posts: posts });
    })
    .catch((err) => {
      res.json({ err });
    });
};

module.exports = router;
