class MessageTemplateDTO {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.subject = data.subject;
        this.content = data.content;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Створити DTO з моделі
    static fromModel(model) {
        if (!model) return null;
        return new MessageTemplateDTO(model.toJSON ? model.toJSON() : model);
    }

    // Створити масив DTO з масиву моделей
    static fromModelArray(models) {
        if (!Array.isArray(models)) return [];
        return models.map(model => this.fromModel(model));
    }

    // Валідація даних для створення
    static validateCreate(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Template name is required');
        }
        
        if (!data.subject || data.subject.trim().length === 0) {
            errors.push('Subject is required');
        }
        
        if (!data.content || data.content.trim().length === 0) {
            errors.push('Content is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Валідація даних для оновлення
    static validateUpdate(data) {
        const errors = [];
        
        if (data.name !== undefined && (!data.name || data.name.trim().length === 0)) {
            errors.push('Template name cannot be empty');
        }
        
        if (data.subject !== undefined && (!data.subject || data.subject.trim().length === 0)) {
            errors.push('Subject cannot be empty');
        }
        
        if (data.content !== undefined && (!data.content || data.content.trim().length === 0)) {
            errors.push('Content cannot be empty');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Замінити плейсхолдери в шаблоні
    replacePlaceholders(userData) {
        let content = this.content;
        let subject = this.subject;
        
        const placeholders = {
            '{{first_name}}': userData.first_name || '',
            '{{last_name}}': userData.last_name || '',
            '{{middle_name}}': userData.middle_name || '',
            '{{email}}': userData.email || '',
            '{{full_name}}': this.getFullName(userData)
        };

        for (const [placeholder, value] of Object.entries(placeholders)) {
            content = content.replace(new RegExp(placeholder, 'g'), value);
            subject = subject.replace(new RegExp(placeholder, 'g'), value);
        }

        return {
            subject,
            content
        };
    }

    // Отримати повне ім'я користувача
    getFullName(userData) {
        const parts = [userData.last_name, userData.first_name];
        if (userData.middle_name) {
            parts.splice(1, 0, userData.middle_name);
        }
        return parts.join(' ');
    }

    // Перевірити наявність плейсхолдерів
    hasPlaceholders() {
        const placeholderRegex = /\{\{[^}]+\}\}/g;
        return placeholderRegex.test(this.content) || placeholderRegex.test(this.subject);
    }

    // Отримати список плейсхолдерів
    getPlaceholders() {
        const placeholderRegex = /\{\{[^}]+\}\}/g;
        const contentPlaceholders = this.content.match(placeholderRegex) || [];
        const subjectPlaceholders = this.subject.match(placeholderRegex) || [];
        
        return [...new Set([...contentPlaceholders, ...subjectPlaceholders])];
    }

    // Перетворити в об'єкт для API відповіді
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            subject: this.subject,
            content: this.content,
            has_placeholders: this.hasPlaceholders(),
            placeholders: this.getPlaceholders(),
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = MessageTemplateDTO;
