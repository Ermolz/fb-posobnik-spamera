const { MessageTemplate } = require('../models');

class MessageTemplateRepository {
    // Отримати всі шаблони
    async findAll(options = {}) {
        const { limit, offset } = options;
        
        const queryOptions = {
            order: [['name', 'ASC']]
        };
        
        if (limit) queryOptions.limit = limit;
        if (offset) queryOptions.offset = offset;
        
        return await MessageTemplate.findAll(queryOptions);
    }

    // Отримати шаблон за ID
    async findById(id) {
        return await MessageTemplate.findByPk(id);
    }

    // Створити новий шаблон
    async create(data) {
        return await MessageTemplate.create(data);
    }

    // Оновити шаблон
    async update(id, data) {
        const [affectedRows] = await MessageTemplate.update(data, {
            where: { id }
        });
        
        if (affectedRows === 0) {
            return null;
        }
        
        return await this.findById(id);
    }

    // Видалити шаблон
    async delete(id) {
        const deletedRows = await MessageTemplate.destroy({
            where: { id }
        });
        
        return deletedRows > 0;
    }

    // Пошук шаблонів за назвою
    async searchByName(name) {
        return await MessageTemplate.findAll({
            where: {
                name: { [require('sequelize').Op.like]: `%${name}%` }
            },
            order: [['name', 'ASC']]
        });
    }

    // Підрахувати загальну кількість шаблонів
    async count() {
        return await MessageTemplate.count();
    }
}

module.exports = MessageTemplateRepository;
