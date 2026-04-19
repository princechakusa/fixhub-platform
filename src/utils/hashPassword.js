const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (entered, hashed) => {
  return bcrypt.compare(entered, hashed);
};

module.exports = { hashPassword, comparePassword };
