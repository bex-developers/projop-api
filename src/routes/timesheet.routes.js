const express = require('express');
const router = express.Router();

const { createOrUpdateTimesheet, getUserTicketsWithHours,  deleteTimesheet} = require('../controllers/timesheet.controller');

router.post('/create-timesheet', createOrUpdateTimesheet);
router.get('/user-tickets-with-hours/:userId', getUserTicketsWithHours);

router.post('/delete-timesheet', deleteTimesheet);

module.exports = router;