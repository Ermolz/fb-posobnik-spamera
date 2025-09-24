const { EmailAddress } = require('../models');
const logger = require('../config/logger');

class EmailAddressService {
    constructor() {
    }

    async getAllAddresses(options = {}) {
        try {
            const { sortBy = 'last_name', sortOrder = 'ASC', limit, offset } = options;
            
            const queryOptions = {
                order: [[sortBy, sortOrder.toUpperCase()]]
            };
            
            if (limit) queryOptions.limit = limit;
            if (offset) queryOptions.offset = offset;
            
            const addresses = await EmailAddress.findAll(queryOptions);
            return {
                success: true,
                data: addresses
            };
        } catch (error) {
            logger.error('EmailAddressService.getAllAddresses error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch email addresses',
                details: error.message
            };
        }
    }

    async getAddressById(id) {
        try {
            const address = await EmailAddress.findByPk(id);
            if (!address) {
                return {
                    success: false,
                    error: 'Address not found'
                };
            }
            return {
                success: true,
                data: address
            };
        } catch (error) {
            logger.error('EmailAddressService.getAddressById error', { id, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch email address',
                details: error.message
            };
        }
    }

    async createAddress(addressData) {
        try {
            if (!addressData.last_name || !addressData.first_name || !addressData.email) {
                return {
                    success: false,
                    error: 'Last name, first name, and email are required'
                };
            }

            const existingAddress = await EmailAddress.findOne({
                where: { email: addressData.email }
            });
            
            if (existingAddress) {
                return {
                    success: false,
                    error: 'Email address already exists'
                };
            }

            const newAddress = await EmailAddress.create(addressData);
            logger.info('EmailAddressService.createAddress success', { id: newAddress.id, email: newAddress.email });
            return {
                success: true,
                data: newAddress,
                message: 'Email address created successfully'
            };
        } catch (error) {
            logger.error('EmailAddressService.createAddress error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to create email address',
                details: error.message
            };
        }
    }

    async updateAddress(id, addressData) {
        try {
            const address = await EmailAddress.findByPk(id);
            if (!address) {
                return {
                    success: false,
                    error: 'Address not found'
                };
            }

            if (addressData.email && addressData.email !== address.email) {
                const existingAddress = await EmailAddress.findOne({
                    where: { email: addressData.email }
                });
                
                if (existingAddress) {
                    return {
                        success: false,
                        error: 'Email address already exists'
                    };
                }
            }

            await address.update(addressData);
            logger.info('EmailAddressService.updateAddress success', { id, email: addressData.email });
            return {
                success: true,
                data: address,
                message: 'Email address updated successfully'
            };
        } catch (error) {
            logger.error('EmailAddressService.updateAddress error', { id, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to update email address',
                details: error.message
            };
        }
    }

    async deleteAddress(id) {
        try {
            const address = await EmailAddress.findByPk(id);
            if (!address) {
                return {
                    success: false,
                    error: 'Address not found'
                };
            }

            await address.destroy();
            logger.info('EmailAddressService.deleteAddress success', { id });
            return {
                success: true,
                message: 'Email address deleted successfully'
            };
        } catch (error) {
            logger.error('EmailAddressService.deleteAddress error', { id, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to delete email address',
                details: error.message
            };
        }
    }

    async searchAddresses(criteria) {
        try {
            const { last_name, first_name, email } = criteria;
            const whereClause = {};
            
            if (last_name) {
                whereClause.last_name = { [require('sequelize').Op.like]: `%${last_name}%` };
            }
            if (first_name) {
                whereClause.first_name = { [require('sequelize').Op.like]: `%${first_name}%` };
            }
            if (email) {
                whereClause.email = { [require('sequelize').Op.like]: `%${email}%` };
            }
            
            const addresses = await EmailAddress.findAll({
                where: whereClause,
                order: [['last_name', 'ASC']]
            });
            
            logger.info('EmailAddressService.searchAddresses success', { criteria, count: addresses.length });
            return {
                success: true,
                data: addresses
            };
        } catch (error) {
            logger.error('EmailAddressService.searchAddresses error', { criteria, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to search email addresses',
                details: error.message
            };
        }
    }

    async getAddressStats() {
        try {
            const totalCount = await EmailAddress.count();
            return {
                success: true,
                data: {
                    total_addresses: totalCount
                }
            };
        } catch (error) {
            logger.error('EmailAddressService.getAddressStats error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch address statistics',
                details: error.message
            };
        }
    }
}

module.exports = EmailAddressService;