const express = require('express');
const router = express.Router();

const { createOrUpdateTimesheet} = require('../controllers/timesheet.controller');

router.post('/create-timesheet', createOrUpdateTimesheet);

module.exports = router;