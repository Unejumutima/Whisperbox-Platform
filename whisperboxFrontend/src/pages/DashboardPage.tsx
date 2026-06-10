import { useNavigate } from 'react-router-dom'
import { HiChatAlt2, HiEye, HiPencilAlt, HiRss, HiTrendingUp } from 'react-icons/hi'
import { MOCK_WHISPERS } from '../utils/mockData'
import WhisperCard from '../components/ui/WhisperCard'

/* ── Mock stats derived from mock data ──────────────────────────────────── */
const total  = MOCK_WHISPERS.length
const unseen = MOCK_WHISPERS.filter((w) => w.status === 'NOT_SEEN').length
const today  = 2 // mock value

const stats = [
  { label: 'Total Whispers', value: total,  Icon: HiChatAlt2,   color: 'text-sky-400',     bg: 'bg-sky-500/10'    },
  { label: 'Unseen',         value: unseen, Icon: HiEye,        color: 'text-indigo-400',  bg: 'bg-indigo-500/10' },
  { label: 'Created Today',  value: today,  Icon: HiPencilAlt,  color: 'text-violet-400',  bg: 'bg-violet-500/10' },
]

/**
 * Dashboard — first page the user sees after logging in.
 * Shows welcome message, stat cards, quick actions, and a recent whispers preview.
 */
export default function DashboardPage() {
  const navigate = useNavigate()

  // Show only the 2 most recent unseen whispers as a preview
  const recent = MOCK_WHISPERS.filter((w) => w.status === 'NOT_SEEN').slice(0, 2)

  return (
    <div className="page-container animate-fade-in space-y-10">

      {/* ── Welcome header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-white/50 mt-1.5 text-sm">
            Welcome back, <span className="text-sky-400 font-medium">Silent Panda</span> 👋
          </p>
        </div>
        <button className="btn-primary self-start sm:self-auto" onClick={() => navigate('/create')}>
          <HiPencilAlt size={16} /> New Whisper
        </button>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="glass p-6 flex items-center gap-4 hover:border-sky-500/20 transition-all duration-200">
            <div className={`${bg} rounded-xl p-3 shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-white/40 text-sm mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick actions ──────────────────────────────────────────── */}
      <div>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <HiTrendingUp size={18} className="text-sky-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* View Feed */}
          <div className="glass p-6 flex flex-col gap-4 hover:border-sky-500/20 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="bg-sky-500/10 rounded-xl p-2.5 shrink-0">
                <HiRss size={20} className="text-sky-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Browse Feed</h3>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">
                  Read all whispers posted anonymously by your school community.
                </p>
              </div>
            </div>
            <button className="btn-ghost self-start text-sm px-4 py-2" onClick={() => navigate('/feed')}>
              Go to Feed →
            </button>
          </div>

          {/* Create */}
          <div className="glass p-6 flex flex-col gap-4 hover:border-sky-500/20 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500/10 rounded-xl p-2.5 shrink-0">
                <HiPencilAlt size={20} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Post a Whisper</h3>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">
                  Share something on your mind completely anonymously.
                </p>
              </div>
            </div>
            <button className="btn-primary self-start text-sm px-4 py-2" onClick={() => navigate('/create')}>
              Create Whisper
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent unseen whispers preview ─────────────────────────── */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <HiEye size={18} className="text-sky-400" /> New Whispers
          </h2>
          <div className="flex flex-col gap-3">
            {recent.map((w) => <WhisperCard key={w.id} whisper={w} />)}
          </div>
          <button
            className="mt-4 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
            onClick={() => navigate('/feed')}
          >
            View all whispers →
          </button>
        </div>
      )}
    </div>
  )
}
