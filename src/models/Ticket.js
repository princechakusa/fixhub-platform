const pool = require('../config/db');

const Ticket = {
  findAll: async (companyId = null) => {
    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params = [];
    if (companyId) {
      params.push(companyId);
      query += ` AND company_id = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },
  
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    return result.rows[0];
  },
  
  create: async (ticketData) => {
    const { id, title, description, technician, priority, status, date_logged, target_date, created_by, location, attachments, category, property_id, unit_id, vendor_id, cost, company_id } = ticketData;
    const result = await pool.query(
      `INSERT INTO tickets (id, title, description, technician, priority, status, date_logged, target_date, created_by, location, attachments, category, property_id, unit_id, vendor_id, cost, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
      [id, title, description, technician, priority, status, date_logged, target_date, created_by, location, attachments, category, property_id, unit_id, vendor_id, cost, company_id]
    );
    return result.rows[0];
  },
  
  update: async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const result = await pool.query(
      `UPDATE tickets SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
  }
};

module.exports = Ticket;