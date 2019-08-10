const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const Ticket = require('./models/Ticket')
require('dotenv/config');

// mongoose
//   .connect('mongodb://localhost/Project2', {useNewUrlParser: true})
//   .then(x =>{
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
//   })
//   .catch(err=>{
//     console.error('Error connecting to Mongo', err)
//   }) 
mongoose.connect(
  process.env.DB_Connection,
  {useNewUrlParser: true},
  (err)=> {
    if( err ) throw err
    console.log("Connected to DB",)
  }
  );
  

  //Middlewares
  app.use(logger('dev'))
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(cookieParser());
  app.use(cors());


app.get('/tickets/:id',(req,res)=>{  
  console.log("entro")
  Ticket.find({ web_id: req.params.id })
    .then(data =>{
      res.send(data);
    }).catch(err =>{
      res.send(err)
    }) 
})

//Import routes
app.use('/', require('./routes/authRoutes'))

app.listen(process.env.PORT || 5000, ()=>console.log(`Listening on Port ${process.env.PORT}`))