const nodemailer = require('nodemailer');
const User = require('../models/authModel'); // Assuming this is your User model
const crypto = require('crypto');

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save token and expiry to the database (implement in your model)
    await User.saveResetToken(user.id, resetToken, resetTokenExpiry);

    // Generate reset link
    const resetLink = `https://admin.sungumskardu.com/ForgotPassword/${resetToken}`;

    // Send email with reset link
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>If you did not request this, please ignore this email.</p>`,
    });

    res.status(200).json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { forgotPassword };
