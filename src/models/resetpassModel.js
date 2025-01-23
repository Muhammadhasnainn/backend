const db = require('../config/database'); // Replace with your actual database connection file

// User Model
const User = {
  // Find user by email
  findByEmail: async (resetToken) => {
    const [rows] = await db.query('SELECT * FROM users WHERE reset_token = ?', [resetToken]);
    return rows[0];
  },

  // Update password by user ID
  updatePassword: async (userId, hashedPassword) => {
    try {
      const query = 'UPDATE users SET password = ? WHERE id = ?';
      const [result] = await db.execute(query, [hashedPassword, userId]); // MySQL query execution
      return result.affectedRows > 0; // Returns true if a row was updated
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
};

module.exports = User;
