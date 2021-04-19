const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Post = require("../models/postModel");
const validateLogin = require("../middleware/validateLogin");
const cors = require("cors");

router.use(cors());

router.get("/:username", validateLogin, (req, res) => {
  const { username } = req.params;
  if (username == null || username == undefined) {
    return res.json("no user id");
  }

  User.find({ username: username })
    .populate({ path: "posts", select: "-_id -__v" })
    .select("-__v -password")
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => res.json(err));
});

router.put("/follow/:userId", validateLogin, (req, res) => {
  const { userId } = req.params;
  if (userId == null || userId == undefined) {
    return res.json("no user id");
  }
  User.findByIdAndUpdate(
    req.user,
    {
      $push: { following: userId },
    },
    { new: true }
  )
    .then(() => {
      User.findByIdAndUpdate(
        userId,
        { $push: { followers: userId } },
        { new: true }
      )
        .then((updatedUser) => {
          res.send(updatedUser);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => console.log(err));
});

router.put("/unfollow/:userId", validateLogin, (req, res) => {
  const { userId } = req.params;
  if (userId == null || userId == undefined) {
    return res.json("no user id");
  }
  User.findByIdAndUpdate(
    req.user,
    {
      $pull: { following: userId },
    },
    { new: true }
  )
    .then(() => {
      User.findByIdAndUpdate(
        userId,
        { $pull: { followers: userId } },
        { new: true }
      )
        .then((updatedUser) => {
          res.send(updatedUser);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => console.log(err));
});

router.put("/edit/:oldusername", validateLogin, (req, res) => {
  let { newUsername, newProfilePic } = req.body;
  const { oldusername } = req.params;
  if (!newUsername && !newProfilePic) {
    return res.send("input either the title or body");
  }

  User.find({ username: oldusername })
    .select("username profilePic -_id")
    .then((profileInReview) => {
      //console.log(profileInReview);

      let { username, profilePic } = profileInReview;
      if (
        newUsername == undefined ||
        newUsername == null ||
        newUsername == " "
      ) {
        newUsername = username;
      }
      if (
        newProfilePic == undefined ||
        newProfilePic == null ||
        newProfilePic == " "
      ) {
        newProfilePic = profilePic;
      }
      console.log(newUsername, newProfilePic);

      User.findOneAndUpdate(
        { username: oldusername },
        {
          $set: { username: newUsername, profilePic: newProfilePic },
        },
        { new: true }
      )

        .populate({ path: "posts", select: "-_id -__v" })
        .select("-__v")
        .then((editedProfile) => {
          const {
            name,
            username,
            email,
            posts,
            following,
            followers,
            _id,
            profilePic,
          } = editedProfile;
          return res.json({
            message: "profile edited",
            user: {
              name,
              username,
              email,
              posts,
              following,
              followers,
              _id,
              profilePic,
            },
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
