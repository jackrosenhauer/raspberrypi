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

let cors = require('cors');

//Nodemailer setup for email updates
var nodemailer = require("nodemailer"); //npm install nodemailer@0.7.1
var transporter = nodemailer.createTransport("SMTP", {
        service: 'gmail',
        auth: {
            user: "", //Valid username and password for gmail account needed here
            pass: ""
        }
    });
var mailOptions = {
    from: '"noreply" <noreply@gmail.com>', // sender address 
    to: '', // receiver email needed here 
    subject: 'Gardening Application Warning', // Subject line 
    text: 'The Temperature/Humidity is outside of the specified range.', // plaintext body 
    html: '<b>The temperature/humidity is outside of the specified range.</b>' // html body 
};

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
          //If temp is outside specified range, email
          if(sensor['temperature']) < minTemp || sensor['temperature'] > maxTemp)
            sendEmailNotification();
        }

        if (sensor['humidity']) {
          addHumidityRecord({SensorName: update, 'humidity': sensor['humidity']});
          //If humidity is outside specified range, email
          if(sensor['humidity']) < minHumidity || sensor['humidity'] > maxHumidity)
            sendEmailNotification();
        }

        console.log(update);
        break;
      case "relay":
        let relayID = update;
        let isOn = status[update].isOn;
        updateRelayRecord(relayID, isOn);
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

function sendEmailNotification(){
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
}

function updateRelayRecord(relayID, isOn){
  Relay.find({where: {id: relayID}}).then(function(record){
    record.update({isOn: isOn});
  });
};

function generateFindOptions(startingDate) {
  var findOptions;

  if(!startingDate) {

    findOptions = {
      limit: 1,
      order: [ [ 'createdAt', 'DESC' ]]
    }

  } else {

    findOptions = {
      where: {
        createdAt: {
          $gt: startingDate
        }
      }
    };

  }

  return findOptions;
}

router.route('/temperatureRecords')

  .get(function(req, res) {
    var startingDate = req.query.startingDate;
    var findOptions = generateFindOptions(startingDate);

    TemperatureRecord.findAll(findOptions).then(function(tempRecords) {
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

  .get(function(req, res) {
    var startingDate = req.query.startingDate;
    var findOptions = generateFindOptions(startingDate);

    HumidityRecord.findAll(findOptions).then(function(humRecords) {
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

router.route('/relays/:id')

  .put(function (req, res, next) {
    var id = req.params.id;
    var isOn = req.body.relay.isOn;
    console.log(id, isOn);

    try{
      controller.changeRelayState(id, isOn, function(){
        Relay.find({where: {id: id}}).then(function (record) {
          record.isOn = isOn;
          res.json({'relay': record});
        });
      });
    } catch (err) {
      if (err.message === "Something went wrong"){

      } else {
        throw err;
      }
    }
  });


// all of our routes will be prefixed with /api/v1
api.use('/api/v1', router);

models.sequelize.sync().then(function () {
  api.listen(port, function () {
    console.log('Express server listening on port ' + port);
  });
});
