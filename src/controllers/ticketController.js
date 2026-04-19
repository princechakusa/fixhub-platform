const Ticket = require('../models/Ticket');
const { getNextTicketId } = require('../utils/helpers');

const getAllTickets = async (req, res) => {
  try {
    const companyId = req.user.access_level === 'manager' ? null : req.user.company_id;
    const tickets = await Ticket.findAll(companyId);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const ticketData = {
      id: getNextTicketId(),
      ...req.body,
      created_by: req.user.name,
      company_id: req.user.company_id
    };
    const newTicket = await Ticket.create(ticketData);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const updated = await Ticket.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Ticket not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    await Ticket.delete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket };