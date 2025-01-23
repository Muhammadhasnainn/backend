const db = require('../config/database');

const User = {
  getByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },
};

module.exports = User;
