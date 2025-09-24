const EmailAddressService = require('../services/EmailAddressService');
const logger = require('../config/logger');

class EmailAddressController {
    constructor() {
        this.service = new EmailAddressService();
    }

    async getAllAddresses(req, res) {
        logger.info('EmailAddressController.getAllAddresses called', { query: req.query });
        try {
            const { sortBy, sortOrder, limit, offset } = req.query;
            const options = { sortBy, sortOrder, limit, offset };
            
            const result = await this.service.getAllAddresses(options);
            
            if (result.success) {
                logger.info('EmailAddressController.getAllAddresses success', { count: result.data.length });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Email addresses retrieved successfully'
                });
            } else {
                logger.error('EmailAddressController.getAllAddresses failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('EmailAddressController.getAllAddresses error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getAddressById(req, res) {
        logger.info('EmailAddressController.getAddressById called', { id: req.params.id });
        try {
            const { id } = req.params;
            const result = await this.service.getAddressById(id);
            
            if (result.success) {
                logger.info('EmailAddressController.getAddressById success', { id });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Email address retrieved successfully'
                });
            } else {
                const statusCode = result.error === 'Address not found' ? 404 : 400;
                logger.warn('EmailAddressController.getAddressById not found', { id, error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('EmailAddressController.getAddressById error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async createAddress(req, res) {
        logger.info('EmailAddressController.createAddress called', { body: req.body });
        try {
            const result = await this.service.createAddress(req.body);
            
            if (result.success) {
                logger.info('EmailAddressController.createAddress success', { id: result.data.id });
                res.status(201).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Email address already exists' ? 409 : 400;
                logger.warn('EmailAddressController.createAddress failed', { error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('EmailAddressController.createAddress error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async updateAddress(req, res) {
        logger.info('EmailAddressController.updateAddress called', { id: req.params.id, body: req.body });
        try {
            const { id } = req.params;
            const result = await this.service.updateAddress(id, req.body);
            
            if (result.success) {
                logger.info('EmailAddressController.updateAddress success', { id });
                res.json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Address not found' ? 404 : 
                                 result.error === 'Email address already exists' ? 409 : 400;
                logger.warn('EmailAddressController.updateAddress failed', { id, error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('EmailAddressController.updateAddress error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async deleteAddress(req, res) {
        logger.info('EmailAddressController.deleteAddress called', { id: req.params.id });
        try {
            const { id } = req.params;
            const result = await this.service.deleteAddress(id);
            
            if (result.success) {
                logger.info('EmailAddressController.deleteAddress success', { id });
                res.json({
                    success: true,
                    message: result.message
                });
            } else {
                const statusCode = result.error === 'Address not found' ? 404 : 400;
                logger.warn('EmailAddressController.deleteAddress failed', { id, error: result.error });
                res.status(statusCode).json(result);
            }
        } catch (error) {
            logger.error('EmailAddressController.deleteAddress error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async searchAddresses(req, res) {
        logger.info('EmailAddressController.searchAddresses called', { query: req.query });
        try {
            const { last_name, first_name, email } = req.query;
            const criteria = { last_name, first_name, email };
            
            const result = await this.service.searchAddresses(criteria);
            
            if (result.success) {
                logger.info('EmailAddressController.searchAddresses success', { count: result.data.length, criteria });
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Search completed successfully'
                });
            } else {
                logger.error('EmailAddressController.searchAddresses failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('EmailAddressController.searchAddresses error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }

    async getAddressStats(req, res) {
        logger.info('EmailAddressController.getAddressStats called');
        try {
            const result = await this.service.getAddressStats();
            
            if (result.success) {
                logger.info('EmailAddressController.getAddressStats success');
                res.json({
                    success: true,
                    data: result.data,
                    message: 'Address statistics retrieved successfully'
                });
            } else {
                logger.error('EmailAddressController.getAddressStats failed', { error: result.error });
                res.status(500).json(result);
            }
        } catch (error) {
            logger.error('EmailAddressController.getAddressStats error', { error: error.message, stack: error.stack });
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                details: error.message
            });
        }
    }
}

module.exports = EmailAddressController;