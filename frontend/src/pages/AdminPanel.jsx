import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

const TABS = ['Campaigns', 'All Donations', 'Post Update']

function Alert({ type, msg }) {
  if (!msg) return null
  const styles =
    type === 'error'
      ? 'bg-red-50 border-red-200 text-red-700'
      : 'bg-green-50 border-green-200 text-green-700'
  return (
    <div className={`border rounded-xl px-4 py-3 text-sm mb-4 ${styles}`}>
      {msg}
    </div>
  )
}

export default function AdminPanel() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Campaigns')
  const [campaigns, setCampaigns] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  // Campaign form state
  const [cForm, setCForm] = useState({ title: '', description: '', goal_amount: '' })
  const [cMsg, setCMsg] = useState({ type: '', text: '' })
  const [cSaving, setCSaving] = useState(false)

  // Update form state
  const [uForm, setUForm] = useState({ campaign_id: '', title: '', content: '', amount_used: '' })
  const [uMsg, setUMsg] = useState({ type: '', text: '' })
  const [uSaving, setUSaving] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/campaigns')
      return
    }
    fetchAll()
  }, [isAdmin])

  const fetchAll = () => {
    setLoading(true)
    Promise.all([api.get('/campaigns'), api.get('/donations/all')])
      .then(([c, d]) => {
        setCampaigns(c.data)
        setDonations(d.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  // --- Campaign actions ---
  const handleCreateCampaign = async (e) => {
    e.preventDefault()
    setCMsg({ type: '', text: '' })
    setCSaving(true)
    try {
      await api.post('/campaigns', {
        ...cForm,
        goal_amount: parseFloat(cForm.goal_amount),
      })
      setCMsg({ type: 'success', text: 'Campaign created successfully!' })
      setCForm({ title: '', description: '', goal_amount: '' })
      fetchAll()
    } catch (err) {
      setCMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create campaign.' })
    } finally {
      setCSaving(false)
    }
  }

  const handleToggleStatus = async (c) => {
    const newStatus = c.status === 'active' ? 'completed' : 'active'
    try {
      await api.put(`/campaigns/${c.id}`, { status: newStatus })
      fetchAll()
    } catch {}
  }

  const handleDeleteCampaign = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?\n\nThis will also delete all donations and updates for this campaign.`)) return
    try {
      await api.delete(`/campaigns/${id}`)
      fetchAll()
    } catch {}
  }

  // --- Update actions ---
  const handleAddUpdate = async (e) => {
    e.preventDefault()
    setUMsg({ type: '', text: '' })
    setUSaving(true)
    try {
      await api.post('/updates', {
        campaign_id: parseInt(uForm.campaign_id),
        title: uForm.title,
        content: uForm.content,
        amount_used: parseFloat(uForm.amount_used || 0),
      })
      setUMsg({ type: 'success', text: 'Update posted successfully!' })
      setUForm({ campaign_id: '', title: '', content: '', amount_used: '' })
    } catch (err) {
      setUMsg({ type: 'error', text: err.response?.data?.message || 'Failed to post update.' })
    } finally {
      setUSaving(false)
    }
  }

  // --- Computed stats ---
  const totalCollected = campaigns.reduce((s, c) => s + c.collected_amount, 0)
  const totalGoal = campaigns.reduce((s, c) => s + c.goal_amount, 0)
  const totalDonationAmount = donations.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage campaigns, monitor donations, and post fund usage updates.
          </p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Campaigns', value: campaigns.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: '🎯' },
            { label: 'Active Campaigns', value: campaigns.filter((c) => c.status === 'active').length, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
            { label: 'Total Donations', value: donations.length, color: 'text-purple-600', bg: 'bg-purple-50', icon: '🧾' },
            { label: 'Total Collected', value: `₹${totalCollected.toLocaleString('en-IN')}`, color: 'text-orange-600', bg: 'bg-orange-50', icon: '💰' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-white`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <span className="text-lg">{s.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-200 p-1 rounded-xl w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-300 animate-pulse">
            Loading...
          </div>
        ) : (
          <>
            {/* ===== CAMPAIGNS TAB ===== */}
            {tab === 'Campaigns' && (
              <div className="space-y-6">
                {/* Create Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">
                    ➕ Create New Campaign
                  </h2>
                  <Alert type={cMsg.type} msg={cMsg.text} />
                  <form onSubmit={handleCreateCampaign}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Campaign Title
                        </label>
                        <input
                          required
                          value={cForm.title}
                          onChange={(e) => setCForm({ ...cForm, title: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Clean Water Initiative"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Goal Amount (₹)
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={cForm.goal_amount}
                          onChange={(e) => setCForm({ ...cForm, goal_amount: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 100000"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        required
                        value={cForm.description}
                        onChange={(e) => setCForm({ ...cForm, description: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={3}
                        placeholder="Describe the campaign purpose and how funds will be used..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={cSaving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                    >
                      {cSaving ? 'Creating...' : '+ Create Campaign'}
                    </button>
                  </form>
                </div>

                {/* Campaign List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">
                      All Campaigns{' '}
                      <span className="text-gray-400 font-normal text-sm">({campaigns.length})</span>
                    </h2>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="text-center py-12 text-gray-300">
                      No campaigns yet. Create your first one above.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {campaigns.map((c) => {
                        const pct = Math.min(
                          Math.round((c.collected_amount / c.goal_amount) * 100),
                          100
                        )
                        return (
                          <div key={c.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <Link
                                    to={`/campaigns/${c.id}`}
                                    className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
                                  >
                                    {c.title}
                                  </Link>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                                      c.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {c.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                                  <span>
                                    Raised:{' '}
                                    <strong className="text-gray-800">
                                      ₹{c.collected_amount.toLocaleString('en-IN')}
                                    </strong>
                                  </span>
                                  <span>Goal: ₹{c.goal_amount.toLocaleString('en-IN')}</span>
                                  <span>{c.donor_count} donors</span>
                                  <span className="font-semibold text-blue-600">{pct}%</span>
                                </div>
                                <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all ${
                                      pct >= 100 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleToggleStatus(c)}
                                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                    c.status === 'active'
                                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {c.status === 'active' ? 'Mark Done' : 'Reactivate'}
                                </button>
                                <button
                                  onClick={() => handleDeleteCampaign(c.id, c.title)}
                                  className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== DONATIONS TAB ===== */}
            {tab === 'All Donations' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-gray-900">
                    All Donations{' '}
                    <span className="text-gray-400 font-normal text-sm">({donations.length})</span>
                  </h2>
                  <div className="text-sm">
                    <span className="text-gray-500">Total collected: </span>
                    <span className="font-bold text-green-600">
                      ₹{totalDonationAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {donations.length === 0 ? (
                  <div className="text-center py-12 text-gray-300">No donations yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['#', 'Donor', 'Campaign', 'Amount', 'Message', 'Date'].map((h) => (
                            <th
                              key={h}
                              className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {donations.map((d, i) => (
                          <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-300 text-xs">{i + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                              {d.donor_name}
                            </td>
                            <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                              <Link
                                to={`/campaigns/${d.campaign_id}`}
                                className="hover:text-blue-600 transition-colors block truncate"
                              >
                                {d.campaign_title}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-green-600 font-bold whitespace-nowrap">
                              ₹{d.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-gray-400 italic max-w-[160px]">
                              <span className="block truncate">{d.message || '—'}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                              {new Date(d.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ===== POST UPDATE TAB ===== */}
            {tab === 'Post Update' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <h2 className="font-semibold text-gray-900 mb-1">📢 Post Fund Usage Update</h2>
                <p className="text-gray-400 text-sm mb-5">
                  Keep donors informed about how their contributions are being used. Updates
                  appear on the campaign details page as a timeline.
                </p>
                <Alert type={uMsg.type} msg={uMsg.text} />
                <form onSubmit={handleAddUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Select Campaign
                    </label>
                    <select
                      required
                      value={uForm.campaign_id}
                      onChange={(e) => setUForm({ ...uForm, campaign_id: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Choose a campaign --</option>
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} {c.status === 'completed' ? '(completed)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Update Title
                    </label>
                    <input
                      required
                      value={uForm.title}
                      onChange={(e) => setUForm({ ...uForm, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Water pumps installed in 3 villages"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Details
                    </label>
                    <textarea
                      required
                      value={uForm.content}
                      onChange={(e) => setUForm({ ...uForm, content: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      placeholder="Describe what was accomplished and how the funds were used..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Amount Used (₹){' '}
                      <span className="text-gray-400 font-normal">optional</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={uForm.amount_used}
                      onChange={(e) => setUForm({ ...uForm, amount_used: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uSaving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    {uSaving ? 'Posting...' : '📢 Post Update'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
