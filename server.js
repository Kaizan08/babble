// IMPORTS
const express = require("express");
const models = require("./models")
const bodyParser = require("body-parser");
const morgan = require("morgan")
const app = express();
const port = process.env.PORT || 3000;
const mustacheExpress = require('mustache-express');

// MIDDLEWARE
app.engine('mustache', mustacheExpress());
app.set('views', './public')
app.use("/", express.static("./public"));
app.set('view engine', 'mustache')
app.use(bodyParser.json());
app.use(morgan("dev"));

// ROUTES
app.get("/", function(req, res){
    res.render('index');
});

app.get("/login", function(req, res){
    res.render('login');
})

app.post("/login", function(req, res){
    
})

app.get("/signup", function(req, res){
    res.render("signup");
})

app.post("/signup", function(req, res){

})

app.get("/post", function(req, res){
    res.render("post");
})

app.post("/post", function(req, res){

})
// app.get("/favorites", function(req, res){
//   models.songs.findAll().then(function(foundSongs){
//     res.render("favorites", {songs:foundSongs});
//   }).catch(function(err){
//     res.status(500).send(err);
//   })
// })

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