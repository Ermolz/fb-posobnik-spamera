const express = require('express');
const router = express.Router();
const MessageTemplateController = require('../controllers/MessageTemplateController');

const messageTemplateController = new MessageTemplateController();

router.get('/search', (req, res) => messageTemplateController.searchTemplatesByName(req, res));
router.get('/stats', (req, res) => messageTemplateController.getTemplateStats(req, res));
router.get('/', (req, res) => messageTemplateController.getAllTemplates(req, res));
router.get('/:id', (req, res) => messageTemplateController.getTemplateById(req, res));
router.post('/', (req, res) => messageTemplateController.createTemplate(req, res));
router.put('/:id', (req, res) => messageTemplateController.updateTemplate(req, res));
router.delete('/:id', (req, res) => messageTemplateController.deleteTemplate(req, res));
router.post('/:id/placeholders', (req, res) => messageTemplateController.getTemplateWithPlaceholders(req, res));

module.exports = router;