module.exports = function (sequelize, DataTypes) {
  let HumidityRecord = sequelize.define("HumidityRecord", {
    humidity: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function (models) {
        HumidityRecord.belongsTo(models.Sensor, {
          onDelete: "CASCADE"
        });
      }
    }
  });

  return HumidityRecord;
};
