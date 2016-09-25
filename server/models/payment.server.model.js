module.exports = function(Sequelize, DataTypes) {
  var Payment = Sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    classMethods: {
      associate: function (models) {
        Payment.belongsTo(models.Student, {
          foreignKey: {
            allowNull: false
          }
        });
        Payment.belongsTo(models.Term, {
          foreignKey: {
            allowNull: false
          }
        });
        Payment.belongsTo(models.PaymentType, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Payment;
}
