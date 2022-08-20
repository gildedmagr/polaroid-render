const express = require('express');
const router = express.Router();
const controller = require('../controllers/index')

router.get('/polaroid/render/start', controller.renderPolaroid);
router.get('/stripes/render/start', controller.renderPolaroid);
router.get('/health/status', controller.healthStatus);

module.exports = router;