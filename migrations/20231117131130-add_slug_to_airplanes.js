'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Airplanes',
      'slug',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );

    await queryInterface.addIndex(
      'Airplanes',
      ['slug'],
      {
        name: 'airplanes_slug_uniq_idx',
        unique: true,
      },
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Airplanes', 'airplanes_slug_uniq_idx');
    await queryInterface.removeColumn('Airplanes', 'slug');
  }
};
