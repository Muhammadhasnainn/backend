const mysql = require('mysql2/promise'); // Use the promise-based version of mysql2
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database.');

    try {
      const [results] = await connection.query('SELECT 1 + 1 AS solution');
      console.log('Query result:', results);
    } catch (queryErr) {
      console.error('Error executing query:', queryErr);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    } else {
      console.error('Error connecting to database:', err.message);
    }
  }
})();

module.exports = pool;
