const express = require('express');
const bp = require('body-parser');
const mongo = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bp.urlencoded({extended: true}));

let tasklist = [];

mongo.connect('mongodb://localhost:27017/ToDolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

const ListSchema = new mongo.Schema({
  name: {
    required: true,
    type: String
  }
});

const List = mongo.model("List",ListSchema);

const task_1 = new List({
  name: "Task 1"
});

const task_2 = new List({
  name: "Task 2"
});

const task_3 = new List({
  name: "Task 3"
});


app.get("/",(req,res)=>{
  var date = new Date();

  options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  var day = date.toLocaleDateString("en-US", options);

  List.find((err, list)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render('index', {currDay: day,tasklist_e: list});
      // if(tasklist.length === 0){
      //   List.find({},(err,item)=>{
      //     if(err){
            
      //     }
      //     else{
      //     item.forEach((task)=>{
      //       tasklist.push(task.name);
      //     });
      //   }
      //   });
      //   res.redirect("/");
      // }
      // else{
      //   res.render('index', {currDay: day,tasklist_e: tasklist});
      // }
    }
  });
});

app.post("/",(req,res)=>{
    var task_name = req.body.task;
    const task = new List({
      name: task_name
    });
    task.save();
    tasklist.push(task.name);
    res.redirect("/");
});

app.post("/delete",(req,res)=>{
  console.log(req.body.checkbox.name);
  List.deleteOne({name: req.body.checkbox.name},(err)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log("Successful deletion");
      res.redirect("/");
    }
  })
})

app.listen('3000',()=>{
  console.log("Server start");
});
