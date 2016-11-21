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

var models = require('./models');

router.use(function(req, res, next) {
  // do logging
  console.log('Check for auth here?');
  next(); // make sure we go to the next routes and don't stop here
});


var TemperatureRecord = models.TemperatureRecord;



router.route('/temperature-records')

  .get(function(req, res) {
    TemperatureRecord.findAll().then(function(tempRecords) {
      res.json(tempRecords);
    });
  })

  .post(function(req, res) {
    TemperatureRecord.create({temperature: req.body.temperature})
      .then(function(){
        res.json({ message: 'temperature-record created successfully.'});
      });
  });


// all of our routes will be prefixed with /api/v1
api.use('/api/v1', router);

models.sequelize.sync().then(function() {
  api.listen(port, function() {
    console.log('Express server listening on port ' + port);
  });
});

