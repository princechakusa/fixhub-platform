const express = require('express');
const { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;
