const express = require('express');
const router = express.Router();
const controller = require('../controllers/index')

router.get('/polaroid/render/start', controller.render);
router.get('/photobook/render/start', controller.render2);
router.get('/health/status', controller.healthStatus);

module.exports = router;