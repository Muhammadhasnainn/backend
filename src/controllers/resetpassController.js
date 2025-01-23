const User = require('../models/resetpassModel');

const resetPassword = async (req, res) => {
  const { resetToken, password } = req.body;

  try {
    const user = await User.findByEmail(resetToken);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isUpdated = await User.updatePassword(user.id, password);

    if (!isUpdated) {
      return res.status(500).json({ message: 'Password update failed.' });
    }

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'An error occurred while resetting the password.' });
  }
};

module.exports = {
  resetPassword,
};
