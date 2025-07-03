const express = require('express');
const router = express.Router();
const {
  system,
  getTechSystem,
  getBtpService,
  getCertInstance,
  getPse,
  getPseKey,
  getCert,
  getSingleCert,
  getAllCert,
  getExpiredCert,
  getValidCert,
  getSoonToExpireCert,
  getCertKpi
} = require('../controllers/conf_items.controller');

// Rutas de configuration items y certificados
router.get('/tickets/system/:company_id', system);
router.get('/tech-system/:company_id', getTechSystem);
router.get('/btp-service/:company_id', getBtpService);
router.get('/cert-instance/:company_id', getCertInstance);
router.get('/pse/:conf_item_id', getPse);
router.get('/pse-key/:conf_item_id', getPseKey);
router.get('/cert/:conf_item_id', getCert);
router.get('/single-cert/:conf_item_id', getSingleCert);
router.get('/all-cert/:company_id', getAllCert);
router.get('/expired-cert/:company_id', getExpiredCert);
router.get('/valid-cert/:company_id', getValidCert);
router.get('/soon-cert/:company_id', getSoonToExpireCert);
router.get('/cert-kpi/:company_id', getCertKpi);

module.exports = router;
