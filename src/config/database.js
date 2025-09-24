const { Sequelize } = require('sequelize');
const logger = require('./logger');
require('dotenv').config({ path: './env.local' });

const sequelize = new Sequelize(
    process.env.DB_NAME || 'email_mailing',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'password',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? (msg) => logger.info('SQL Query', { query: msg }) : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        logger.info('Database connection has been established successfully');
        return true;
    } catch (error) {
        logger.error('Unable to connect to the database', { error: error.message, stack: error.stack });
        return false;
    }
}

async function syncDatabase() {
    try {
        await sequelize.sync({ alter: true });
        logger.info('Database synchronized successfully');
        return true;
    } catch (error) {
        logger.error('Database synchronization failed', { error: error.message, stack: error.stack });
        return false;
    }
}

module.exports = {
    sequelize,
    testConnection,
    syncDatabase
};