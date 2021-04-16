const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

require("dotenv").config();
router.use(cors());
router.post("/signup", cors(), (req, res) => {
  const { name, username, password, email, profilePic } = req.body;

  if (!name || !username || !password || !email) {
    return res.status(401).json({ err: "please fill all fields" });
  } else {
    //check if user with an email exists
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          res.json("a user with this email exists");
        } else {
          //checks if user with an email already exists
          User.findOne({ username: username })
            .then((savedUsername) => {
              if (savedUsername) {
                res.json("a user with this username exists");
              } else {
                //encrypt password with bcrypt
                bcrypt.genSalt(10, function (err, salt) {
                  if (err) {
                    return res.json(err);
                  }
                  bcrypt.hash(password, salt, function (err, hash) {
                    if (err) {
                      return res.json(err);
                    }
                    //create an instance of the user model with the parameters passed in
                    const user = new User({
                      name,
                      username,
                      password: hash,
                      email,
                      profilePic,
                    });
                    user
                      .save()
                      .then((response) => {
                        console.log("user signd up");
                        return res.json({
                          success: "sign up successful" + req.body.username,
                          response: response,
                        });
                      })
                      .catch((err) => {
                        return res.status(500).json({ err });
                      });
                  });
                });
              }
            })
            .catch((err) => {
              res.json(err);
            });
        }
      })
      .catch((err) => res.json(err));
  }
});

router.post("/signin", cors(), (req, res) => {
  if (req.body == null || req.body == undefined) {
    return res
      .status(401)
      .json({ err: "password and username required for login" });
  }
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ err: "password and username required for login" });
  }

  User.findOne({ email })
    .then((result) => {
      if (result == undefined || result == null) {
        return res.json({ err: "incorrect email or password" });
      }

      bcrypt.compare(password, result.password, function (err, validPassword) {
        if (err) {
          return res.json({ err: "incorrect email or password" });
        }

        if (!validPassword) {
          return res.json({ err: "incorrect email or password" });
        }

        const {
          name,
          username,
          email,
          posts,
          following,
          followers,
          _id,
        } = result;

        jwt.sign(
          { user: _id },
          `${process.env.privateKey}`,
          function (err, token) {
            if (err) {
              return res.status(500).json(err);
            }
            console.log(name);
            return res.json({
              token,
              user: { name, username, email, posts, following, followers, _id },
            });
          }
        );
      });
    })
    .catch((err) => {
      if (err) {
        return res.json({ err: "incorrect email or password" });
      }
    });
});

module.exports = router;
