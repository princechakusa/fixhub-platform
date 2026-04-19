const pool = require('../config/db');

const Company = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM companies WHERE is_active = true ORDER BY name');
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0];
  },
  
  create: async (companyData) => {
    const { name, code, color, logo_url } = companyData;
    const result = await pool.query(
      `INSERT INTO companies (name, code, color, logo_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, code, color, logo_url]
    );
    return result.rows[0];
  },
  
  update: async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const result = await pool.query(
      `UPDATE companies SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await pool.query('UPDATE companies SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = Company;