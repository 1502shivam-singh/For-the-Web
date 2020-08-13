require('dotenv').config()
const express = require('express');
const bp = require('body-parser');
const mongo = require("mongoose");
var encrypt = require('mongoose-encryption');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bp.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongo.connect('mongodb://localhost:27017/UsersDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongo.Schema({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongo.model("User",userSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("/secrets");
});


app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
})

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/submit",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
});

app.post("/submit",(req,res)=>{
    User.findById(req.user.id, (err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            if(result){
                result.secret = req.body.secret;
                result.save((err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.redirect("/secrets");
                    }
                });
            }
        }
    });
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/secrets",(req,res)=>{
    User.find({secret: {$ne: null}},(err,results)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets",{secrets_e: results});
        }
    })
})

app.post("/register",(req,res)=>{
    User.register({email: req.body.username}, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, ()=>{
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login",(req,res)=>{
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });
    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secrets");
            });
        }
    });
});

app.listen('3000',()=>{
    console.log("Server start");
});