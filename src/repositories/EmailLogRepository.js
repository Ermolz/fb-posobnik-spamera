const { EmailLog, EmailAddress, MessageTemplate } = require('../models');

class EmailLogRepository {
    async create(data) {
        return await EmailLog.create(data);
    }

    async updateStatus(id, status, error_message = null) {
        const updateData = { status };
        
        if (error_message) {
            updateData.error_message = error_message;
        }
        
        if (status === 'sent') {
            updateData.sent_at = new Date();
        }
        
        const [affectedRows] = await EmailLog.update(updateData, {
            where: { id }
        });
        
        return affectedRows > 0;
    }

    async findAll(options = {}) {
        const { limit = 100, offset = 0 } = options;
        
        return await EmailLog.findAndCountAll({
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
    }

    async findByStatus(status, options = {}) {
        const { limit = 100, offset = 0 } = options;
        
        return await EmailLog.findAndCountAll({
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
    }

    async getStats() {
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
        
        return result;
    }

    async findByDateRange(startDate, endDate, options = {}) {
        const { limit = 100, offset = 0 } = options;
        
        return await EmailLog.findAndCountAll({
            where: {
                created_at: {
                    [require('sequelize').Op.between]: [startDate, endDate]
                }
            },
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
    }

    async deleteOldLogs(daysOld = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const deletedRows = await EmailLog.destroy({
            where: {
                created_at: {
                    [require('sequelize').Op.lt]: cutoffDate
                }
            }
        });
        
        return deletedRows;
    }
}

module.exports = EmailLogRepository;
