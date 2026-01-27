const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketsAdmin,
  getTicketsHelpDesk,
  getOpenTicketsEmail,
  getTicketsAll,
  getTicket,
  create_ticket,
  update_ticket,
  status_ticket,
  solution_category,
  addMemberToTicket,
  ticket_company_type,
  ticket_type
} = require('../controllers/tickets.controller');

// Rutas de tickets

router.get('/tickets/:company_id/:fecha_inicial/:fecha_final', getTickets);
router.get('/ticketsAdmin/:fecha_inicial/:fecha_final', getTicketsAdmin);
router.get('/ticketsHelpDesk/:person_id/:fecha_inicial/:fecha_final', getTicketsHelpDesk);
router.get('/open-tickets/:user_email', getOpenTicketsEmail);
router.post('/tickets/create_ticket', create_ticket);
router.put('/update_ticket/:ticket_id', update_ticket);
router.get('/tickets/status_ticket', status_ticket);
router.get('/tickets/ticket_type', ticket_type);
router.get('/tickets/ticket_company_type', ticket_company_type);
router.get('/tickets/solution_category', solution_category);
router.get('/v1/tickets/:ticket_id', getTicket);

router.post('/ticket/:ticket_id/add-member', addMemberToTicket);
router.get('/tickets/:company_id', getTicketsAll);

module.exports = router;
