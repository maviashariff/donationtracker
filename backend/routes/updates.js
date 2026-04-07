const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { addUpdate, getCampaignUpdates, deleteUpdate } = require('../controllers/updateController');

router.post('/', auth, adminOnly, addUpdate);
router.get('/campaign/:campaignId', getCampaignUpdates);
router.delete('/:id', auth, adminOnly, deleteUpdate);

module.exports = router;
