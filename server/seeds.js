var models = require('./models');

var TemperatureRecord = models.TemperatureRecord;
var HumidityRecord = models.HumidityRecord;
var Relay = models.Relay;

models.sequelize.sync().then(function() {
  var startingTime = Date.now();

  for(var i = 0; i < 10; i++) {
    var randomTemp = parseInt(Math.random() * 10);
    var sequentialTime = new Date(startingTime - (720000 * (10 - i))).toUTCString();
    console.log(sequentialTime);
    models.sequelize.query('insert into "TemperatureRecords" ("id", "temperature", "createdAt", "updatedAt") values (DEFAULT, ' + randomTemp + ', \''+ sequentialTime +'\', \''+ sequentialTime +'\');');
  }

  for(var i = 0; i < 10; i++) {
    var randomHumidity = Math.random().toFixed(2);
    var sequentialTime = new Date(startingTime - (720000 * (10 - i))).toUTCString();
    console.log(sequentialTime);
    models.sequelize.query('insert into "HumidityRecords" ("id", "humidity", "createdAt", "updatedAt") values (DEFAULT, ' + randomHumidity + ', \''+ sequentialTime +'\', \''+ sequentialTime +'\');');
  }

  Relay.create({name: 'Light', isOn: false});
  Relay.create({name: 'Pump', isOn: false});

});

