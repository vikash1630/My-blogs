import React, { useEffect, useState } from 'react'

/* ---------- category system (encodes the syllabus's own TCP grouping, not decoration) ---------- */

const CATEGORIES = {
  handshake: {
    ring: 'border-indigo-200 dark:border-indigo-500/25',
    bg: 'bg-indigo-50/70 dark:bg-indigo-500/[0.06]',
    top: 'border-t-indigo-400 dark:border-t-indigo-500',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/50',
    dot: 'bg-indigo-400',
    label: 'Connection Establishment',
  },
  reliability: {
    ring: 'border-sky-200 dark:border-sky-500/25',
    bg: 'bg-sky-50/70 dark:bg-sky-500/[0.06]',
    top: 'border-t-sky-400 dark:border-t-sky-500',
    badge: 'bg-sky-100 text-sky-700 border-sky-400 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/50',
    dot: 'bg-sky-400',
    label: 'Reliability & Ordering',
  },
  control: {
    ring: 'border-amber-200 dark:border-amber-500/25',
    bg: 'bg-amber-50/70 dark:bg-amber-500/[0.06]',
    top: 'border-t-amber-400 dark:border-t-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-400 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/50',
    dot: 'bg-amber-400',
    label: 'Flow & Congestion Control',
  },
  termination: {
    ring: 'border-rose-200 dark:border-rose-500/25',
    bg: 'bg-rose-50/70 dark:bg-rose-500/[0.06]',
    top: 'border-t-rose-400 dark:border-t-rose-500',
    badge: 'bg-rose-100 text-rose-700 border-rose-400 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/50',
    dot: 'bg-rose-400',
    label: 'Connection Termination',
  },
}

const CALLOUT = {
  interview: { border: 'border-blue-200 dark:border-blue-500/25', bg: 'bg-blue-50/70 dark:bg-blue-500/[0.06]', text: 'text-blue-600 dark:text-blue-300' },
  remember: { border: 'border-emerald-200 dark:border-emerald-500/25', bg: 'bg-emerald-50/70 dark:bg-emerald-500/[0.06]', text: 'text-emerald-600 dark:text-emerald-300' },
  warning: { border: 'border-red-200 dark:border-red-500/25', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-300' },
}

/* ---------- shared visual primitives (identical to Part 1 / Part 2) ---------- */

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

function SyllabusGroup({ label, items }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-col gap-2">
        {items.map(([topic, status]) => (
          <div key={topic} className="flex items-center justify-between rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-sm sm:text-base">
            <span className="text-gray-700 dark:text-gray-300">{topic}</span>
            <span className="font-mono font-bold text-gray-900 dark:text-white">{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SyllabusListGroup({ label, items, status }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3.5">
        <Bullets items={items} />
        <div className="mt-3 flex justify-end">
          <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">{status}</span>
        </div>
      </div>
    </div>
  )
}

/* ---------- page ---------- */

function Part3() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrollTop = h.scrollTop || document.body.scrollTop
      const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      {/* scroll progress — the signal moving through the wire */}
      <div className="fixed top-0 left-0 h-[3px] bg-amber-500 z-50 print:hidden" style={{ width: `${progress}%` }} />

      {/* Header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-16">
          <div className="flex items-start justify-between gap-4 sm:gap-8">
            <div className="min-w-0">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
                🌐 Computer Networks · Field Notes
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-mono">
                TCP: Handshake to TIME_WAIT — Part 3
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
            Hops 30–44: the 3-way handshake, sequence numbers and cumulative ACKs, loss and out-of-order recovery, duplicate ACKs, flow and congestion control, slow start, and how TCP tears a connection down.
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

        {/* 30 */}
        <Section number={30} title="TCP Connection + 3-Way Handshake" category="handshake">
          <div>
            <Label>What</Label>
            <P>TCP establishes a connection between two endpoints before reliably transferring data.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>TCP needs both sides to agree that communication can begin and establish initial connection state.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Client: SYN →', 'Server: SYN + ACK ←', 'Client: ACK →', 'Connection established']} />
          </div>
          <div>
            <Label>Meanings</Label>
            <Bullets
              items={[
                'SYN → "I want to establish a connection."',
                'SYN + ACK → "I received your request and I\'m ready."',
                'ACK → "I received your response."',
              ]}
            />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think TCP connection establishment is just "Client connects to server." TCP needs both sides to exchange control information before normal data transfer.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP uses a 3-way handshake to establish the connection and synchronize the initial sequence numbers between both sides.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            SYN → SYN+ACK → ACK = TCP connection establishment.
          </Callout>
        </Section>

        {/* 31 */}
        <Section number={31} title="TCP Sequence Numbers" category="reliability">
          <div>
            <Label>What</Label>
            <P>TCP sequence numbers identify the position of bytes in the TCP byte stream.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>TCP needs to track ordering, detect missing/duplicate data, and know exactly which bytes have been received.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`ABC\n↓\n\nA → sequence 1000\nB → sequence 1001\nC → sequence 1002\n\nNext byte:\n1003\n\nABC\n↓\n1000 → 1001 → 1002\n                 ↓\n          next expected = 1003`}</CodeBox>
          </div>
          <P>The important point: TCP sequence numbers track BYTES, not simply packet numbers.</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think: "Packet 1 = sequence 1, packet 2 = sequence 2." TCP sequence numbers represent positions in the byte stream.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP uses sequence numbers to provide ordered byte-stream delivery and identify which data has been received or lost.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Sequence number = position of the byte in the TCP stream.
          </Callout>
        </Section>

        {/* 32 */}
        <Section number={32} title="TCP ACK = Next Byte Expected" category="reliability">
          <div>
            <Label>What</Label>
            <P>A TCP ACK generally indicates the next byte the receiver expects to receive in order.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>It allows the sender to know how much of the byte stream has been received contiguously.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`ABC:\n1000, 1001, 1002\n\nReceiver gets ABC.\n\nNext expected:\n1003\n\nTherefore:\n\nACK = 1003\n\nMeaning:\n"Everything before 1003 has been received; I now expect 1003."`}</CodeBox>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`ABC | DEF | GHI\n\nABC received:\n        ↓\nACK = DEF's first sequence number\n\nIf DEF then arrives:\n        ↓\nACK moves forward`}</CodeBox>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            ACK is NOT necessarily "the number of the last byte received." In this model, ACK means "the next byte I expect."
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP uses cumulative acknowledgements; the ACK number tells the sender the next byte expected in sequence.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            ACK = NEXT expected byte.
          </Callout>
        </Section>

        {/* 33 */}
        <Section number={33} title="TCP Lost Data + Retransmission" category="reliability">
          <div>
            <Label>What</Label>
            <P>If TCP data is lost, TCP can retransmit the missing data.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>TCP promises reliable delivery, so missing data cannot simply be ignored.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`ABC | DEF | GHI\n\nABC → received ✅\nDEF → LOST ❌\nGHI → received\n\nReceiver is still waiting for DEF.\n\nSo ACK remains at:\n\nACK = DEF's sequence number\n\nSender eventually detects the loss and retransmits DEF.\n\nDEF → retransmitted\n        ↓\nReceiver gets it\n        ↓\nACK advances`}</CodeBox>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think TCP automatically knows the exact moment a packet was lost. It infers loss using mechanisms such as duplicate ACKs and retransmission timeout.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP detects possible loss through mechanisms such as timeout and duplicate ACKs, then retransmits the missing data.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Lost data → detect → retransmit → ACK advances.
          </Callout>
        </Section>

        {/* 34 */}
        <Section number={34} title="Out-of-Order TCP Data" category="reliability">
          <div>
            <Label>What</Label>
            <P>TCP data can arrive out of order because different segments can take different paths or experience different delays.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>TCP allows multiple segments/bytes to be in flight simultaneously.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`Sender:\n\nABC | DEF | GHI | JKL\n\nSuppose:\n\nABC → received ✅\nDEF → LOST ❌\nGHI → received ✅\nJKL → received ✅\n\nReceiver:\n\nABC  ✅\nDEF  ❌  ← gap\nGHI  ✅  ← buffered\nJKL  ✅  ← buffered\n\nThe receiver still needs DEF before the stream can become\nfully contiguous.\n\nTherefore:\n\nACK = DEF's sequence number\n\nAfter DEF arrives:\n\nABC | DEF | GHI | JKL\n        ↓\nAll contiguous\n        ↓\nACK advances`}</CodeBox>
          </div>
          <div>
            <Label>Mistake</Label>
            <WrongRight wrong="TCP discards every non-contiguous segment." right="TCP can buffer out-of-order data. The important thing is that TCP presents an ordered byte stream to the application." />
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP can receive and buffer out-of-order data, but cumulative ACK progress cannot move past a missing gap.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            GHI can arrive before DEF → buffer GHI → wait for DEF.
          </Callout>
        </Section>

        {/* 35 */}
        <Section number={35} title="Duplicate ACK + Fast Retransmit" category="reliability">
          <div>
            <Label>What</Label>
            <P>When later data arrives while an earlier byte is still missing, the receiver can repeatedly acknowledge the same next expected byte.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>The sender gets a signal that something before the received data may be missing.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`ABC | DEF | GHI | JKL\n\nDEF → LOST\n\nReceiver gets:\n\nABC ✅\nGHI ✅\nJKL ✅\n\nReceiver still expects DEF:\n\nACK = DEF\n\nMore out-of-order data arrives:\n        ↓\nACK = DEF\nACK = DEF\nACK = DEF\n\nThese repeated ACKs are duplicate ACKs.\n\nTCP can use multiple duplicate ACKs as a signal to retransmit\nthe suspected missing data without waiting for a timeout.\n\nDEF → retransmitted\n        ↓\nReceiver now has:\n\nABC | DEF | GHI | JKL\n        ↓\nACK jumps forward`}</CodeBox>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            The sender does NOT resend the entire sliding window just because DEF was lost. It can identify the missing data and retransmit it.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Duplicate ACKs can provide an earlier indication of loss and allow TCP to perform fast retransmission instead of waiting for the retransmission timeout.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Repeated ACK for the same gap → likely missing data.
          </Callout>
        </Section>

        {/* 36 */}
        <Section number={36} title="TCP Retransmission Timeout" category="reliability">
          <div>
            <Label>What</Label>
            <P>TCP retransmits data when the expected acknowledgement does not arrive within an estimated timeout.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>If there are not enough duplicate ACKs to quickly detect loss, TCP still needs another way to recover.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Data', 'Sender waits for ACK', "ACK doesn't arrive in time", 'Retransmission Timeout', 'Retransmit']} />
            <div className="mt-3">
              <P>TCP uses network timing information rather than one universal fixed timeout.</P>
            </div>
          </div>
          <div>
            <Label>Important terms</Label>
            <Bullets
              items={[
                'Round-Trip Time (RTT) → time for data to travel to the receiver and for the response to come back.',
                'Retransmission Timeout (RTO) → timeout used before TCP decides it may need retransmission.',
              ]}
            />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think TCP has one fixed timeout such as "wait exactly 1 second." Network delay changes, so TCP estimates timing.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP uses retransmission timeout as a loss-recovery mechanism when acknowledgements don't arrive within the estimated time.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            No ACK in expected time → timeout → retransmit.
          </Callout>
        </Section>

        {/* 37 */}
        <Section number={37} title="TCP Flow Control" category="control">
          <div>
            <Label>What</Label>
            <P>TCP flow control prevents a fast sender from overwhelming the receiver.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>The receiver has finite buffer/memory and may process data slower than the sender.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Fast Sender', 'Too much data', 'Slow Receiver', 'Receiver buffer can fill']} />
            <div className="mt-3">
              <P>TCP uses the Receive Window (rwnd) to communicate how much additional data the receiver can currently handle.</P>
            </div>
            <div className="mt-3">
              <FlowChart steps={['Sender', 'Receive Window', 'Controls outstanding data']} />
            </div>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Flow control is NOT mainly about protecting the network. It protects the RECEIVER.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP flow control uses the receiver's advertised window to prevent the sender from overwhelming the receiver.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Receive Window → protects receiver.
          </Callout>
        </Section>

        {/* 38 */}
        <Section number={38} title="TCP Sliding Window" category="control">
          <div>
            <Label>What</Label>
            <P>TCP allows multiple bytes of data to be in flight instead of waiting for an ACK after every segment.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Waiting for every ACK would waste network capacity, especially when there is network delay.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`Sender:\n\nABC | DEF | GHI | JKL\n        ↓\nMultiple data pieces can be in flight\n\nSuppose the window allows:\n\n[ ABC | DEF | GHI ]\n\nABC gets acknowledged:\n\nABC → ACK received\n        ↓\nWindow slides:\n\n[ DEF | GHI | JKL ]\n\nNow JKL can be sent.\n\n"Sliding" means the range of allowed unacknowledged data moves\nforward as ACKs arrive.`}</CodeBox>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            A TCP window is fundamentally measured in BYTES, not simply "number of packets."
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Sliding window improves throughput by allowing multiple bytes to be outstanding before acknowledgements arrive.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            ACK arrives → old data leaves window → new data enters.
          </Callout>
        </Section>

        {/* 39 */}
        <Section number={39} title="Sliding Window + Out-of-Order Buffering" category="control">
          <P>Important combined mental model.</P>
          <div>
            <Label>What</Label>
            <P>Sliding Window allows multiple pieces of data to be in flight, so later data can arrive before earlier data.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>This is why TCP can have situations where GHI and JKL arrive while DEF is missing.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <CodeBox>{`Sender:\n\nABC | DEF | GHI | JKL\n        ↓\nDEF lost\n\nReceiver:\n\nABC ✅\nDEF ❌\nGHI ✅ → BUFFER\nJKL ✅ → BUFFER\n\nReceiver continues acknowledging:\n\nACK = DEF\n\nThe sender may receive duplicate ACKs for DEF.\n\n        ↓\n\nDEF retransmitted\n        ↓\n\nReceiver:\n\nABC | DEF | GHI | JKL\n        ↓\nContiguous\n        ↓\nACK advances\n        ↓\nWindow slides forward`}</CodeBox>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            The sender does NOT simply "restart the whole window from DEF." TCP can retransmit the missing data while already-received out-of-order data remains buffered.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            This example connects sliding window, cumulative ACKs, out-of-order buffering, duplicate ACKs, retransmission and window advancement.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            DEF lost → GHI/JKL buffered → ACK stays at DEF → DEF arrives → ACK jumps → window slides.
          </Callout>
        </Section>

        {/* 40 */}
        <Section number={40} title="Congestion Control" category="control">
          <div>
            <Label>What</Label>
            <P>TCP controls how much data it puts into the network to avoid overloading the network.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Even if the receiver can handle huge amounts of data, the network path itself has limited capacity.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Many senders', 'Network routers/links', 'Limited capacity', 'Queues fill', 'Delay / packet loss', 'Congestion']} />
            <div className="mt-3">
              <P>TCP uses a Congestion Window (cwnd) to limit how much data can be in flight based on its estimate of network capacity.</P>
            </div>
          </div>
          <div>
            <Label>So conceptually</Label>
            <CodeBox>{`Effective sending window\n=\nmin(Receive Window, Congestion Window)`}</CodeBox>
            <div className="mt-3">
              <TwoCol left={<span>Receive Window → receiver capacity</span>} right={<span>Congestion Window → estimated network capacity</span>} />
            </div>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            <div className="flex flex-col gap-1">
              <span>Don't mix these:</span>
              <TwoCol left={<span>Flow Control → protects receiver</span>} right={<span>Congestion Control → protects network</span>} />
            </div>
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP uses congestion control to adapt its sending rate based on signals from the network such as loss and delay.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Receive Window → receiver. Congestion Window → network.
          </Callout>
        </Section>

        {/* 41 */}
        <Section number={41} title="Slow Start + Congestion Avoidance" category="control">
          <div>
            <Label>Slow Start — What</Label>
            <P>TCP initially increases its Congestion Window rapidly while discovering how much traffic the network can handle.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>At the beginning, TCP does not know the capacity of the path.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Small Congestion Window', 'Send data', 'ACKs arrive', 'Increase window', 'More data in flight']} />
            <div className="mt-3 flex flex-col gap-1">
              <P>The growth is rapid during the initial phase.</P>
              <P>"Slow Start" does NOT mean TCP always sends slowly.</P>
            </div>
          </div>
          <div>
            <Label>Congestion Avoidance — What</Label>
            <P>After the initial rapid-growth phase, TCP increases its sending capacity more gradually.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Slow Start', 'Rapid growth', 'Congestion Avoidance', 'Gradual growth', 'Congestion/loss detected', 'Reduce / adjust sending rate']} />
            <div className="mt-3">
              <P>We only need the conceptual behaviour for SDE-1; exact TCP implementation formulas are not necessary here.</P>
            </div>
          </div>
          <div>
            <Label>Mistake</Label>
            <WrongRight
              wrong="Slow Start = TCP permanently sends slowly."
              right="No. It starts cautiously and then increases its sending capacity rapidly."
            />
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP starts cautiously because it doesn't know network capacity, then increases the sending window while observing the network.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Slow Start → discover capacity quickly. Congestion Avoidance → grow more carefully.
          </Callout>
        </Section>

        {/* 42 */}
        <Section number={42} title="TCP Connection Termination" category="termination">
          <div>
            <Label>What</Label>
            <P>TCP normally closes a connection using FIN and ACK messages, with each direction closed independently.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>TCP is full-duplex, so the two directions of communication can be closed separately.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart
              direction="vertical"
              steps={['Client: FIN →', 'Server: ACK ←', 'Server may still send data', 'Server: FIN ←', 'Client: ACK →', 'Connection closed']}
            />
          </div>
          <div>
            <Label>Meanings</Label>
            <Bullets items={['FIN → "I\'m finished sending."', 'ACK → "I received your FIN."']} />
          </div>
          <P>The server can continue sending data after acknowledging the client's FIN, because only the client's sending direction has been closed.</P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think one FIN instantly kills both directions. TCP is full-duplex.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP normally needs four messages to close because each direction can be terminated independently.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            TCP opening → 3-way. TCP normal closing → usually 4 messages.
          </Callout>
        </Section>

        {/* 43 */}
        <Section number={43} title="FIN vs RST" category="termination">
          <div>
            <Label>FIN — What</Label>
            <P>FIN is used for graceful TCP connection termination.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>FIN → "I'm done sending data." The other side ACKs it and can still send remaining data before its own FIN.</P>
          </div>
          <div>
            <Label>RST (Reset) — What</Label>
            <P>RST is used for an abrupt/reset-style termination.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>RST → "Reset this connection." It is different from the normal graceful FIN-based shutdown.</P>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            FIN ≠ RST. FIN is the normal graceful closing mechanism. RST represents an abrupt/reset-style termination.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            FIN is used for graceful TCP shutdown; RST is used to reset/abort a connection rather than performing the normal graceful close.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            FIN → graceful close. RST → reset/abort.
          </Callout>
        </Section>

        {/* 44 */}
        <Section number={44} title="TIME_WAIT" category="termination" isLast>
          <div>
            <Label>What</Label>
            <P>TIME_WAIT is a TCP state entered by the side that actively closes the connection after sending the final ACK.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>It gives delayed packets from the old connection time to disappear and allows the final ACK to be retransmitted if needed.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Connection closing', 'Final ACK', 'TIME_WAIT', 'Eventually closed completely']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't think TIME_WAIT means: "The server is waiting for the other server." It is a TCP endpoint state associated commonly with the side that actively closes the connection.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TIME_WAIT helps prevent delayed packets from an old connection from interfering with a later connection using the same connection identity and allows recovery if the final ACK needs to be retransmitted.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            TIME_WAIT → old packets die out + final ACK can be repeated.
          </Callout>
        </Section>

        {/* connection — TCP reliability */}
        <section className="mb-7 print:break-inside-avoid">
          <h2 className="font-mono text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-5">Connection — TCP Reliability</h2>
          <FlowChart direction="vertical" steps={['Application data', 'TCP', 'Sequence Numbers', 'ACKs', 'Missing data detected', 'Retransmission', 'Ordered byte stream']} />
          <div className="mt-4">
            <Label>With Sliding Window</Label>
            <div className="mt-3">
              <FlowChart direction="vertical" steps={['Multiple bytes in flight', 'Out-of-order arrival possible', 'Buffer later data', 'Wait for missing data', 'ACK advances when contiguous']} />
            </div>
          </div>
        </section>

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
              "UDP is connectionless and lightweight and does not provide TCP's built-in reliability/order.",
              'Server applications commonly listen on known ports such as 80, 443, 22 and 53.',
              'Clients commonly use ephemeral source ports.',
              'TCP connections are commonly identified by Source IP + Source Port + Destination IP + Destination Port.',
              'A socket is NOT another port number.',
              'Port = number. Socket = OS-managed communication abstraction/object.',
              'One listening server port can handle many simultaneous TCP connections because each connection has separate state and connection identity.',
              'TCP uses a 3-way handshake: SYN → SYN+ACK → ACK.',
              'TCP sequence numbers track byte positions, not simply packet numbers.',
              'TCP ACK generally means: "This is the next byte I expect."',
              'TCP can buffer out-of-order data.',
              'If DEF is lost but GHI and JKL arrive: GHI/JKL can remain buffered while ACK stays at DEF.',
              'Duplicate ACKs can indicate missing data and allow fast retransmission.',
              "If the expected ACK doesn't arrive in time, TCP can use retransmission timeout to recover.",
              'Flow Control protects the receiver. Receive Window communicates receiver capacity.',
              'Sliding Window allows multiple bytes to be in flight, improving throughput.',
              'Congestion Control protects the network. Congestion Window limits data based on estimated network capacity.',
              'Conceptually: Effective sending window = min(Receive Window, Congestion Window).',
              'Slow Start increases the sending window rapidly while TCP discovers network capacity.',
              'Congestion Avoidance increases it more gradually.',
              'TCP normally closes with: FIN → ACK → FIN → ACK.',
              'FIN = graceful close. RST = reset/abrupt termination.',
              'TIME_WAIT gives delayed packets time to disappear and allows recovery if the final ACK needs retransmission.',
              'The main TCP reliability chain is: Sequence Numbers → ACKs → Loss Detection → Retransmission → Ordered Byte Stream.',
            ]}
          />
        </RevisionPanel>

        <RevisionPanel title="⚠️ Mistakes I Should Never Repeat" className="border-2 border-dashed border-red-200 dark:border-red-500/30 bg-red-50/40 dark:bg-red-500/[0.04]">
          <div className="flex flex-col gap-7">
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">1. TCP vs UDP</p>
              <WrongRight wrong={`"TCP is better than UDP."`} right="They solve different requirements and make different trade-offs." />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">2. Client-side ports</p>
              <WrongRight
                wrong={`"Port 443 means every device involved uses port 443."`}
                right="443 is commonly the server's destination/listening port; clients normally use ephemeral source ports."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">3. Port vs socket</p>
              <WrongRight wrong={`"A port is the same thing as a socket."`} right="Port is a number; socket is an OS communication abstraction." />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">4. Port ≠ irrelevant once a socket exists</p>
              <WrongRight
                wrong={`"50001 is not a port because it is related to a socket."`}
                right="50001 IS the port number. The socket uses/contains that endpoint information and manages communication state."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">5. Socket as identifier</p>
              <WrongRight
                wrong={`"A socket is just another identifier replacing the port."`}
                right="No. A socket represents the communication endpoint/object and its associated state."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">6. Shared server ports</p>
              <WrongRight
                wrong={`"One server port means only one client can connect."`}
                right="Many TCP connections can share the same server port because their connection identities differ."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">7. Out-of-order data</p>
              <WrongRight wrong="TCP discards all non-contiguous data." right="TCP can buffer out-of-order data; the application receives the ordered byte stream." />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">8. ACK meaning</p>
              <WrongRight wrong="ACK means the last byte received." right="The cumulative ACK generally identifies the NEXT byte expected." />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">9. Retransmission scope</p>
              <WrongRight
                wrong="If DEF is lost, TCP resends the whole window."
                right="TCP can identify the missing data and retransmit it while already-received out-of-order data remains buffered."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">10. Flow vs congestion control</p>
              <WrongRight wrong="Flow control and congestion control are the same." right="Flow control protects the receiver; congestion control protects the network." />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">11. Slow Start</p>
              <WrongRight wrong="Slow Start means TCP always sends slowly." right="It starts cautiously but increases rapidly while discovering network capacity." />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">12. FIN scope</p>
              <WrongRight
                wrong="A FIN immediately closes the entire TCP connection."
                right="TCP is full-duplex; one direction can close while the other continues sending."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">13. TIME_WAIT</p>
              <WrongRight
                wrong="TIME_WAIT means the server is simply waiting."
                right="TIME_WAIT is a TCP state used after active close for delayed-packet cleanup and final-ACK reliability."
              />
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="🎤 Interview Rules" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-4">
            <QA q="Why do we need Transport Layer if IP exists?" a="IP provides host-to-host delivery; Transport Layer provides endpoint/process-level communication and transport services." />
            <QA q="How can one server port handle thousands of connections?" a="Each TCP connection has its own connection identity/state, commonly distinguished by the 4-tuple." />
            <QA q="What is the difference between a port and a socket?" a="A port is a transport-layer number; a socket is the OS/application abstraction used to communicate and maintain the associated network communication state." />
            <QA q="What is a 4-tuple?" a="Source IP + Source Port + Destination IP + Destination Port." />
            <QA q="Why does a client need an ephemeral port?" a="To distinguish its outgoing communication from other simultaneous connections." />
            <QA q="Is TCP always better than UDP?" a="No. TCP prioritizes reliable ordered delivery; UDP provides simpler, connectionless transport with fewer built-in guarantees." />
            <QA q="How does TCP establish a connection?" a="Through the 3-way handshake: SYN → SYN+ACK → ACK." />
            <QA q="What does the TCP sequence number represent?" a="The position of bytes in the TCP byte stream." />
            <QA q="What does ACK 1003 mean?" a="The receiver has received everything up to byte 1002 in sequence and expects byte 1003 next." />
            <QA q="What happens if DEF is lost but GHI arrives?" a="GHI can be buffered; the cumulative ACK stays at DEF until the missing data arrives." />
            <QA q="How does TCP detect a missing segment?" a="Through mechanisms such as duplicate ACKs and retransmission timeout." />
            <QA q="Why use a sliding window?" a="To keep multiple bytes in flight and improve throughput instead of waiting for an ACK after every segment." />
            <QA q="Flow control vs congestion control?" a="Flow control protects the receiver; congestion control protects the network." />
            <QA q="What is the purpose of the Congestion Window?" a="It limits how much data TCP allows in flight based on its estimate of network capacity." />
            <QA q="Why does TCP use Slow Start?" a="It initially doesn't know the network path's capacity, so it starts cautiously and increases its sending capacity while observing the network." />
            <QA q="Why does TCP normally need four messages to close?" a="Because TCP is full-duplex; each direction can be closed independently." />
            <QA q="FIN vs RST?" a="FIN is graceful termination; RST abruptly resets the connection." />
            <QA q="Why TIME_WAIT?" a="To let delayed old packets expire and allow retransmission of the final ACK if necessary." />
          </div>
        </RevisionPanel>

        <RevisionPanel title="🧩 Mental Models">
          <div className="flex flex-col gap-7">
            <div>
              <Label>Model 1</Label>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['IP — which machine?', 'Port — which transport endpoint?', 'Socket — OS communication interface/object', 'TCP connection — specific communication session']} />
              </div>
            </div>
            <div>
              <Label>Model 2</Label>
              <div className="mt-3">
                <FlowChart
                  direction="vertical"
                  steps={[
                    'ABC | DEF | GHI | JKL', 'DEF LOST', 'GHI + JKL buffered', 'ACK stays at DEF',
                    'DEF retransmitted', 'ABC | DEF | GHI | JKL', 'ACK advances', 'Window slides',
                  ]}
                />
              </div>
            </div>
            <div>
              <Label>Model 3</Label>
              <div className="mt-3">
                <TwoCol
                  left={
                    <div className="flex flex-col gap-1">
                      <span className="font-mono font-bold">Flow Control</span>
                      <span>↓ Receive Window</span>
                      <span>↓ Protect receiver</span>
                    </div>
                  }
                  right={
                    <div className="flex flex-col gap-1">
                      <span className="font-mono font-bold">Congestion Control</span>
                      <span>↓ Congestion Window</span>
                      <span>↓ Protect network</span>
                    </div>
                  }
                />
                <div className="mt-3">
                  <CodeBox>{`min of both\n     ↓\nEffective sending window`}</CodeBox>
                </div>
              </div>
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="⚡ Rapid Revision" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-3.5">
            <QA q="What does SYN do?" a="Requests TCP connection establishment." />
            <QA q="What does SYN+ACK mean?" a="Server received SYN and acknowledges it while sending its own synchronization information." />
            <QA q="What completes the handshake?" a="Client's ACK." />
            <QA q="TCP sequence number represents what?" a="Byte position in the TCP stream." />
            <QA q="What does ACK 1003 mean?" a="Byte 1003 is the next expected byte." />
            <QA q="DEF lost but GHI arrives?" a="GHI can be buffered while ACK remains at DEF." />
            <QA q="Why can GHI arrive before DEF?" a="Multiple data pieces can be in flight and can experience different delays/loss." />
            <QA q="What can repeated ACKs indicate?" a="Earlier data may be missing." />
            <QA q="What is fast retransmit?" a="Retransmission triggered by duplicate ACKs before waiting for a timeout." />
            <QA q="What happens if ACK doesn't arrive in time?" a="Retransmission timeout can trigger retransmission." />
            <QA q="What does Flow Control protect?" a="Receiver." />
            <QA q="What does Congestion Control protect?" a="Network." />
            <QA q="What is the Receive Window?" a="Receiver-advertised capacity for additional data." />
            <QA q="What is the Congestion Window?" a="Sender-side estimate of how much data the network can handle." />
            <QA q="Why sliding window?" a="Multiple bytes can be in flight simultaneously." />
            <QA q="What happens when ACKs arrive?" a="The sending window can move/slide forward." />
            <QA q="Slow Start?" a="Start cautiously and increase sending capacity rapidly." />
            <QA q="Congestion Avoidance?" a="Increase sending capacity more gradually." />
            <QA q="Normal TCP closing?" a="FIN → ACK → FIN → ACK." />
            <QA q="FIN?" a="Graceful close of one direction." />
            <QA q="RST?" a="Abrupt/reset-style termination." />
            <QA q="Why TIME_WAIT?" a="Delayed-packet cleanup and final-ACK reliability." />
          </div>
        </RevisionPanel>

        <RevisionPanel title="📍 Syllabus Position">
          <div className="flex flex-col gap-5">
            <SyllabusGroup
              label="Network Layer"
              items={[
                ['IP / MAC', '✅'], ['Subnetting', '✅'], ['ARP', '✅'], ['Gateway', '✅'], ['NAT', '✅'],
                ['Routing', '✅'], ['Default Route', '✅'], ['Longest Prefix Match', '✅'], ['TTL', '✅'],
                ['ICMP', '✅'], ['MTU / Fragmentation', '✅'],
              ]}
            />
            <SyllabusGroup
              label="Transport Layer"
              items={[
                ['Overview', '✅'], ['Ports', '✅'], ['TCP vs UDP overview', '✅'], ['Client/server ports', '✅'],
                ['Ephemeral ports', '✅'], ['4-tuple', '✅'], ['Sockets', '✅'], ['Listening sockets', '✅'], ['Port vs Socket', '✅'],
              ]}
            />
            <SyllabusGroup
              label="Deep TCP/UDP"
              items={[
                ['TCP connection + 3-way handshake', '✅'], ['Sequence numbers', '✅'], ['ACKs', '✅'],
                ['Lost data / retransmission', '✅'], ['Out-of-order data', '✅'], ['Duplicate ACKs', '✅'],
                ['Fast Retransmit', '✅'], ['Retransmission Timeout', '✅'], ['Flow Control', '✅'],
                ['Sliding Window', '✅'], ['Out-of-order buffering', '✅'], ['Congestion Control', '✅'],
                ['Slow Start', '✅'], ['Congestion Avoidance', '✅'], ['Connection termination', '✅'],
                ['FIN vs RST', '✅'], ['TIME_WAIT', '✅'],
              ]}
            />
            <SyllabusGroup
              label="Application Layer"
              items={[
                ['DNS', '🔜'], ['HTTP', '🔜'], ['HTTPS / TLS', '🔜'], ['Cookies / Sessions', '🔜'],
                ['Authentication basics', '🔜'], ['REST APIs', '🔜'], ['WebSockets', '🔜'], ['Caching', '🔜'], ['CDN', '🔜'],
              ]}
            />
            <SyllabusGroup
              label="Security"
              items={[
                ['Encryption basics', '🔜'], ['Symmetric vs Asymmetric', '🔜'], ['Hashing', '🔜'],
                ['Digital Signatures', '🔜'], ['Certificates', '🔜'], ['TLS deeper concepts', '🔜'],
                ['CORS', '🔜'], ['Common web/network attacks', '🔜'],
              ]}
            />
            <SyllabusGroup
              label="Performance / Distributed"
              items={[
                ['Proxy', '🔜'], ['Reverse Proxy', '🔜'], ['Load Balancer', '🔜'], ['CDN', '🔜'],
                ['Caching strategies', '🔜'], ['Connection pooling', '🔜'], ['Compression', '🔜'],
              ]}
            />
            <SyllabusListGroup
              label="Practical / Interview Flows"
              items={[
                'What happens when you type google.com?',
                'DNS → TCP → TLS → HTTP',
                'HTTP request lifecycle',
                'Connection failures',
                'DNS failures',
                'TCP vs UDP decisions',
                'Network debugging scenarios',
              ]}
              status="🔜"
            />
            <SyllabusListGroup
              label="Final Revision"
              items={['Interview questions', 'Common traps', 'Rapid revision', 'SDE-1 cheat sheet']}
              status="🔜"
            />
            <div className="rounded-lg bg-gray-900 dark:bg-white/10 px-4 py-3.5 text-sm sm:text-base text-white">
              Next → Application Layer → DNS
            </div>
          </div>
        </RevisionPanel>

      </main>

      <style>{`
        @media print {
          @page { margin: 16mm 14mm; }
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  )
}

export default Part3