

module.exports = function (Sequelize, DataTypes) {
  var Term = Sequelize.define('Term', {
    id: { type:DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    name: { type: DataTypes.STRING },
    session: { type: DataTypes.STRING }
  });
  return Term;
};
