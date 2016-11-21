module.exports = function(sequelize, DataTypes) {
  var TemperatureEntry = sequelize.define("TemperatureEntry", {
    temperature: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        TemperatureEntry.belongsTo(models.Sensor, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return TemperatureEntry;
};
