module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define("employee", {
      employee_id: {
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
      status: {
        type: DataTypes.ENUM('work', 'quit'),
        defaultValue: 'work',
        allowNull: false,
      },
    });
  
    Employee.associate = (models) => {
      Employee.belongsTo(models.Account, {
        foreignKey: 'account_id',
        as: 'account',
      });
    };
  
    return Employee;
  };