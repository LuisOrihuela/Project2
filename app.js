const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
require('dotenv/config');

mongoose
  .connect('mongodb://localhost/Project2', {useNewUrlParser: true})
  .then(x =>{
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err=>{
    console.error('Error connecting to Mongo', err)
  })

  //middleware to enable sessions in Express
  // app.use(session({
  //   secret: "auth-secret",
  //   cookie: { maxAge: 60000 },
  //   resave: false,
  //   saveUninitialized: true,
  //   store: new MongoStore({
  //     mongooseConnection: mongoose.connection,
  //     ttl: 24 * 60 * 60 // 1 day
  //   })
  // }));

  

  //Middlewares
  app.use(logger('dev'))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(cookieParser());
  app.use(cors());



app.get('/',(req,res)=>{
  res.send("Home Page")
})

//Import routes
app.use('/', require('./routes/authRoutes'))

app.listen(process.env.PORT || 5000, ()=>console.log(`Listening on Port ${process.env.PORT}`))