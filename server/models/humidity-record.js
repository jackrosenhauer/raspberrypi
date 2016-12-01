module.exports = function (sequelize, DataTypes) {
  let HumidityRecord = sequelize.define("HumidityRecord", {
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
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
