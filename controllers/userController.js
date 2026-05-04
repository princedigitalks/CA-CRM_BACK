const User = require('../models/User');

/**
 * @desc    Register or Update User FCM Token
 * @route   POST /api/users/register-token
 * @access  Public
 */
exports.registerToken = async (req, res) => {
  try {
    const { fcmToken, name, email } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: 'FCM Token is required' });
    }

    // Check if user with this token exists
    let user = await User.findOne({ fcmToken });

    if (user) {
      if (name) user.name = name.trim();
      if (email) user.email = email.trim();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        fcmToken: fcmToken.trim(),
        name: name?.trim(),
        email: email?.trim()
      });
    }

    res.status(200).json({ message: 'Token registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
