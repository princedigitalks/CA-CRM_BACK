const express = require('express');
const router = express.Router();
const {
    getContactByDataFetch,
    getContactByFamilyDataFetch,
} = require('../../controllers/whatsappapi/apiController');

router.get('/family/:phone', getContactByFamilyDataFetch);
router.get('/:phone/:person/:doc', getContactByDataFetch);
module.exports = router;