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
    res.render('index');
});

app.get("/login", function(req, res){
    res.render('login');
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
    models.user.findOne({where:{"username":req.body.username, "password":req.body.password}}).then(function(data){
    req.session.user = data["username"];
    res.render('index');
}).catch(function(err){
    res.redirect("login", {msg:err});
    })
})

app.get("/signup", function(req, res){
    res.render("signup");
})

app.post("/signup", function(req, res){
    var errors;
    if (req.body.password === req.body.conf_password){
        var userObj = {
            fname: req.body.fname,
            lname: req.body.lname,
            username: req.body.username,
            password: req.body.password
        };
        var newUser = models.user.build(userObj);
        newUser.save().then(function(savedUser){
            msg = "User was created successfully";
            res.redirect("signup", {errors:msg});
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


// app.post("/favsongs", function(req, res){
//   var songobj = {songid: req.body.id, 
//               genre: req.body.genre,
//               title: req.body.title,
//               description: req.body.description,
//               avatar_url: req.body.user.avatar_url,
//               stream_url: req.body.stream_url,
//               user: req.body.user.username  
//               }
//   models.songs.build(songobj)
//   .save().then(function(savedsong){
//     res.redirect("/");
//   }).catch(function(err){
//     res.status(500).send(err);
//   });
// })

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});