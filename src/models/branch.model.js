const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');

class BranchModel extends Model {
    toJSON() {
        // Customize the response to prevent unnecessary fields from being exposed
        let values = Object.assign({}, this.get());
        return values;
    }
}

BranchModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'BranchModel',
    tableName: 'branch',
    timestamps: true,
    paranoid: true, // This enables soft deletes
});

module.exports = BranchModel;
