"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var db = {};
let sequelize;

// var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
  sequelize = new Sequelize('gardening_app', 'root', null, {
    dialect: 'postgres',
    logging: false
  });
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js") && (!file.endsWith('.swp'));
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});


//let ValidationError = sequelize.ValidationError;
//create all the sensors
// console.log("first?");
// db.Sensor.create({name: "Hygrometer"})
// 	.then(function (instance) {
// 		//console.log(instance);
// 	})
// 	.catch(function (error) {
// 		if (error instanceof ValidationError) {
// 			console.log(error.message);
// 			for (var i = 0, len = error.errors.length; i < len; i++) {
// 				console.log(error.errors[i]);
// 			}
// 		} else {
// 			console.log(error);
// 		}
// 	});
//
// db.TemperatureRecord.create({SensorName: "Hygrometer", temperature: Math.random(1) * 100})
// 	.then(function (instance) {
// 		console.log("successfully added temperature record");
// 	})
// 	.catch(function (error) {
// 		if (error instanceof ValidationError) {
// 			console.log(error.message);
// 		} else {
// 			throw error;
// 		}
// 	});
//
//
// // db.Sensor.create({name: "relay1"});
// // db.Sensor.create({name: "relay2"});
// // db.Sensor.create({name: "relay3"});
// // db.Sensor.create({name: "relay4"});
// // db.Sensor.create({name: "relay5"});
// // db.Sensor.create({name: "relay6"});
// // db.Sensor.create({name: "relay7"});
// // db.Sensor.create({name: "relay8"});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
