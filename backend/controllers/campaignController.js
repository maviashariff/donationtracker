const db = require('../config/db');

exports.getAll = (req, res) => {
  const campaigns = db.prepare(`
    SELECT
      c.*,
      u.name AS creator_name,
      (SELECT COUNT(*) FROM donations d WHERE d.campaign_id = c.id) AS donor_count
    FROM campaigns c
    LEFT JOIN users u ON c.created_by = u.id
    ORDER BY c.created_at DESC
  `).all();
  return res.json(campaigns);
};

exports.getOne = (req, res) => {
  const campaign = db.prepare(`
    SELECT c.*, u.name AS creator_name
    FROM campaigns c
    LEFT JOIN users u ON c.created_by = u.id
    WHERE c.id = ?
  `).get(req.params.id);

  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found.' });
  }

  const donations = db.prepare(`
    SELECT d.*, u.name AS donor_name
    FROM donations d
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.campaign_id = ?
    ORDER BY d.created_at DESC
  `).all(req.params.id);

  const updates = db.prepare(
    'SELECT * FROM updates WHERE campaign_id = ? ORDER BY created_at DESC'
  ).all(req.params.id);

  return res.json({ ...campaign, donations, updates });
};

exports.create = (req, res) => {
  const { title, description, goal_amount } = req.body;

  if (!title || !description || !goal_amount) {
    return res.status(400).json({ message: 'Title, description, and goal amount are required.' });
  }
  if (goal_amount <= 0) {
    return res.status(400).json({ message: 'Goal amount must be positive.' });
  }

  const result = db
    .prepare('INSERT INTO campaigns (title, description, goal_amount, created_by) VALUES (?, ?, ?, ?)')
    .run(title.trim(), description.trim(), parseFloat(goal_amount), req.user.id);

  const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(campaign);
};

exports.update = (req, res) => {
  const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(req.params.id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found.' });
  }

  const { title, description, goal_amount, status } = req.body;

  db.prepare('UPDATE campaigns SET title = ?, description = ?, goal_amount = ?, status = ? WHERE id = ?').run(
    title || campaign.title,
    description || campaign.description,
    goal_amount ? parseFloat(goal_amount) : campaign.goal_amount,
    status || campaign.status,
    req.params.id
  );

  return res.json(db.prepare('SELECT * FROM campaigns WHERE id = ?').get(req.params.id));
};

exports.remove = (req, res) => {
  const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(req.params.id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found.' });
  }

  db.prepare('DELETE FROM updates WHERE campaign_id = ?').run(req.params.id);
  db.prepare('DELETE FROM donations WHERE campaign_id = ?').run(req.params.id);
  db.prepare('DELETE FROM campaigns WHERE id = ?').run(req.params.id);

  return res.json({ message: 'Campaign deleted successfully.' });
};
