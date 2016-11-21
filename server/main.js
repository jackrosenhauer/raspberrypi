/**
 * Created by Jack on 11/14/2016.
 */
console.log("api...");

var express = require("express");
var session = require("express-session");


var api = express();

api.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "jack" && req.session.admin){
    return next();
  } else {
    return res.sendStatus(401);
  }
};

api.get("/", auth, function(req, res){
  //send base html
  res.send('home');
});

api.get("/test", function(req, res){
  res.send("YAY");
});

api.get("/api/v1/temperature-records", function(req, res){
  res.sent("YAY");
});

api.post("/login", function(req, res){
  console.log(req.query)
  if (!req.query.username || !req.query.password){
    res.send("login failed");
  } else if (req.query.username === "jack" || req.query.password === "supersecret"){
    req.session.user = "jack";
    req.session.admin = true;
    res.send("success");
  }
});

api.post("/logout", function(req, res){
  req.session.destroy();
  res.send("logout success");
});

api.listen(7710);
console.log("app running on localhost:" + 7710);
