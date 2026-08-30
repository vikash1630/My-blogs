import React, { useEffect, useState } from 'react'

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
  transport: {
    ring: 'border-sky-200 dark:border-sky-500/25',
    bg: 'bg-sky-50/70 dark:bg-sky-500/[0.06]',
    top: 'border-t-sky-400 dark:border-t-sky-500',
    badge: 'bg-sky-100 text-sky-700 border-sky-400 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/50',
    dot: 'bg-sky-400',
    label: 'Transport Layer',
  },
  transition: {
    ring: 'border-violet-200 dark:border-violet-500/25',
    bg: 'bg-violet-50/70 dark:bg-violet-500/[0.06]',
    top: 'border-t-violet-400 dark:border-t-violet-500',
    badge: 'bg-violet-100 text-violet-700 border-violet-400 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/50',
    dot: 'bg-violet-400',
    label: 'Transition (Socket)',
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

/* ---------- shared visual primitives (identical to Part 1) ---------- */

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

function Part2() {
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
                Transport Layer &amp; Sockets — Part 2
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
            Hops 19–29: NAT's unresolved port problem, why the Transport Layer exists, ports, TCP vs UDP, ephemeral ports, the 4-tuple, and how sockets bridge applications to the network.
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

        {/* 19 */}
        <Section number={19} title="NAT → Port Numbers" category="resolve">
          <div>
            <Label>What</Label>
            <P>NAT (Network Address Translation) allows multiple devices using private IPs to communicate with the Internet through a public IP.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Private IPs are not directly routable on the public Internet. NAT lets many devices share one public IP.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart direction="vertical" steps={['Laptop A: 192.168.1.10:5001', 'Router/NAT', 'Public IP:62001']} />
            <div className="mt-4">
              <FlowChart direction="vertical" steps={['Laptop B: 192.168.1.11:5002', 'Router/NAT', 'Public IP:62002']} />
            </div>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`192.168.1.10:5001 → PublicIP:62001\n192.168.1.11:5002 → PublicIP:62002`}</CodeBox>
            <div className="mt-3">
              <P>The router maintains a NAT mapping so replies can be sent back to the correct internal device.</P>
            </div>
          </div>
          <Callout icon="⚠️" label="Important" color={CALLOUT.warning}>
            The port number helps NAT distinguish multiple simultaneous connections that share the same public IP.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            NAT = IP translation. Port mapping = helps distinguish different connections/endpoints.
          </Callout>
        </Section>

        {/* 20 */}
        <Section number={20} title="Transport Layer — Why Do We Need It?" category="foundational">
          <div>
            <Label>What</Label>
            <P>The Network Layer provides host-to-host delivery. The Transport Layer provides communication between applications/transport endpoints on those hosts.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>IP can deliver data to a machine, but a machine can have many applications communicating simultaneously.</P>
          </div>
          <div>
            <Label>Example</Label>
            <FieldBox fields={['Laptop 192.168.1.10', 'Chrome', 'Discord', 'VS Code', 'Game']} />
            <div className="mt-3">
              <P>IP alone cannot tell the OS which communication should receive the incoming data.</P>
            </div>
          </div>
          <div>
            <Label>Core idea</Label>
            <div className="flex flex-col gap-2.5">
              <TwoCol left={<span>IP → which host?</span>} right={<span>Port → which transport endpoint?</span>} />
              <P>TCP/UDP → how should the data be transported?</P>
            </div>
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            IP provides host-to-host delivery; the Transport Layer adds process/endpoint-level communication and transport services such as reliability, ordering, flow control and congestion control depending on the protocol.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Network Layer → "Which machine?" Transport Layer → "Which communication endpoint?"
          </Callout>
        </Section>

        {/* 21 */}
        <Section number={21} title="Port Numbers" category="transport">
          <div>
            <Label>What</Label>
            <P>A port is a 16-bit number used by TCP or UDP to identify a transport endpoint.</P>
          </div>
          <div>
            <Label>Range</Label>
            <CodeBox>{`0 → 65535\n\n192.168.1.10:5000\n\nIP   = 192.168.1.10\nPort = 5000`}</CodeBox>
          </div>
          <div>
            <Label>Why</Label>
            <P>One machine can run many network applications using the same IP address.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>IP identifies the host/interface at the Network Layer. Port identifies the transport endpoint used for communication.</P>
            <div className="mt-3">
              <CodeBox>{`192.168.1.10:443\n192.168.1.10:5000\n192.168.1.10:22\n\nSame machine/IP, different transport endpoints.`}</CodeBox>
            </div>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            A port is NOT itself an application. It is a transport-layer number used by the OS to direct communication to the appropriate endpoint/socket.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            IP = host. Port = transport endpoint.
          </Callout>
        </Section>

        {/* 22 */}
        <Section number={22} title="TCP vs UDP — Overview" category="transport">
          <div>
            <Label>TCP</Label>
            <P>Connection-oriented transport protocol designed to provide reliable and ordered delivery. Provides mechanisms for acknowledgements, retransmission, ordering, flow control, congestion control and connection management.</P>
            <div className="mt-2">
              <P>Example use: file/data transfer where losing or reordering data is generally unacceptable.</P>
            </div>
          </div>
          <div>
            <Label>UDP</Label>
            <P>Connectionless and lightweight transport protocol. UDP does NOT provide TCP's built-in reliability, ordering, retransmission, flow control or congestion control. It basically provides a simple way to send datagrams.</P>
            <div className="mt-2">
              <P>Example: some real-time applications may prefer UDP because waiting for retransmission of old data can be worse than losing it.</P>
            </div>
          </div>
          <div>
            <Label>Mistake</Label>
            <WrongRight wrong={`"TCP is better than UDP."`} right="They make different trade-offs." />
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            TCP vs UDP is not "reliable vs unreliable" only. The real question is what transport behaviour the application requires.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            TCP → reliability + ordering + connection. UDP → lightweight + connectionless + application decides what additional reliability it needs.
          </Callout>
        </Section>

        {/* 23 */}
        <Section number={23} title="Server Ports — Well-Known Ports" category="transport">
          <div>
            <Label>What</Label>
            <P>Servers commonly listen on known ports so clients know where to contact a particular service.</P>
          </div>
          <div>
            <Label>Examples</Label>
            <CodeBox>{`HTTP  → 80\nHTTPS → 443\nSSH   → 22\nDNS   → 53`}</CodeBox>
            <div className="mt-3">
              <P>server-ip:443 means the client is contacting the HTTPS service at port 443.</P>
            </div>
          </div>
          <P>Ports 0–1023 are commonly referred to as well-known ports.</P>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A server generally listens on a known port while clients usually use temporary/ephemeral source ports.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Server → known/listening port. Client → usually ephemeral port.
          </Callout>
        </Section>

        {/* 24 */}
        <Section number={24} title="Ephemeral Ports" category="transport">
          <div>
            <Label>What</Label>
            <P>A temporary port typically selected by the OS for a client's outgoing connection.</P>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`Client: 192.168.1.10:52001\nServer: 142.x.x.x:443\n\n52001 → client-side ephemeral port\n443   → server-side destination port`}</CodeBox>
          </div>
          <div>
            <Label>Why</Label>
            <P>A client can have many simultaneous connections, so each communication needs to be distinguishable.</P>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`192.168.1.10:52001 → Server A:443\n192.168.1.10:52002 → Server B:443\n192.168.1.10:52003 → Server C:443\n\nSame client IP, different source ports.`}</CodeBox>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            The client normally does NOT use port 443 just because it is connecting to HTTPS. 443 is the server's destination/listening port.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Client chooses temporary source port. Server listens on known destination port.
          </Callout>
        </Section>

        {/* 25 */}
        <Section number={25} title="4-Tuple" category="transport">
          <div>
            <Label>What</Label>
            <P>A TCP connection can be identified by four pieces of information: Source IP, Source Port, Destination IP, Destination Port.</P>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`Client: 192.168.1.10:52001\nServer: 142.x.x.x:443\n\nSource IP        = 192.168.1.10\nSource Port      = 52001\nDestination IP   = 142.x.x.x\nDestination Port = 443`}</CodeBox>
          </div>
          <div>
            <Label>Why</Label>
            <P>The server can have many simultaneous connections on the same destination port.</P>
          </div>
          <div>
            <Label>Example</Label>
            <CodeBox>{`Connection A: 192.168.1.10:52001 → 142.x.x.x:443\nConnection B: 192.168.1.10:52002 → 142.x.x.x:443\n\nThey have different source ports, so they are different connections.`}</CodeBox>
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A TCP connection is commonly identified by the source/destination IP addresses and ports.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Source IP + Source Port + Destination IP + Destination Port = 4-tuple.
          </Callout>
        </Section>

        {/* 26 */}
        <Section number={26} title="Socket" category="transition">
          <div>
            <Label>What</Label>
            <P>A socket is an OS abstraction/interface that an application uses to communicate over a network.</P>
          </div>
          <div>
            <Label>Core flow</Label>
            <FlowChart direction="vertical" steps={['Application', 'Socket', 'TCP / UDP', 'IP', 'Network']} />
          </div>
          <div>
            <Label>Why</Label>
            <P>Applications normally do not directly manipulate IP packets, frames, signals, etc. They use networking APIs provided by the OS/runtime through sockets.</P>
          </div>
          <div>
            <Label>Example — Node.js</Label>
            <CodeBox>app.listen(3000)</CodeBox>
            <div className="mt-3">
              <FlowChart direction="vertical" steps={['Express', 'Node.js networking APIs', 'Socket', 'TCP', 'IP', 'Network']} />
            </div>
          </div>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Socket = OS/application interface for network communication.
          </Callout>
        </Section>

        {/* 27 */}
        <Section number={27} title="Listening Socket vs Connection" category="transition">
          <div>
            <Label>Listening socket</Label>
            <P>A server creates a socket that listens for incoming connections.</P>
            <div className="mt-3">
              <FlowChart direction="vertical" steps={['socket()', 'bind(IP, port)', 'listen()', 'accept()']} />
            </div>
          </div>
          <P>bind() → Associates the socket with an address/port. listen() → Prepares a TCP socket to accept connections. accept() → Accepts an incoming TCP connection. The exact system-call implementation is not the focus yet; understand the roles.</P>
          <div>
            <Label>One listening port → many connections</Label>
            <CodeBox>{`Server: 10.0.0.5:443\n\nClient A: 192.168.1.10:50001 → 10.0.0.5:443\nClient B: 192.168.1.11:50002 → 10.0.0.5:443\nClient C: 192.168.1.12:50003 → 10.0.0.5:443`}</CodeBox>
            <div className="mt-3">
              <FieldBox fields={['Server', 'Listening socket :443', 'Connection A', 'Connection B', 'Connection C']} />
            </div>
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            One server port can handle thousands of simultaneous TCP connections because connections are distinguished using their connection information (including the 4-tuple).
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Listening socket → waits for new connections. Established connection → communicates with a specific client.
          </Callout>
        </Section>

        {/* 28 */}
        <Section number={28} title="Port vs Socket" category="transition">
          <div>
            <Label>Port</Label>
            <P>A port is a NUMBER, e.g. 50001. It is used by TCP/UDP for transport-level addressing.</P>
          </div>
          <div>
            <Label>Socket</Label>
            <P>A socket is an OS-managed COMMUNICATION ABSTRACTION/OBJECT.</P>
          </div>
          <div>
            <Label>Breakdown</Label>
            <Bullets items={['50001 → Port number', '192.168.1.10:50001 → Transport endpoint/address', 'Socket → OS communication object/interface + associated state (IP address, port, protocol, connection state)']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            A socket is NOT another port number.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Port = number. Socket = communication endpoint/object used by the OS/application.
          </Callout>
        </Section>

        {/* 29 */}
        <Section number={29} title="Why a Socket, If We Have a Port?" category="transition" isLast>
          <P>This was an important point of confusion.</P>
          <div>
            <Label>Mistake</Label>
            <WrongRight
              wrong={`"If 50001 is already a port, why do we need a socket?"`}
              right="Because the port only gives a transport-layer number. It does not represent all the state required to manage an actual communication."
            />
          </div>
          <div>
            <Label>What the OS also maintains</Label>
            <Bullets items={['Protocol (TCP/UDP)', 'Connection state', 'Peer information', 'Data waiting to be sent/received', 'TCP sequence/ACK state', 'Other communication state']} />
          </div>
          <div>
            <Label>Correct mental model</Label>
            <FlowChart direction="vertical" steps={['Port — one part of transport addressing', 'Socket — OS-managed communication endpoint/object', 'Contains/uses addressing + protocol + communication state']} />
            <div className="mt-3">
              <FlowChart direction="vertical" steps={['Client socket 192.168.1.10:50001', 'TCP connection', 'Server socket 142.x.x.x:443']} />
            </div>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Do NOT think: Port → Socket → Another Port. Think: Port = number, Socket = OS communication abstraction, Connection = specific communication between endpoints.
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            A port number alone cannot represent the complete state of a TCP communication. The OS uses socket/connection state to manage the actual communication.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            "50001 is the port. The socket is what the OS uses to actually manage communication involving that port."
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
              "UDP is connectionless and lightweight and does not provide TCP's built-in reliability/order.",
              'Server applications commonly listen on known ports such as 80, 443, 22 and 53.',
              'Clients commonly use ephemeral source ports.',
              'TCP connections are commonly identified by Source IP + Source Port + Destination IP + Destination Port.',
              'A socket is NOT another port number.',
              'Port = number. Socket = OS-managed communication abstraction/object.',
              'One listening server port can handle many simultaneous TCP connections because each connection has separate state and connection identity.',
              'Transport Layer is responsible for more than addressing: TCP provides reliability, ordering, flow control, congestion control and connection management.',
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
                right="443 is commonly the server's listening/destination port; clients normally use ephemeral source ports."
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
                <FlowChart direction="vertical" steps={['Client 192.168.1.10:50001', 'TCP', 'Server 142.x.x.x:443']} />
              </div>
            </div>
            <div>
              <Label>Model 3 — one server, many connections</Label>
              <div className="mt-3">
                <FieldBox fields={['10.0.0.5:443', 'Client A → 50001', 'Client B → 50002', 'Client C → 50003']} />
                <div className="mt-3">
                  <P>Same server port. Different client source ports/connections.</P>
                </div>
              </div>
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="⚡ Rapid Revision" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-3.5">
            <QA q="What does IP identify?" a="Network-layer host/interface destination." />
            <QA q="What does a port identify?" a="A transport endpoint." />
            <QA q="Port range?" a="0–65535." />
            <QA q="Common HTTPS port?" a="443." />
            <QA q="What port does the client usually use?" a="An ephemeral source port." />
            <QA q="What is TCP?" a="Connection-oriented, reliable and ordered transport." />
            <QA q="What is UDP?" a="Connectionless, lightweight transport without TCP's built-in reliability/order." />
            <QA q="What is a 4-tuple?" a="Source IP, source port, destination IP, destination port." />
            <QA q="What is a socket?" a="OS communication abstraction/interface used by applications." />
            <QA q="Is a socket another port?" a="No." />
            <QA q="Can multiple TCP connections use port 443?" a="Yes." />
            <QA q="Why?" a="Each connection has separate connection identity/state." />
            <QA q="What does a listening socket do?" a="Waits for incoming TCP connections." />
            <QA q="What does accept() conceptually do?" a="Accepts an incoming TCP connection." />
            <QA q="Why isn't a port enough to manage TCP communication?" a="A port is only a number; TCP communication requires connection state and other information managed by the OS." />
          </div>
        </RevisionPanel>

        <RevisionPanel title="📍 Current Syllabus Position">
          <div className="flex flex-col gap-5">
            <div>
              <Label>Network Layer</Label>
              <div className="mt-2 flex flex-col gap-2">
                {['IP / MAC', 'Subnetting', 'ARP', 'Gateway', 'NAT', 'Routing', 'Default Route', 'Longest Prefix Match', 'TTL', 'ICMP', 'MTU / Fragmentation'].map((topic) => (
                  <div key={topic} className="flex items-center justify-between rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-sm sm:text-base">
                    <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">✅</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Transport Layer</Label>
              <div className="mt-2 flex flex-col gap-2">
                {['Overview', 'Ports', 'TCP vs UDP overview', 'Client/server ports', 'Ephemeral ports', '4-tuple', 'Sockets', 'Listening sockets', 'Port vs Socket'].map((topic) => (
                  <div key={topic} className="flex items-center justify-between rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-sm sm:text-base">
                    <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">✅</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Deep TCP/UDP</Label>
              <div className="mt-2 flex flex-col gap-2">
                {['TCP connection', '3-way handshake', 'Sequence numbers', 'ACKs', 'Retransmission', 'Flow control', 'Congestion control', 'Connection termination', 'TIME_WAIT'].map((topic) => (
                  <div key={topic} className="flex items-center justify-between rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-sm sm:text-base">
                    <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">⏭️</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-gray-900 dark:bg-white/10 px-4 py-3.5 text-sm sm:text-base text-white">
              Next → TCP Connection + 3-Way Handshake
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

export default Part2