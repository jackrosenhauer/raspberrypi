module.exports = function(sequelize, DataTypes) {
  var Sensor = sequelize.define("Sensor", {
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Sensor.hasMany(models.TemperatureRecord)
      }
    }
  });

  return Sensor;
};
