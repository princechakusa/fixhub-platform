const User = require('../models/User');
const { hashPassword } = require('../utils/hashPassword');

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll(req.user.company_id);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, color, access_level, company_id } = req.body;
    const password_hash = await hashPassword(password);
    const user = await User.create({ name, email, password_hash, role, color, access_level, company_id });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, color, access_level, company_id } = req.body;
    const user = await User.update(req.params.id, { name, email, role, color, access_level, company_id });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };