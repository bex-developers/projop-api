const express = require('express');
const router = express.Router();
const { getCompanyInfo } = require('../controllers/company.controller');

// Ruta de compañía
router.get('/tickets/company_info/:company_id', getCompanyInfo);

module.exports = router;
