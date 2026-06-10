import { useState } from 'react'
import { HiPencilAlt, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'
import clsx from 'clsx'

const TITLE_MAX   = 100
const CONTENT_MIN = 5
const CONTENT_MAX = 2000

interface FormErrors {
  title?: string
  content?: string
}

/**
 * Create Whisper page.
 * Validates inputs on submit, shows inline error and success messages.
 * No backend call yet — success is simulated.
 */
export default function CreateWhisperPage() {
  const [title,   setTitle]   = useState('')
  const [content, setContent] = useState('')
  const [errors,  setErrors]  = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  /* Validate and simulate submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    const newErrors: FormErrors = {}
    if (!title.trim())                      newErrors.title   = 'Title is required.'
    else if (title.trim().length > TITLE_MAX) newErrors.title = `Title cannot exceed ${TITLE_MAX} characters.`

    if (!content.trim())                            newErrors.content = 'Content is required.'
    else if (content.trim().length < CONTENT_MIN)   newErrors.content = `Content must be at least ${CONTENT_MIN} characters.`
    else if (content.trim().length > CONTENT_MAX)   newErrors.content = `Content cannot exceed ${CONTENT_MAX} characters.`

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    setErrors({})
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTitle('')
      setContent('')
    }, 900)
  }

  const titleLeft   = TITLE_MAX - title.length
  const contentLeft = CONTENT_MAX - content.length

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <h1 className="page-title">Create a Whisper</h1>
          <p className="text-white/40 text-sm mt-1">Your message will be posted anonymously.</p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="flex items-center gap-3 glass border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 rounded-xl animate-slide-up">
            <HiCheckCircle size={20} className="text-emerald-400 shrink-0" />
            <p className="text-emerald-300 text-sm font-medium">
              Whisper posted successfully! It is now visible in the feed.
            </p>
          </div>
        )}

        {/* Form card */}
        <div className="glass p-7">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

            {/* ── Title field ──────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="title" className="text-white/70 text-sm font-medium">
                  Title <span className="text-red-400">*</span>
                </label>
                <span className={clsx('text-xs', titleLeft < 15 ? 'text-amber-400' : 'text-white/25')}>
                  {titleLeft} left
                </span>
              </div>

              <input
                id="title"
                type="text"
                className={clsx('input-field', errors.title && 'border-red-500/60 focus:border-red-500')}
                placeholder="Give your whisper a title…"
                maxLength={TITLE_MAX}
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })) }}
              />

              {errors.title && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs">
                  <HiExclamationCircle size={13} /> {errors.title}
                </p>
              )}
            </div>

            {/* ── Content field ─────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-white/70 text-sm font-medium">
                  Content <span className="text-red-400">*</span>
                </label>
                <span className={clsx('text-xs', contentLeft < 100 ? 'text-amber-400' : 'text-white/25')}>
                  {contentLeft} left
                </span>
              </div>

              <textarea
                id="content"
                className={clsx('input-field resize-none', errors.content && 'border-red-500/60 focus:border-red-500')}
                placeholder="What's on your mind? Share it anonymously…"
                rows={7}
                maxLength={CONTENT_MAX}
                value={content}
                onChange={(e) => { setContent(e.target.value); setErrors((p) => ({ ...p, content: undefined })) }}
              />

              {errors.content && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs">
                  <HiExclamationCircle size={13} /> {errors.content}
                </p>
              )}
            </div>

            {/* ── Anonymity notice ──────────────────────────────────── */}
            <div className="flex items-center gap-2.5 bg-sky-500/8 border border-sky-500/20 rounded-xl px-4 py-3">
              <HiPencilAlt size={16} className="text-sky-400 shrink-0" />
              <p className="text-sky-300/80 text-xs leading-relaxed">
                This whisper will be posted under your anonymous alias. Your real identity will never be shown.
              </p>
            </div>

            {/* ── Submit ────────────────────────────────────────────── */}
            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Posting…</>
                : <><HiPencilAlt size={16} /> Post Whisper</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
