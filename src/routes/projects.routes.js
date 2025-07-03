const express = require('express');
const router = express.Router();
const { support_project } = require('../controllers/projects.controller');

// Ruta de proyectos
router.get('/tickets/support_project/:company_id', support_project);

module.exports = router;
 