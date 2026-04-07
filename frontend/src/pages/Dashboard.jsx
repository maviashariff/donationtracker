import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <span className={`text-2xl`}>{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/donations/mine')
      .then((r) => setDonations(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
  const uniqueCampaigns = new Set(donations.map((d) => d.campaign_id)).size

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here&apos;s a summary of your contribution history.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Donated"
            value={`₹${totalDonated.toLocaleString('en-IN')}`}
            color="text-blue-600"
            icon="💰"
          />
          <StatCard
            label="Campaigns Supported"
            value={uniqueCampaigns}
            color="text-green-600"
            icon="🎯"
          />
          <StatCard
            label="Total Transactions"
            value={donations.length}
            color="text-purple-600"
            icon="🧾"
          />
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Donation History</h2>
            <Link
              to="/campaigns"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Donate More →
            </Link>
          </div>

          {loading ? (
            <div className="divide-y">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 animate-pulse flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48" />
                    <div className="h-3 bg-gray-100 rounded w-32" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : donations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="text-4xl mb-3">💝</p>
              <p className="text-gray-500 font-medium mb-1">No donations yet</p>
              <p className="text-gray-400 text-sm mb-5">
                Find a campaign you care about and make your first donation.
              </p>
              <Link
                to="/campaigns"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Browse Campaigns
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {donations.map((d) => (
                <div
                  key={d.id}
                  className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/campaigns/${d.campaign_id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm block truncate"
                      >
                        {d.campaign_title}
                      </Link>
                      {d.message && (
                        <p className="text-gray-400 text-xs mt-0.5 italic truncate">
                          &ldquo;{d.message}&rdquo;
                        </p>
                      )}
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(d.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-green-600 font-bold text-sm">
                      +₹{d.amount.toLocaleString('en-IN')}
                    </span>
                    <p className={`text-xs mt-0.5 capitalize ${d.campaign_status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                      {d.campaign_status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
