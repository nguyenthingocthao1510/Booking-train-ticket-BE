module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("customer", {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_card: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
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
  
    Customer.associate = (models) => {
      Customer.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account',
      });
    };
  
    return Customer;
  };