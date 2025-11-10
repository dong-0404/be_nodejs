require('dotenv').config({ path: '/Users/shin/Documents/DemoProject/be_app/.env' });

module.exports = {
  "development": {
    host: process.env.MYSQL_HOST,        
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DATABASE, 
    username: process.env.MYSQL_USER,     
    password: process.env.MYSQL_PASSWORD, 
    dialect: 'mysql',
    logging: false
  },
  "dev": {
    "username": "root",
    "password": "shin2004",
    "database": "shoe_app",
    "host": "127.0.0.1",
    "port": 3306,
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
