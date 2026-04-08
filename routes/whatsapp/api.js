const express = require('express');
const router = express.Router();
const {
    getContactByDataFetch,
    getContactByFamilyDataFetch,
} = require('../../controllers/whatsappapi/apiController');

router.get('/:phone', getContactByDataFetch);
router.get('/family/:phone', getContactByFamilyDataFetch);
module.exports = router;