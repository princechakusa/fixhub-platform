const pool = require('../config/db');

const Setting = {
  get: async (key) => {
    const result = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
    return result.rows[0] ? result.rows[0].value : null;
  },
  set: async (key, value) => {
    await pool.query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value]
    );
  },
  getAll: async () => {
    const result = await pool.query('SELECT * FROM settings');
    const obj = {};
    result.rows.forEach(row => { obj[row.key] = row.value; });
    return obj;
  }
};

module.exports = Setting;