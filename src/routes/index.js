const { Router } = require('express');
const router = Router();

//Definimos rutas

const { getTickets } = require('../controllers/index.controller');

router.get('/', async (req, res) =>  {
    res.json({status: 'API is ready listen request from ' + process.env.LOCATION});
  });
router.get('/tickets', getTickets);




module.exports = router;