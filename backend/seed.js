const db = require('./config/db');
const bcrypt = require('bcryptjs');

function seed() {
  const already = db.prepare("SELECT id FROM users WHERE email = 'admin@donation.com'").get();
  if (already) {
    console.log('✅ Database already seeded — skipping.');
    return;
  }

  console.log('🌱 Seeding database with sample data...');

  const adminPwd = bcrypt.hashSync('admin123', 10);
  const donorPwd = bcrypt.hashSync('donor123', 10);

  const adminId = db
    .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
    .run('Admin Shaji', 'admin@donation.com', adminPwd, 'admin').lastInsertRowid;

  const donor1Id = db
    .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
    .run('Ravi Kumar', 'ravi@example.com', donorPwd, 'donor').lastInsertRowid;

  const donor2Id = db
    .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
    .run('Priya Sharma', 'priya@example.com', donorPwd, 'donor').lastInsertRowid;

  // Campaigns
  const c1Id = db.prepare(
    "INSERT INTO campaigns (title, description, goal_amount, collected_amount, created_by) VALUES (?, ?, ?, ?, ?)"
  ).run(
    'Clean Water Initiative',
    'Providing clean drinking water to rural villages in Karnataka. We aim to install water purification systems and pipelines to ensure safe drinking water for over 500 families.',
    100000, 45000, adminId
  ).lastInsertRowid;

  const c2Id = db.prepare(
    "INSERT INTO campaigns (title, description, goal_amount, collected_amount, created_by) VALUES (?, ?, ?, ?, ?)"
  ).run(
    'Education for All',
    'Sponsoring education for underprivileged children in Mysore district. Funds will cover school fees, books, uniforms, and mid-day meals for 200 children for one academic year.',
    75000, 30000, adminId
  ).lastInsertRowid;

  const c3Id = db.prepare(
    "INSERT INTO campaigns (title, description, goal_amount, collected_amount, created_by) VALUES (?, ?, ?, ?, ?)"
  ).run(
    'Flood Relief Fund',
    'Immediate relief for flood victims in coastal Karnataka. Providing emergency kits, temporary shelters, food supplies, and medical assistance to thousands of displaced families.',
    200000, 120000, adminId
  ).lastInsertRowid;

  const c4Id = db.prepare(
    "INSERT INTO campaigns (title, description, goal_amount, collected_amount, status, created_by) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    'Senior Citizen Care',
    'Supporting elderly individuals without family support in Mysore. Providing monthly ration kits, medical checkups, and companionship programs for 100 senior citizens.',
    50000, 50000, 'completed', adminId
  ).lastInsertRowid;

  // Donations
  db.prepare("INSERT INTO donations (user_id, campaign_id, amount, message) VALUES (?, ?, ?, ?)").run(donor1Id, c1Id, 15000, 'Clean water is a basic right!');
  db.prepare("INSERT INTO donations (user_id, campaign_id, amount, message) VALUES (?, ?, ?, ?)").run(donor2Id, c1Id, 30000, 'Happy to support this initiative.');
  db.prepare("INSERT INTO donations (user_id, campaign_id, amount, message) VALUES (?, ?, ?, ?)").run(donor1Id, c2Id, 30000, 'Education is the future of our nation.');
  db.prepare("INSERT INTO donations (user_id, campaign_id, amount, message) VALUES (?, ?, ?, ?)").run(donor2Id, c3Id, 80000, 'Stay strong, help is on the way!');
  db.prepare("INSERT INTO donations (user_id, campaign_id, amount, message) VALUES (?, ?, ?, ?)").run(donor1Id, c3Id, 40000, 'Praying for everyone affected.');
  db.prepare("INSERT INTO donations (user_id, campaign_id, amount, message) VALUES (?, ?, ?, ?)").run(donor2Id, c4Id, 50000, 'Our elders deserve the best care.');

  // Updates
  db.prepare("INSERT INTO updates (campaign_id, title, content, amount_used) VALUES (?, ?, ?, ?)").run(
    c1Id, 'Water Pumps Installed',
    'Successfully installed 5 solar-powered water pumps in 3 villages. Approximately 200 families now have direct access to clean drinking water. Installation work was completed on schedule.',
    20000
  );
  db.prepare("INSERT INTO updates (campaign_id, title, content, amount_used) VALUES (?, ?, ?, ?)").run(
    c1Id, 'Pipeline Construction Started',
    'Began pipeline construction to connect 2 more remote villages to the water grid. Work is currently 40% complete. Expected to finish within 3 weeks.',
    10000
  );
  db.prepare("INSERT INTO updates (campaign_id, title, content, amount_used) VALUES (?, ?, ?, ?)").run(
    c2Id, 'School Supplies Distributed',
    'Distributed books, school bags, stationery sets, and uniforms to 150 students across 4 government schools in the district. Children are now fully equipped for the academic year.',
    15000
  );
  db.prepare("INSERT INTO updates (campaign_id, title, content, amount_used) VALUES (?, ?, ?, ?)").run(
    c3Id, 'Emergency Kits Delivered',
    'Successfully delivered 500 emergency kits containing food supplies (rice, dal, oil), medicine packs, and clothing to flood-affected families in 8 coastal villages.',
    60000
  );
  db.prepare("INSERT INTO updates (campaign_id, title, content, amount_used) VALUES (?, ?, ?, ?)").run(
    c3Id, 'Temporary Shelters Constructed',
    'Built 20 weatherproof temporary shelters to house displaced families. Each shelter can comfortably accommodate a family of 4. Medical camps are being organized at each site.',
    40000
  );
  db.prepare("INSERT INTO updates (campaign_id, title, content, amount_used) VALUES (?, ?, ?, ?)").run(
    c4Id, 'Monthly Ration Distribution Complete',
    'Distributed ration kits to all 100 registered senior citizens for this month. Kits include rice, vegetables, oil, and basic medicines. Regular volunteers visited each home personally.',
    20000
  );

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('  📧 Admin:  admin@donation.com  |  Password: admin123');
  console.log('  📧 Donor1: ravi@example.com    |  Password: donor123');
  console.log('  📧 Donor2: priya@example.com   |  Password: donor123');
  console.log('');
}

module.exports = seed;
