// models/manager.js
module.exports = (sequelize, DataTypes) => {
    const Manager = sequelize.define("manager", {
      manager_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      citizen_identification_card: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female'),
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    Manager.associate = (models) => {
      Manager.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account',
      });
    };
  
    return Manager;
  };
  