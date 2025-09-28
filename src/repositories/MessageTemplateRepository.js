const { MessageTemplate } = require('../models');

class MessageTemplateRepository {
    async findAll(options = {}) {
        const { limit, offset } = options;
        
        const queryOptions = {
            order: [['name', 'ASC']]
        };
        
        if (limit) queryOptions.limit = limit;
        if (offset) queryOptions.offset = offset;
        
        return await MessageTemplate.findAll(queryOptions);
    }

    async findById(id) {
        return await MessageTemplate.findByPk(id);
    }

    async create(data) {
        return await MessageTemplate.create(data);
    }

    async update(id, data) {
        const [affectedRows] = await MessageTemplate.update(data, {
            where: { id }
        });
        
        if (affectedRows === 0) {
            return null;
        }
        
        return await this.findById(id);
    }

    async delete(id) {
        const deletedRows = await MessageTemplate.destroy({
            where: { id }
        });
        
        return deletedRows > 0;
    }

    async searchByName(name) {
        return await MessageTemplate.findAll({
            where: {
                name: { [require('sequelize').Op.like]: `%${name}%` }
            },
            order: [['name', 'ASC']]
        });
    }

    async count() {
        return await MessageTemplate.count();
    }
}

module.exports = MessageTemplateRepository;
