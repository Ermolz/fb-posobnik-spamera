const EmailAddress = require('./EmailAddress');
const MessageTemplate = require('./MessageTemplate');
const EmailLog = require('./EmailLog');

// Налаштування зв'язків між моделями
EmailLog.belongsTo(EmailAddress, {
    foreignKey: 'email_address_id',
    as: 'emailAddress'
});

EmailLog.belongsTo(MessageTemplate, {
    foreignKey: 'template_id',
    as: 'template'
});

EmailAddress.hasMany(EmailLog, {
    foreignKey: 'email_address_id',
    as: 'emailLogs'
});

MessageTemplate.hasMany(EmailLog, {
    foreignKey: 'template_id',
    as: 'emailLogs'
});

module.exports = {
    EmailAddress,
    MessageTemplate,
    EmailLog
};
