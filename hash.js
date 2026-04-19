const bcrypt = require('bcryptjs');
const password = 'FixHub@Admin2026';
const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);
console.log('Hashed password:', hash);
