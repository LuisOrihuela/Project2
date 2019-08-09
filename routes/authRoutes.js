const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;
const jwt = require("jsonwebtoken");
const events = [
  {
    id: "1234",
    title: "Gasolineras G500",
    time: "$250",
    date: "01/08/2019"
  },
  {
    id: "1584",
    title: "Pemex",
    time: "$350",
    date: "03/08/2019"
  },
  {
    id: "2794",
    title: "Hidrosina",
    time: "$150",
    date: "05/08/2019"
  },
  {
    id: "4619",
    title: "bp",
    time: "$200",
    date: "08/08/2019"
  }
];

//Middleware to verify if a token exists
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(401);
  }
}

router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const datosFiscales = req.body.datosFiscales;

  if (!email) {
    res.send("Please type email and password");
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (user !== null) {
        res.json("This email is already associated to an account");
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        email,
        password: hashPass,
        name,
        datosFiscales
      });

      newUser.save(err => {
        if (err) {
          res.send("Something went wrong");
        } else {
          const token = jwt.sign({ name, email, hashPass }, "the_secret_key");
          res.json({
            token,
            email,
            name
          });          
        }
      });
    })
    .catch(err => next(err));
});

router.get("/dashboard", verifyToken, (req, res) => {
  jwt.verify(req.token, "the_secret_key", err => {
    // verifies token
    if (err) {
      // if error, respond with 401 code
      console.log(err);
      res.sendStatus(401);
    } else {
      // otherwise, respond with private data
      res.json({ events: events });
    }
  });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Please enter both username and password");
    return;
  }

  User.findOne({ email: email })
    .then(user => {
      const name = user.name;
      if (!user) {
        res.status("400");
        console.log("user doesn't exist, please create an account");
        return;
      } //If password is correct generate new token and send back the data
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ name, email, password }, "the_secret_key");
        res.json({
          token,
          email,
          name
        });
      } else {
        res.status(400).send({ error: "incorrect password" });
      }
    })
    .catch(err => next(err));
});

module.exports = router;
