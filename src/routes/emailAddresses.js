const express = require('express');
const router = express.Router();
const EmailAddressController = require('../controllers/EmailAddressController');

const emailAddressController = new EmailAddressController();

router.get('/search', (req, res) => emailAddressController.searchAddresses(req, res));
router.get('/stats', (req, res) => emailAddressController.getAddressStats(req, res));
router.get('/', (req, res) => emailAddressController.getAllAddresses(req, res));
router.get('/:id', (req, res) => emailAddressController.getAddressById(req, res));
router.post('/', (req, res) => emailAddressController.createAddress(req, res));
router.put('/:id', (req, res) => emailAddressController.updateAddress(req, res));
router.delete('/:id', (req, res) => emailAddressController.deleteAddress(req, res));

module.exports = router;