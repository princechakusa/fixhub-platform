const pool = require('../config/db');
const { comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const login = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: 'Please provide name and password' });
  }
  try {
    const result = await pool.query('SELECT * FROM team_members WHERE name = $1 AND is_active = true', [name]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user.id);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      color: user.color,
      accessLevel: user.access_level,
      company_id: user.company_id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { login, getMe };
