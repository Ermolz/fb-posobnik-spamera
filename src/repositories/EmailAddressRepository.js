const { EmailAddress } = require('../models');

class EmailAddressRepository {
    async findAll(options = {}) {
        const { sortBy = 'last_name', sortOrder = 'ASC', limit, offset } = options;
        
        const order = [[sortBy, sortOrder.toUpperCase()]];
        const queryOptions = { order };
        
        if (limit) queryOptions.limit = limit;
        if (offset) queryOptions.offset = offset;
        
        return await EmailAddress.findAll(queryOptions);
    }

    async findById(id) {
        return await EmailAddress.findByPk(id);
    }

    async create(data) {
        return await EmailAddress.create(data);
    }

    async update(id, data) {
        const [affectedRows] = await EmailAddress.update(data, {
            where: { id }
        });
        
        if (affectedRows === 0) {
            return null;
        }
        
        return await this.findById(id);
    }

    async delete(id) {
        const deletedRows = await EmailAddress.destroy({
            where: { id }
        });
        
        return deletedRows > 0;
    }

    async emailExists(email, excludeId = null) {
        const whereClause = { email };
        
        if (excludeId) {
            whereClause.id = { [require('sequelize').Op.ne]: excludeId };
        }
        
        const count = await EmailAddress.count({ where: whereClause });
        return count > 0;
    }

    async findAllForMailing() {
        return await EmailAddress.findAll({
            order: [['last_name', 'ASC'], ['first_name', 'ASC']]
        });
    }

    async search(criteria) {
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
        
        return await EmailAddress.findAll({
            where: whereClause,
            order: [['last_name', 'ASC']]
        });
    }

    async count() {
        return await EmailAddress.count();
    }
}

module.exports = EmailAddressRepository;
