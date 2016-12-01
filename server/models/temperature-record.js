module.exports = function (sequelize, DataTypes) {
  var TemperatureRecord = sequelize.define("TemperatureRecord", {
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
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
