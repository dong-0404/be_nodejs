const { Sequelize } = require('sequelize');
const config = require('./config/config');

// Chọn cấu hình môi trường (ví dụ: 'development')
const env = 'dev';
const dbConfig = config[env];

// Tạo kết nối Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
});

async function testConnection() {
  try {
    await sequelize.authenticate(); 
  } catch (error) {
    // Connection failed
  } finally {
    await sequelize.close(); 
  }
}

testConnection();
