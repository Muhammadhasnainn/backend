const db = require('../config/database');

const User = {
  getByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  saveResetToken: async (id, token, expiry) => {
    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
      [token, expiry, id]
    );
  },
};

module.exports = User;
