const express = require('express');
const router = express.Router();
const MailingController = require('../controllers/MailingController');

const mailingController = new MailingController();

// Отримати адреси для розсилки
router.get('/addresses', (req, res) => mailingController.getAddressesForMailing(req, res));

// Отримати шаблони для розсилки
router.get('/templates', (req, res) => mailingController.getTemplatesForMailing(req, res));

// Відправити розсилку
router.post('/send', (req, res) => mailingController.sendMailing(req, res));

// Отримати логи розсилок
router.get('/logs', (req, res) => mailingController.getMailingLogs(req, res));

// Отримати статистику розсилок
router.get('/stats', (req, res) => mailingController.getMailingStats(req, res));

// Отримати логи за статусом
router.get('/logs/:status', (req, res) => mailingController.getLogsByStatus(req, res));

// Очистити старі логи
router.delete('/logs/cleanup', (req, res) => mailingController.cleanupOldLogs(req, res));

module.exports = router;
