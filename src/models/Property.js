const pool = require('../config/db');

const Property = {
  findAll: async (companyId = null) => {
    let query = 'SELECT * FROM properties WHERE is_active = true';
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
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const { name, address, type, units_count, company_id } = data;
    const result = await pool.query(
      'INSERT INTO properties (name, address, type, units_count, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, address, type, units_count, company_id]
    );
    return result.rows[0];
  },
  update: async (id, data) => {
    const { name, address, type, units_count } = data;
    const result = await pool.query(
      'UPDATE properties SET name = $1, address = $2, type = $3, units_count = $4 WHERE id = $5 RETURNING *',
      [name, address, type, units_count, id]
    );
    return result.rows[0];
  },
  delete: async (id) => {
    await pool.query('UPDATE properties SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = Property;