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

function Part1() {
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
                Bits to NAT — Part 1
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
            Nineteen hops through the stack, traced in the order we actually reasoned through them — plus every wrong turn worth remembering.
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

        {/* 1 */}
        <Section number={1} title="Why Networking Uses Layers" category="foundational">
          <div>
            <Label>Why</Label>
            <P>One giant networking system would be too complex to build, maintain, and upgrade.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>Divide responsibilities into layers → each layer solves a specific problem.</P>
          </div>
          <div>
            <Label>Connection</Label>
            <FlowChart steps={['Physical', 'Data Link', 'Network', 'Transport', 'Application']} />
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Layering is essentially separation of concerns applied to networking.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            One huge problem → smaller independent responsibilities.
          </Callout>
        </Section>

        {/* 2 */}
        <Section number={2} title="Bits → Signals" category="physical">
          <div>
            <Label>What</Label>
            <P>Computers work with bits; physical media carry signals.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <FlowChart steps={['Bits', 'NIC', 'physical signal']} />
            <div className="mt-4">
              <Bullets items={['Copper → electrical signal', 'Fiber → light', 'Wireless → radio']} />
            </div>
          </div>
          <P>The receiving NIC converts the signal back into bits.</P>
          <Callout icon="⚠️" label="Important clarification" color={CALLOUT.warning}>
            The switch/router does not directly reason about electrical signals. Its network interface receives the signal and converts it back into bits.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Bits exist logically; signals exist on the medium.
          </Callout>
        </Section>

        {/* 3 */}
        <Section number={3} title="NIC" category="physical">
          <div>
            <Label>What</Label>
            <P>Network Interface Card connects the device's networking stack to the physical network.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <Bullets items={['Bits ↔ signals', 'Has a MAC address', 'Sends/receives frames']} />
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Don't say "NIC converts packets into signals." More precisely, the NIC handles the physical transmission of the bits representing the frame.
          </Callout>
        </Section>

        {/* 4 */}
        <Section number={4} title="Frame vs Packet" category="datalink">
          <P>A major mental model from our discussion:</P>
          <FlowChart direction="vertical" steps={['Application Data', 'IP Packet', 'Frame', 'Bits', 'Signals']} />
          <div>
            <Label>Frame</Label>
            <P>Data Link Layer unit; contains MAC information.</P>
          </div>
          <div>
            <Label>Simplified</Label>
            <FieldBox fields={['Destination MAC', 'Source MAC', 'IP Packet', 'CRC']} />
          </div>
          <div>
            <Label>Packet</Label>
            <P>Network Layer unit; contains IP information.</P>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Frame and packet are not interchangeable terms.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Frame = local delivery. Packet = network-to-network delivery.
          </Callout>
        </Section>

        {/* 5 */}
        <Section number={5} title="MAC Address" category="datalink">
          <div>
            <Label>What</Label>
            <P>Address associated with a network interface.</P>
          </div>
          <div>
            <Label>Why</Label>
            <P>Needed for local delivery within a LAN.</P>
          </div>
          <div>
            <Label>Core idea</Label>
            <P>Switches use MAC addresses to decide which local port should receive a frame.</P>
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            MAC is not designed for Internet-scale routing.
          </Callout>
        </Section>

        {/* 6 */}
        <Section number={6} title="Hub → Switch" category="datalink">
          <div>
            <Label>Hub</Label>
            <div className="flex flex-col gap-2 mt-1">
              <P>Problem: Every device receives the transmitted signal.</P>
              <P>Result: Wasteful traffic + collisions.</P>
            </div>
          </div>
          <div>
            <Label>Switch</Label>
            <div className="flex flex-col gap-2 mt-1">
              <P>Why: Needed efficient local delivery.</P>
              <P>Core idea: Switch learns:</P>
              <CodeBox>MAC → Port</CodeBox>
              <P>and forwards a frame toward the appropriate port instead of blindly sending it everywhere.</P>
            </div>
          </div>
          <Callout icon="⭐" label="Interview" color={CALLOUT.interview}>
            <TwoCol left={<span>Switch → MAC/frame/local network</span>} right={<span>Router → IP/packet/different networks</span>} />
          </Callout>
        </Section>

        {/* 7 */}
        <Section number={7} title="Why IP Was Needed" category="network">
          <P>This was one of our most important reasoning discussions.</P>
          <div>
            <Label>Problem with only MAC</Label>
            <P>If the Internet used MAC addresses globally, routers would need knowledge such as:</P>
            <CodeBox>Billions of MAC addresses → where each one is located</CodeBox>
            <P>That doesn't scale.</P>
          </div>
          <div>
            <Label>Solution</Label>
            <P>Group devices into networks.</P>
            <P>Routers only need to know:</P>
            <CodeBox>«Which network should I send this packet toward?»</CodeBox>
            <P>IP provides a hierarchical/logical addressing system that makes routing scalable.</P>
          </div>
          <Callout icon="🧠" label="Mental model" color={CALLOUT.remember}>
            <TwoCol left={<span>MAC = local identity</span>} right={<span>IP = network location</span>} />
          </Callout>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            The important reason for IP isn't simply "MAC isn't unique." MAC can be globally unique; the problem is that MAC addresses don't provide a scalable hierarchical location structure for routing.
          </Callout>
        </Section>

        {/* 8 */}
        <Section number={8} title="IPv4" category="network">
          <div>
            <Label>What</Label>
            <P>IPv4 is a 32-bit logical address.</P>
          </div>
          <CodeBox>192.168.1.10</CodeBox>
          <P>= 4 octets × 8 bits.</P>
          <div>
            <Label>Each octet</Label>
            <CodeBox>{`00000000 → 11111111\n0        → 255`}</CodeBox>
          </div>
          <Callout icon="⭐" label="Interview" color={CALLOUT.interview}>
            IPv4 has 2³² ≈ 4.3 billion possible addresses.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            IPv4 = 32 bits = 4 × 8-bit octets.
          </Callout>
        </Section>

        {/* 9 */}
        <Section number={9} title="Why IP Can Change" category="network">
          <P>Important reasoning:</P>
          <P>A MAC identifies the network interface.</P>
          <P>An IP represents where that device belongs in the network topology.</P>
          <div>
            <Label>Move</Label>
            <FlowChart steps={['Home Network', 'College Network']} />
          </div>
          <P>The device can receive a different IP while its NIC/MAC remains the same.</P>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            <TwoCol left={<span>MAC → who/which interface</span>} right={<span>IP → where in the network</span>} />
          </Callout>
          <Callout icon="⚠️" label="Note" color={CALLOUT.warning}>
            Don't interpret this as a perfect universal identity/location analogy; it's a useful mental model for routing.
          </Callout>
        </Section>

        {/* 10 */}
        <Section number={10} title="Router" category="network">
          <div>
            <Label>What</Label>
            <P>Connects different networks.</P>
          </div>
          <div>
            <Label>Core job</Label>
            <FlowChart direction="vertical" steps={['Receive packet', 'Read destination IP', 'Check routing table', 'Choose next hop', 'Forward packet']} />
          </div>
          <P>A router may have multiple interfaces, and each interface can have its own IP and MAC.</P>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            Routers primarily make forwarding decisions using destination IP.
          </Callout>
        </Section>

        {/* 11 */}
        <Section number={11} title="Routing Table & Next Hop" category="network">
          <div>
            <Label>Why</Label>
            <P>A router may have multiple possible directions.</P>
          </div>
          <div>
            <Label>Routing table</Label>
            <P>Contains routes toward destination networks and associated next hops/interfaces.</P>
          </div>
          <div>
            <Label>Next hop</Label>
            <P>The next router/device to which the packet should be forwarded.</P>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            A router doesn't necessarily know the entire end-to-end physical path. It makes a forwarding decision for the next step based on its routing information.
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Router doesn't need the whole journey → it needs the next useful direction.
          </Callout>
        </Section>

        {/* 12 */}
        <Section number={12} title="MAC Changes at Every Router" category="transition">
          <P>This was a major doubt we resolved.</P>
          <div>
            <Label>Suppose</Label>
            <FlowChart steps={['Laptop', 'Home Router', 'ISP Router', '...', 'Server']} />
          </div>
          <P>The IP packet is carried end-to-end.</P>
          <div>
            <Label>At each router</Label>
            <OrderedSteps
              items={[
                'Old frame is removed.',
                'Router reads destination IP.',
                'Router chooses next hop.',
                'A new frame is created.',
                'New source/destination MACs are used.',
              ]}
            />
          </div>
          <div>
            <Label>Therefore</Label>
            <TwoCol left={<span>IP → usually remains end-to-end</span>} right={<span>MAC → changes at every Layer-2 hop</span>} />
          </div>
          <div>
            <Label>Your original mistake</Label>
            <WrongRight
              wrong={`"IP changes because the router uses IP."`}
              right="Correct thinking: «Router reads IP → chooses next hop → creates a new MAC frame.»"
            />
          </div>
          <P>→ Why wrong: Routers read the destination IP to make forwarding decisions; reading an address does not mean changing it.</P>
          <Callout icon="⭐" label="Rule" color={CALLOUT.interview}>
            IP decides where the packet should go; MAC delivers it across the current local link.
          </Callout>
        </Section>

        {/* 13 */}
        <Section number={13} title="Router Also Has MAC" category="network">
          <P>A router is a networking computer with multiple interfaces.</P>
          <div>
            <Label>Each interface can have</Label>
            <Bullets items={['IP address', 'MAC address']} />
          </div>
          <div>
            <Label>Example</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="font-mono font-bold text-gray-900 dark:text-white mb-2 text-sm">LAN interface</p>
                <CodeBox>{`IP  = 192.168.1.1\nMAC = AA:AA`}</CodeBox>
              </div>
              <div>
                <p className="font-mono font-bold text-gray-900 dark:text-white mb-2 text-sm">WAN interface</p>
                <CodeBox>{`IP  = Public IP\nMAC = BB:BB`}</CodeBox>
              </div>
            </div>
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            Don't imagine "the router has one MAC for everything." Think in terms of interfaces.
          </Callout>
        </Section>

        {/* 14 */}
        <Section number={14} title="ARP" category="resolve">
          <div>
            <Label>Problem</Label>
            <P>Laptop knows:</P>
            <CodeBox>Router IP = 192.168.1.1</CodeBox>
            <P>but needs:</P>
            <CodeBox>Router MAC = ?</CodeBox>
          </div>
          <div>
            <Label>Solution</Label>
            <P>ARP.</P>
          </div>
          <div>
            <Label>ARP</Label>
            <P>IP → MAC.</P>
          </div>
          <div>
            <Label>Flow</Label>
            <FlowChart
              direction="vertical"
              steps={['Check ARP cache', 'If missing: ARP Request → broadcast', 'Owner of IP → ARP Reply', 'Store mapping', 'Build frame']}
            />
          </div>
          <Callout icon="⭐" label="Interview Point" color={CALLOUT.interview}>
            ARP Request → usually broadcast on the LAN. ARP Reply → normally unicast back to requester.
          </Callout>
          <div>
            <Label>Major trap</Label>
            <WrongRight
              wrong={`"ARP finds Google's MAC."`}
              right="Your laptop only needs the MAC of its next local hop, normally the default gateway."
            />
          </div>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            ARP solves local IP → MAC resolution.
          </Callout>
        </Section>

        {/* 15 */}
        <Section number={15} title="Signals → Switch → Router" category="physical">
          <P>Physical flow we clarified:</P>
          <FlowChart
            direction="vertical"
            steps={[
              'Laptop NIC', 'Bits', 'Signals', 'Cable/Air', 'Switch NIC', 'Bits / Frame',
              'Switch forwarding', 'Switch NIC', 'Signals', 'Router NIC', 'Bits / Frame', 'Router reads IP packet',
            ]}
          />
          <P>The signal is not passed around as the router's logical input.</P>
          <P>Each receiving interface converts the physical signal back into a digital representation that the networking hardware can process.</P>
        </Section>

        {/* 16 */}
        <Section number={16} title="DNS Before Google" category="network">
          <P>When typing:</P>
          <CodeBox>google.com</CodeBox>
          <P>the browser needs Google's IP address.</P>
          <P>DNS resolves:</P>
          <CodeBox>google.com → IP address</CodeBox>
          <P>Only after obtaining the IP can the client communicate with the destination using that IP.</P>
          <div>
            <Label>Simplified flow we established</Label>
            <FlowChart
              direction="vertical"
              steps={['google.com', 'DNS lookup', 'Google IP', 'Create IP packet', 'ARP for local gateway MAC if needed', 'Frame', 'NIC → Switch → Router → ...']}
            />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            DNS is not the same thing as HTTP. DNS answers: «"What IP corresponds to this name?"»
          </Callout>
        </Section>

        {/* 17 */}
        <Section number={17} title="Public vs Private IP" category="network">
          <div>
            <Label>Problem</Label>
            <P>IPv4 has only:</P>
            <CodeBox>2³² ≈ 4.3 billion</CodeBox>
            <P>addresses.</P>
            <P>Giving every device its own public IPv4 address doesn't scale.</P>
          </div>
          <div>
            <Label>Private IP</Label>
            <P>Reserved for internal networks.</P>
            <P>Main ranges discussed:</P>
            <CodeBox>{`10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16`}</CodeBox>
            <P>Examples:</P>
            <CodeBox>{`192.168.1.10\n10.0.0.5`}</CodeBox>
            <P>Private addresses are not publicly routable across the Internet.</P>
          </div>
          <div>
            <Label>Public IP</Label>
            <P>Globally routable address used for Internet communication.</P>
          </div>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            <TwoCol left={<span>Private IP → inside network</span>} right={<span>Public IP → Internet-facing/routable</span>} />
          </Callout>
        </Section>

        {/* 18 */}
        <Section number={18} title="NAT — Part 1" category="resolve">
          <div>
            <Label>Problem</Label>
            <P>A laptop may have:</P>
            <CodeBox>192.168.1.10</CodeBox>
            <P>Google cannot directly route a response to that private address across the public Internet.</P>
          </div>
          <div>
            <Label>Solution</Label>
            <P>NAT = Network Address Translation</P>
            <P>A router translates the source private address into a public address when sending traffic outward.</P>
          </div>
          <div>
            <Label>Example</Label>
            <FlowChart direction="vertical" steps={['192.168.1.10', 'NAT', '49.204.50.18']} />
          </div>
          <P>Google sees the public address, not the laptop's private address.</P>
          <div>
            <Label>Why NAT became important</Label>
            <Bullets items={['Conserves scarce IPv4 addresses.', 'Allows many private devices to share public addressing.']} />
          </div>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.warning}>
            NAT's primary historical purpose is address conservation, not "security."
          </Callout>
          <Callout icon="🧠" label="Remember" color={CALLOUT.remember}>
            Private network hides behind public addressing through NAT.
          </Callout>
        </Section>

        {/* 19 */}
        <Section number={19} title="NAT → Port Numbers (Pending)" category="resolve" pending isLast>
          <P>We stopped here.</P>
          <div>
            <Label>The unresolved problem</Label>
            <P>Suppose:</P>
            <CodeBox>{`Laptop → Public IP\nPhone  → Same Public IP\nTV     → Same Public IP`}</CodeBox>
            <P>All three initiate connections.</P>
            <P>When responses return to the router:</P>
            <CodeBox>«How does it know which internal device gets which response?»</CodeBox>
            <P>This leads directly to port numbers and then into the Transport Layer.</P>
          </div>
          <div>
            <Label>Connection</Label>
            <FlowChart
              direction="vertical"
              steps={['Private IP', 'NAT', 'Multiple devices share public IP', 'Port numbers', 'TCP / UDP']}
            />
          </div>
        </Section>

        {/* -------- MASTER REVISION -------- */}

        <section className="rounded-2xl bg-gray-900 dark:bg-white/5 p-6 sm:p-9 text-white border border-white/10 mb-6 print:break-inside-avoid">
          <h2 className="font-mono text-xl sm:text-2xl font-extrabold mb-2">Master Revision</h2>
          <p className="text-white/70 text-base sm:text-lg">Everything above, compressed.</p>
        </section>

        <RevisionPanel title="⭐ Must Remember">
          <OrderedSteps
            items={[
              'NIC: bits ↔ physical signals.',
              'Frame: local Layer-2 delivery; contains MAC addresses.',
              'Packet: Layer-3 delivery; contains IP addresses.',
              'Switch: forwards frames using MAC.',
              'Router: forwards packets using destination IP.',
              'MAC: local delivery.',
              'IP: scalable logical/network addressing.',
              'ARP: local IP → MAC resolution.',
              'MAC changes at each router hop; IP usually remains end-to-end.',
              'Private IPs are not publicly routable.',
              'NAT translates private addressing to public addressing.',
              'NAT + shared public IP leads naturally to port-based tracking.',
            ]}
          />
        </RevisionPanel>

        <RevisionPanel title="⚠️ Frequent Mistakes" className="border-2 border-dashed border-red-200 dark:border-red-500/30 bg-red-50/40 dark:bg-red-500/[0.04]">
          <div className="flex flex-col gap-7">
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">1. MAC vs IP</p>
              <WrongRight
                wrong={`"IP changes because routers use IP."`}
                right="Router reads IP to decide the next hop; the MAC frame changes for the next local network."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">2. ARP</p>
              <WrongRight
                wrong={`"ARP finds Google's MAC."`}
                right="ARP finds the next local device's MAC, commonly the default gateway."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">3. Router</p>
              <WrongRight
                wrong={`"Router just forwards the same frame."`}
                right="Router removes the incoming frame and creates a new outgoing frame."
              />
            </div>
            <div>
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-3 text-sm">4. Switch vs Router</p>
              <WrongRight
                wrong="Both do the same addressing job."
                right="Switch → MAC → Frame → Local network. Router → IP → Packet → Different networks."
              />
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="🎤 Interview Rules" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">Rule 1</p>
              <P>Whenever explaining networking, distinguish: Frame ≠ Packet ≠ Signal</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">Rule 2</p>
              <P>When asked "Why?", explain the scaling/problem-solving reason, not just the definition.</P>
              <P>Example: «Why IP?» Not merely "IP identifies devices." Instead: «IP provides hierarchical logical addressing so routers can route between networks without maintaining global per-device MAC information.»</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">Rule 3</p>
              <P>For packet-flow questions, think:</P>
              <div className="mt-3">
                <FlowChart direction="vertical" steps={['Application', 'Packet', 'Frame', 'Bits', 'Signal']} />
              </div>
              <P>and reverse this at the receiving side.</P>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-white/5 p-4 sm:p-5">
              <p className="font-mono font-bold text-gray-900 dark:text-white mb-1 text-sm">Rule 4</p>
              <P>At every router:</P>
              <div className="mt-3">
                <FlowChart steps={['Read IP', 'choose next hop', 'new Layer-2 frame']} />
              </div>
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="🧩 Patterns">
          <div className="mb-7">
            <Label>Networking evolution pattern</Label>
            <div className="mt-3">
              <FlowChart
                direction="vertical"
                steps={[
                  'Physical signals', 'Need local organization', 'Frames + MAC', 'Need inter-network communication',
                  'IP + routers', 'Need IP→MAC mapping', 'ARP', 'IPv4 scarcity', 'Private IP', 'NAT',
                  'Shared public IP', 'Ports', 'TCP/UDP',
                ]}
              />
            </div>
          </div>
          <div>
            <Label>Problem → Solution pattern</Label>
            <div className="mt-3 flex flex-col gap-2.5">
              {[
                ['Raw signals insufficient', 'Protocols'],
                ['One giant protocol too complex', 'Layers'],
                ['Local delivery inefficient', 'Switch'],
                ["MAC doesn't scale for Internet routing", 'IP'],
                ['Router knows IP but needs local MAC', 'ARP'],
                ['IPv4 addresses scarce', 'Private IP + NAT'],
              ].map(([problem, solution], i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{problem}</span>
                  <span className="text-lg text-gray-300 dark:text-gray-600">→</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-gray-900 dark:text-white">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </RevisionPanel>

        <RevisionPanel title="⚡ Rapid Revision" className="bg-white dark:bg-white/[0.02]">
          <div className="flex flex-col gap-3.5">
            <QA q="What does NIC do?" a="Converts digital bits to/from physical signals and handles network-interface communication." />
            <QA q="What does a switch use?" a="MAC addresses." />
            <QA q="What does a router use for forwarding?" a="Destination IP." />
            <QA q="Frame or packet: which is Layer 2?" a="Frame." />
            <QA q="Frame or packet: which is Layer 3?" a="Packet." />
            <QA q="Why does MAC change at every router?" a="Each router creates a new local Layer-2 frame for the next network." />
            <QA q="Why does IP usually stay the same?" a="It represents the end-to-end destination/source at the network layer." />
            <QA q="What does ARP solve?" a="IP → MAC resolution on the local network." />
            <QA q="Does ARP find Google's MAC?" a="No. It resolves the MAC of the relevant local next hop." />
            <QA q="Why can't private IP be routed publicly?" a="Private address ranges are intended for internal networks and aren't globally routable." />
            <QA q="Why NAT?" a="Primarily to conserve scarce IPv4 addresses by allowing many private hosts to share public addressing." />
            <QA q="What problem remains after NAT?" a="Multiple internal connections can share one public IP, so the router needs additional information—leading to port-based connection tracking." />
          </div>
        </RevisionPanel>

        <RevisionPanel title="Current Syllabus Position">
          <div className="flex flex-col gap-2">
            {[
              ['Fundamentals', '✅'],
              ['Physical Layer', '✅'],
              ['Data Link Layer', '✅'],
              ['MAC / Switch / Frames', '✅'],
              ['Network Layer basics', '✅'],
              ['Router / Routing', '✅'],
              ['ARP', '✅'],
              ['IPv4 basics', '✅'],
              ['Public vs Private IP', '✅'],
              ['NAT', '🟡 Part 1'],
              ['Port Numbers', '⏭️ Next'],
              ['TCP / UDP', '⏭️'],
            ].map(([topic, status]) => (
              <div key={topic} className="flex items-center justify-between rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 text-sm sm:text-base">
                <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{status}</span>
              </div>
            ))}
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

export default Part1