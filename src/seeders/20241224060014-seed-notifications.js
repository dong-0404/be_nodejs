'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Notifications', [
      // Customer 2's notifications
      {
        userId: 2,
        title: 'Welcome to ShoeStore!',
        body: 'Thank you for joining us. Discover amazing shoes and get 10% off your first order.',
        type: 'system',
        isRead: false,
        data: JSON.stringify({ discount: 10 }),
        readAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'New Arrivals',
        body: 'Check out our latest collection of Nike Air Max 270!',
        type: 'product',
        isRead: false,
        data: JSON.stringify({ productId: 1, productName: 'Nike Air Max 270' }),
        readAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Customer 3's notifications
      {
        userId: 3,
        title: 'Order Confirmed',
        body: 'Your order #ORD-001 has been confirmed and is being prepared.',
        type: 'order',
        isRead: true,
        data: JSON.stringify({ orderId: 1, orderNumber: 'ORD-001' }),
        readAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        title: 'Special Offer',
        body: 'Get 20% off on all Adidas shoes this weekend only!',
        type: 'promo',
        isRead: false,
        data: JSON.stringify({ discount: 20, brand: 'Adidas' }),
        readAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Customer 4's notifications
      {
        userId: 4,
        title: 'Order Shipped',
        body: 'Your order #ORD-002 has been shipped and is on its way!',
        type: 'order',
        isRead: false,
        data: JSON.stringify({ orderId: 2, orderNumber: 'ORD-002', trackingNumber: 'TRK123456' }),
        readAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Customer 5's notifications
      {
        userId: 5,
        title: 'Price Drop Alert',
        body: 'The Nike Air Max 270 you saved is now 15% off!',
        type: 'product',
        isRead: false,
        data: JSON.stringify({ productId: 1, productName: 'Nike Air Max 270', discount: 15 }),
        readAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notifications', null, {});
  }
};
