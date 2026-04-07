export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">Donation Tracking System for Social Welfare</span>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs mb-3">
          <span>
            <span className="text-gray-500">Client:</span>{' '}
            <span className="text-white font-semibold">Shaji</span>
          </span>
          <span className="text-gray-700">|</span>
          <span>
            <span className="text-gray-500">Roll No:</span>{' '}
            <span className="text-white font-semibold">SB230347</span>
          </span>
        </div>

        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} DonateTrack · All rights reserved
        </p>
      </div>
    </footer>
  )
}
