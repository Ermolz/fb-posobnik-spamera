const { EmailAddress, MessageTemplate, EmailLog } = require('../models');
const { sendEmail } = require('../config/email');
const logger = require('../config/logger');

class MailingService {
    constructor() {
    }

    async getAddressesForMailing() {
        try {
            const addresses = await EmailAddress.findAll({
                order: [['last_name', 'ASC'], ['first_name', 'ASC']]
            });
            return {
                success: true,
                data: addresses
            };
        } catch (error) {
            logger.error('MailingService.getAddressesForMailing error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch addresses for mailing',
                details: error.message
            };
        }
    }

    async getTemplatesForMailing() {
        try {
            const templates = await MessageTemplate.findAll({
                order: [['name', 'ASC']]
            });
            return {
                success: true,
                data: templates
            };
        } catch (error) {
            logger.error('MailingService.getTemplatesForMailing error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch templates for mailing',
                details: error.message
            };
        }
    }

    async sendMailing(mailingData) {
        try {
            const { templateId, customSubject, customContent, selectedAddresses } = mailingData;
            
            if (!selectedAddresses || selectedAddresses.length === 0) {
                return {
                    success: false,
                    error: 'No addresses selected for mailing'
                };
            }

            if (!templateId && (!customSubject || !customContent)) {
                return {
                    success: false,
                    error: 'Either templateId or custom subject and content must be provided'
                };
            }

            const addresses = await EmailAddress.findAll({
                where: { id: selectedAddresses }
            });

            if (addresses.length === 0) {
                return {
                    success: false,
                    error: 'No valid addresses found'
                };
            }

            let subject, content;

            if (templateId) {
                const template = await MessageTemplate.findByPk(templateId);
                if (!template) {
                    return {
                        success: false,
                        error: 'Template not found'
                    };
                }
                subject = template.subject;
                content = template.content;
            } else {
                subject = customSubject;
                content = customContent;
            }

            const results = [];
            let sentCount = 0;
            let failedCount = 0;

            for (const address of addresses) {
                try {
                    const personalizedContent = this.replacePlaceholders(content, address);
                    const personalizedSubject = this.replacePlaceholders(subject, address);

                    const logEntry = await EmailLog.create({
                        email_address_id: address.id,
                        template_id: templateId,
                        subject: personalizedSubject,
                        content: personalizedContent,
                        status: 'pending'
                    });

                    const emailResult = await sendEmail(
                        address.email,
                        personalizedSubject,
                        personalizedContent
                    );

                    if (emailResult.success) {
                        await logEntry.update({ status: 'sent', sent_at: new Date() });
                        sentCount++;
                        results.push({
                            address_id: address.id,
                            email: address.email,
                            name: `${address.first_name} ${address.last_name}`,
                            status: 'sent',
                            message_id: emailResult.messageId
                        });
                    } else {
                        await logEntry.update({ status: 'failed', error_message: emailResult.error });
                        failedCount++;
                        results.push({
                            address_id: address.id,
                            email: address.email,
                            name: `${address.first_name} ${address.last_name}`,
                            status: 'failed',
                            error: emailResult.error
                        });
                    }
                } catch (error) {
                    logger.error('MailingService.sendMailing individual email error', { 
                        email: address.email, 
                        error: error.message, 
                        stack: error.stack 
                    });
                    failedCount++;
                    results.push({
                        address_id: address.id,
                        email: address.email,
                        name: `${address.first_name} ${address.last_name}`,
                        status: 'failed',
                        error: error.message
                    });
                }
            }

            logger.info('MailingService.sendMailing completed', { 
                total: addresses.length, 
                sent: sentCount, 
                failed: failedCount 
            });

            return {
                success: true,
                data: {
                    total_addresses: addresses.length,
                    sent: sentCount,
                    failed: failedCount,
                    results: results
                }
            };

        } catch (error) {
            logger.error('MailingService.sendMailing error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to send mailing',
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
            '{{full_name}}': `${userData.first_name} ${userData.last_name}`
        };

        let result = text;
        for (const [placeholder, value] of Object.entries(placeholders)) {
            result = result.replace(new RegExp(placeholder, 'g'), value);
        }

        return result;
    }

    async getMailingLogs(options = {}) {
        try {
            const { limit = 100, offset = 0 } = options;
            const logs = await EmailLog.findAndCountAll({
                include: [
                    {
                        model: EmailAddress,
                        as: 'emailAddress',
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: MessageTemplate,
                        as: 'template',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit,
                offset
            });
            return {
                success: true,
                data: logs
            };
        } catch (error) {
            logger.error('MailingService.getMailingLogs error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch mailing logs',
                details: error.message
            };
        }
    }

    async getMailingStats() {
        try {
            const stats = await EmailLog.findAll({
                attributes: [
                    'status',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['status']
            });
            
            const result = {
                total: 0,
                sent: 0,
                failed: 0,
                pending: 0
            };
            
            stats.forEach(stat => {
                const count = parseInt(stat.dataValues.count);
                result.total += count;
                result[stat.status] = count;
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            logger.error('MailingService.getMailingStats error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch mailing statistics',
                details: error.message
            };
        }
    }

    async getLogsByStatus(status, options = {}) {
        try {
            const { limit = 100, offset = 0 } = options;
            const logs = await EmailLog.findAndCountAll({
                where: { status },
                include: [
                    {
                        model: EmailAddress,
                        as: 'emailAddress',
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: MessageTemplate,
                        as: 'template',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['created_at', 'DESC']],
                limit,
                offset
            });
            return {
                success: true,
                data: logs
            };
        } catch (error) {
            logger.error('MailingService.getLogsByStatus error', { status, error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to fetch logs by status',
                details: error.message
            };
        }
    }

    async cleanupOldLogs(daysOld = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            
            const deletedCount = await EmailLog.destroy({
                where: {
                    created_at: {
                        [require('sequelize').Op.lt]: cutoffDate
                    }
                }
            });
            
            logger.info('MailingService.cleanupOldLogs success', { deletedCount, daysOld });
            return {
                success: true,
                data: {
                    deleted_count: deletedCount,
                    message: `Cleaned up ${deletedCount} old log entries`
                }
            };
        } catch (error) {
            logger.error('MailingService.cleanupOldLogs error', { error: error.message, stack: error.stack });
            return {
                success: false,
                error: 'Failed to cleanup old logs',
                details: error.message
            };
        }
    }
}

module.exports = MailingService;