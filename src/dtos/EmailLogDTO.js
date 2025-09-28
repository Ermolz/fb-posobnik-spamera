class EmailLogDTO {
    constructor(data) {
        this.id = data.id;
        this.email_address_id = data.email_address_id;
        this.template_id = data.template_id;
        this.subject = data.subject;
        this.content = data.content;
        this.status = data.status;
        this.error_message = data.error_message;
        this.sent_at = data.sent_at;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        
        this.email_address = data.email_address;
        this.template = data.template;
    }

    static fromModel(model) {
        if (!model) return null;
        return new EmailLogDTO(model.toJSON ? model.toJSON() : model);
    }

    static fromModelArray(models) {
        if (!Array.isArray(models)) return [];
        return models.map(model => this.fromModel(model));
    }

    static fromFindAndCountAllResult(result) {
        return {
            data: this.fromModelArray(result.rows),
            total: result.count,
            limit: result.limit,
            offset: result.offset
        };
    }

    static validateCreate(data) {
        const errors = [];
        
        if (!data.email_address_id) {
            errors.push('Email address ID is required');
        }
        
        if (!data.subject || data.subject.trim().length === 0) {
            errors.push('Subject is required');
        }
        
        if (!data.content || data.content.trim().length === 0) {
            errors.push('Content is required');
        }
        
        if (data.status && !['pending', 'sent', 'failed'].includes(data.status)) {
            errors.push('Invalid status');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    getStatusWithIcon() {
        const statusIcons = {
            pending: '⏳',
            sent: '✅',
            failed: '❌'
        };
        
        return `${statusIcons[this.status] || '❓'} ${this.status.toUpperCase()}`;
    }

    getSentTime() {
        if (this.sent_at) {
            return new Date(this.sent_at).toLocaleString();
        }
        return null;
    }

    getCreatedTime() {
        return new Date(this.created_at).toLocaleString();
    }

    hasError() {
        return this.status === 'failed' && this.error_message;
    }

    getRecipientName() {
        if (this.email_address) {
            const parts = [this.email_address.last_name, this.email_address.first_name];
            if (this.email_address.middle_name) {
                parts.splice(1, 0, this.email_address.middle_name);
            }
            return parts.join(' ');
        }
        return 'Unknown';
    }

    getRecipientEmail() {
        return this.email_address ? this.email_address.email : 'Unknown';
    }

    getTemplateName() {
        return this.template ? this.template.name : 'Custom';
    }

    toJSON() {
        return {
            id: this.id,
            email_address_id: this.email_address_id,
            template_id: this.template_id,
            subject: this.subject,
            content: this.content,
            status: this.status,
            status_with_icon: this.getStatusWithIcon(),
            error_message: this.error_message,
            has_error: this.hasError(),
            sent_at: this.sent_at,
            sent_time: this.getSentTime(),
            created_at: this.created_at,
            created_time: this.getCreatedTime(),
            recipient: {
                name: this.getRecipientName(),
                email: this.getRecipientEmail()
            },
            template: {
                id: this.template_id,
                name: this.getTemplateName()
            }
        };
    }
}

module.exports = EmailLogDTO;
