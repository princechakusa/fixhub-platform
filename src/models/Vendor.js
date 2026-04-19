const pool = require('../config/db');

const Vendor = {
  findAll: async (companyId = null) => {
    let query = 'SELECT * FROM vendors WHERE is_active = true';
    const params = [];
    if (companyId) {
      params.push(companyId);
      query += ` AND company_id = $${params.length}`;
    }
    query += ' ORDER BY name';
    const result = await pool.query(query, params);
    return result.rows;
  },
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM vendors WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const { name, category, contact_name, phone, email, rating, company_id } = data;
    const result = await pool.query(
      `INSERT INTO vendors (name, category, contact_name, phone, email, rating, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, category, contact_name, phone, email, rating, company_id]
    );
    return result.rows[0];
  },
  update: async (id, data) => {
    const { name, category, contact_name, phone, email, rating } = data;
    const result = await pool.query(
      `UPDATE vendors SET name = $1, category = $2, contact_name = $3, phone = $4, email = $5, rating = $6
       WHERE id = $7 RETURNING *`,
      [name, category, contact_name, phone, email, rating, id]
    );
    return result.rows[0];
  },
  delete: async (id) => {
    await pool.query('UPDATE vendors SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = Vendor;