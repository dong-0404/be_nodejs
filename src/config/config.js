require('dotenv').config({ path: '/Users/shin/Documents/DemoProject/be_app/.env' });

module.exports = {
  "development": {
    host: process.env.MYSQL_HOST,        
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DATABASE, 
    username: process.env.MYSQL_USER,     
    password: process.env.MYSQL_PASSWORD, 
    dialect: 'mysql',
    logging: false  // Tắt SQL query logging
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "db_swp",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
}
