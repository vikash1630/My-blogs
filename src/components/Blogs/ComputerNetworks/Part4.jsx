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

function Part4() {
  const [progress, setProgress] = useState(0)
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

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                DNS to CDN — Part 4
              </h1>
            </div>

            {/* download / print button — inline with the title, right-aligned */}
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
            Eight hops through DNS, HTTP, TLS, and content delivery — traced in the order we actually reasoned through them.
          </p>

          {/* category legend — the colors below mean something, not decoration */}
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

        {/* 45 */}
        <Section number={45} title="Domain Name System (DNS)" category="resolve">
          <div>
            <Label>What</Label>
            <P>DNS translates a domain name such as google.com into an IP address that the network can use.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Humans remember names; computers need IP addresses to reach the destination host.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Browser', 'DNS Resolver', 'Root', '.com', 'Authoritative DNS Server', 'IP address', 'Resolver', 'Laptop']} />
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`google.com\n    ↓\n142.x.x.x`}</CodeBox>
          </div>
          <P>The confusion here was "DNS gives the website." Don't think that. DNS mainly gives the IP address needed to reach the server.</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            DNS does NOT directly establish the TCP/TLS/HTTP connection. DNS → "What IP belongs to this domain?" TCP/TLS/HTTP → actually establish communication and request data.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            DNS is the naming system that resolves human-readable domain names into IP addresses so clients can locate the destination host.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            DNS = domain name → IP address
          </Callout>
        </Section>

        {/* 46 */}
        <Section number={46} title="DNS Recursive vs Iterative Lookup" category="resolve">
          <div>
            <Label>What</Label>
            <P>Recursive lookup means the resolver finds the final answer for the client; iterative lookup means each DNS server points the resolver toward the next place to ask.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>The client should not need to understand the entire DNS hierarchy.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>Client → Resolver = Recursive</P>
            <P>Resolver → DNS hierarchy = Iterative</P>
          </div>
          <div>
            <Label>Client says</Label>
            <CodeBox>"You find it."</CodeBox>
          </div>
          <div>
            <Label>Resolver → Root</Label>
            <CodeBox>"I don't know Google's IP. Ask these .com servers."</CodeBox>
          </div>
          <div>
            <Label>Resolver → .com</Label>
            <CodeBox>"I don't know the IP. Ask these authoritative servers."</CodeBox>
          </div>
          <div>
            <Label>Resolver → Authoritative</Label>
            <CodeBox>"google.com = IP"</CodeBox>
          </div>
          <div>
            <Label>Full flow</Label>
            <FlowChart direction="vertical" steps={['Resolver', 'Root', '.com', 'Authoritative', 'IP', 'Resolver', 'Laptop']} />
          </div>
          <P>The way I finally got this was: Client → "You find it." → Recursive. Resolver → "Tell me where to look next." → Iterative.</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't say "Root recursively finds the IP." The resolver is performing the overall recursive job for the client, while its queries through the DNS hierarchy are typically iterative.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            The client usually makes a recursive request to a resolver, while the resolver follows the DNS hierarchy iteratively through root, top-level domain, and authoritative servers.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Client → Resolver = Recursive<br />Resolver → DNS hierarchy = Iterative
          </Callout>
        </Section>

        {/* 47 */}
        <Section number={47} title="DNS TTL" category="resolve">
          <div>
            <Label>What</Label>
            <P>DNS Time To Live controls how long a DNS answer can be cached before it needs to be considered stale and refreshed.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Without DNS caching, every lookup would repeatedly travel through DNS infrastructure.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['DNS lookup', 'IP address', 'Cache', 'DNS Time To Live = 300 seconds', 'Reuse cached answer', 'TTL expires', 'Fresh lookup']} />
          </div>
          <div>
            <Label>Important distinction</Label>
            <TwoCol left={<span>IP Time To Live (TTL)<br />→ limits router hops</span>} right={<span>DNS Time To Live (TTL)<br />→ controls how long a DNS answer can be cached</span>} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Same abbreviation, completely different purpose. IP TTL → packet lifetime / router hops. DNS TTL → cache lifetime of DNS information.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            DNS Time To Live determines how long resolvers and other caches can retain a DNS response before refreshing it.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            IP TTL → router hops<br />DNS TTL → DNS cache lifetime
          </Callout>
        </Section>

        {/* 48 */}
        <Section number={48} title="HTTP" category="network">
          <div>
            <Label>What</Label>
            <P>HTTP is an application-layer protocol used for communication between clients and web servers.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>The client and server need a common format for requesting and returning web resources.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart steps={['Client', 'HTTP Request', 'Server', 'HTTP Response', 'Client']} />
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`GET /\nHost: google.com\n\n↓\n\nHTTP/1.1 200 OK\nContent-Type: text/html\n\n↓\n\nHTML/data`}</CodeBox>
          </div>
          <div>
            <Label>Common methods</Label>
            <Bullets items={['GET → retrieve data', 'POST → send/create data', 'PUT → replace/update data', 'DELETE → delete data']} />
          </div>
          <P>The important mental model: HTTP → "What resource do I want?" "How should I send the request?" "What did the server return?"</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            HTTP itself does NOT provide encryption. Plain HTTP: Client → HTTP → Network. HTTPS: Client → TLS → HTTP → Network.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            HTTP is an application-layer request-response protocol used between clients and servers. HTTPS is HTTP carried over a secure TLS connection.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            HTTP = request → response
          </Callout>
        </Section>

        {/* 49 */}
        <Section number={49} title="HTTPS + TLS" category="network">
          <div>
            <Label>What</Label>
            <P>HTTPS is HTTP communicated over a TLS-secured connection.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Normal HTTP does not protect the contents of communication from network attackers.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>HTTP only:</P>
            <FlowChart direction="vertical" steps={['Client', 'HTTP', 'Network', 'Server']} />
            <P>HTTPS:</P>
            <FlowChart direction="vertical" steps={['Client', 'TLS', 'HTTP', 'Network', 'Server']} />
          </div>
          <P>The confusion here was: "If we skip the TLS handshake, is it HTTP?" For the simplified mental model: HTTP → application protocol. HTTPS → HTTP + TLS security. TLS establishes the security needed before protected HTTP communication takes place.</P>
          <div>
            <Label>TLS provides</Label>
            <Bullets items={['Encryption → outsiders should not be able to read the protected data', 'Integrity → attackers should not silently modify the protected data', 'Authentication → client can verify the server\'s identity through certificates']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            HTTPS is NOT a completely different application protocol from HTTP. Think: HTTPS = HTTP + TLS.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            HTTPS is HTTP over TLS. TLS establishes secure communication, authenticates the server, and protects the HTTP data.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            HTTP + TLS = HTTPS
          </Callout>
        </Section>

        {/* 50 */}
        <Section number={50} title="TLS Certificates" category="network">
          <div>
            <Label>What</Label>
            <P>A digital certificate binds a domain identity to a public key and is signed by a trusted Certificate Authority (CA).</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>When connecting to https://example.com, the client needs a way to verify that the public key actually belongs to that domain.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Website', 'Certificate', 'Domain identity + Public key + CA signature', 'Browser', 'Verify trusted CA', 'Trust server identity']} />
          </div>
          <div>
            <Label>For your portfolio</Label>
            <FlowChart direction="vertical" steps={['pichu.site', 'TLS certificate', 'Certificate Authority', 'Browser verifies certificate', 'Secure connection']} />
          </div>
          <P>The confusion here was: "I bought pichu.site from a domain seller, so did the seller give me the certificate?" Don't think: Domain purchase → automatically means the seller personally created the certificate. Think: Domain → proves/control of the name. Certificate → binds that domain to a public key and is issued/signed by a Certificate Authority. The hosting/platform or certificate service can obtain/manage the certificate for the domain.</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            A Certificate Authority does not simply sign every certificate without checks. The CA performs domain validation according to the certificate type and issuance process before issuing/signing it.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A TLS certificate allows the browser to verify that the public key presented by the server is associated with the requested domain and trusted through a Certificate Authority.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Certificate = domain identity + public key + trusted CA signature
          </Callout>
        </Section>

        {/* 51 */}
        <Section number={51} title="HTTP Caching" category="network">
          <div>
            <Label>What</Label>
            <P>HTTP caching stores reusable responses so future requests can be served without always contacting the origin server.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>It reduces latency, bandwidth usage and server load.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <div className="flex flex-col gap-2">
              <P>First request:</P>
              <FlowChart direction="vertical" steps={['Client', 'Cache MISS', 'Origin Server', 'Response', 'Cache stores response', 'Client']} />
              <P>Next request:</P>
              <FlowChart direction="vertical" steps={['Client', 'Cache HIT', 'Response ⚡']} />
            </div>
          </div>
          <div>
            <Label>HTTP can control caching using headers such as:</Label>
            <CodeBox>Cache-Control: max-age=3600</CodeBox>
            <P>Meaning roughly: Response can be considered fresh for 3600 seconds.</P>
          </div>
          <div>
            <Label>Important distinction</Label>
            <TwoCol left={<span>DNS Time To Live<br />→ controls DNS answer caching</span>} right={<span>HTTP Cache-Control<br />→ controls HTTP response caching</span>} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think "Cache = database." Cache is generally a performance layer containing reusable copies; the origin/database remains the authoritative source.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            HTTP caching stores reusable responses closer to the client, reducing latency, bandwidth usage and load on the origin server.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Cache hit → fast response<br />Cache miss → fetch → store → serve
          </Callout>
        </Section>

        {/* 52 */}
        <Section number={52} title="CDN" category="network" isLast>
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

        {/* -------- MASTER REVISION -------- */}

        <section className="rounded-2xl bg-gray-900 dark:bg-white/5 p-6 sm:p-9 text-white border border-white/10 mb-6 print:break-inside-avoid">
          <h2 className="font-mono text-xl sm:text-2xl font-extrabold mb-2">Master Revision</h2>
          <p className="text-white/70 text-base sm:text-lg">Everything above, compressed.</p>
        </section>

        <RevisionPanel title="⭐ Must Remember">
          <OrderedSteps
            items={[
              'NAT translates private addressing to public addressing and uses port mappings to distinguish simultaneous connections.',
              'IP identifies the host/interface. Port identifies a transport endpoint.',
              'TCP and UDP are Transport Layer protocols.',
              'TCP provides reliable, ordered, connection-oriented transport.',
              'UDP is connectionless and lightweight and does not provide TCP\'s built-in reliability/order.',
              'Server applications commonly listen on known ports such as 80, 443, 22 and 53.',
              'Clients commonly use ephemeral source ports.',
              'TCP connections are commonly identified by: Source IP + Source Port + Destination IP + Destination Port.',
              'A socket is NOT another port number.',
              'Port = number. Socket = OS-managed communication abstraction/object.',
              'One listening server port can handle many simultaneous TCP connections because each connection has separate state and connection identity.',
              'TCP uses a 3-way handshake: SYN → SYN+ACK → ACK.',
              'TCP sequence numbers track byte positions.',
              'TCP ACK generally means: "This is the next byte I expect."',
              'TCP can buffer out-of-order data.',
              'Duplicate ACKs can indicate missing data.',
              'Retransmission timeout can recover missing data when the expected ACK does not arrive in time.',
              'Flow Control protects the receiver.',
              'Sliding Window allows multiple bytes to be in flight.',
              'Congestion Control protects the network.',
              'Slow Start initially increases the sending capacity rapidly while TCP discovers network capacity.',
              'TCP normally closes with: FIN → ACK → FIN → ACK.',
              'FIN = graceful close. RST = reset/abrupt termination.',
              'TIME_WAIT helps delayed old packets disappear and allows recovery if the final ACK needs retransmission.',
              'DNS translates domain names into IP addresses.',
              'Client → Resolver is generally recursive.',
              'Resolver → DNS hierarchy is generally iterative.',
              'DNS lookup flow: Resolver → Root → .com → Authoritative → IP.',
              'IP Time To Live limits router hops.',
              'DNS Time To Live controls how long a DNS answer can be cached.',
              'HTTP follows a request → response model.',
              'HTTP itself does not provide encryption.',
              'HTTPS = HTTP + TLS.',
              'TLS provides encryption, integrity and server authentication.',
              'A TLS certificate binds a domain identity to a public key and is signed through a trusted Certificate Authority.',
              'HTTP caching stores reusable responses to reduce latency, bandwidth and server load.',
              'Cache hit → serve cached response.',
              'Cache miss → fetch → store → serve.',
              'CDN distributes cached content closer to users.',
              'CDN can reduce latency and origin-server load.',
            ]}
          />
        </RevisionPanel>

        <RevisionPanel title="⚠️ Mistakes I Should Never Repeat" className="border-2 border-dashed border-red-200 dark:border-red-500/30 bg-red-50/40 dark:bg-red-500/[0.04]">
          <div className="flex flex-col gap-7">
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">1. TCP vs UDP</p>
              <WrongRight
                wrong={`"TCP is better than UDP."`}
                right="They solve different requirements."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">2. Port usage</p>
              <WrongRight
                wrong={`"Port 443 means every device involved uses port 443."`}
                right="The server commonly listens on 443; the client normally uses an ephemeral source port."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">3. Port vs socket</p>
              <WrongRight
                wrong={`"A port is the same thing as a socket."`}
                right="Port is a number; socket is an OS communication abstraction."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">4. Server port capacity</p>
              <WrongRight
                wrong={`"One server port means only one client can connect."`}
                right="Many TCP connections can share the same server port."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">5. TCP out-of-order</p>
              <WrongRight
                wrong={`"TCP discards all non-contiguous data."`}
                right="TCP can buffer out-of-order data."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">6. ACK meaning</p>
              <WrongRight
                wrong={`"ACK means the last byte received."`}
                right="ACK generally identifies the NEXT byte expected."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">7. Flow vs congestion control</p>
              <WrongRight
                wrong={`"Flow control and congestion control are the same."`}
                right="Flow control protects the receiver; congestion control protects the network."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">8. Slow Start</p>
              <WrongRight
                wrong={`"Slow Start means TCP always sends slowly."`}
                right="It starts cautiously and then increases sending capacity rapidly."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">9. FIN</p>
              <WrongRight
                wrong={`"A FIN immediately closes both directions."`}
                right="TCP is full-duplex; each direction can close independently."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">10. TIME_WAIT</p>
              <WrongRight
                wrong={`"TIME_WAIT means the server is simply waiting."`}
                right="It is a TCP state used for delayed-packet cleanup and final-ACK reliability."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">11. DNS purpose</p>
              <WrongRight
                wrong={`"DNS gives me the website."`}
                right="DNS primarily gives the IP address needed to reach the host."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">12. Recursive vs iterative</p>
              <WrongRight
                wrong={`"Recursive and iterative mean the same thing."`}
                right="Client → Resolver is recursive; resolver's hierarchy lookups are generally iterative."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">13. TTL</p>
              <WrongRight
                wrong={`"IP TTL and DNS TTL have the same purpose."`}
                right="IP TTL limits router hops; DNS TTL controls DNS caching time."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">14. HTTP encryption</p>
              <WrongRight
                wrong={`"HTTP is encrypted."`}
                right="Plain HTTP does not provide encryption; HTTPS uses TLS."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">15. HTTPS misconception</p>
              <WrongRight
                wrong={`"HTTPS is a completely different application protocol."`}
                right="HTTPS is HTTP carried over TLS."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">16. Certificate origin</p>
              <WrongRight
                wrong={`"Buying a domain automatically means the domain seller personally created my TLS certificate."`}
                right="Domain registration and certificate issuance are separate; a Certificate Authority issues/signs the certificate."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">17. Certificate purpose</p>
              <WrongRight
                wrong={`"A certificate is just encryption."`}
                right="It also helps establish server identity by binding the domain to a public key."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">18. Cache vs database</p>
              <WrongRight
                wrong={`"Cache is the original database."`}
                right="Cache stores reusable copies for performance."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">19. CDN vs origin</p>
              <WrongRight
                wrong={`"CDN replaces the origin server."`}
                right="CDN usually caches and delivers content while the origin remains the source."
              />
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="🎤 Interview Rules" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "How does DNS resolve google.com?"</p>
              <P>The client asks a resolver recursively; the resolver can query the DNS hierarchy iteratively: Root → .com → Authoritative server → IP.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "Recursive vs iterative DNS?"</p>
              <P>Recursive means the resolver finds the final answer for the client; iterative means a DNS server directs the resolver toward the next server to ask.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What does DNS Time To Live mean?"</p>
              <P>It controls how long a DNS answer can be cached.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What does IP Time To Live mean?"</p>
              <P>It limits how many router hops a packet can survive.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is HTTP?"</p>
              <P>An application-layer request-response protocol used for client-server communication.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is HTTPS?"</p>
              <P>HTTP over TLS, providing encrypted and authenticated communication.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What does TLS provide?"</p>
              <P>Encryption, integrity and server authentication.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "Why do we need a certificate in HTTPS?"</p>
              <P>It helps the client verify that the server's public key is associated with the requested domain and trusted through a Certificate Authority.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is caching?"</p>
              <P>Storing reusable responses so future requests can be served faster without always contacting the origin.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "What is a CDN?"</p>
              <P>A distributed network of edge servers that caches and serves content closer to users.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">If asked: "CDN vs cache?"</p>
              <P>Cache is the general concept; a CDN is a distributed content delivery system that commonly uses caching at edge locations.</P>
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="🧩 Mental Models">
          <div className="mb-7">
            <Label>Model 1</Label>
            <div className="mt-3">
              <FlowChart direction="vertical" steps={['Client', 'DNS Resolver', 'Root', '.com', 'Authoritative', 'IP', 'Resolver', 'Client']} />
            </div>
          </div>
          <div className="mb-7">
            <Label>Model 2</Label>
            <div className="mt-3">
              <FlowChart direction="vertical" steps={['google.com', 'DNS', 'IP', 'TCP', 'TLS', 'HTTP', 'Server']} />
            </div>
          </div>
          <div>
            <Label>Model 3</Label>
            <div className="mt-3">
              <FlowChart direction="vertical" steps={['User', 'CDN Edge', 'Cache HIT → Response ⚡', 'Cache MISS', 'Origin', 'CDN stores', 'User']} />
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="⚡ Rapid Revision" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-3.5">
            <QA q="What does DNS do?" a="Domain name → IP address." />
            <QA q="Client → Resolver?" a="Generally recursive." />
            <QA q="Resolver → DNS hierarchy?" a="Generally iterative." />
            <QA q="DNS lookup hierarchy?" a="Root → top-level domain server → authoritative server." />
            <QA q="What does IP Time To Live do?" a="Limits router hops." />
            <QA q="What does DNS Time To Live do?" a="Controls DNS cache lifetime." />
            <QA q="What is HTTP?" a="Application-layer request-response protocol." />
            <QA q="Does HTTP provide encryption?" a="No." />
            <QA q="What is HTTPS?" a="HTTP over TLS." />
            <QA q="What does TLS provide?" a="Encryption, integrity and authentication." />
            <QA q="What is a TLS certificate?" a="Domain identity + public key + trusted Certificate Authority signature." />
            <QA q="Who signs certificates?" a="Certificate Authorities." />
            <QA q="What is caching?" a="Storing reusable data for faster future access." />
            <QA q="Cache hit?" a="Serve cached response." />
            <QA q="Cache miss?" a="Fetch from origin, store, then serve." />
            <QA q="What is a CDN?" a="Distributed edge servers that deliver content closer to users." />
            <QA q="Does CDN replace the origin?" a="No, it usually caches and delivers content from the origin." />
          </div>
        </RevisionPanel>

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

export default Part4