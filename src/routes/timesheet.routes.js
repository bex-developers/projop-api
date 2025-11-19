const express = require('express');
const router = express.Router();

const { createOrUpdateTimesheet, getUserTicketsWithHours} = require('../controllers/timesheet.controller');

router.post('/create-timesheet', createOrUpdateTimesheet);
router.get('/user-tickets-with-hours/:userId', getUserTicketsWithHours);

module.exports = router;