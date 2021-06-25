const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path");

const PORT = 5000;
const secretKey = "SECRET";
const lifetime = 3600;
const timeToRefresh = lifetime - 10; // after every 10 seconds we ask the user to refresh

const posts = ["post 1", "post 2", "post 2030"];

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/posts", (req, res) => {
  res.sendFile(path.join(__dirname, "public") + "/posts.html");
});

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, secretKey);

    if(payload.exp - Math.round(Date.now() / 1000) < timeToRefresh) return res.sendStatus(401);

    res.locals.user = payload;

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
};

app.use("/api/", verifyToken);

// get posts
app.get("/api/posts", (req, res) => {
  res.send(posts);
});

app.listen(PORT, () =>
  console.log(`resource server listening at port: ${PORT}`)
);
