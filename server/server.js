const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

const user = require("./routes/user");
const post = require("./routes/post");
const auth = require("./routes/auth");
const port = process.env.PORT || 5000;
mongoose
  .connect(`${process.env.CONNECTIONURI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((err) => console.log(err));

mongoose.connection.on("open", () => {
  console.log("db connected");
});

app.use("/user", user);
app.use("/post", post);
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("server listening on port  " + port);
});
