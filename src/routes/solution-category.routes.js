const express = require('express');
const router = express.Router();
const { getSolutionCategories } = require('../controllers/solution-category.controller');

router.get('/solution-categories', getSolutionCategories);

module.exports = router;