const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('./src/config/logger');
require('dotenv').config({ path: './env.local' });

const { testConnection, syncDatabase } = require('./src/config/database');
const { testEmailConnection } = require('./src/config/email');

require('./src/models');

const emailAddressesRoutes = require('./src/routes/emailAddresses');
const messageTemplatesRoutes = require('./src/routes/messageTemplates');
const mailingRoutes = require('./src/routes/mailing');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/email-addresses', emailAddressesRoutes);
app.use('/api/message-templates', messageTemplatesRoutes);
app.use('/api/mailing', mailingRoutes);

app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = await testConnection();
        const emailStatus = await testEmailConnection();
        
        res.json({
            success: true,
            status: 'OK',
            database: dbStatus ? 'Connected' : 'Disconnected',
            email: emailStatus ? 'Connected' : 'Disconnected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Health check error', { error: error.message, stack: error.stack });
        res.status(500).json({
            success: false,
            status: 'Error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.use((err, req, res, next) => {
    logger.error('Express error handler', { error: err.message, stack: err.stack });
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'The requested resource was not found'
    });
});

module.exports = app;