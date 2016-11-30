module.exports = function (sequelize, DataTypes) {
  var TemperatureRecord = sequelize.define("TemperatureRecord", {
    temperature: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function (models) {
        TemperatureRecord.belongsTo(models.Sensor, {
          onDelete: "CASCADE"
        });
      }
    }
  });

  return TemperatureRecord;
};
