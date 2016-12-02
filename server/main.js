var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
var patch = require('node-patch');
let Controller = require("./controller.js");
let config = require('./config');

controller = new Controller({
    repl: false,
    debug: false,
    id: "GrowPI"
});

controller.on("ready", function(){
    controller.setUpdateInterval(5000);
});

controller.on("update", function(status){
    console.log(status);
});

var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var api = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

var port = process.env.PORT || 7710;
var router = express.Router();

var models = require('./models');


router.use(function(req, res, next) {

  // Allow Cross-Origin Requests
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


  // do logging
  console.log('Check for auth here?');
  next(); // make sure we go to the next routes and don't stop here
});


var TemperatureRecord = models.TemperatureRecord;
var HumidityRecord = models.HumidityRecord;
var Relay = models.Relay;

function getAttributesForModel(model) {
  return Object.keys(model.rawAttributes).filter(function(key) { return key !== 'id'});
}


router.route('/temperature-records')

  .get(function(req, res) {
    TemperatureRecord.findAll().then(function(tempRecords) {

      var serializeOptions = {
        attributes: getAttributesForModel(TemperatureRecord)
      };

      res.json(new JSONAPISerializer('temperature-records', serializeOptions).serialize(tempRecords));
    });
  })

  .post(function(req, res) {
    TemperatureRecord.create({temperature: req.body.temperature})
      .then(function(){
        res.json({ message: 'temperature-record created successfully.'});
      });
  });


router.route('/humidity-records')

  .get(function(req, res) {
    HumidityRecord.findAll().then(function(humRecords) {

      var serializeOptions = {
        attributes: getAttributesForModel(HumidityRecord)
      };

      res.json(new JSONAPISerializer('humidity-records', serializeOptions).serialize(humRecords));
    });
  })

  .post(function(req, res) {
    HumidityRecord.create({humidity: req.body.humidity})
      .then(function(){
        res.json({ message: 'humidity-record created successfully.'});
      });
  });


router.route('/relays')

  .get(function(req, res) {
    Relay.findAll().then(function(relays) {

      var serializeOptions = {
        attributes: getAttributesForModel(Relay)
      };

      res.json(new JSONAPISerializer('relays', serializeOptions).serialize(relays));

    });
  })

  .post(function(req, res) {
    Relay.create({name: req.body.name, isOn: false})
      .then(function(){
        res.json({ message: 'relay created successfully.'});
      });
  })

router.route('/relays/:id')

  .patch(function(req, res){
    console.log(req);
    // var rel = req.body.Relay;
    // rel.isOn = !(rel.isOn)
    // res.json({ message: 'relay status changed.'});
  });


// all of our routes will be prefixed with /api/v1
api.use('/api/v1', router);

models.sequelize.sync().then(function() {
  api.listen(port, function() {
    console.log('Express server listening on port ' + port);
  });
});
