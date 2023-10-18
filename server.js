//importing npm dependencies
const express = require("express");
const session = require('express-session')
const dotenv = require("dotenv");
const upload=require('express-fileupload')
const path=require('path')

dotenv.config();

//importing other dependencies
const doctorRoute=require('./routes/doctor')
const patientRoute=require('./routes/patient')
const locRoute=require('./routes/getLocation')

const app = express();

//setting ejs as view engine for frontend
app.set('view engine','ejs');

//declaring middleware usage
app.use(express.urlencoded())
app.use(express.json())
app.use(upload())
app.use(session({
    secret: 'blackcatnero',
    resave: false,
    saveUninitialized: true
  }))
app.use(express.static(__dirname+'/static'))
 
app.use('/doctor',doctorRoute)
app.use('/patient',patientRoute)
app.use('/getLocation',locRoute)


app.get('/home', (req,res)=>{
  res.render('index')
})


//starting app on port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
