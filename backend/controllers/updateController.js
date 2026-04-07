const db = require('../config/db');

exports.addUpdate = (req, res) => {
  const { campaign_id, title, content, amount_used } = req.body;

  if (!campaign_id || !title || !content) {
    return res.status(400).json({ message: 'Campaign ID, title, and content are required.' });
  }

  const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(campaign_id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found.' });
  }

  const result = db
    .prepare('INSERT INTO updates (campaign_id, title, content, amount_used) VALUES (?, ?, ?, ?)')
    .run(parseInt(campaign_id), title.trim(), content.trim(), parseFloat(amount_used) || 0);

  return res.status(201).json(db.prepare('SELECT * FROM updates WHERE id = ?').get(result.lastInsertRowid));
};

exports.getCampaignUpdates = (req, res) => {
  const updates = db
    .prepare('SELECT * FROM updates WHERE campaign_id = ? ORDER BY created_at DESC')
    .all(req.params.campaignId);
  return res.json(updates);
};

exports.deleteUpdate = (req, res) => {
  const upd = db.prepare('SELECT * FROM updates WHERE id = ?').get(req.params.id);
  if (!upd) {
    return res.status(404).json({ message: 'Update not found.' });
  }
  db.prepare('DELETE FROM updates WHERE id = ?').run(req.params.id);
  return res.json({ message: 'Update deleted.' });
};
