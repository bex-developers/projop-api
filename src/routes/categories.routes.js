const express = require('express');
const router = express.Router();
const {
  types,
  priority,
  catalog,
  customer_project,
  customer_company,
  customer_class,
  getCatalog,
  getCatalogPage,
  getServiceCatalog,
  getRootCatalog,
  getParentCatalog,
  getChildCatalog,
  getAllCatalog,
  create_service,
  getSapCategoryType
} = require('../controllers/categories.controller');

// Rutas de categorías y catálogos
router.get('/tickets/types', types);
router.get('/tickets/priority', priority);
router.get('/tickets/catalog', catalog);
router.get('/tickets/customer_project/:company_id', customer_project);
router.get('/tickets/customer_company/:company_id', customer_company);
router.get('/tickets/customer_class', customer_class);
router.get('/service_catalog', getCatalog);
router.get('/service_catalogpage', getCatalogPage);
router.get('/service-catalog/:category_id', getServiceCatalog);
router.post('/service_catalog/create_service', create_service);
router.get('/sap-category-type/', getSapCategoryType);
router.get('/root-catalog', getRootCatalog);
router.get('/parent-catalog/:parent_id', getParentCatalog);
router.get('/child-catalog/:parent_id', getChildCatalog);
router.get('/all_catalog/', getAllCatalog);

module.exports = router;   
