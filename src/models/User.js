const pool = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM team_members WHERE email = $1 AND is_active = true', [email]);
    return result.rows[0];
  },
  
  findByName: async (name) => {
    const result = await pool.query('SELECT * FROM team_members WHERE name = $1 AND is_active = true', [name]);
    return result.rows[0];
  },
  
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM team_members WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0];
  },
  
  create: async (userData) => {
    const { name, email, password_hash, role, color, access_level, company_id } = userData;
    const result = await pool.query(
      `INSERT INTO team_members (name, email, password_hash, role, color, access_level, company_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, password_hash, role, color, access_level, company_id]
    );
    return result.rows[0];
  },
  
  update: async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const result = await pool.query(
      `UPDATE team_members SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },
  
  delete: async (id) => {
    await pool.query('UPDATE team_members SET is_active = false WHERE id = $1', [id]);
  }
};

module.exports = User;