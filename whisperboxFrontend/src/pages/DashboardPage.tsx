import { useNavigate } from 'react-router-dom'
import { HiChatAlt2, HiEye, HiPencilAlt, HiRss, HiTrendingUp } from 'react-icons/hi'
import toast           from 'react-hot-toast'
import { useAuth }     from '../hooks/useAuth'
import { useWhispers } from '../hooks/useWhispers'
import WhisperCard     from '../components/ui/WhisperCard'
import LoadingSpinner  from '../components/ui/LoadingSpinner'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const isAdmin = user?.role === 'ADMIN'

  /**
   * Admins cannot post whispers — they manage the platform.
   * If admin clicks any "create whisper" button, show a toast and stop.
   */
  const handleCreateWhisper = () => {
    if (isAdmin) {
      toast('Admins cannot post whispers. You manage the platform, not participate.', {
        icon: '🛡️',
        style: {
          background: '#1e1b4b',
          color: '#e0e7ff',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '12px',
          fontSize: '14px',
        },
      })
      return
    }
    navigate('/create')
  }

  // Fetch whispers for stats + recent preview
  const { whispers, pageInfo, loading, error } = useWhispers({ size: 20, direction: 'desc' })

  const totalAll  = pageInfo?.totalElements ?? 0
  const unseenAll = whispers.filter((w) => w.status === 'NOT_SEEN').length

  const today = new Date().toDateString()
  const todayCount = whispers.filter((w) => {
    if (!w.createdAt || !Array.isArray(w.createdAt)) return false
    const [y, m, d] = w.createdAt as number[]
    return new Date(y, m - 1, d).toDateString() === today
  }).length

  const stats = [
    { label: 'Total Whispers', value: totalAll,   Icon: HiChatAlt2,  color: 'text-sky-400',    bg: 'bg-sky-500/10'    },
    { label: 'Unseen',         value: unseenAll,  Icon: HiEye,       color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Created Today',  value: todayCount, Icon: HiPencilAlt, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ]

  const recentUnseen = whispers.filter((w) => w.status === 'NOT_SEEN').slice(0, 3)

  return (
    <div className="page-container animate-fade-in space-y-10">

      {/* ── Welcome header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-white/50 mt-1.5 text-sm">
            Welcome back,{' '}
            <span className="text-sky-400 font-medium">
              {isAdmin ? 'Admin' : (user?.anonymousName ?? '…')}
            </span>{' '}
            👋
          </p>
        </div>

        {/* "+ New Whisper" button — both roles see it; admin gets toast instead */}
        <button
          className="btn-primary self-start sm:self-auto"
          onClick={handleCreateWhisper}
        >
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
              {loading
                ? <div className="w-10 h-8 bg-white/10 rounded-lg animate-pulse" />
                : <p className="text-3xl font-bold text-white">{value}</p>
              }
              <p className="text-white/40 text-sm mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────── */}
      <div>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <HiTrendingUp size={18} className="text-sky-400" /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Browse Feed */}
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
            <button
              className="btn-ghost self-start text-sm px-4 py-2"
              onClick={() => navigate(isAdmin ? '/admin' : '/feed')}
            >
              {isAdmin ? 'Go to Admin Panel →' : 'Go to Feed →'}
            </button>
          </div>

          {/* Create Whisper — admin sees the toast; student navigates */}
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
            <button
              className="btn-primary self-start text-sm px-4 py-2"
              onClick={handleCreateWhisper}
            >
              Create Whisper
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent unseen whispers preview ─────────────────────────── */}
      <div>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <HiEye size={18} className="text-sky-400" /> New Whispers
        </h2>

        {loading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner label="Loading whispers…" />
          </div>
        )}

        {!loading && error && (
          <div className="glass border border-red-500/20 p-5 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && recentUnseen.length === 0 && (
          <p className="text-white/30 text-sm">No new whispers right now.</p>
        )}

        {!loading && !error && recentUnseen.length > 0 && (
          <>
            <div className="flex flex-col gap-3">
              {recentUnseen.map((w) => <WhisperCard key={w.id} whisper={w} />)}
            </div>
            <button
              className="mt-4 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
              onClick={() => navigate(isAdmin ? '/admin' : '/feed')}
            >
              View all whispers →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
