import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProgressBar from '../components/ProgressBar'
import { useAuth } from '../context/AuthContext'

const QUICK_AMOUNTS = [500, 1000, 2000, 5000]

export default function CampaignDetails() {
  const { id } = useParams()
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(false)
  const [form, setForm] = useState({ amount: '', message: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchCampaign = () => {
    api
      .get(`/campaigns/${id}`)
      .then((r) => setCampaign(r.data))
      .catch(() => navigate('/campaigns'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCampaign()
  }, [id])

  const handleDonate = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) { navigate('/login'); return }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    setError('')
    setSuccess('')
    setDonating(true)
    try {
      await api.post('/donations', {
        campaign_id: parseInt(id),
        amount: parseFloat(form.amount),
        message: form.message,
      })
      setSuccess('Thank you! Your donation was successful. 🎉')
      setForm({ amount: '', message: '' })
      fetchCampaign()
    } catch (err) {
      setError(err.response?.data?.message || 'Donation failed. Please try again.')
    } finally {
      setDonating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading campaign...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!campaign) return null

  const pct = Math.min(Math.round((campaign.collected_amount / campaign.goal_amount) * 100), 100)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/campaigns" className="hover:text-blue-600 transition-colors">Campaigns</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-xs">{campaign.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---- LEFT COL ---- */}
          <div className="lg:col-span-2 space-y-6">

            {/* Campaign Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                    campaign.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {campaign.status}
                </span>
                <span className="text-xs text-gray-400">
                  Created by <span className="font-medium text-gray-600">{campaign.creator_name}</span>
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">{campaign.title}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{campaign.description}</p>

              <ProgressBar collected={campaign.collected_amount} goal={campaign.goal_amount} />

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">
                    ₹{campaign.collected_amount?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Raised</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-700">
                    ₹{campaign.goal_amount?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Goal</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {campaign.donations?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Donors</p>
                </div>
              </div>
            </div>

            {/* Fund Usage Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Fund Usage Updates</h2>
              <p className="text-gray-400 text-sm mb-6">Track how your donations are being used.</p>

              {campaign.updates?.length === 0 ? (
                <div className="text-center py-8 text-gray-300">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="text-sm text-gray-400">No updates posted yet.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-blue-100" />
                  <div className="space-y-6">
                    {campaign.updates?.map((u) => (
                      <div key={u.id} className="relative flex gap-4 pl-10">
                        {/* Dot */}
                        <div className="absolute left-2.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md mt-0.5" />
                        <div className="flex-1 bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{u.title}</h3>
                            {u.amount_used > 0 && (
                              <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                ₹{u.amount_used.toLocaleString('en-IN')} used
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{u.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(u.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Donors */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Recent Donors</h2>
              {campaign.donations?.length === 0 ? (
                <div className="text-center py-8 text-gray-300">
                  <p className="text-3xl mb-2">❤️</p>
                  <p className="text-sm text-gray-400">Be the first to donate!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {campaign.donations?.slice(0, 10).map((d) => (
                    <div key={d.id} className="py-3 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {d.donor_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{d.donor_name}</p>
                          {d.message && (
                            <p className="text-gray-400 text-xs italic mt-0.5">
                              &ldquo;{d.message}&rdquo;
                            </p>
                          )}
                          <p className="text-gray-300 text-xs mt-0.5">
                            {new Date(d.created_at).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <span className="text-green-600 font-bold text-sm whitespace-nowrap">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ---- RIGHT COL: Donate Card ---- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-1">Make a Donation</h2>
              <p className="text-gray-400 text-sm mb-5">100% of your funds go directly to the campaign.</p>

              {!isLoggedIn ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm mb-4">
                    You need to be logged in to donate.
                  </p>
                  <Link
                    to="/login"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    Login to Donate
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center mt-2 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl text-sm transition-colors"
                  >
                    Create an Account
                  </Link>
                </div>
              ) : campaign.status !== 'active' ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">✅</p>
                  <p className="text-gray-500 font-medium">Campaign Completed</p>
                  <p className="text-gray-400 text-sm mt-1">
                    This campaign is no longer accepting donations.
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleDonate} className="space-y-4">
                    {/* Quick amounts */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quick Select
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_AMOUNTS.map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setForm({ ...form, amount: amt })}
                            className={`py-2 rounded-xl text-sm font-semibold border transition-colors ${
                              parseFloat(form.amount) === amt
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            ₹{amt.toLocaleString('en-IN')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Custom Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Message <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Leave an encouraging message..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={donating}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3.5 rounded-xl transition-colors text-sm shadow-sm shadow-green-200"
                    >
                      {donating ? 'Processing...' : '❤️  Donate Now'}
                    </button>
                  </form>

                  <p className="text-center text-xs text-gray-400 mt-3">
                    Donating as <span className="font-medium text-gray-600">{user?.name}</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
