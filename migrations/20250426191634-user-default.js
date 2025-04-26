
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // 1. Create Branch
      await queryInterface.bulkInsert('branch', [
        {
          name: 'Main Branch',
          address: 'Main Street 123',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction });

      // 2. Get the inserted branch id
      const [branch] = await queryInterface.sequelize.query(
        `SELECT id FROM branch WHERE name = 'Main Branch' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT, transaction }
      );

      const branchId = branch.id;

      // 3. Insert Users
      await queryInterface.bulkInsert('user', [
        {
          username: 'Programmer',
          password: '$2a$08$YLZ7gtHc5KgiF3TlX/12r.boof4dIvGSoViUYxaRL8f7yHhKjPh0i',
          fullname: 'Dasturchi',
          role: 'Programmer',
          branch_id: branchId,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        },
        {
          username: 'Admin',
          password: '$2a$08$YLZ7gtHc5KgiF3TlX/12r.boof4dIvGSoViUYxaRL8f7yHhKjPh0i',
          fullname: 'Admin',
          role: 'Admin',
          branch_id: branchId,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        }
      ], { transaction });

      await transaction.commit();
    } catch (errors) {
      await transaction.rollback();
      throw errors;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Delete users first
      await queryInterface.bulkDelete('user', {
        username: { [Sequelize.Op.in]: ['Programmer', 'Admin'] }
      }, { transaction });

      // Delete branch
      await queryInterface.bulkDelete('branch', {
        name: 'Main Branch'
      }, { transaction });

      await transaction.commit();
    } catch (errors) {
      await transaction.rollback();
      throw errors;
    }
  }
};
