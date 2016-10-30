

module.exports = function (Sequelize, DataTypes) {
  var Role = Sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    name: { type: DataTypes.STRING}
  });
  return Role;
};
