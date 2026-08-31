import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../UI/Footer'

/* ---------- category system (encodes OSI-layer grouping, not decoration) ---------- */

const CATEGORIES = {
  foundational: {
    ring: 'border-slate-200 dark:border-slate-500/25',
    bg: 'bg-slate-50/70 dark:bg-slate-500/[0.06]',
    top: 'border-t-slate-400 dark:border-t-slate-500',
    badge: 'bg-slate-100 text-slate-600 border-slate-400 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-500/50',
    dot: 'bg-slate-400',
    label: 'Foundational',
  },
  physical: {
    ring: 'border-amber-200 dark:border-amber-500/25',
    bg: 'bg-amber-50/70 dark:bg-amber-500/[0.06]',
    top: 'border-t-amber-400 dark:border-t-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-400 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/50',
    dot: 'bg-amber-400',
    label: 'Physical',
  },
  datalink: {
    ring: 'border-teal-200 dark:border-teal-500/25',
    bg: 'bg-teal-50/70 dark:bg-teal-500/[0.06]',
    top: 'border-t-teal-400 dark:border-t-teal-500',
    badge: 'bg-teal-100 text-teal-700 border-teal-400 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/50',
    dot: 'bg-teal-400',
    label: 'Data Link',
  },
  network: {
    ring: 'border-indigo-200 dark:border-indigo-500/25',
    bg: 'bg-indigo-50/70 dark:bg-indigo-500/[0.06]',
    top: 'border-t-indigo-400 dark:border-t-indigo-500',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/50',
    dot: 'bg-indigo-400',
    label: 'Network / IP',
  },
  transition: {
    ring: 'border-violet-200 dark:border-violet-500/25',
    bg: 'bg-violet-50/70 dark:bg-violet-500/[0.06]',
    top: 'border-t-violet-400 dark:border-t-violet-500',
    badge: 'bg-violet-100 text-violet-700 border-violet-400 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/50',
    dot: 'bg-violet-400',
    label: 'Transition',
  },
  resolve: {
    ring: 'border-rose-200 dark:border-rose-500/25',
    bg: 'bg-rose-50/70 dark:bg-rose-500/[0.06]',
    top: 'border-t-rose-400 dark:border-t-rose-500',
    badge: 'bg-rose-100 text-rose-700 border-rose-400 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/50',
    dot: 'bg-rose-400',
    label: 'Resolution & Translation',
  },
}

const CALLOUT = {
  interview: { border: 'border-blue-200 dark:border-blue-500/25', bg: 'bg-blue-50/70 dark:bg-blue-500/[0.06]', text: 'text-blue-600 dark:text-blue-300' },
  remember: { border: 'border-emerald-200 dark:border-emerald-500/25', bg: 'bg-emerald-50/70 dark:bg-emerald-500/[0.06]', text: 'text-emerald-600 dark:text-emerald-300' },
  warning: { border: 'border-red-200 dark:border-red-500/25', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-300' },
}

/* ---------- shared visual primitives ---------- */

function P({ children }) {
  return <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
}

function Label({ children }) {
  return <p className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{children}</p>
}

function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function OrderedSteps({ items }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <span className="flex-shrink-0 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-900 dark:bg-white/10 font-mono text-xs sm:text-sm font-bold text-white dark:text-gray-100">
            {i + 1}
          </span>
          <span className="pt-0.5">{item}</span>
        </li>
      ))}
    </ol>
  )
}

function Callout({ icon, label, color, children }) {
  return (
    <div className={`rounded-xl border ${color.border} ${color.bg} px-5 py-4`}>
      <p className={`mb-1.5 font-mono text-xs font-bold uppercase tracking-widest ${color.text}`}>
        {icon} {label}
      </p>
      <div className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  )
}

function CodeBox({ children }) {
  return (
    <div className="overflow-hidden rounded-xl bg-gray-900 dark:bg-black/40 shadow-sm">
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
      </div>
      <pre className="overflow-x-auto px-5 py-4 text-sm sm:text-base leading-relaxed text-emerald-300 font-mono whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  )
}

function FlowChart({ steps, direction = 'horizontal' }) {
  const isVertical = direction === 'vertical'
  return (
    <div
      className={`flex ${isVertical ? 'flex-col items-stretch' : 'flex-row flex-wrap items-center'} gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-5`}
    >
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <span
            className={`${isVertical ? 'w-full text-center' : ''} rounded-lg bg-gray-900 dark:bg-white/10 px-3.5 py-2 font-mono text-xs sm:text-sm font-bold text-white dark:text-gray-100 leading-snug`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <span className={`text-xl text-gray-300 dark:text-gray-600 ${isVertical ? 'text-center' : ''}`}>
              {isVertical ? '↓' : '→'}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function FieldBox({ fields }) {
  return (
    <div className="flex flex-wrap overflow-hidden rounded-lg border border-gray-900 dark:border-white/20 font-mono text-xs sm:text-sm">
      {fields.map((f, i) => (
        <div
          key={i}
          className={`px-4 py-3 ${
            i % 2 === 0 ? 'bg-gray-900 text-white dark:bg-white/10' : 'bg-gray-100 text-gray-900 dark:bg-white/5 dark:text-gray-100'
          } ${i < fields.length - 1 ? 'border-r border-gray-700 dark:border-white/20' : ''}`}
        >
          {f}
        </div>
      ))}
    </div>
  )
}

function WrongRight({ wrong, right }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-red-200 dark:border-red-500/25 bg-red-50 dark:bg-red-500/10 px-5 py-4 text-base sm:text-lg leading-relaxed text-red-700 dark:text-red-300">
        ❌ {wrong}
      </div>
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/10 px-5 py-4 text-base sm:text-lg leading-relaxed text-emerald-700 dark:text-emerald-300">
        ✅ {right}
      </div>
    </div>
  )
}

function TwoCol({ left, right }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-lg bg-white dark:bg-white/5 px-4 py-3.5 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
        {left}
      </div>
      <div className="rounded-lg bg-white dark:bg-white/5 px-4 py-3.5 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
        {right}
      </div>
    </div>
  )
}

function QA({ q, a }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-4 sm:p-5">
      <p className="font-mono font-bold text-gray-900 dark:text-white text-sm sm:text-base mb-2">Q: {q}</p>
      <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">A: {a}</p>
    </div>
  )
}

/* ---------- hop wrapper: numbered, category-colored, rail-connected ---------- */

function Section({ number, title, category, isLast, pending, children }) {
  const c = CATEGORIES[category]
  const num = String(number).padStart(2, '0')
  return (
    <div className="flex gap-3 sm:gap-4 print:break-inside-avoid">
      <div className="flex-none w-9 sm:w-10 flex flex-col items-center">
        <span
          className={`flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs sm:text-sm font-bold ${c.badge}`}
        >
          {num}
        </span>
        {!isLast && <span className="flex-1 w-0.5 mt-1 bg-gray-200 dark:bg-white/10" />}
      </div>
      <section
        className={`flex-1 min-w-0 mb-7 rounded-2xl border ${c.ring} ${c.bg} border-t-4 ${c.top} ${
          pending ? 'border-dashed' : ''
        } p-5 sm:p-7`}
      >
        <h2 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug mb-5">
          {title}
        </h2>
        <div className="flex flex-col gap-4">{children}</div>
      </section>
    </div>
  )
}

function RevisionPanel({ title, className = '', children }) {
  return (
    <section className={`rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] p-5 sm:p-8 mb-6 print:break-inside-avoid ${className}`}>
      {title && <h3 className="font-mono text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-5">{title}</h3>}
      {children}
    </section>
  )
}

/* ---------- page ---------- */

function Part5() {
  const [progress, setProgress] = useState(0)
  const [celebration, setCelebration] = useState(false)
  const [showTopArrow, setShowTopArrow] = useState(false)
  const [showBottomArrow, setShowBottomArrow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrollTop = h.scrollTop || document.body.scrollTop
      const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)

      setShowTopArrow(scrollTop > 200)
      setShowBottomArrow(scrollTop > 200 && scrollTop < scrollHeight - 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dismiss celebration on any key press
  useEffect(() => {
    if (!celebration) return
    const handleKey = () => setCelebration(false)
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [celebration])

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const triggerCelebration = () => {
    setCelebration(true)
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      {/* scroll progress — the signal moving through the wire */}
      <div className="fixed top-0 left-0 h-[3px] bg-amber-500 z-50 print:hidden" style={{ width: `${progress}%` }} />

      {/* floating scroll arrows */}
      {showTopArrow && (
        <button
          onClick={scrollToBottom}
          className="fixed top-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-all"
          title="Go to bottom"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
      )}

      {showBottomArrow && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-all"
          title="Go to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      )}

      {/* celebration overlay — dismiss on any click or key press */}
      {celebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center print:hidden cursor-pointer"
          onClick={() => setCelebration(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-center px-6 py-8">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono mb-3 tracking-tight">
              Syllabus Complete!
            </h2>
            <p className="text-lg sm:text-xl text-white/80 font-mono mb-4">
              Bits → NAT → DNS → CDN → Full Stack Networking
            </p>
            <p className="text-base text-white/60 font-mono">
              Every hop traced. Every trap mapped. You're ready.
            </p>
            <div className="mt-6 flex justify-center gap-4 text-3xl">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🎊</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
              <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🚀</span>
              <span className="animate-bounce" style={{ animationDelay: '600ms' }}>💪</span>
              <span className="animate-bounce" style={{ animationDelay: '800ms' }}>🏆</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-16">
          <div className="flex items-start justify-between gap-4 sm:gap-8">
            <div className="min-w-0">
              {/* Back to Blogs button – top left, high visibility */}
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-mono text-sm font-bold px-5 py-2.5 shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all mb-4"
              >
                <span className="text-base">←</span>
                <span className="hidden sm:inline">Back to Blogs</span>
                <span className="sm:hidden">Blogs</span>
              </Link>

              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
                🌐 Computer Networks · Field Notes
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-mono">
                Proxies to Full Stack — Part 5
              </h1>
            </div>

            <button
              onClick={() => window.print()}
              className="flex-none flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs font-bold px-4 py-2.5 shadow-md hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors print:hidden mt-1"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 flex-none">
                <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>

          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md mb-6 mt-3">
            Sixteen more hops through proxies, security, architecture, and the full request journey — the final leg of the syllabus.
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-5 border-t border-dashed border-gray-200 dark:border-white/10">
            {Object.values(CATEGORIES).map((c) => (
              <span key={c.label} className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-14">

        {/* 52 */}
        <Section number={52} title="Content Delivery Network (CDN)" category="network">
          <div>
            <Label>What</Label>
            <P>A CDN is a distributed network of servers that caches and serves content closer to users.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Serving content from a nearby edge location can reduce latency and reduce load on the origin server.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <div className="flex flex-col gap-2">
              <P>Without CDN:</P>
              <FlowChart direction="vertical" steps={['User in India', 'Long-distance request', 'Origin Server', 'Response']} />
              <P>With CDN:</P>
              <FlowChart direction="vertical" steps={['User', 'Nearby CDN Edge', 'Cache HIT → Response ⚡']} />
              <P>If cache miss:</P>
              <FlowChart direction="vertical" steps={['User', 'CDN Edge', 'Origin Server', 'CDN stores content', 'User']} />
            </div>
          </div>
          <div>
            <Label>Typical cached content</Label>
            <Bullets items={['Images', 'JavaScript', 'CSS', 'Videos', 'Static files']} />
          </div>
          <P>The way I finally got this was: Cache → general idea of storing reusable data closer. CDN → distributed servers that use caching to deliver content closer to users.</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think CDN replaces the origin server. Think: Origin Server → CDN → Edge locations → Users.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A CDN distributes cached content across edge servers so users can retrieve content from locations closer to them, reducing latency and origin-server load.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            CDN = content closer to users
          </Callout>
        </Section>

        {/* 53 */}
        <Section number={53} title="Maximum Transmission Unit (MTU)" category="network">
          <div>
            <Label>What</Label>
            <P>MTU = maximum size of an IP packet that a network link can carry in one frame.</P>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`MTU = 1500 bytes\n\nPacket = 1400 bytes\n→ Fits\n\nPacket = 2000 bytes\n→ Too large for that link`}</CodeBox>
          </div>
        </Section>

        {/* 54 */}
        <Section number={54} title="Path MTU Discovery (PMTUD)" category="network">
          <div>
            <Label>What</Label>
            <P>PMTUD finds the smallest MTU available along the entire path from source to destination.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>A packet may fit the source network but be too large for a smaller-MTU link somewhere in the middle.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`Source\n  ↓ MTU 1500\nRouter\n  ↓ MTU 1400\nRouter\n  ↓ MTU 1500\nDestination`}</CodeBox>
            <P>Path MTU = 1400 bytes. So the sender should send packets ≤ 1400 bytes.</P>
          </div>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            MTU → Maximum packet size of ONE link<br />PMTUD → Finds the maximum packet size that can travel across the ENTIRE PATH without fragmentation
          </Callout>
        </Section>

        {/* 55 */}
        <Section number={55} title="Forward Proxy" category="network">
          <div>
            <Label>What</Label>
            <P>A forward proxy is a server that makes requests on behalf of the client.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>It can hide the client's direct identity from the destination and provide centralized filtering, access control, or routing.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Client', 'Forward Proxy', 'Internet', 'Server']} />
            <P>The server sees the proxy as the immediate requester rather than directly communicating with the original client.</P>
          </div>
          <div>
            <Label>Example</Label>
            <FlowChart direction="vertical" steps={['Laptop', 'Company Proxy', 'Google', 'Response', 'Company Proxy', 'Laptop']} />
          </div>
          <P>The mental model: Forward Proxy → "I'll make requests on behalf of the client."</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't confuse a forward proxy with a reverse proxy. Forward Proxy → represents the CLIENT. Reverse Proxy → represents the SERVER.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A forward proxy sits on the client side and acts on behalf of clients when accessing external servers.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Forward Proxy = client-side representative
          </Callout>
        </Section>

        {/* 56 */}
        <Section number={56} title="Reverse Proxy" category="network">
          <div>
            <Label>What</Label>
            <P>A reverse proxy is a server placed in front of backend servers and acts on their behalf toward clients.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Clients don't need to communicate directly with individual backend servers.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Client', 'Reverse Proxy', 'Backend Server']} />
            <P>With multiple backends:</P>
            <CodeBox>{`Client\n  ↓\nReverse Proxy\n  ↓\n┌───┼────┐\n↓   ↓    ↓\nB1  B2   B3`}</CodeBox>
            <P>The client normally sees the reverse proxy as the server.</P>
          </div>
          <div>
            <Label>Common uses</Label>
            <Bullets items={['TLS termination', 'Load balancing', 'Routing', 'Caching', 'Security controls']} />
          </div>
          <div>
            <Label>Example</Label>
            <FlowChart direction="vertical" steps={['Browser', 'api.example.com', 'Reverse Proxy', 'Backend A / Backend B / Backend C']} />
          </div>
          <P>The mental model: Reverse Proxy → "I'll receive requests on behalf of the server."</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think the reverse proxy is the actual application. It is usually an intermediary in front of the actual backend servers.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A reverse proxy sits in front of backend servers and receives client requests on their behalf, often providing routing, security, caching, or load balancing.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Reverse Proxy = server-side representative
          </Callout>
        </Section>

        {/* 57 */}
        <Section number={57} title="Load Balancer" category="network">
          <div>
            <Label>What</Label>
            <P>A load balancer distributes incoming traffic across multiple backend servers.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>One server may not be able to handle all traffic. Distributing requests improves scalability and availability.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`Clients\n   ↓\nLoad Balancer\n   ↓\n┌───┬───┬───┐\n↓   ↓   ↓\nB1  B2  B3`}</CodeBox>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`1000 requests\n      ↓\nLoad Balancer\n   ↙   ↓   ↘\n B1   B2    B3`}</CodeBox>
            <P>Instead of:</P>
            <CodeBox>{`1000 requests\n      ↓\n    B1 💥`}</CodeBox>
          </div>
          <div>
            <Label>Common strategies include</Label>
            <Bullets items={['Round Robin → distribute requests sequentially', 'Least Connections → send traffic toward a server with fewer active connections']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "Load balancer = always a separate physical machine." It can be implemented as software, a managed cloud service, or part of another infrastructure component. Also: Load Balancer → distributes traffic. Reverse Proxy → represents/protects backend servers. They can exist together, and one component can perform both roles.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A load balancer distributes incoming requests across multiple backend instances to improve scalability, availability and fault tolerance.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Load Balancer = distribute traffic
          </Callout>
        </Section>

        {/* 58 */}
        <Section number={58} title="VPN" category="network">
          <div>
            <Label>What</Label>
            <P>A VPN creates an encrypted tunnel between a device and a VPN server, allowing the device's network traffic to be carried through that tunnel.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>It can protect traffic across an untrusted network and make the VPN server the visible network endpoint for subsequent Internet traffic.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Device', 'Encrypted VPN Tunnel', 'VPN Server', 'Internet', 'Destination']} />
          </div>
          <P>The mental model: Forward Proxy → "I'll make requests on behalf of the client." VPN → "I'll carry/route the client's network traffic through this encrypted tunnel."</P>
          <div>
            <Label>Important distinction</Label>
            <TwoCol left={<span>Forward Proxy<br />→ usually works at the application/request level</span>} right={<span>VPN<br />→ operates at the network connection/tunnel level and can carry traffic from many applications</span>} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't say "VPN = reverse proxy." A VPN server is not automatically a reverse proxy.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A VPN creates an encrypted tunnel through which a client's network traffic is routed, while a forward proxy generally acts on behalf of the client for specific application-level requests.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            VPN = encrypted traffic tunnel
          </Callout>
        </Section>

        {/* 59 */}
        <Section number={59} title="Client-Server Architecture" category="foundational">
          <div>
            <Label>What</Label>
            <P>Client-server architecture is a model where clients request services or data and servers provide them.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>It separates the requester from the system providing the service.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`Client A ──┐\nClient B ──┼──→ Server\nClient C ──┘       ↓\n              Data / Logic`}</CodeBox>
          </div>
          <div>
            <Label>Example</Label>
            <FlowChart direction="vertical" steps={['Browser', 'HTTP Request', 'Web Server', 'Application / Database', 'HTTP Response', 'Browser']} />
          </div>
          <P>A server can also communicate with another server.</P>
          <div>
            <Label>Example</Label>
            <FlowChart direction="vertical" steps={['Frontend Server', 'Backend Server', 'Database Server']} />
          </div>
          <P>The important mental model: Client → asks for a service. Server → provides the service.</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "Client = frontend and Server = database." Not necessarily. Client and server describe their role in a communication.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Client-server architecture separates requesters from service providers: clients send requests and servers process those requests and return responses.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Client asks → Server provides
          </Callout>
        </Section>

        {/* 60 */}
        <Section number={60} title="3-Tier Architecture" category="foundational">
          <div>
            <Label>What</Label>
            <P>3-tier architecture separates an application into three logical layers: 1. Presentation, 2. Application / Business Logic, 3. Data.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Separating responsibilities makes the system easier to maintain, modify and scale.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Client / Browser', 'Presentation Layer', 'Application / Business Logic', 'Data Layer', 'Database']} />
          </div>
          <div>
            <Label>Example</Label>
            <FlowChart direction="vertical" steps={['Browser', 'Frontend', 'Backend API', 'Database']} />
          </div>
          <div>
            <Label>Responsibilities</Label>
            <Bullets items={['Presentation → UI and user interaction', 'Application → business logic and processing', 'Data → storing and retrieving data']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "3-tier means exactly 3 physical servers." The three tiers are logical responsibilities. They can be deployed across many servers.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            3-tier architecture separates presentation, business logic, and data access into distinct layers.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            UI → Logic → Data
          </Callout>
        </Section>

        {/* 61 */}
        <Section number={61} title="Basic Web Application Architecture" category="network">
          <div>
            <Label>What</Label>
            <P>A production web application commonly contains multiple components between the user and the backend.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Different components handle different responsibilities such as DNS resolution, caching, routing, traffic distribution and data processing.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['User', 'DNS', 'CDN / Reverse Proxy', 'Load Balancer', 'Backend Servers', 'Database']} />
          </div>
          <div>
            <Label>More realistically</Label>
            <CodeBox>{`                    ┌──→ Backend A ──┐\nUser → DNS → CDN → Load Balancer → Backend B ──→ Database\n                    └──→ Backend C ──┘`}</CodeBox>
          </div>
          <div>
            <Label>For static content</Label>
            <FlowChart direction="vertical" steps={['User', 'CDN', 'Cache HIT ⚡', 'Response']} />
          </div>
          <div>
            <Label>For dynamic data</Label>
            <FlowChart direction="vertical" steps={['User', 'Load Balancer', 'Backend', 'Database', 'Backend', 'User']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think every request must pass through every component. Static content may be served directly by a CDN, while dynamic requests may need the backend and database.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A typical production web architecture uses components such as CDNs, reverse proxies, load balancers, backend servers and databases to efficiently process different types of requests.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            User → Edge → LB → Backend → DB
          </Callout>
        </Section>

        {/* 62 */}
        <Section number={62} title="Monolith vs Microservices" category="foundational">
          <div>
            <Label>What</Label>
            <P>A monolith is one main deployable application containing multiple functionalities. Microservices split functionality into smaller independently deployable services.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Different architectures provide different trade-offs in scaling, deployment and complexity.</P>
          </div>
          <div>
            <Label>Core idea — Monolith</Label>
            <CodeBox>{`Client\n  ↓\nOne Application\n ├── Users\n ├── Orders\n ├── Payments\n └── Products\n      ↓\n   Database`}</CodeBox>
          </div>
          <div>
            <Label>Microservices</Label>
            <CodeBox>{`              ┌──→ User Service\nClient → API ─┼──→ Order Service\n              ├──→ Payment Service\n              └──→ Product Service`}</CodeBox>
          </div>
          <P>Microservices allow services to potentially scale and deploy independently.</P>
          <div>
            <Label>Example</Label>
            <P>If Order Service receives huge traffic: Order Service → Scale independently — while other services may remain unchanged.</P>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "Microservices are always better." Microservices introduce distributed-system complexity: Network calls, Service discovery, Monitoring, Deployment complexity, Distributed failures, Data consistency. For a small application, a monolith can be simpler.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A monolith packages functionality into one deployable unit, while microservices split functionality into independently deployable services.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Monolith → One application<br />Microservices → Many independently deployable services
          </Callout>
        </Section>

        {/* 63 */}
        <Section number={63} title="API Gateway" category="network">
          <div>
            <Label>What</Label>
            <P>An API Gateway is a single entry point through which clients access multiple backend services.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>The client should not need to know about every individual microservice.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`                    ┌──→ User Service\nClient → API Gateway ├──→ Order Service\n                    ├──→ Payment Service\n                    └──→ Product Service`}</CodeBox>
            <P>The client only needs to know the gateway.</P>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`GET /users/123\n      ↓\nAPI Gateway\n      ↓\nUser Service\n\nPOST /orders\n      ↓\nAPI Gateway\n      ↓\nOrder Service`}</CodeBox>
          </div>
          <div>
            <Label>An API Gateway can provide</Label>
            <Bullets items={['Routing', 'Authentication checks', 'Rate limiting', 'Request transformation', 'Service aggregation']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "API Gateway = Load Balancer." They can overlap, but their main purposes differ. Load Balancer → distributes traffic across instances. API Gateway → provides a controlled API entry point and routes requests to services.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            An API Gateway provides a single entry point for clients and can handle routing, authentication, rate limiting and other cross-cutting concerns.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            API Gateway = one front door → many backend services
          </Callout>
        </Section>

        {/* 64 */}
        <Section number={64} title="CORS" category="network">
          <div>
            <Label>What</Label>
            <P>CORS is a browser security mechanism that controls whether JavaScript from one origin can access resources from another origin.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Browsers enforce the Same-Origin Policy to prevent a website from freely accessing resources from another origin.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`Frontend\nhttps://app.example.com\n        ↓\n        Request\n        ↓\nBackend\nhttps://api.example.com\n        ↓\nCORS headers\n        ↓\nBrowser decides whether JavaScript\ncan access the response`}</CodeBox>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`Access-Control-Allow-Origin:\nhttps://app.example.com`}</CodeBox>
            <P>Meaning: "This origin is allowed to access my response."</P>
          </div>
          <div>
            <Label>Important</Label>
            <Bullets items={['Browser → enforces CORS', 'Server → sends permission headers', 'A server-to-server request normally does not have the browser\'s CORS restriction']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "CORS blocks the server from receiving the request." The browser may send the request, but CORS determines whether the browser allows the page's JavaScript to access the response. CORS is NOT: Authentication, Encryption, Firewall.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            CORS allows a server to specify which origins are permitted to access its resources from browser-based JavaScript.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            CORS = "Can this origin access that response?"
          </Callout>
        </Section>

        {/* 65 */}
        <Section number={65} title="Network Security Basics" category="foundational">
          <div>
            <Label>What</Label>
            <P>Network security protects communication, systems and data from unauthorized access and attacks.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>A network connection alone does not mean the communication or system is secure.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <Bullets items={['Confidentiality → outsiders should not read protected data', 'Integrity → attackers should not silently modify data', 'Authentication → verify who someone is', 'Authorization → determine what they are allowed to access']} />
          </div>
          <div>
            <Label>Example</Label>
            <Bullets items={['HTTPS / TLS → protects data in transit', 'Firewall → controls network traffic', 'Authentication → "Who are you?"', 'Authorization → "What are you allowed to access?"']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't mix up: Authentication → Who are you? Authorization → What are you allowed to do? Also: HTTPS ≠ complete application security. HTTPS protects communication in transit, but it does not automatically prevent application vulnerabilities or misuse by authorized users.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Network security uses mechanisms such as encryption, authentication, authorization, firewalls and access controls to protect systems and communication.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Authentication → Who?<br />Authorization → What?
          </Callout>
        </Section>

        {/* 66 */}
        <Section number={66} title="Common Network Attacks" category="network">
          <div>
            <Label>What</Label>
            <P>Attackers can target communication, availability, DNS, or exposed network services. We only need the common SDE-1 level concepts.</P>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label>1. Man-in-the-Middle (MITM)</Label>
              <CodeBox>{`Client\n  ↓\n🚨 Attacker\n  ↓\nServer`}</CodeBox>
              <P>Goal → observe or modify communication. Defense → HTTPS / TLS helps protect the communication channel.</P>
            </div>
            <div>
              <Label>2. DDoS</Label>
              <P>Distributed Denial of Service means many systems send large amounts of traffic toward a target.</P>
              <CodeBox>{`Bot A ──┐\nBot B ──┤\nBot C ──┼──→ Server 💥\nBot D ──┘`}</CodeBox>
              <P>Goal → overwhelm resources so legitimate users cannot access the service.</P>
              <P>Common defenses:</P>
              <Bullets items={['CDN', 'Rate limiting', 'Traffic filtering', 'Load balancing', 'DDoS protection services']} />
            </div>
            <div>
              <Label>3. DNS Spoofing / Poisoning</Label>
              <P>An attacker attempts to provide a false DNS answer.</P>
              <CodeBox>{`User\n ↓\nDNS lookup\n ↓\nFalse response\n ↓\nWrong IP`}</CodeBox>
              <P>The user may be redirected to a malicious server. DNS security mechanisms such as DNSSEC can help authenticate DNS data.</P>
            </div>
            <div>
              <Label>4. Port Scanning</Label>
              <P>An attacker checks which ports are reachable.</P>
              <CodeBox>{`Attacker\n   ↓\n22?    → ?\n80?    → ?\n443?   → ?\n8080?  → ?`}</CodeBox>
              <P>Goal → discover exposed services. Defense → firewall and expose only required services/ports.</P>
            </div>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "HTTPS prevents every network attack." HTTPS mainly protects the communication channel. It does not automatically prevent: DDoS, Port scanning, Compromised servers, Application vulnerabilities, Weak credentials.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Common attacks include MITM, DDoS, DNS spoofing and port scanning. Defenses depend on the attack and may include TLS, firewalls, rate limiting, traffic filtering and DNS security.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            MITM → intercept communication<br />DDoS → overwhelm service<br />DNS spoofing → false DNS answer<br />Port scan → discover exposed services
          </Callout>
        </Section>

        {/* 67 */}
        <Section number={67} title="Common Network Interview Scenarios" category="foundational" isLast>
          <div>
            <Label>What</Label>
            <P>Many interview questions combine several networking concepts into one request journey.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Interviewers want to know whether you understand how the individual components work together.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>When you type: https://google.com</P>
            <FlowChart direction="vertical" steps={['Browser', 'DNS', 'IP', 'TCP', 'TLS', 'HTTP', 'Server', 'HTTP Response', 'Browser']} />
            <P>The simplified mental model: Name → IP → Connection → Security → Request → Response.</P>
          </div>
          <div>
            <Label>Example question</Label>
            <P><strong>Question:</strong> "What happens when you type google.com?"</P>
            <P><strong>Answer:</strong> The browser resolves the domain through DNS, obtains an IP address, establishes the transport connection, negotiates TLS for HTTPS, sends the HTTP request, and receives the response.</P>
          </div>
          <div>
            <Label>How does a request reach the correct application?</Label>
            <FlowChart direction="vertical" steps={['Domain', 'DNS', 'IP', 'Routing', 'Server', 'Port', 'Socket / Application']} />
            <TwoCol left={<span>IP<br />→ Which host/interface?</span>} right={<span>Port<br />→ Which transport endpoint?</span>} />
          </div>
          <div>
            <Label>How does a website handle huge traffic?</Label>
            <CodeBox>{`Users\n  ↓\nCDN / Reverse Proxy\n  ↓\nLoad Balancer\n  ↓\n┌──────┬──────┬──────┐\nServer Server Server\n└──────┴──────┴──────┘\n        ↓\n     Database`}</CodeBox>
            <P>Static content: User → CDN → Cache HIT ⚡. Dynamic content: User → Load Balancer → Backend → Database.</P>
          </div>
          <div>
            <Label>Why might a frontend fail to access an API?</Label>
            <CodeBox>{`Frontend Origin\n      ↓\nDifferent API Origin\n      ↓\nCORS\n      ↓\nBrowser may block JavaScript\nfrom accessing the response`}</CodeBox>
            <P>Check: Access-Control-Allow-Origin.</P>
          </div>
          <div>
            <Label>Why use a reverse proxy?</Label>
            <FlowChart direction="vertical" steps={['Client', 'Reverse Proxy', 'Backend A / B / C']} />
            <P>Possible responsibilities: Routing, Load balancing, TLS termination, Caching, Security controls.</P>
          </div>
          <div>
            <Label>Forward Proxy vs Reverse Proxy</Label>
            <TwoCol left={<span>Forward Proxy<br />→ represents CLIENT</span>} right={<span>Reverse Proxy<br />→ represents SERVER</span>} />
            <P>VPN → carries/routes the client's network traffic through an encrypted tunnel.</P>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't immediately assume the backend is down. It may be a browser CORS restriction.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Strong networking answers are usually built by explaining the journey of a request and the purpose of each component, rather than listing isolated definitions.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Think in the journey of a request, not isolated protocols.
          </Callout>
        </Section>

        {/* -------- MASTER REVISION -------- */}

        <section className="rounded-2xl bg-gray-900 dark:bg-white/5 p-6 sm:p-9 text-white border border-white/10 mb-6 print:break-inside-avoid">
          <h2 className="font-mono text-xl sm:text-2xl font-extrabold mb-2">Master Revision</h2>
          <p className="text-white/70 text-base sm:text-lg">Everything above, compressed.</p>
        </section>

        <RevisionPanel title="⭐ Must Remember">
          <OrderedSteps
            items={[
              'Forward Proxy represents the client.',
              'Reverse Proxy represents the server/backend.',
              'Forward Proxy makes requests on behalf of the client.',
              'Reverse Proxy receives requests on behalf of backend servers.',
              'Load Balancer distributes traffic across backend instances.',
              'API Gateway provides a controlled entry point to multiple backend services.',
              'API Gateway and Load Balancer can overlap, but they solve different primary problems.',
              'VPN carries/routes network traffic through an encrypted tunnel.',
              'VPN is not automatically a forward proxy or reverse proxy.',
              'Client-server architecture: Client asks → Server provides.',
              '3-tier architecture: Presentation → Application Logic → Data.',
              'Three tiers are logical layers, not necessarily three physical servers.',
              'A typical web architecture can contain: DNS → CDN/Reverse Proxy → Load Balancer → Backend → DB.',
              'Monolith: One main deployable application.',
              'Microservices: Multiple independently deployable services.',
              'Microservices improve independent scaling/deployment but introduce distributed-system complexity.',
              'API Gateway: One front door → many backend services.',
              'CORS is primarily a browser-enforced security mechanism.',
              'CORS: "Can this origin access that response?"',
              'Authentication: "Who are you?"',
              'Authorization: "What are you allowed to do?"',
              'HTTPS protects communication in transit but is not complete application security.',
              'MITM: Attempt to intercept communication.',
              'DDoS: Attempt to overwhelm a service with traffic.',
              'DNS spoofing: Attempt to provide a false DNS answer.',
              'Port scanning: Discover reachable/exposed services.',
              'The end-to-end request mental model is: Domain → DNS → IP → Transport → TLS → HTTP → Edge / Proxy / LB → Backend → Database.',
            ]}
          />
        </RevisionPanel>

        <RevisionPanel title="⚠️ Mistakes I Should Never Repeat" className="border-2 border-dashed border-red-200 dark:border-red-500/30 bg-red-50/40 dark:bg-red-500/[0.04]">
          <div className="flex flex-col gap-7">
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">1. Forward proxy</p>
              <WrongRight
                wrong={`"Forward proxy represents the server."`}
                right="Forward proxy represents the client."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">2. Reverse proxy</p>
              <WrongRight
                wrong={`"Reverse proxy represents the client."`}
                right="Reverse proxy represents the server/backend."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">3. VPN vs proxy</p>
              <WrongRight
                wrong={`"VPN is just a proxy."`}
                right="VPN creates an encrypted network tunnel and can carry traffic from many applications."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">4. Load balancer vs API Gateway</p>
              <WrongRight
                wrong={`"Load balancer and API Gateway are the same."`}
                right="Load balancer primarily distributes traffic; API Gateway provides a controlled API entry point and service routing."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">5. 3-tier misconception</p>
              <WrongRight
                wrong={`"3-tier means exactly three physical servers."`}
                right="3-tier describes three logical layers."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">6. Microservices</p>
              <WrongRight
                wrong={`"Microservices are always better than monoliths."`}
                right="Microservices provide independent scaling/deployment but add distributed-system complexity."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">7. CORS blocking</p>
              <WrongRight
                wrong={`"CORS blocks the server from receiving the request."`}
                right="CORS is enforced by the browser when deciding whether JavaScript can access the response."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">8. CORS vs authentication</p>
              <WrongRight
                wrong={`"CORS is authentication."`}
                right="CORS controls browser cross-origin access; authentication verifies identity."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">9. HTTPS scope</p>
              <WrongRight
                wrong={`"HTTPS solves all security problems."`}
                right="HTTPS protects data in transit; it does not eliminate application vulnerabilities or DDoS attacks."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">10. CDN vs origin</p>
              <WrongRight
                wrong={`"CDN replaces the origin server."`}
                right="CDN usually caches and serves content while the origin remains the source."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">11. Request path</p>
              <WrongRight
                wrong={`"Every request must pass through every architecture layer."`}
                right="Different requests can take different paths depending on whether content is static, cached, dynamic, etc."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">12. Client/server roles</p>
              <WrongRight
                wrong={`"Client always means frontend and server always means database."`}
                right="Client/server describe communication roles, not specific technologies."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">13. API Gateway requirement</p>
              <WrongRight
                wrong={`"API Gateway is always required for microservices."`}
                right="It is a common architecture pattern, not a universal requirement."
              />
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="🎤 Interview Rules" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is a forward proxy?"</p>
              <P>A server that acts on behalf of clients when making requests to external servers.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is a reverse proxy?"</p>
              <P>A server-side intermediary that receives client requests and forwards them to backend servers.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "Forward proxy vs reverse proxy?"</p>
              <P>Forward proxy represents the client; reverse proxy represents the server.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is a load balancer?"</p>
              <P>It distributes incoming traffic across multiple backend instances to improve scalability and availability.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is an API Gateway?"</p>
              <P>A single entry point for clients that routes requests to backend services and can handle concerns such as authentication and rate limiting.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "VPN vs proxy?"</p>
              <P>A traditional forward proxy generally handles application requests on behalf of the client, while a VPN carries network traffic through an encrypted tunnel.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is client-server architecture?"</p>
              <P>A model where clients request services and servers provide them.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is 3-tier architecture?"</p>
              <P>Separating presentation, business logic and data into three logical layers.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "Monolith vs microservices?"</p>
              <P>A monolith is one main deployable application; microservices split functionality into independently deployable services.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is CORS?"</p>
              <P>A browser security mechanism that controls whether JavaScript from one origin can access resources from another origin.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "Authentication vs authorization?"</p>
              <P>Authentication verifies identity; authorization determines what that identity is allowed to access.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What happens when you type google.com?"</p>
              <P>DNS resolves the domain to an IP; the client establishes the transport connection, negotiates TLS for HTTPS, sends the HTTP request, and receives the response.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "How would you scale a web application?"</p>
              <P>Use components such as CDN caching, reverse proxies, load balancing and multiple backend instances, while scaling data storage appropriately.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "Why use a CDN?"</p>
              <P>To serve cached content closer to users, reducing latency and origin-server load.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "Why use a reverse proxy?"</p>
              <P>To provide a server-side entry point for routing, TLS termination, caching, security and potentially load balancing.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is the most important networking mental model?"</p>
              <P>Follow the request: Domain → DNS → IP → Transport → TLS → HTTP → Edge/Proxy/LB → Backend → Database.</P>
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="🧠 Mental Models">
          <div className="flex flex-col gap-6">
            <div>
              <Label>Model 1 — Basic HTTPS request</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['google.com', 'DNS', 'IP', 'TCP/UDP', 'TLS', 'HTTP', 'Server']} />
              </div>
            </div>
            <div>
              <Label>Model 2 — Production web request</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['User', 'DNS', 'CDN / Reverse Proxy', 'Load Balancer', 'Backend', 'Database']} />
              </div>
            </div>
            <div>
              <Label>Model 3 — CDN</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['User', 'CDN Edge', 'Cache HIT → Response ⚡', 'Cache MISS', 'Origin', 'CDN stores', 'User']} />
              </div>
            </div>
            <div>
              <Label>Model 4 — Forward Proxy</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['Client', 'Forward Proxy', 'Internet', 'Destination Server']} />
              </div>
            </div>
            <div>
              <Label>Model 5 — Reverse Proxy</Label>
              <div className="mt-3">
                <CodeBox>{`Client\n  ↓\nReverse Proxy\n  ↓\n┌───┬───┬───┐\nB1  B2  B3`}</CodeBox>
              </div>
            </div>
            <div>
              <Label>Model 6 — API Gateway</Label>
              <div className="mt-3">
                <CodeBox>{`Client\n     ↓\nAPI Gateway\n  ┌──┼──┬──┐\n  ↓  ↓  ↓  ↓\n User Order Payment Product\n Service Service Service Service`}</CodeBox>
              </div>
            </div>
            <div>
              <Label>Model 7 — VPN</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['Client', 'Encrypted VPN Tunnel', 'VPN Server', 'Internet', 'Destination']} />
              </div>
            </div>
            <div>
              <Label>Model 8 — 3-Tier</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['Presentation', 'Business Logic', 'Data']} />
              </div>
            </div>
            <div>
              <Label>Model 9 — Security</Label>
              <div className="mt-3">
                <Bullets items={['Authentication → Who are you?', 'Authorization → What can you access?', 'TLS → Can outsiders read/modify the communication?', 'Firewall → Which network traffic is allowed?']} />
              </div>
            </div>
            <div>
              <Label>Model 10 — Complete request</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['User', 'DNS', 'IP', 'CDN / Reverse Proxy', 'Load Balancer', 'Backend', 'Database', 'Cache / Services may change the path']} />
              </div>
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="⚡ Rapid Revision" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-3.5">
            <QA q="What is a forward proxy?" a="A proxy that represents the client." />
            <QA q="What is a reverse proxy?" a="A proxy that represents the server/backend." />
            <QA q="Forward proxy mental model?" a={'"I\'ll make requests on behalf of the client."'} />
            <QA q="VPN mental model?" a={'"I\'ll carry/route the client\'s network traffic through this encrypted tunnel."'} />
            <QA q="What does a load balancer do?" a="Distributes traffic across backend instances." />
            <QA q="What does an API Gateway do?" a="Provides one entry point to multiple backend services." />
            <QA q="Is API Gateway the same as a load balancer?" a="No. Their primary responsibilities differ, though they can overlap." />
            <QA q="What is client-server architecture?" a="Client asks → Server provides." />
            <QA q="What is 3-tier architecture?" a="Presentation → Business Logic → Data." />
            <QA q="What is a monolith?" a="One main deployable application." />
            <QA q="What are microservices?" a="Multiple independently deployable services." />
            <QA q="Why use microservices?" a="Independent scaling and deployment, at the cost of distributed-system complexity." />
            <QA q="What is CORS?" a="Browser-controlled cross-origin access." />
            <QA q="What does CORS ask?" a={'"Can this origin access that response?"'} />
            <QA q="Authentication?" a="Who are you?" />
            <QA q="Authorization?" a="What are you allowed to access?" />
            <QA q="What does HTTPS protect?" a="Communication in transit using TLS." />
            <QA q="Does HTTPS stop DDoS?" a="No." />
            <QA q="What is MITM?" a="Attempt to intercept communication." />
            <QA q="What is DDoS?" a="Attempt to overwhelm a service with distributed traffic." />
            <QA q="What is DNS spoofing?" a="Providing a false DNS answer." />
            <QA q="What is port scanning?" a="Discovering reachable/exposed services." />
            <QA q="Why use a CDN?" a="Serve content closer to users and reduce origin load." />
            <QA q="What is the end-to-end request flow?" a="DNS → IP → Transport → TLS → HTTP → Edge/Proxy/LB → Backend → Database." />
          </div>
        </RevisionPanel>

        {/* -------- END OF SYLLABUS -------- */}

        <section className="rounded-2xl bg-gray-900 dark:bg-white/5 p-6 sm:p-9 text-white border border-white/10 mb-6 print:break-inside-avoid">
          <h2 className="font-mono text-xl sm:text-2xl font-extrabold mb-2">End of Current Computer Networks Syllabus</h2>
          <p className="text-white/70 text-base sm:text-lg mb-4">
            Deep TCP topics that were explicitly skipped remain skipped. The current teaching syllabus is now complete at the SDE-1 level we planned.
          </p>
          <p className="text-white/70 text-base sm:text-lg mb-6">
            <strong className="text-white">Next phase:</strong> Complete Computer Networks revision → Interview questions → Scenario-based questions → Final weak-point correction.
          </p>
          <button
            onClick={triggerCelebration}
            className="inline-flex items-center gap-3 rounded-full bg-amber-500 hover:bg-amber-400 text-gray-900 font-mono text-sm sm:text-base font-bold px-8 py-4 shadow-lg transition-colors print:hidden"
          >
            <span className="text-xl">🎓</span>
            Mark as Finished
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      <style>{`
        @media print {
          @page { margin: 16mm 14mm; }
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  )
}

export default Part5