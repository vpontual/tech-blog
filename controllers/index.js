const router = require('express').Router();

const apiRoutes = require('./api');
const uiRoutes = require('./uiRoutes');

router.use('/', uiRoutes);
router.use('/api', apiRoutes);

module.exports = router;
