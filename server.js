// IMPORTS
const express = require("express");
const models = require("./models")
const bodyParser = require("body-parser");
const morgan = require("morgan")
const app = express();
const session = require("express-session");
const port = process.env.PORT || 3000;
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator')
const sessionConfig = require("./sessionConfig");
// MIDDLEWARE
app.engine('mustache', mustacheExpress());
app.set('views', './public')
app.use("/", express.static("./public"));
app.set('view engine', 'mustache')
app.use(session(sessionConfig));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(expressValidator());

// ROUTES
app.get("/", function(req, res){
    if (req.session.user){
        var username = req.session.user.charAt(0).toUpperCase() + req.session.user.slice(1);
        res.render('index',{username:username});
    } else {
    res.render('index');
}
});

app.get("/login", function(req, res){
    var msg;
    if (req.session.user){
        msg = 'Welcome '+ req.session.user+'!';
        var username = req.session.user.charAt(0).toUpperCase() + req.session.user.slice(1);
    }
    res.render('login',{msg: msg, username: username});
})

// app.get("/favorites", function(req, res){
//   models.songs.findAll().then(function(foundSongs){
//     res.render("favorites", {songs:foundSongs});
//   }).catch(function(err){
//     res.status(500).send(err);
//   })
// })

app.post("/login", function(req, res){
    console.log(req.body.username);
    console.log(req.body.password);
    models.user.findOne({where:{"username":req.body.username.toLowerCase(), "password":req.body.password.toLowerCase()}}).then(function(data){
    req.session.user = data["username"];
    res.redirect('/');
}).catch(function(err){
    res.redirect("login", {msg:err});
    })
})

app.get("/signup", function(req, res){
    if (req.session.user){
        msg = 'Welcome '+ req.session.user+'!';
        var username = req.session.user.charAt(0).toUpperCase() + req.session.user.slice(1);
        res.render("signup", {username: username, msg: msg})
    } else{
        res.render("signup");
    }
})

app.post("/signup", function(req, res){
    var errors;
    if (req.body.password.toLowerCase() === req.body.conf_password.toLowerCase()){
        var userObj = {
            fname: req.body.fname.toLowerCase(),
            lname: req.body.lname.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password.toLowerCase()
        };
        var newUser = models.user.build(userObj);
        newUser.save().then(function(savedUser){
            msg = "User was created successfully";
            res.render("signup", {errors:msg});
        }).catch(function(err){
        res.status(500).render("signup", {errors :'Please select a different username, that username is taken!'});
        });
    }
    else {
        errors = 'The passwords do not match, please try again!';
        res.render('signup', {errors:errors});
    }   
})

app.get("/post", function(req, res){
    res.render("post");
})

app.post("/post", function(req, res){

})

app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});