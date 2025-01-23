const User = require('../models/loginModel');
const jwt = require('jsonwebtoken');

// Secret key for JWT (Change this to an environment variable in production)
const JWT_SECRET = 'your_jwt_secret_key';

// Login function
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user details from the database using the username
    const user = await User.getByUsername(username);

    // If user not found or password does not match
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token with user ID and username as payload
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiry time (can be adjusted)
    );

    // Return response with token
    res.status(200).json({
      message: 'Login successful!',
      token, // Send token in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  loginUser,
};
