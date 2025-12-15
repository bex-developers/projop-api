const express = require('express');
const router = express.Router();

const { createOrUpdateTimesheet, getUserTicketsWithHours,  deleteTimesheet, getSupportTicketsWithHours,  getUserHoursSummary } = require('../controllers/timesheet.controller');

router.post('/create-timesheet', createOrUpdateTimesheet);
router.get('/user-tickets-with-hours/:userId', getUserTicketsWithHours);

router.get('/users/:userId/support-tickets', getSupportTicketsWithHours);

router.post('/delete-timesheet', deleteTimesheet);

router.get('/users/:userId/hours-summary', getUserHoursSummary);


module.exports = router;