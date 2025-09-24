const app = require('./app');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    logger.info('Server starting', { port: PORT });
    
    const { testConnection, syncDatabase } = require('./src/config/database');
    const { testEmailConnection } = require('./src/config/email');
    
    const dbStatus = await testConnection();
    const emailStatus = await testEmailConnection();
    
    if (dbStatus) {
        logger.info('Syncing database');
        await syncDatabase();
    }
    
    if (dbStatus && emailStatus) {
        logger.info('All systems ready');
    } else {
        logger.warn('Some services may not be available', { dbStatus, emailStatus });
    }
});