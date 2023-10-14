"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "badang0509@gmail.com",
          password: "12112",
          username: "John Wick 1",
        },
        {
          email: "duyanh1406@gmail.com",
          password: "12112",
          username: "John Wick 2",
        },
        {
          email: "hoangvu0212@gmail.com",
          password: "12112",
          username: "John Wick 3",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
