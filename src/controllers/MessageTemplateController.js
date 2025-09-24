const MessageTemplateService = require('../services/MessageTemplateService');
const logger = require('../config/logger');

class MessageTemplateController {
    constructor() {
        this.service = new MessageTemplateService();
    }

    async getAllTemplates(req, res) {
        logger.info('MessageTemplateController.getAllTemplates called', { query: req.query });
        try {
            const { limit, offset } = req.query;
            const options = { limit, offset };
            
            const result = await this.service.getAllTemplates(options);
            
            if (result.success) {
                logger.info('MessageTemplateController.getAllTemplates success', { count: result.data.length });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Message templates retrieved successfully'
                });
            } else {
                logger.error('MessageTemplateController.getAllTemplates failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.getAllTemplates error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getTemplateById(req, res) {
        logger.info('MessageTemplateController.getTemplateById called', { id: req.params.id });
        try {
            const { id } = req.params;
            const result = await this.service.getTemplateById(id);
            
            if (result.success) {
                logger.info('MessageTemplateController.getTemplateById success', { id });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Message template retrieved successfully'
                });
            } else {
                const statusCode = result.error === 'Template not found' ? 404 : 400;
                logger.warn('MessageTemplateController.getTemplateById not found', { id, error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.getTemplateById error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async createTemplate(req, res) {
        logger.info('MessageTemplateController.createTemplate called', { body: req.body });
        try {
            const result = await this.service.createTemplate(req.body);
            
            if (result.success) {
                logger.info('MessageTemplateController.createTemplate success', { id: result.data.id });
                res.status(201).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                logger.warn('MessageTemplateController.createTemplate failed', { error: result.error });
                res.status(400).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.createTemplate error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async updateTemplate(req, res) {
        logger.info('MessageTemplateController.updateTemplate called', { id: req.params.id, body: req.body });
        try {
            const { id } = req.params;
            const result = await this.service.updateTemplate(id, req.body);
            
            if (result.success) {
                logger.info('MessageTemplateController.updateTemplate success', { id });
                res.json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Template not found' ? 404 : 400;
                logger.warn('MessageTemplateController.updateTemplate failed', { id, error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.updateTemplate error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async deleteTemplate(req, res) {
        logger.info('MessageTemplateController.deleteTemplate called', { id: req.params.id });
        try {
            const { id } = req.params;
            const result = await this.service.deleteTemplate(id);
            
            if (result.success) {
                logger.info('MessageTemplateController.deleteTemplate success', { id });
                res.json({
                    success: true,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Template not found' ? 404 : 400;
                logger.warn('MessageTemplateController.deleteTemplate failed', { id, error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.deleteTemplate error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async searchTemplatesByName(req, res) {
        logger.info('MessageTemplateController.searchTemplatesByName called', { query: req.query });
        try {
            const { name } = req.query;
            
            if (!name) {
                logger.warn('MessageTemplateController.searchTemplatesByName missing name parameter');
                return res.status(400).json({
                    success: false,
                    error: 'Search name is required'
                });
            }
            
            const result = await this.service.searchTemplatesByName(name);
            
            if (result.success) {
                logger.info('MessageTemplateController.searchTemplatesByName success', { count: result.data.length, name });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Template search completed successfully'
                });
            } else {
                logger.error('MessageTemplateController.searchTemplatesByName failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.searchTemplatesByName error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getTemplateStats(req, res) {
        logger.info('MessageTemplateController.getTemplateStats called');
        try {
            const result = await this.service.getTemplateStats();
            
            if (result.success) {
                logger.info('MessageTemplateController.getTemplateStats success');
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Template statistics retrieved successfully'
                });
            } else {
                logger.error('MessageTemplateController.getTemplateStats failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.getTemplateStats error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getTemplateWithPlaceholders(req, res) {
        logger.info('MessageTemplateController.getTemplateWithPlaceholders called', { id: req.params.id, body: req.body });
        try {
            const { id } = req.params;
            const userData = req.body;
            
            const result = await this.service.getTemplateWithPlaceholders(id, userData);
            
            if (result.success) {
                logger.info('MessageTemplateController.getTemplateWithPlaceholders success', { id });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Template with placeholders processed successfully'
                });
            } else {
                const statusCode = result.error === 'Template not found' ? 404 : 400;
                logger.warn('MessageTemplateController.getTemplateWithPlaceholders failed', { id, error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('MessageTemplateController.getTemplateWithPlaceholders error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }
}

module.exports = MessageTemplateController;