const express = require("express");
const app = express();
app.get("/",function(req,res){
  res.send("<h1>Page0</h1>")
})

app.get("/next",function(req,res){
  res.send("<h1>Page2</h1>")
})

app.get("/next/thenext",function(req,res){
  res.send("<h1>Page3</h1>")
})

app.listen(4000);
console.log("server running");
