const pool = require('../config/db');

const PMSchedule = {
  findAll: async (companyId = null) => {
    let query = 'SELECT * FROM maintenance_schedules WHERE is_active = true';
    const params = [];
    if (companyId) {
      params.push(companyId);
      query += ` AND company_id = $${params.length}`;
    }
    query += ' ORDER BY next_run NULLS LAST';
    const result = await pool.query(query, params);
    return result.rows;
  },
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM maintenance_schedules WHERE id = $1', [id]);
    return result.rows[0];
  },
  create: async (data) => {
    const { title, category, frequency, checklist, assigned_to, priority, property_id, next_run, company_id } = data;
    const result = await pool.query(
      `INSERT INTO maintenance_schedules (title, category, frequency, checklist, assigned_to, priority, property_id, next_run, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, category, frequency, checklist, assigned_to, priority, property_id, next_run, company_id]
    );
    return result.rows[0];
  },
  update: async (id, data) => {
    const { title, category, frequency, checklist, assigned_to, priority, property_id, next_run } = data;
    const result = await pool.query(
      `UPDATE maintenance_schedules SET title = $1, category = $2, frequency = $3, checklist = $4, assigned_to = $5, priority = $6, property_id = $7, next_run = $8
       WHERE id = $9 RETURNING *`,
      [title, category, frequency, checklist, assigned_to, priority, property_id, next_run, id]
    );
    return result.rows[0];
  },
  delete: async (id) => {
    await pool.query('UPDATE maintenance_schedules SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = PMSchedule;