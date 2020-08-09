const express = require('express');
const bp = require('body-parser');
const mongo = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bp.urlencoded({extended: true}));

mongo.connect('mongodb://localhost:27017/ToDolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Lists collection
const ListSchema = new mongo.Schema({
  name: {
    required: true,
    type: String
  }
});

const List = mongo.model("List",ListSchema);

//Liststores collection
const ListstoreSchema = new mongo.Schema({
  name: {
    required: true,
    type: String
  },
  lists: [ListSchema] 
});

const listStore = new mongo.model("listStore",ListstoreSchema);

app.get("/",(req,res)=>{
  // var date = new Date();
  // options = {
  //   weekday: "long",
  //   day: "numeric",
  //   month: "long"
  // };
  // var day = date.toLocaleDateString("en-US", options);

  List.find((err, list)=>{
    if(err){
      console.log(err);
    }
    else{
      //res.render('index', {currDay: day,tasklist_e: list}); displays todays date
      res.render('index', {currlist: "Today",tasklist_e: list});
    }
  });
});

app.get("/:customListName",(req,res)=>{
  if(listStore.findOne({name: req.params.customListName},(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      if(!result){
        res.render('index', {currlist: req.params.customListName, tasklist_e: []});
      }
      else{
        res.render('index', {currlist: result.name, tasklist_e: result.lists});
      }
    }
  }));
});

app.post("/",(req,res)=>{
    let task_name = req.body.task;
    let list_name = req.body.list;
    const task = new List({
      name: task_name
    });
    if(list_name === "Today"){
      task.save();
      res.redirect("/");
    }
    else{
      listStore.findOne({name: list_name},(err, result)=>{
        if(err){
          console.log(err);
        }
        else{
          if(!result){ 
          const list1 = new listStore({
            name: list_name,
            lists: [task]
          }); 
          list1.save();
          res.redirect("/"+list_name);
          }
          else{
          result.lists.push(task);
          result.save();
          res.redirect("/"+list_name);
          }
        }
      });
    }

});

app.post("/delete",(req,res)=>{
  console.log(req.body);
  let listHead = req.body.list_id;
  let listItemId = req.body.checkbox;
  console.log(listHead);
  console.log(listItemId);
  if(listHead === "Today"){
    List.deleteOne({_id: listItemId},(err)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("Successful deletion");
        res.redirect("/");
      }
    })
  }
  else{
    console.log(2);
    listStore.findOneAndUpdate({name: listHead},{$pull: {lists: {_id: listItemId}}},(err,result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/"+listHead);
      }
    });    
  }
})

app.listen('3000',()=>{
  console.log("Server start");
});
