const express = require('express');
const router = express.Router();
const { getSection, getSectiontoMemberId, getDocByDataFetch, getContactByDataFetch } = require('../../controllers/automationRoutes/apiController');

router.get('/sections/:phone', getSection);
router.get('/members/:phone/:sectionId', getSectiontoMemberId);
router.get('/docslist/:phone/:person', getDocByDataFetch);
router.get('/docs/:phone/:person/:doc', getContactByDataFetch);
module.exports = router;