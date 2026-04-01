const Category = require('../models/Category');
const FAQ = require('../models/FAQ');
const Health = require('../models/Health');
const HomePage = require('../models/HomePage');
const Location = require('../models/Location');
const MedicalGroup = require('../models/MedicalGroup');
const Provider = require('../models/Provider');
const QA = require('../models/QA');
const Review = require('../models/Review');
const Form = require('../models/Form');
const Service = require('../models/Service');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard-stats
 * @access  Private
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      categories: await Category.countDocuments().lean(),
      faqs: await FAQ.countDocuments().lean(),
      health: await Health.countDocuments().lean(),
      homepage: await HomePage.countDocuments().lean(),
      locations: await Location.countDocuments().lean(),
      medicalGroups: await MedicalGroup.countDocuments().lean(),
      providers: await Provider.countDocuments().lean(),
      qa: await QA.countDocuments().lean(),
      reviews: await Review.countDocuments().lean(),
      forms: await Form.countDocuments().lean(),
      services: await Service.countDocuments().lean(),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
