const GeneralSetting = require('../models/GeneralSetting');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Get Logo
 * @route   GET /api/general-settings/logo
 * @access  Public
 */
exports.getLogo = async (req, res) => {
  try {
    let setting = await GeneralSetting.findOne();
    if (!setting) {
      setting = await GeneralSetting.create({ logo: '/logo.png' });
    }
    res.json({ logo: setting.logo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Update Logo
 * @route   PUT /api/general-settings/logo
 * @access  Private (Admin)
 */
exports.updateLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const logoPath = req.file.path.replace(/\\/g, '/'); // Normalize path
    
    let setting = await GeneralSetting.findOne();
    if (setting) {
      // Optional: Delete old logo file if it's not the default one
      const imagePath = path.join(__dirname, '..', setting.logo);

      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting logo image:', err);
          });
        }
      });
      setting.logo = logoPath;
      await setting.save();
    } else {
      setting = await GeneralSetting.create({ logo: logoPath });
    }

    res.json({ message: 'Logo updated', logo: setting.logo });
  } catch (err) {
    console.log(err,'errererer')
    res.status(500).json({ error: err.message });
  }
};

exports.updateMarquee = async (req, res) => {
  try {
    const { marqueName, marqueLink } = req.body;
    let setting = await GeneralSetting.findOne();
    if (setting) {
      setting.marqueName = marqueName?.trim();
      setting.marqueLink = marqueLink?.trim();
      await setting.save();
    } else {
      setting = await GeneralSetting.create({ marqueName: marqueName?.trim(), marqueLink: marqueLink?.trim() });
    }
    res.json({ message: 'Marquee updated', marqueName, marqueLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMarqueeSettings = async (req, res) => {
  try {
    let setting = await GeneralSetting.findOne();
    if (!setting) {
      setting = await GeneralSetting.create({ marqueName: '', marqueLink: '' });
    }
    res.json({ marqueName: setting.marqueName, marqueLink: setting.marqueLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
