const pool = require('../config/db');

const Unit = {
  findAll: async (propertyId = null, companyId = null) => {
    let query = 'SELECT * FROM units WHERE is_active = true';
    const params = [];
    if (propertyId) {
      params.push(propertyId);
      query += ` AND property_id = $${params.length}`;
    }
    if (companyId && !propertyId) {
      params.push(companyId);
      query += ` AND company_id = $${params.length}`;
    }
    query += ' ORDER BY unit_number';
    const result = await pool.query(query, params);
    return result.rows;
  },
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM units WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const { unit_number, floor, type, tenant_name, tenant_phone, is_occupied, property_id, company_id } = data;
    const result = await pool.query(
      `INSERT INTO units (unit_number, floor, type, tenant_name, tenant_phone, is_occupied, property_id, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [unit_number, floor, type, tenant_name, tenant_phone, is_occupied, property_id, company_id]
    );
    return result.rows[0];
  },
  update: async (id, data) => {
    const { unit_number, floor, type, tenant_name, tenant_phone, is_occupied, property_id } = data;
    const result = await pool.query(
      `UPDATE units SET unit_number = $1, floor = $2, type = $3, tenant_name = $4, tenant_phone = $5, is_occupied = $6, property_id = $7
       WHERE id = $8 RETURNING *`,
      [unit_number, floor, type, tenant_name, tenant_phone, is_occupied, property_id, id]
    );
    return result.rows[0];
  },
  delete: async (id) => {
    await pool.query('UPDATE units SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = Unit;