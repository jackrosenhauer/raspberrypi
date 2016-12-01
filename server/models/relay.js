module.exports = function (sequelize, DataTypes) {
  let Relays = sequelize.define("Relays", {
    name: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    isOn: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });

  return Relays;
};
