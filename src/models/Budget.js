const pool = require('../config/db');

const Budget = {
  findAll: async (companyId = null) => {
    let query = 'SELECT * FROM budgets WHERE is_active = true';
    const params = [];
    if (companyId) {
      params.push(companyId);
      query += ` AND company_id = $${params.length}`;
    }
    query += ' ORDER BY year DESC, month DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM budgets WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const { name, amount, spent, period, year, month, category, property_id, company_id } = data;
    const result = await pool.query(
      `INSERT INTO budgets (name, amount, spent, period, year, month, category, property_id, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, amount, spent, period, year, month, category, property_id, company_id]
    );
    return result.rows[0];
  },
  update: async (id, data) => {
    const { name, amount, spent, period, year, month, category, property_id } = data;
    const result = await pool.query(
      `UPDATE budgets SET name = $1, amount = $2, spent = $3, period = $4, year = $5, month = $6, category = $7, property_id = $8
       WHERE id = $9 RETURNING *`,
      [name, amount, spent, period, year, month, category, property_id, id]
    );
    return result.rows[0];
  },
  delete: async (id) => {
    await pool.query('UPDATE budgets SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = Budget;