const express = require('express');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', roleCheck('manager', 'supervisor'), getUsers);
router.get('/:id', roleCheck('manager', 'supervisor'), getUserById);
router.post('/', roleCheck('manager'), createUser);
router.put('/:id', roleCheck('manager'), updateUser);
router.delete('/:id', roleCheck('manager'), deleteUser);

module.exports = router;