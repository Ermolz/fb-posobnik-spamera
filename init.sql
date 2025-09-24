-- Create table for storing email addresses
CREATE TABLE IF NOT EXISTS email_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for storing message templates
CREATE TABLE IF NOT EXISTS message_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for logging mailings
CREATE TABLE IF NOT EXISTS email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_address_id INT,
    template_id INT,
    subject VARCHAR(255),
    content TEXT,
    status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email_address_id) REFERENCES email_addresses(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES message_templates(id) ON DELETE SET NULL
);

-- Insert sample message templates
INSERT INTO message_templates (name, subject, content) VALUES
('Welcome', 'Welcome to our community!', 'Dear {{first_name}} {{last_name}}, welcome to our community!'),
('Important Notice', 'Important message', 'Dear {{first_name}} {{last_name}}, we want to inform you about important changes.'),
('Promotion', 'Special offer', 'Dear {{first_name}} {{last_name}}, we have a special offer just for you!');

-- Insert sample addresses
INSERT INTO email_addresses (last_name, first_name, middle_name, email) VALUES
('Smith', 'John', 'Michael', 'john.smith@example.com'),
('Johnson', 'Sarah', 'Elizabeth', 'sarah.johnson@example.com'),
('Williams', 'David', 'Robert', 'david.williams@example.com');
