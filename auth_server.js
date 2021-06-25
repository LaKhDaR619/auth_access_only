const express = require("express");
const jwt = require("jsonwebtoken");

const PORT = 5500;
const secret = "SECRET";
const lifetime = 3600; // 1 hour

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.json());

const user = {
  username: "test",
  password: "1234",
};

// login
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
      const access_token = jwt.sign(
        {
          sub: { username },
          iat: Math.round(Date.now() / 1000),
          exp: Math.round(Date.now() / 1000 + lifetime),
        },
        secret
      );

      return res.json({
        access_token,
      });
    }

    res.sendStatus(401);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

// refresh the token
app.post("/refresh", (req, res) => {
  try {
    const access_token = req.headers.access_token;

    const payload = jwt.verify(access_token, secret);

    const new_access_token = jwt.sign(
      {
        sub: payload.sub,
        iat: Math.round(Date.now() / 1000),
        exp: Math.round(Date.now() / 1000 + lifetime),
      },
      secret
    );

    res.json({
      access_token: new_access_token
    });
  } catch {
    res.sendStatus(401);
  }
});

app.listen(PORT, () => console.log(`auth server listening at port: ${PORT}`));
