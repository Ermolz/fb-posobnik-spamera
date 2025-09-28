class MailingDTO {
    constructor(data) {
        this.template_id = data.template_id;
        this.custom_subject = data.custom_subject;
        this.custom_content = data.custom_content;
        this.selected_addresses = data.selected_addresses || [];
    }

    static validateMailing(data) {
        const errors = [];
        
        if (!data.selected_addresses || data.selected_addresses.length === 0) {
            errors.push('At least one email address must be selected');
        }
        
        if (!data.template_id && (!data.custom_subject || !data.custom_content)) {
            errors.push('Either template ID or custom subject and content must be provided');
        }
        
        if (data.template_id && (data.custom_subject || data.custom_content)) {
            errors.push('Cannot use both template and custom content');
        }
        
        if (data.custom_subject && (!data.custom_subject.trim())) {
            errors.push('Custom subject cannot be empty');
        }
        
        if (data.custom_content && (!data.custom_content.trim())) {
            errors.push('Custom content cannot be empty');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    getMailingType() {
        if (this.template_id) {
            return 'template';
        }
        return 'custom';
    }

    getAddressCount() {
        return this.selected_addresses.length;
    }

    hasAddresses() {
        return this.selected_addresses.length > 0;
    }

    getDescription() {
        const type = this.getMailingType();
        const count = this.getAddressCount();
        
        if (type === 'template') {
            return `Template mailing to ${count} address${count !== 1 ? 'es' : ''}`;
        } else {
            return `Custom mailing to ${count} address${count !== 1 ? 'es' : ''}`;
        }
    }

    toJSON() {
        return {
            template_id: this.template_id,
            custom_subject: this.custom_subject,
            custom_content: this.custom_content,
            selected_addresses: this.selected_addresses,
            mailing_type: this.getMailingType(),
            address_count: this.getAddressCount(),
            has_addresses: this.hasAddresses(),
            description: this.getDescription()
        };
    }
}

class MailingResultDTO {
    constructor(data) {
        this.total_sent = data.total_sent || 0;
        this.total_failed = data.total_failed || 0;
        this.total_addresses = data.total_addresses || 0;
        this.results = data.results || [];
        this.success = data.success || false;
        this.message = data.message || '';
    }

    addResult(result) {
        this.results.push(result);
        if (result.status === 'sent') {
            this.total_sent++;
        } else if (result.status === 'failed') {
            this.total_failed++;
        }
    }

    getSuccessRate() {
        if (this.total_addresses === 0) return 0;
        return Math.round((this.total_sent / this.total_addresses) * 100);
    }

    isComplete() {
        return this.total_sent + this.total_failed === this.total_addresses;
    }

    getStats() {
        return {
            total_addresses: this.total_addresses,
            total_sent: this.total_sent,
            total_failed: this.total_failed,
            success_rate: this.getSuccessRate(),
            is_complete: this.isComplete()
        };
    }

    toJSON() {
        return {
            success: this.success,
            message: this.message,
            stats: this.getStats(),
            results: this.results
        };
    }
}

module.exports = {
    MailingDTO,
    MailingResultDTO
};
