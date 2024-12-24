const { Sequelize } = require('sequelize');
const config = require('./config/config');

// Chọn cấu hình môi trường (ví dụ: 'development')
const env = 'test';
const dbConfig = config[env];

// Tạo kết nối Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

async function testConnection() {
  try {
    await sequelize.authenticate(); 
    console.log(`Kết nối tới cơ sở dữ liệu "${dbConfig.database}" thành công!`);
  } catch (error) {
    console.error('Kết nối không thành công:', error);
  } finally {
    await sequelize.close(); 
  }
}

testConnection();
