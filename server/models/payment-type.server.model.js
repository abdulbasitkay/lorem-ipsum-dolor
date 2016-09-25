module.exports = function (Sequelize, DataTypes) {
  var PaymentType = Sequelize.define('PaymentType', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    name: { type: DataTypes.STRING, allowNull: false }
  });

  return PaymentType;
}
