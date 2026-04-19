const pool = require('../config/db');

const Inventory = {
  findAll: async (companyId = null) => {
    let query = 'SELECT * FROM inventory WHERE is_active = true';
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
    const result = await pool.query('SELECT * FROM inventory WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0];
  },
  
  create: async (itemData) => {
    const { name, qty, min_qty, unit, company_id } = itemData;
    const result = await pool.query(
      `INSERT INTO inventory (name, qty, min_qty, unit, company_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, qty, min_qty, unit, company_id]
    );
    return result.rows[0];
  },
  
  update: async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const result = await pool.query(
      `UPDATE inventory SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await pool.query('UPDATE inventory SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = Inventory;