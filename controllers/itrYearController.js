const ItrYear = require('../models/ItrYear');

// GET all ITR years (active only for dropdowns)
exports.getAllItrYears = async (req, res) => {
  try {
    const onlyActive = req.query.activeOnly === 'true';
    const filter = onlyActive ? { isActive: true } : {};
    const years = await ItrYear.find(filter).sort({ order: 1, year: -1 });
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create a new ITR year
exports.createItrYear = async (req, res) => {
  try {
    const { year, isActive, order } = req.body;
    if (!year || !year.trim()) {
      return res.status(400).json({ message: 'Year is required' });
    }
    const existing = await ItrYear.findOne({ year: year.trim() });
    if (existing) {
      return res.status(400).json({ message: `Year "${year}" already exists` });
    }
    const itrYear = new ItrYear({
      year: year.trim(),
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });
    await itrYear.save();
    res.status(201).json(itrYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update an ITR year
exports.updateItrYear = async (req, res) => {
  try {
    const { year, isActive, order } = req.body;
    const updated = await ItrYear.findByIdAndUpdate(
      req.params.id,
      { year: year?.trim(), isActive, order },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'ITR Year not found' });
    }
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This year already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE an ITR year
exports.deleteItrYear = async (req, res) => {
  try {
    const deleted = await ItrYear.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'ITR Year not found' });
    }
    res.json({ message: 'ITR Year deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
