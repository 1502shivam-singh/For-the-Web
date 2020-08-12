const express = require('express');
const bp = require('body-parser');
const mongo = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bp.urlencoded({extended: true}));

mongo.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const Article = new mongo.model("article", {
    title: {
        required: true,
        type: String
    },
    content: {
        type: String,
        required: true
    }
});

const node_wiki = new Article({
    title: "Node.js",
    content: "Node allows javascript to interact with hardware"
});
//node_wiki.save();

//GET, POST, DELETE, PUT and PATCH on articles route 

app.route("/articles")

.get((req,res)=>{
    Article.find((err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(result);
        }
    });
})

.post((req,res)=>{
    const post_title = req.body.title;
    const post_content = req.body.content;
    
    const post_wiki = new Article({
        title: post_title,
        content: post_content
    });

    post_wiki.save();
    res.redirect("/articles");
})

.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("Succesfully deleted all articles");
        }
    });
});

//GET, POST, DELETE, PUT and PATCH on custom article title route 

app.route("/articles/:customRoute")

.get((req,res)=>{
    Article.find({title: req.params.customRoute},(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
})

.put((req,res)=>{
    Article.update({title: req.params.customRoute},{title: req.body.newTitle, content: req.body.newContent},{overwrite: true},(err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("Record updated with put request");
        }
    });
})

.patch((req,res)=>{
    Article.update({title: req.params.customRoute}, {$set: req.body} ,(err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("Record updated with patch request");
        }
    });
})

.delete((req,res)=>{
    Article.deleteMany({title: req.params.customRoute},(err)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("Succesfully deleted article on "+req.params.customRoute);
        }
    });
});



app.listen('3000',()=>{
  console.log("Server start");
});
