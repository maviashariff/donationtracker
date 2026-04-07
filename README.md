# Donation Tracking System for Social Welfare

**Client:** Shaji | **Roll No:** SB230347

A full-stack donation tracking web application with role-based access, campaign management, donation system, and fund usage tracking.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React (Vite) + Tailwind CSS         |
| Backend   | Node.js + Express                   |
| Database  | SQLite via better-sqlite3           |
| Auth      | JWT (JSON Web Tokens)               |
| API style | REST                                |

---

## ⚠️ Windows Setup (REQUIRED before npm install)

`better-sqlite3` compiles native C++ bindings. On Windows, you need build tools first.

**Option A – npm (run PowerShell as Administrator):**
```
npm install --global windows-build-tools
```

**Option B – Visual Studio (recommended):**
Download: https://visualstudio.microsoft.com/downloads/
Install "Desktop development with C++" workload.

Also ensure you have Python 3.x installed.

---

## Project Structure

```
donation-tracker/
├── backend/
│   ├── config/
│   │   └── db.js              # SQLite connection + table creation
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── campaignController.js
│   │   ├── donationController.js
│   │   └── updateController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── adminOnly.js       # Admin role guard
│   ├── routes/
│   │   ├── auth.js
│   │   ├── campaigns.js
│   │   ├── donations.js
│   │   └── updates.js
│   ├── seed.js                # Auto-seeds on first start
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # Axios instance with interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx     # Client name + roll number
    │   │   ├── ProgressBar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CampaignList.jsx
    │   │   ├── CampaignDetails.jsx
    │   │   └── AdminPanel.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Local Setup

### 1. Backend

```bash
cd backend

# Copy and configure env
cp .env.example .env
# Edit .env → set JWT_SECRET to any long random string

# Install dependencies (needs Windows Build Tools on Windows)
npm install

# Start server (auto-seeds DB on first run)
npm start
```

Server runs at: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## Demo Accounts (auto-created on first start)

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@donation.com     | admin123  |
| Donor | ravi@example.com       | donor123  |
| Donor | priya@example.com      | donor123  |

---

## API Reference

### Auth
| Method | Endpoint             | Access  | Description     |
|--------|----------------------|---------|-----------------|
| POST   | /api/auth/register   | Public  | Register user   |
| POST   | /api/auth/login      | Public  | Login user      |

### Campaigns
| Method | Endpoint             | Access  | Description        |
|--------|----------------------|---------|--------------------|
| GET    | /api/campaigns       | Public  | List all campaigns |
| GET    | /api/campaigns/:id   | Public  | Campaign details   |
| POST   | /api/campaigns       | Admin   | Create campaign    |
| PUT    | /api/campaigns/:id   | Admin   | Update campaign    |
| DELETE | /api/campaigns/:id   | Admin   | Delete campaign    |

### Donations
| Method | Endpoint             | Access  | Description         |
|--------|----------------------|---------|---------------------|
| POST   | /api/donations       | Auth    | Make a donation     |
| GET    | /api/donations/mine  | Auth    | My donations        |
| GET    | /api/donations/all   | Admin   | All donations       |

### Updates
| Method | Endpoint                          | Access  | Description          |
|--------|-----------------------------------|---------|----------------------|
| POST   | /api/updates                      | Admin   | Post fund update     |
| GET    | /api/updates/campaign/:campaignId | Public  | Get campaign updates |
| DELETE | /api/updates/:id                  | Admin   | Delete update        |

---

## Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect the GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `PORT` → `5000`
   - `JWT_SECRET` → any long random string

> Note: Render's free tier uses ephemeral storage. The SQLite `.db` file will reset on each deploy. For production, switch to PostgreSQL.

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework: **Vite**
4. Add environment variable:
   - `VITE_API_URL` → your Render backend URL (e.g. `https://your-app.onrender.com`)
5. Update `frontend/src/api/axios.js` baseURL for production:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
})
```

---

## Features

- ✅ JWT Authentication (Register / Login)
- ✅ Role-based access: Admin & Donor
- ✅ Admin: Create, manage, delete campaigns
- ✅ Admin: Post fund usage updates (timeline)
- ✅ Admin: View all donations in a table
- ✅ Donor: Browse campaigns with progress bars
- ✅ Donor: Make donations with optional message
- ✅ Donor: Quick-select donation amounts
- ✅ Donor: Personal dashboard with donation history
- ✅ Campaign details with update timeline
- ✅ Auto-seed with sample data on first start
- ✅ Mobile responsive UI
- ✅ Client name + roll number in footer on all pages
