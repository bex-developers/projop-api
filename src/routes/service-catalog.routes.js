const express = require('express');
const router = express.Router();
const { getServiceCatalog } = require('../controllers/service-catalog.controller');

router.get('/list-service-catalog', getServiceCatalog);

module.exports = router;