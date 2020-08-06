//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const ejs = require("ejs");
const { request } = require("express");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Variables
const blogs = [];

// get requests

app.get("/",(req,res)=>{
  console.log(blogs);
  res.render("home",{
    homeStartingContent_h : homeStartingContent,
    blogs_h : blogs
  });
})

app.get("/about",(req,res)=>{
  res.render("about",{aboutContent_h : aboutContent});
})

app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent_h : contactContent});
})

app.get("/compose",(req,res)=>{
  res.render("compose");
})

app.get("/posts/:postname",(req,res)=>{
  console.log(req.params.postname);
  let post_body, title;
  blogs.forEach((blog)=>{
    if( _.lowerCase(blog.postTitle) === _.lowerCase(req.params.postname) ){
      post_body = blog.postBody; 
      title = blog.postTitle;
      console.log(typeof(post_body));
      console.log("match-found");
    }
  })
  res.render("post",{
    post_title: title,
    blogPost: post_body
  });
})
//get requests end

// post requests

app.post("/compose",(req,res)=>{
  const post = {
    postTitle: req.body.blog_title,
    postBody: req.body.blog,
    postlink: _.lowerCase(req.body.blog_title)
  };
  blogs.push(post);
  res.redirect("/");
})








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
