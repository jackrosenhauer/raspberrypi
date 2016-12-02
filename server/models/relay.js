module.exports = function (sequelize, DataTypes) {
  let Relay = sequelize.define("Relay", {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    isOn: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  return Relay;
};
