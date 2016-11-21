var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');

var api = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

var port = process.env.PORT || 7710;
var router = express.Router();

var models = require('../models');




router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});






router.get('/temperature-entry', function(req, res) {
  models.TemperatureEntry.findAll().then(function(tempEntries) {
    res.json(tempEntries);
  });
});

// all of our routes will be prefixed with /api
api.use('/api/v1', router);

models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   */
  api.listen(port, function() {
    console.log('Express server listening on port ' + port);
  });
  // server.on('error', onError);
  // server.on('listening', onListening);
});


// api.use(session({
//   secret: '2C44-4D44-WppQ38S',
//   resave: true,
//   saveUninitialized: true
// }));

// // Authentication and Authorization Middleware
// var auth = function(req, res, next) {
//   if (req.session && req.session.user === "jack" && req.session.admin){
//     return next();
//   } else {
//     return res.sendStatus(401);
//   }
// };

// api.get("/", auth, function(req, res){
//   //send base html
//   res.send('home');
// });

// api.get("/test", function(req, res){
//   res.send("YAY");
// });

// api.get("/api/v1/temperature-records", function(req, res){
//   res.sent("YAY");
// });

// api.post("/login", function(req, res){
//   console.log(req.query)
//   if (!req.query.username || !req.query.password){
//     res.send("login failed");
//   } else if (req.query.username === "jack" || req.query.password === "supersecret"){
//     req.session.user = "jack";
//     req.session.admin = true;
//     res.send("success");
//   }
// });

// api.post("/logout", function(req, res){
//   req.session.destroy();
//   res.send("logout success");
// });

