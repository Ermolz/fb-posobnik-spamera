const { MessageTemplate } = require('../models');
const logger = require('../config/logger');

class MessageTemplateService {
    constructor() {
    }

    async getAllTemplates(options = {}) {
        try {
            const { limit, offset } = options;
            
            const queryOptions = {
                order: [['name', 'ASC']]
            };
            
            if (limit) queryOptions.limit = limit;
            if (offset) queryOptions.offset = offset;
            
            const templates = await MessageTemplate.findAll(queryOptions);
            return {
                success: true,
                data: templates
            };
        } catch (error) {
            logger.error('MessageTemplateService.getAllTemplates error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch message templates',
                details: error.message
            };
        }
    }

    async getTemplateById(id) {
        try {
            const template = await MessageTemplate.findByPk(id);
            if (!template) {
                return {
                    success: false,
                    error: 'Template not found'
                };
            }
            return {
                success: true,
                data: template
            };
        } catch (error) {
            logger.error('MessageTemplateService.getTemplateById error', { id, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch message template',
                details: error.message
            };
        }
    }

    async createTemplate(templateData) {
        try {
            if (!templateData.name || !templateData.subject || !templateData.content) {
                return {
                    success: false,
                    error: 'Name, subject, and content are required'
                };
            }

            const newTemplate = await MessageTemplate.create(templateData);
            logger.info('MessageTemplateService.createTemplate success', { id: newTemplate.id, name: newTemplate.name });
            return {
                success: true,
                data: newTemplate,
                message: 'Message template created successfully'
            };
        } catch (error) {
            logger.error('MessageTemplateService.createTemplate error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to create message template',
                details: error.message
            };
        }
    }

    async updateTemplate(id, templateData) {
        try {
            const template = await MessageTemplate.findByPk(id);
            if (!template) {
                return {
                    success: false,
                    error: 'Template not found'
                };
            }

            await template.update(templateData);
            logger.info('MessageTemplateService.updateTemplate success', { id, name: templateData.name });
            return {
                success: true,
                data: template,
                message: 'Message template updated successfully'
            };
        } catch (error) {
            logger.error('MessageTemplateService.updateTemplate error', { id, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to update message template',
                details: error.message
            };
        }
    }

    async deleteTemplate(id) {
        try {
            const template = await MessageTemplate.findByPk(id);
            if (!template) {
                return {
                    success: false,
                    error: 'Template not found'
                };
            }

            await template.destroy();
            logger.info('MessageTemplateService.deleteTemplate success', { id });
            return {
                success: true,
                message: 'Message template deleted successfully'
            };
        } catch (error) {
            logger.error('MessageTemplateService.deleteTemplate error', { id, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to delete message template',
                details: error.message
            };
        }
    }

    async searchTemplatesByName(name) {
        try {
            if (!name || name.trim().length === 0) {
                return {
                    success: false,
                    error: 'Search name is required'
                };
            }

            const templates = await MessageTemplate.findAll({
                where: {
                    name: { [require('sequelize').Op.like]: `%${name}%` }
                },
                order: [['name', 'ASC']]
            });
            
            logger.info('MessageTemplateService.searchTemplatesByName success', { name, count: templates.length });
            return {
                success: true,
                data: templates
            };
        } catch (error) {
            logger.error('MessageTemplateService.searchTemplatesByName error', { name, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to search message templates',
                details: error.message
            };
        }
    }

    async getTemplateStats() {
        try {
            const totalCount = await MessageTemplate.count();
            return {
                success: true,
                data: {
                    total_templates: totalCount
                }
            };
        } catch (error) {
            logger.error('MessageTemplateService.getTemplateStats error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch template statistics',
                details: error.message
            };
        }
    }

    async getTemplateWithPlaceholders(id, userData) {
        try {
            const template = await MessageTemplate.findByPk(id);
            if (!template) {
                return {
                    success: false,
                    error: 'Template not found'
                };
            }

            const personalizedContent = this.replacePlaceholders(template.content, userData);
            const personalizedSubject = this.replacePlaceholders(template.subject, userData);

            return {
                success: true,
                data: {
                    template: template,
                    personalized: {
                        subject: personalizedSubject,
                        content: personalizedContent
                    }
                }
            };
        } catch (error) {
            logger.error('MessageTemplateService.getTemplateWithPlaceholders error', { id, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to process template with placeholders',
                details: error.message
            };
        }
    }

    replacePlaceholders(text, userData) {
        const placeholders = {
            '{{first_name}}': userData.first_name || '',
            '{{last_name}}': userData.last_name || '',
            '{{middle_name}}': userData.middle_name || '',
            '{{email}}': userData.email || '',
            '{{full_name}}': this.getFullName(userData)
        };

        let result = text;
        for (const [placeholder, value] of Object.entries(placeholders)) {
            result = result.replace(new RegExp(placeholder, 'g'), value);
        }

        return result;
    }

    getFullName(userData) {
        const parts = [userData.last_name, userData.first_name];
        if (userData.middle_name) {
            parts.splice(1, 0, userData.middle_name);
        }
        return parts.join(' ');
    }
}

module.exports = MessageTemplateService;