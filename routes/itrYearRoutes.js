const express = require('express');
const router = express.Router();
const {
  getAllItrYears,
  createItrYear,
  updateItrYear,
  deleteItrYear,
} = require('../controllers/itrYearController');
const { protect } = require('../middleware/authMiddleware');

router.get('/itr-years', protect, getAllItrYears);
router.post('/itr-years', protect, createItrYear);
router.put('/itr-years/:id', protect, updateItrYear);
router.delete('/itr-years/:id', protect, deleteItrYear);

module.exports = router;
