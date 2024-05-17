// models/account.js
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("account", {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('manager', 'employee', 'customer'),
      defaultValue: 'customer',
      allowNull: false,
    },
  });

  Account.associate = (models) => {
    Account.hasOne(models.Customer, {
      foreignKey: 'account_id',
      as: 'customer',
    });
    Account.hasOne(models.Employee, {
      foreignKey: 'account_id',
      as: 'employee',
    });
    Account.hasOne(models.Manager, {
      foreignKey: 'account_id',
      as: 'manager',
    });
  };

  return Account;
}