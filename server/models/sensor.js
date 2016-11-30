module.exports = function (sequelize, DataTypes) {
  let Sensor = sequelize.define("Sensor", {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    classMethods: {
      associate: function (models) {
        Sensor.hasMany(models.TemperatureRecord);
        Sensor.hasMany(models.HumidityRecord);
      }
    }
  });

  return Sensor;
};