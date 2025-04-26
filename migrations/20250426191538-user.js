'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('user', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: Sequelize.DataTypes.STRING(25),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.DataTypes.STRING(60),
          allowNull: false,
        },
        fullname: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: false,
        },
        role: {
          type: Sequelize.DataTypes.ENUM('Admin', 'SuperAdmin', 'Teacher', 'Student', 'Cashier', 'Programmer'),
          allowNull: false,
          defaultValue: 'Admin',
        },
        branch_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'branch',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        deletedAt: {
          type: Sequelize.DataTypes.DATE,
          allowNull: true,
        },
      }, { transaction });

      await transaction.commit();
    } catch (errors) {
      await transaction.rollback();
      throw errors;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('user', { transaction });
      await transaction.commit();
    } catch (errors) {
      await transaction.rollback();
      throw errors;
    }
  }
};