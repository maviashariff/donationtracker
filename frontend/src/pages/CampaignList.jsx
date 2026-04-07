import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProgressBar from '../components/ProgressBar'
import { useAuth } from '../context/AuthContext'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-gray-200 rounded-full w-20" />
        <div className="h-4 bg-gray-100 rounded w-16" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="space-y-1.5 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full" />
    </div>
  )
}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    api
      .get('/campaigns')
      .then((r) => setCampaigns(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = campaigns.filter((c) =>
    filter === 'all' ? true : c.status === filter
  )

  const totalRaised = campaigns.reduce((s, c) => s + c.collected_amount, 0)
  const totalDonors = campaigns.reduce((s, c) => s + (c.donor_count || 0), 0)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Make a Difference Today</h1>
            <p className="text-blue-100 mb-5 text-sm max-w-lg">
              Every contribution brings us closer to a better world. Support campaigns that matter
              and track exactly how your money is being used.
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-2xl font-bold">₹{totalRaised.toLocaleString('en-IN')}</p>
                <p className="text-blue-200 text-xs mt-0.5">Total raised</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{campaigns.length}</p>
                <p className="text-blue-200 text-xs mt-0.5">Active campaigns</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDonors}</p>
                <p className="text-blue-200 text-xs mt-0.5">Donors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {filter === 'all' ? 'All Campaigns' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Campaigns`}
            <span className="text-base font-normal text-gray-400 ml-2">({filtered.length})</span>
          </h2>
          <div className="flex gap-2 bg-gray-200 p-1 rounded-xl w-fit">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p className="font-medium text-gray-500">No campaigns found</p>
            <p className="text-sm mt-1">Try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        c.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {c.status}
                    </span>
                    <span className="text-xs text-gray-400">{c.donor_count} donor{c.donor_count !== 1 ? 's' : ''}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-5 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                  <ProgressBar collected={c.collected_amount} goal={c.goal_amount} />
                </div>
                <div className="px-6 pb-6">
                  <Link
                    to={`/campaigns/${c.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    View Campaign
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="mt-8 text-center">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create a New Campaign in Admin Panel
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
