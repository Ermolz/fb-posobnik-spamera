const MailingService = require('../services/MailingService');
const logger = require('../config/logger');

class MailingController {
    constructor() {
        this.service = new MailingService();
    }

    async getAddressesForMailing(req, res) {
        logger.info('MailingController.getAddressesForMailing called');
        try {
            const result = await this.service.getAddressesForMailing();
            
            if (result.success) {
                logger.info('MailingController.getAddressesForMailing success', { count: result.data.length });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Addresses for mailing retrieved successfully'
                });
            } else {
                logger.error('MailingController.getAddressesForMailing failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MailingController.getAddressesForMailing error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getTemplatesForMailing(req, res) {
        logger.info('MailingController.getTemplatesForMailing called');
        try {
            const result = await this.service.getTemplatesForMailing();
            
            if (result.success) {
                logger.info('MailingController.getTemplatesForMailing success', { count: result.data.length });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Templates for mailing retrieved successfully'
                });
            } else {
                logger.error('MailingController.getTemplatesForMailing failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MailingController.getTemplatesForMailing error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async sendMailing(req, res) {
        logger.info('MailingController.sendMailing called', { body: req.body });
        try {
            const result = await this.service.sendMailing(req.body);
            
            if (result.success) {
                logger.info('MailingController.sendMailing success', { 
                    total: result.data.total_addresses,
                    sent: result.data.sent,
                    failed: result.data.failed
                });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Mailing sent successfully'
                });
            } else {
                const statusCode = result.error === 'Validation failed' ? 400 : 500;
                logger.warn('MailingController.sendMailing failed', { error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('MailingController.sendMailing error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getMailingLogs(req, res) {
        logger.info('MailingController.getMailingLogs called', { query: req.query });
        try {
            const { limit = 100, offset = 0 } = req.query;
            const options = { limit: parseInt(limit), offset: parseInt(offset) };
            
            const result = await this.service.getMailingLogs(options);
            
            if (result.success) {
                logger.info('MailingController.getMailingLogs success', { count: result.data.count });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Mailing logs retrieved successfully'
                });
            } else {
                logger.error('MailingController.getMailingLogs failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MailingController.getMailingLogs error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getMailingStats(req, res) {
        logger.info('MailingController.getMailingStats called');
        try {
            const result = await this.service.getMailingStats();
            
            if (result.success) {
                logger.info('MailingController.getMailingStats success', { stats: result.data });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Mailing statistics retrieved successfully'
                });
            } else {
                logger.error('MailingController.getMailingStats failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MailingController.getMailingStats error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getLogsByStatus(req, res) {
        logger.info('MailingController.getLogsByStatus called', { status: req.params.status, query: req.query });
        try {
            const { status } = req.params;
            const { limit = 100, offset = 0 } = req.query;
            const options = { limit: parseInt(limit), offset: parseInt(offset) };
            
            if (!['pending', 'sent', 'failed'].includes(status)) {
                logger.warn('MailingController.getLogsByStatus invalid status', { status });
                return res.status(400).json({
                    success: false,
                    error: 'Invalid status. Must be one of: pending, sent, failed'
                });
            }
            
            const result = await this.service.getLogsByStatus(status, options);
            
            if (result.success) {
                logger.info('MailingController.getLogsByStatus success', { status, count: result.data.count });
                res.json({
                    success: true,
                    data: result.data,
                    message: `Logs with status '${status}' retrieved successfully`
                });
            } else {
                logger.error('MailingController.getLogsByStatus failed', { status, error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MailingController.getLogsByStatus error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async cleanupOldLogs(req, res) {
        logger.info('MailingController.cleanupOldLogs called', { query: req.query });
        try {
            const { daysOld = 30 } = req.query;
            const result = await this.service.cleanupOldLogs(parseInt(daysOld));
            
            if (result.success) {
                logger.info('MailingController.cleanupOldLogs success', { deleted: result.data.deleted_count });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Old logs cleaned up successfully'
                });
            } else {
                logger.error('MailingController.cleanupOldLogs failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MailingController.cleanupOldLogs error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }
}

module.exports = MailingController;