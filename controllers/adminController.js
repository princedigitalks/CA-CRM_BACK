const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Auth admin & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Change admin password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin && (await admin.matchPassword(oldPassword))) {
      admin.password = newPassword;
      await admin.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(400).json({ message: 'Invalid old password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create initial admin
 * @route   POST /api/auth/create-admin
 * @access  Public
 */
exports.createInitialAdmin = async (req, res) => {
  try {
    const { adminId, oldPassword, newEmail, newPassword } = req.body;

    const existingAdmin = await Admin.findOne({ email: "demo@gmail.com" });

    if (!existingAdmin) {
      const admin = new Admin({
        email: "demo@gmail.com",
        password: "12345678",
      });

      await admin.save();

      return res.status(201).json({
        message: "Initial admin created",
      });
    }

    if (!adminId || !oldPassword) {
      return res.status(400).json({
        message: "Admin already exists. Provide adminId & oldPassword to update.",
      });
    }

    const admin = await Admin.findOne({ email: adminId });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    if (newEmail) admin.email = newEmail;
    if (newPassword) admin.password = newPassword; // pre-save hook will hash

    await admin.save();

    return res.json({
      message: "Admin updated successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
