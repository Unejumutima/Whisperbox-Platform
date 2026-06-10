import { FaGoogle } from 'react-icons/fa'
import { HiLockClosed, HiChatAlt2, HiShieldCheck, HiSparkles } from 'react-icons/hi'
import Footer from '../components/layout/Footer'
import { GOOGLE_LOGIN_URL } from '../utils/constants'

const features = [
  {
    Icon: HiLockClosed,
    title: 'Stay Anonymous',
    description: 'Your real identity is never exposed. Only your generated alias is visible.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
  },
  {
    Icon: HiChatAlt2,
    title: 'Share Freely',
    description: 'Post thoughts, questions, or frustrations without fear of judgment.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    Icon: HiShieldCheck,
    title: 'School Only',
    description: 'Only verified school email addresses can access the platform.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
]

/**
 * Public landing page — no layout wrapper, standalone.
 * Shows hero, features, and Google login CTA.
 */
export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-slate-950 flex flex-col"
      style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(14,165,233,0.15) 0%, transparent 70%)' }}
    >
      {/* ── Navbar strip ─────────────────────────────────────────────── */}
      <header className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="gradient-text font-bold text-xl tracking-tight select-none">✦ Whisperbox</span>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 gap-7">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 glass border border-sky-500/30 px-4 py-1.5 rounded-full text-xs text-sky-300 font-medium">
          <HiSparkles size={13} className="text-sky-400" />
          Anonymous Student Messaging
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] tracking-tight">
            <span className="gradient-text">Speak freely.</span>
            <br />
            <span className="text-white">Stay anonymous.</span>
          </h1>
        </div>

        {/* Subtext */}
        <p className="text-white/50 max-w-md text-lg leading-relaxed">
          Share thoughts within your school community — no names, no judgment, just honest voices.
        </p>

        {/* CTA button */}
        <div className="flex flex-col items-center gap-3">
          <button
            className="btn-primary text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-sky-500/20"
            onClick={() => { window.location.href = GOOGLE_LOGIN_URL }}
          >
            <FaGoogle size={17} />
            Continue with Google
          </button>
          <p className="text-white/30 text-xs">Only school email addresses are accepted.</p>
        </div>

        {/* Floating stats strip */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {[['100%', 'Anonymous'], ['🔒', 'Secure'], ['⚡', 'Real-time']].map(([val, label]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-sky-400 font-bold text-sm">{val}</span>
              <span className="text-white/35 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-4 pb-24">
        <p className="text-center text-white/30 text-xs uppercase tracking-widest font-medium mb-10">
          Why Whisperbox?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map(({ Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="glass p-6 flex flex-col gap-4 hover:border-sky-500/20 hover:bg-white/5 transition-all duration-300"
            >
              <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1.5">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}
