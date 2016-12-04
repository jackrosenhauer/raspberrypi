var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
// var patch = require('node-patch');
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

let cors = require('cors');

controller = new Controller({
  repl: false,
  debug: false,
  id: "GrowPI"
});

controller.on("ready", function () {
  controller.setUpdateInterval(5000);
});

controller.on("update", function (status) {
  console.log(status);
  Object.keys(status).forEach(function (update) {
    switch (status[update]['type']) {
      case "sensor":
        let sensor = status[update];
        if (sensor['temperature']) {
          addTemperatureRecord({SensorName: update, 'temperature': sensor['temperature']});
        }

        if (sensor['humidity']) {
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
api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json());


router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // do logging
  console.log('Check for auth here?');
  next(); // make sure we go to the next routes and don't stop here
});

function getAttributesForModel(model) {
  return Object.keys(model.rawAttributes).filter(function (key) {
    return key !== 'id'
  });
}

function addTemperatureRecord(record) {
  TemperatureRecord.create({SensorName: record.name, temperature: record.temperature})
    .then(function (instance) {
      return {status: 'success'};
    })
    .catch(function (error) {
      return {status: 'error', message: error.message};
    })
}

function addHumidityRecord(record) {
  HumidityRecord.create({SensorName: record.name, humidity: record.humidity})
    .then(function (instance) {
      return {status: 'success'};
    })
    .catch(function (error) {
      return {status: 'error', message: error.message};
    })
}

router.route('/temperatureRecords')
  .get(function (req, res) {
    console.log("Get request for temp records");
    TemperatureRecord.findAll().then(function (tempRecords) {
      res.json({'temperature-records': tempRecords});
    });
  })

  .post(function (req, res) {
    console.log("Get request for humidity records");
    TemperatureRecord.create({temperature: req.body.temperature})
      .then(function () {
        res.json({message: 'temperature-record created successfully.'});
      });
  });


router.route('/humidityRecords')
  .get(function (req, res) {
    HumidityRecord.findAll().then(function (humRecords) {
      res.json({'humidity-records': humRecords});
    });
  })

  .post(function (req, res) {
    HumidityRecord.create({humidity: req.body.humidity})
      .then(function () {
        res.json({message: 'humidity-record created successfully.'});
      });
  });


router.route('/relays')

  .get(function (req, res) {
    console.log("Get request for relays");
    Relay.findAll().then(function (relays) {
      res.json({'relays': relays});
    });
  })

  .post(function (req, res) {
    Relay.create({name: req.body.name, isOn: false})
      .then(function () {
        res.json({message: 'relay created successfully.'});
      });
  });


//Toggle relay on/off
//Not working yet

router.route('/relays/:id')

  .put(function (req, res, next) {
    var id = req.params.id;
    var isOn = req.body.relay.isOn;
    console.log(id, isOn);


    Relay.find({where: {id: id}}).then(function (record) {
      record.update({isOn: isOn}).then(function (updatedRecord) {
        res.json({'relay': updatedRecord});
      });
    });
  });


// all of our routes will be prefixed with /api/v1
api.use('/api/v1', router);

models.sequelize.sync().then(function () {
  api.listen(port, function () {
    console.log('Express server listening on port ' + port);
  });
});