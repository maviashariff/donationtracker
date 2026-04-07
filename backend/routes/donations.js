const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { donate, getMyDonations, getAll } = require('../controllers/donationController');

// Order matters: /mine must come before /:id style routes
router.get('/mine', auth, getMyDonations);
router.get('/all', auth, adminOnly, getAll);
router.post('/', auth, donate);

module.exports = router;
