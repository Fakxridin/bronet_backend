const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const BranchModel = require('./branch.model'); // Import the Branch model

class UserModel extends Model {
    toJSON() {
        let values = Object.assign({}, this.get());
        delete values.password; // Exclude password from the response
        return values;
    }
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Admin', 'SuperAdmin', 'Teacher', 'Student', 'Cashier', 'Programmer'),
        defaultValue: 'Admin'
    },
    token: {
        type: DataTypes.VIRTUAL
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: BranchModel,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'UserModel',
    tableName: 'user',
    timestamps: true,
    paranoid: true
});

// Define associations
UserModel.belongsTo(BranchModel, { foreignKey: 'branch_id' }); // Define the relationship

module.exports = UserModel;
