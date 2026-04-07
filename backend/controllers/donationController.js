const db = require('../config/db');

exports.donate = (req, res) => {
  const { campaign_id, amount, message } = req.body;

  if (!campaign_id || !amount) {
    return res.status(400).json({ message: 'Campaign ID and amount are required.' });
  }
  if (parseFloat(amount) <= 0) {
    return res.status(400).json({ message: 'Donation amount must be positive.' });
  }

  const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaign_id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found.' });
  }
  if (campaign.status !== 'active') {
    return res.status(400).json({ message: 'This campaign is not accepting donations.' });
  }

  const result = db
    .prepare('INSERT INTO donations (user_id, campaign_id, amount, message) VALUES (?, ?, ?, ?)')
    .run(req.user.id, parseInt(campaign_id), parseFloat(amount), message || null);

  db.prepare('UPDATE campaigns SET collected_amount = collected_amount + ? WHERE id = ?').run(
    parseFloat(amount),
    parseInt(campaign_id)
  );

  return res.status(201).json(db.prepare('SELECT * FROM donations WHERE id = ?').get(result.lastInsertRowid));
};

exports.getMyDonations = (req, res) => {
  const donations = db.prepare(`
    SELECT d.*, c.title AS campaign_title, c.status AS campaign_status
    FROM donations d
    LEFT JOIN campaigns c ON d.campaign_id = c.id
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC
  `).all(req.user.id);
  return res.json(donations);
};

exports.getAll = (req, res) => {
  const donations = db.prepare(`
    SELECT d.*, u.name AS donor_name, c.title AS campaign_title
    FROM donations d
    LEFT JOIN users u ON d.user_id = u.id
    LEFT JOIN campaigns c ON d.campaign_id = c.id
    ORDER BY d.created_at DESC
  `).all();
  return res.json(donations);
};
