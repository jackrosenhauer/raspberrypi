var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
let Controller = require("./controller.js");
let config = require('./RelaySchedule');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var models = require('./models');

var api = express();
var port = process.env.PORT || 7710;
var router = express.Router();
var TemperatureRecord = models.TemperatureRecord;
var HumidityRecord = models.HumidityRecord;
var Relay = models.Relay;

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
  Object.keys(status).forEach(function(update){
    switch(status[update]['type']){
      case "sensor":
        let sensor = status[update];
        if (sensor['temperature']){
          addTemperatureRecord({SensorName: update, 'temperature': sensor['temperature']});
        }

        if (sensor['humidity']){
          addHumidityRecord({SensorName: update, 'humidity': sensor['humidity']});
        }

        console.log(update);
        break;
      case "relay":
        console.log("relay???");
        console.log(update);
        break;
    }
  });
  // console.log(status);
});

// configure app to use bodyParser()
// this will let us get the data from a POST
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

router.use(function(req, res, next) {
  // Allow Cross-Origin Requests
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // do logging
  console.log('Check for auth here?');
  next(); // make sure we go to the next routes and don't stop here
});

function getAttributesForModel(model) {
  return Object.keys(model.rawAttributes).filter(function(key) { return key !== 'id'});
}

function addTemperatureRecord(record){
  TemperatureRecord.create({SensorName: record.name, temperature: record.temperature})
    .then(function(instance){
      return {status: 'success'};
    })
    .catch(function(error){
      return {status: 'error', message: error.message};
    })
}

function addHumidityRecord(record){
  HumidityRecord.create({SensorName: record.name, humidity: record.humidity})
    .then(function(instance){
      return {status: 'success'};
    })
    .catch(function(error){
      return {status: 'error', message: error.message};
    })
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


// all of our routes will be prefixed with /api/v1
api.use('/api/v1', router);

models.sequelize.sync().then(function() {
  api.listen(port, function() {
    console.log('Express server listening on port ' + port);
  });
});
