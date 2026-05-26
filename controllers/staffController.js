const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret');
};

/**
 * @desc    Auth staff & get token
 * @route   POST /api/staff/login
 * @access  Public
 */
// exports.loginStaff = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log(email, password);
//     const staff = await Staff.findOne({ email: email.toLowerCase() });
//     const res = await bcrypt.compare(password, staff.password)
//     console.log(res, 'dikjf', staff);

//     if (staff && res) {
//       res.json({
//         _id: staff._id,
//         name: staff.name,
//         email: staff.email,
//         role: staff.role,
//         token: generateToken(staff._id),
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(email, password);
    const staff = await Staff.findOne({ email: email.toLowerCase() });

    // Rename this variable to something else, like 'isMatch'
    const isMatch = await bcrypt.compare(password, staff.password)
    console.log(isMatch, 'dikjf', staff);

    if (staff && isMatch) {
      res.json({
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        token: generateToken(staff._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * @desc    Get all staff
 * @route   GET /api/staff
 * @access  Private (Admin only)
 */
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find({}).select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get staff by ID
 * @route   GET /api/staff/:id
 * @access  Private
 */
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new staff
 * @route   POST /api/staff
 * @access  Private (Admin only)
 */
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const staff = new Staff({
      name: name?.trim(),
      email: email?.trim(),
      password: password?.trim(),
      role: role || 'staff',
    });
    await staff.save();
    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update staff
 * @route   PUT /api/staff/:id
 * @access  Private (Admin only)
 */
exports.updateStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    if (name) staff.name = name.trim();
    if (email) staff.email = email.trim();
    if (password) staff.password = password.trim();
    if (role) staff.role = role;

    await staff.save();

    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete staff
 * @route   DELETE /api/staff/:id
 * @access  Private (Admin only)
 */
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};