const { Router } = require('express');
const router = Router();

//Definimos rutas

const { getTickets } = require('../controllers/index.controller');
const keycloak = require('../config/keycloak-config.js').getKeycloak();

router.get('/', async (req, res) =>  {
    res.json({status: 'API is ready listen request from ' + process.env.LOCATION});
  });
router.get('/tickets', keycloak.protect('Customer'), getTickets);



module.exports = router;