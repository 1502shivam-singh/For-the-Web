const express = require('express');
const bp = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));

app.use(bp.urlencoded({ extended: false }))

app.post("/",(req,res)=>{
  console.log("info received");
  res.send("Signup success "+req.body.first+" "+" "+req.body.second+" "+req.body.mail);
  
})

app.get("/",(req,res)=>{
  console.log("Server is running");
  res.sendFile(__dirname+"/signup.html");
})

app.listen(3000);
