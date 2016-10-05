'use strict';

module.exports = function (Sequelize, DataTypes) {
  var Student = Sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    parentName: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    parentPhone: { type: DataTypes.STRING }
  }, {
    classMethods: {
      associate: function (models) {
        Student.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Student;
}
