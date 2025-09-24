class EmailAddressDTO {
    constructor(data) {
        this.id = data.id;
        this.last_name = data.last_name;
        this.first_name = data.first_name;
        this.middle_name = data.middle_name;
        this.email = data.email;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Створити DTO з моделі
    static fromModel(model) {
        if (!model) return null;
        return new EmailAddressDTO(model.toJSON ? model.toJSON() : model);
    }

    // Створити масив DTO з масиву моделей
    static fromModelArray(models) {
        if (!Array.isArray(models)) return [];
        return models.map(model => this.fromModel(model));
    }

    // Валідація даних для створення
    static validateCreate(data) {
        const errors = [];
        
        if (!data.last_name || data.last_name.trim().length === 0) {
            errors.push('Last name is required');
        }
        
        if (!data.first_name || data.first_name.trim().length === 0) {
            errors.push('First name is required');
        }
        
        if (!data.email || data.email.trim().length === 0) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Invalid email format');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Валідація даних для оновлення
    static validateUpdate(data) {
        const errors = [];
        
        if (data.last_name !== undefined && (!data.last_name || data.last_name.trim().length === 0)) {
            errors.push('Last name cannot be empty');
        }
        
        if (data.first_name !== undefined && (!data.first_name || data.first_name.trim().length === 0)) {
            errors.push('First name cannot be empty');
        }
        
        if (data.email !== undefined) {
            if (!data.email || data.email.trim().length === 0) {
                errors.push('Email cannot be empty');
            } else if (!this.isValidEmail(data.email)) {
                errors.push('Invalid email format');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Перевірка валідності email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Отримати повне ім'я
    getFullName() {
        const parts = [this.last_name, this.first_name];
        if (this.middle_name) {
            parts.splice(1, 0, this.middle_name);
        }
        return parts.join(' ');
    }

    // Отримати коротке ім'я
    getShortName() {
        return `${this.first_name} ${this.last_name}`;
    }

    // Перетворити в об'єкт для API відповіді
    toJSON() {
        return {
            id: this.id,
            last_name: this.last_name,
            first_name: this.first_name,
            middle_name: this.middle_name,
            email: this.email,
            full_name: this.getFullName(),
            short_name: this.getShortName(),
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

module.exports = EmailAddressDTO;
