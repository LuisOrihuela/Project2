const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const bcryptSalt = 10;
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const mongo = require('mongodb')


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
  const Userid = "";

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

      

      newUser.save((err, user) => {
        if (err) {
          res.send("Something went wrong");
        } else {
          const id = user._id
          const token = jwt.sign({ name, email, hashPass }, "the_secret_key");
          res.json({
            token,
            email,
            name,
            id
          });            
        }
      });
    })
    .catch(err => next(err));

    User.find({name, email})
      .then(user => user._id )
});

router.get("/dashboard/:_id", verifyToken, (req, res) => {
  jwt.verify(req.token, "the_secret_key", err => {
    // verifies token
    if (err) {
      // if error, respond with 401 code
      console.log(err);
      res.sendStatus(401);
    } else {
      // otherwise, respond with private data      
      User.find({_id: req.params._id})
        .then(user => res.send(user))
        .catch(err => console.log(err))
    }
  });
});

router.put('/agregar-factura/:id',(req,res) => { 
  const ticket = req.body
  console.log(ticket)
  const id = req.params.id
  User.findByIdAndUpdate(id, {$push: {tickets: ticket}})
    .then(ticket=>{
      res.send(ticket)
      console.log("Succsefully added")
    })
    .catch(err => console.log(err))    
})


router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Please enter both username and password");
    return;
  }
  User.find
  User.findOne({ email: email })
    .then(user => {
      const name = user.name;
      const id = user._id
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
          name,
          id
        })
      } else {
        res.status(400).send({ error: "incorrect password" });
      }
    })
    .catch(err => next(err));
});

module.exports = router;
