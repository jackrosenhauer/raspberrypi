module.exports = function (sequelize, DataTypes) {
  let Relay = sequelize.define("Relay", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isOn: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    webName: {
      type: DataTypes.STRING
    }
  });

  return Relay;
};
