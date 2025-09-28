const express = require('express');
const router = express.Router();
const MailingController = require('../controllers/MailingController');

const mailingController = new MailingController();

router.get('/addresses', (req, res) => mailingController.getAddressesForMailing(req, res));

router.get('/templates', (req, res) => mailingController.getTemplatesForMailing(req, res));

router.post('/send', (req, res) => mailingController.sendMailing(req, res));

router.get('/logs', (req, res) => mailingController.getMailingLogs(req, res));

router.get('/stats', (req, res) => mailingController.getMailingStats(req, res));

router.get('/logs/:status', (req, res) => mailingController.getLogsByStatus(req, res));

router.delete('/logs/cleanup', (req, res) => mailingController.cleanupOldLogs(req, res));

module.exports = router;
