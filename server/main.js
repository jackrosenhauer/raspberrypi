let express = require("express");
let session = require("express-session");
let bodyParser = require('body-parser');

let Controller = require("./controller.js");
let config = require('./config');
let JSONAPISerializer = require('jsonapi-serializer').Serializer;
let models = require('./models');

let api = express();
let port = process.env.PORT || 7710;
let router = express.Router();

//db models
let TemperatureRecord = models.TemperatureRecord;
let HumidityRecord = models.HumidityRecord;
let Relay = models.Relay;

let cors = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json());
// all of our routes will be prefixed with /api/v1
api.use('/api/v1', router);

api.use(cors());

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');

  // do logging
  //console.log('Check for auth here?');
  next(); // make sure we go to the next routes and don't stop here
});

//Temp range and Humidity range
let minTemp = 65;
let maxTemp = 85;
let minHumidity = 0.4;
let maxHumidity = 0.7;

//Nodemailer setup for email updates
let nodemailer = require("nodemailer"); //npm install nodemailer@0.7.1
let transporter = nodemailer.createTransport("SMTP", {
  service: 'gmail',
  auth: {
    user: "", //Valid username and password for gmail account needed here
    pass: ""
  }
});

let mailOptions = {
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
}, config["controller"]);

//wait for the board to get setup, then start express
controller.on("ready", function () {
  controller.setUpdateInterval(5000);
  models.sequelize.sync().then(function () {
    api.listen(port, function () {
      console.log('Express server listening on port ' + port);
    });
  });
});

controller.on("update", function (status) {
  Object.keys(status).forEach(function (update) {
    switch (status[update]['type']) {
      case "sensor":
        let sensor = status[update];
        if (sensor['temperature']) {
          addTemperatureRecord({SensorName: update, 'temperature': sensor['temperature']});

          //If temp is outside specified range, email
          if (config["alerts"]["enabled"]){
            if (sensor['temperature'] < minTemp || sensor['temperature'] > maxTemp) {
              sendEmailNotification();
            }
          }

        }

        if (sensor['humidity']) {
          addHumidityRecord({SensorName: update, 'humidity': sensor['humidity']});

          //If humidity is outside specified range, email
          if (config["alerts"]["enabled"]){
            if (sensor['humidity'] < minHumidity || sensor['humidity'] > maxHumidity) {
              sendEmailNotification();
            }
          }
        }

        break;
      case "relay":
        console.log(update);
        console.log(status);
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

function sendEmailNotification() {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

function updateRelayRecord(relayID, isOn) {
  Relay.findOrCreate({where: {name: relayID}, defaults: {isOn: isOn}})
    .spread(function (relay, created) {
      console.log(relay.get({
        plain: true
      }));
      if (!created) {
        relay.update({isOn: isOn});
      }

      console.log(created);
    })
}

function generateFindOptions(startingDate) {
  let findOptions;

  if (!startingDate) {

    findOptions = {
      limit: 1,
      order: [['createdAt', 'DESC']]
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

  .get(function (req, res) {
    let startingDate = req.query.startingDate;
    let findOptions = generateFindOptions(startingDate);

    TemperatureRecord.findAll(findOptions).then(function (tempRecords) {
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
    let startingDate = req.query.startingDate;
    let findOptions = generateFindOptions(startingDate);

    HumidityRecord.findAll(findOptions).then(function (humRecords) {
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
    let id = req.params.id;
    let isOn = req.body.relay.isOn;
    console.log(id, isOn);

    Relay.find({where: {id: id}}).then(function(record){
      controller.changeRelayState(record.name, isOn, function(){
        record.isOn = isOn;
        res.json({'relay': record});
      });

    });
    // try {
    //   controller.changeRelayState(id, isOn, function () {
    //     Relay.find({where: {id: id}}).then(function (record) {
    //       record.isOn = isOn;
    //       res.json({'relay': record});
    //     });
    //   });
    // } catch (err) {
    //   if (err.message === "Something went wrong") {
    //
    //   } else {
    //     throw err;
    //   }
    // }
  });


process.on("exit", function(){
  console.log("exiting");
});

process.on("SIGINT", function(){
  console.log("exiting, sigint");
});
