module.exports = function (Sequelize, DataTypes) {
    var User = Sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
        username: { type:DataTypes.STRING },
        password: { type: DataTypes.STRING },
        emailAddress: { type: DataTypes.STRING },
        firstName: { type: DataTypes.STRING },
        lastName: { type: DataTypes.STRING },
    }, {
        instanceMethods: {
            toJSON: function () {
                var value = this.get();
                delete value.password;
                return value;
            }
        },
        classMethods: {
            associate: function (models) {
                User.belongsTo(models.Role, {
                    onDelete: 'CASCADE',
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return User;
};
