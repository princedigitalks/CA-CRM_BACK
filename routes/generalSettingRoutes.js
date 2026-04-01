const express = require('express');
const router = express.Router();
const { getLogo, updateLogo, updateMarquee, getMarqueeSettings } = require('../controllers/generalSettingController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware'); // Assuming auth middleware exists

router.get('/get-logo', getLogo);
router.put('/update-logo', protect, upload.single('logo'), updateLogo);
router.put('/update-marquee', protect, updateMarquee);
router.get('/get-marquee-settings', getMarqueeSettings);

module.exports = router;
