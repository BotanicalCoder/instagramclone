const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  

  if (!authorization || authorization == undefined) {
    return res.status(401).json({ error: "you must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.privateKey, (err, result) => {
    if (err) {
      return res.status(401).json("sign in to view this page");
    }
    req.user = result.user;

    next();
  });
};
