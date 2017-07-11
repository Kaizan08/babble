// IMPORTS
const express = require("express");
const models = require("./models");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const session = require("express-session");
const port = process.env.PORT || 3000;
const mustacheExpress = require("mustache-express");
const expressValidator = require("express-validator");
const sessionConfig = require("./sessionConfig");
const sequelize = require("sequelize");
// MIDDLEWARE
app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.use("/", express.static("./public"));
app.set("view engine", "mustache");
app.use(session(sessionConfig));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(expressValidator());

// ROUTES
app.get("/", function(req, res) {
  models.post
    .findAll({
      include: [
        { model: models.user, as: "author" },
        { model: models.like, as: "likes" }
      ],
      order: [["id", "DESC"]]
    })
    .then(function(data) {
      // res.json(data)
      for (var i = 0; i < data.length; i++) {
        //does delete
        if (data[i].author.username == req.session.user) {
          data[i].author.username = false;
        }
        if (data[i].author.id !== req.session.userid){
          data[i].userId = false;
        }
        if (data[i]['likes'] != ''){
          for (var j=0; j< data[i]['likes'].length; j++){
            if (data[i]['likes'][j]['authorid'] == req.session.userid ){
              data[i].author.lname = false;
            }
          }
        }
      }
      if (req.session.user) {
        var username =
          req.session.user.charAt(0).toUpperCase() + req.session.user.slice(1);
        res.render("index", { username: username.toLowerCase(), posts: data });
      } else {
        return res.render("index", { posts: data });
      }
    })
    .catch(function(err) {
      res.render("index");
    });
});

app.get("/login", function(req, res) {
  var msg;
  if (req.session.user) {
    msg = "Welcome " + req.session.user + "!";
    var username =
      req.session.user.charAt(0).toUpperCase() + req.session.user.slice(1);
  }
  res.render("login", { msg: msg, username: username });
});

app.post("/login", function(req, res) {
  models.user
    .findOne({
      where: {
        username: req.body.username.toLowerCase(),
        password: req.body.password.toLowerCase()
      }
    })
    .then(function(data) {
      req.session.userid = data["id"];
      req.session.user = data["username"];
      res.redirect("/");
    })
    .catch(function(err) {
      res.redirect("login", { msg: err });
    });
});

app.get("/signup", function(req, res) {
  if (req.session.user) {
    msg = "Welcome " + req.session.user + "!";
    var username =
      req.session.user.charAt(0).toUpperCase() + req.session.user.slice(1);
    res.render("signup", { username: username, msg: msg });
  } else {
    res.render("signup");
  }
});

app.post("/signup", function(req, res) {
  var errors;
  if (
    req.body.password.toLowerCase() === req.body.conf_password.toLowerCase()
  ) {
    var userObj = {
      fname: req.body.fname.toLowerCase(),
      lname: req.body.lname.toLowerCase(),
      username: req.body.username.toLowerCase(),
      password: req.body.password.toLowerCase()
    };
    var newUser = models.user.build(userObj);
    newUser
      .save()
      .then(function(savedUser) {
        msg = "User was created successfully";
        res.render("signup", { errors: msg });
      })
      .catch(function(err) {
        res.status(500).render("signup", {
          errors: "Please select a different username, that username is taken!"
        });
      });
  } else {
    errors = "The passwords do not match, please try again!";
    res.render("signup", { errors: errors });
  }
});

app.get("/createbab", function(req, res) {
  if (req.session.user) {
    var username =
      req.session.user.charAt(0).toUpperCase() + req.session.user.slice(1);
    res.render("createbab", { username: username });
  } else {
    res.redirect("login");
  }
});

app.post("/createbab", function(req, res) {
  var bab = {
    babble: req.body.bab,
    userId: req.session.userid
  };
  console.log(bab);
  var posts = models.post.build(bab);
  posts
    .save()
    .then(function(successfulpost) {
      res.redirect("/");
    })
    .catch(function(err) {
      res.status(500).render("createbab", { errors: err });
    });
});

app.get("/posts/:id", (req, res) => {
  models.post
    .findOne({
      where: { id: req.params.id },
      include: [
        {
          model: models.like,
          as: "likes",
          include: { model: models.user, as: "user" }
        }
      ]
    })
    .then(function(result) {
      res.render("posts", {post:result, user:req.session.user});
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/like", (req, res) => {
  var output = req.body.likethis;
  console.log(output);
  console.log(req.session.userid);
  models.like
    .build({ postid: output, authorid: req.session.userid }).save()
    .then(function(updatedrecord) {
      res.redirect("/");
    });
});

app.post("/delete", (req, res) => {
  var output = req.body.deletethis;
  models.like
    .destroy({ where: { postid: output } })
    .then(function() {
      models.post
        .destroy({ where: { id: output } })
        .then(function() {
          res.redirect("/");
        })
        .catch(function(err) {
          res.status(500).send(err);
        });
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
