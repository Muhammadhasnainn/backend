const db = require('../config/database');

const Gallery = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM gallery');
    return rows;
  },
  create: async (data) => {
    const { image, alt_text, tags } = data;
    const [result] = await db.query(
      `INSERT INTO gallery (image, alt_text, tags) VALUES (?, ?, ?)`,
      [image, alt_text, tags]
    );
    return result.insertId; // Only returning the ID
  },
  delete: async (id) => {
    await db.query('DELETE FROM gallery WHERE id = ?', [id]);
  },
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM gallery WHERE id = ?', [id]);
    return rows[0]; // Return the first record
  },
};
module.exports = Gallery;
