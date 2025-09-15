'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PaymentMethods', [
      // Customer 2's payment methods
      {
        userId: 2,
        type: 'credit_card',
        provider: 'visa',
        brand: 'Visa',
        last4: '1234',
        tokenOrRef: 'tok_visa_1234',
        isDefault: true,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        type: 'ewallet',
        provider: 'momo',
        brand: 'MoMo',
        last4: null,
        tokenOrRef: 'momo_token_123',
        isDefault: false,
        isActive: true,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Customer 3's payment method
      {
        userId: 3,
        type: 'credit_card',
        provider: 'mastercard',
        brand: 'Mastercard',
        last4: '5678',
        tokenOrRef: 'tok_mc_5678',
        isDefault: true,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Customer 4's payment method
      {
        userId: 4,
        type: 'ewallet',
        provider: 'zalopay',
        brand: 'ZaloPay',
        last4: null,
        tokenOrRef: 'zalopay_token_456',
        isDefault: true,
        isActive: true,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PaymentMethods', null, {});
  }
};
