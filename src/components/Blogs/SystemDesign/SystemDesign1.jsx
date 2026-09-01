import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Download, Zap, Timer } from "lucide-react";
import Footer from '../../UI/Footer';

const CONCEPTS = [
  {
    id: 1,
    section: "Day 1",
    name: "Starting Point — Simple System",
    hue: "blue",
    icon: "🏗️",
    description: "Client → Server → Database. Works while traffic is manageable.",
    content: "As users increase: More Requests → More CPU / RAM / DB usage → Bottleneck",
    diagram: "Client\n  ↓\nServer\n  ↓\nDatabase",
    keypoint: "Works until traffic is manageable"
  },
  {
    id: 2,
    section: "Day 1",
    name: "Scaling",
    hue: "cyan",
    icon: "📈",
    description: "Make ONE server stronger OR add MORE servers?",
    content: `Vertical Scaling:
→ Make ONE server stronger
→ Small Server → Bigger Server → Physical / Cost limit

Horizontal Scaling:
→ Add MORE servers
→ Multiple machines provide more capacity + redundancy`,
    diagram: "Vertical: Single Strong\nvs\nHorizontal: Multiple Weak",
    keypoint: "Horizontal scaling has no ceiling like vertical does"
  },
  {
    id: 3,
    section: "Day 1",
    name: "Load Balancer",
    hue: "teal",
    icon: "⚖️",
    description: "Routes traffic to backend servers. NOT application storage. NOT business logic.",
    content: `Algorithms:
→ Round Robin: Next server in sequence
→ Least Connections: Server with fewer active connections
→ IP Hash: Same client → same server

Problem:
→ Multiple servers exist. Who decides where each request goes?

Solution: Load Balancer routes traffic to S1, S2, S3`,
    diagram: "Client\n  ↓\nLoad Balancer\n  ↓\nS1   S2   S3",
    keypoint: "Load Balancer routes traffic across servers"
  },
  {
    id: 4,
    section: "Day 1",
    name: "Health Checks",
    hue: "emerald",
    icon: "✅",
    description: "Detects unhealthy servers and removes them from rotation.",
    content: `If: S1 ✅, S2 ❌, S3 ✅

Load Balancer:
→ Detects unhealthy server
→ Stops sending NEW requests to it
→ Recovered server gets health check first
→ Then returns to traffic

Important:
→ Existing request on crashed server may fail / timeout
→ Future requests go to healthy servers`,
    diagram: "S1 ✅ → Traffic\nS2 ❌ → No Traffic\nS3 ✅ → Traffic",
    keypoint: "Health checks prevent bad servers from breaking traffic"
  },
  {
    id: 5,
    section: "Day 1",
    name: "Load Balancer Failure",
    hue: "orange",
    icon: "⚠️",
    description: "Single LB becomes a SPOF. Need redundant load balancers.",
    content: `Single LB:
Client → LB ❌ → Servers
→ LB becomes SPOF (Single Point of Failure)

Solution:
→ Redundant / highly available Load Balancers

Core rule:
→ Critical components should not become single points of failure`,
    diagram: "Single LB ❌\nvs\nRedundant LBs ✅",
    keypoint: "Critical components need redundancy"
  },
  {
    id: 6,
    section: "Day 1",
    name: "Stateful vs Stateless",
    hue: "amber",
    icon: "🔄",
    description: "Where should user state live?",
    content: `Stateful:
Request 1 → Server 1 (User state stored here)
Request 2 → Server 2 (State may be missing ❌)
→ Sticky Sessions try to keep user on same server
→ But creates scaling/failure complexity

Stateless:
Request 1 → S1
Request 2 → S3
Request 3 → S2
→ Any server can handle request
→ Easier horizontal scaling`,
    diagram: "Stateful: State in Server\nvs\nStateless: State in Client/DB",
    keypoint: "Prefer stateless design for horizontal scaling"
  },
  {
    id: 7,
    section: "Day 1",
    name: "Database Becomes Next Bottleneck",
    hue: "rose",
    icon: "💾",
    description: "After scaling servers, database becomes the problem.",
    content: `After scaling servers:
S1 ─┐
S2 ─┼→ Database
S3 ─┘

More servers → More DB requests → Database may become bottleneck

Possible limits:
→ CPU
→ RAM
→ Connections
→ Disk I/O
→ Query processing`,
    diagram: "S1 ─┐\nS2 ─┼→ DB\nS3 ─┘",
    keypoint: "Each component has a ceiling"
  },
  {
    id: 8,
    section: "Day 1",
    name: "Caching",
    hue: "lime",
    icon: "⚡",
    description: "Repeated request → do we really need DB every time?",
    content: `Cache:
Request → Cache
├── HIT → Return
└── MISS → Database → Cache → Return

Cache Hit: Data found
Cache Miss: Data not found → DB

HashMap intuition: Works for simple/local caching

Problems at scale:
→ Limited memory
→ Each server has separate cache
→ Restart loses data
→ Servers don't share cache

Distributed cache (Redis):
→ Shared fast cache across servers`,
    diagram: "Request\n  ↓\nCache\n├─ HIT → Return\n└─ MISS → DB",
    keypoint: "Distributed cache reduces DB load"
  },
  {
    id: 9,
    section: "Day 1",
    name: "System Design Mindset",
    hue: "purple",
    icon: "🧠",
    description: "DO NOT MEMORIZE the architecture. ASK THE RIGHT QUESTIONS.",
    content: `DO NOT MEMORIZE:
Load Balancer → Redis → Database → Kafka

ASK:
→ Where is the system struggling?
→ Why?
→ What removes the bottleneck?
→ What becomes the NEXT bottleneck?
→ What are the trade-offs?

Bottleneck can MOVE:
Server bottleneck → Add servers → DB bottleneck → Scale/optimize DB → Another bottleneck`,
    diagram: "Bottleneck\n  ↓\nIdentify\n  ↓\nRemove\n  ↓\nNext Bottleneck",
    keypoint: "Think in terms of bottlenecks, not memorized architectures"
  },
  {
    id: 10,
    section: "Day 1",
    name: "Latency vs Throughput",
    hue: "indigo",
    icon: "⏱️",
    description: "Two different performance metrics.",
    content: `Latency:
→ Time for ONE request
→ Example: 50 ms

Throughput:
→ Amount of work handled per unit time
→ Example: 1000 requests/sec

Chat:
→ Low latency important

Batch processing:
→ High throughput often important

Both may matter`,
    diagram: "Latency = Response time\nThroughput = Requests/sec",
    keypoint: "Different metrics for different use cases"
  },
  {
    id: 11,
    section: "Day 1",
    name: "Availability vs Reliability",
    hue: "sky",
    icon: "🛡️",
    description: "Two different reliability concepts.",
    content: `Availability:
→ "Can I use the system?"

Reliability:
→ "Can I trust it to work correctly?"

A system can be:
→ Available but unreliable
→ Reliable but temporarily unavailable`,
    diagram: "Availability = Uptime\nReliability = Correctness",
    keypoint: "Both needed for good systems"
  },
  {
    id: 12,
    section: "Day 1",
    name: "Fault Tolerance",
    hue: "pink",
    icon: "🔁",
    description: "Continue operating despite failure.",
    content: `S1 ❌
S2 ✅
S3 ✅
→ System can continue

Redundancy:
→ Multiple instances/copies

Failover:
→ Switch to healthy alternative

Fault Tolerance:
→ Continue operating despite failure

Failure → Redundancy → Failover → Continue service`,
    diagram: "Failure\n  ↓\nRedundancy\n  ↓\nFailover\n  ↓\nContinue",
    keypoint: "Design for failure from day one"
  },
  {
    id: 13,
    section: "Day 1",
    name: "SPOF",
    hue: "red",
    icon: "⛔",
    description: "Single Point of Failure breaks critical functionality.",
    content: `Single Point of Failure:
→ One component whose failure breaks critical functionality

Potential SPOFs:
→ Single Load Balancer
→ Single Database

Question:
→ "If this fails, does critical functionality stop?"`,
    diagram: "Single LB ❌\nSingle DB ❌\n\nvs\n\nMultiple ✅",
    keypoint: "Identify and eliminate SPOFs"
  },
  {
    id: 14,
    section: "Day 1",
    name: "Performance vs Scalability",
    hue: "fuchsia",
    icon: "📊",
    description: "Two different system properties.",
    content: `Performance:
→ How fast / efficient is the system now?

Scalability:
→ How well can it handle MORE load?

Example:
→ A system can be fast today but not scale well tomorrow
→ A system can be poorly optimized but highly scalable`,
    diagram: "Performance = Speed now\nScalability = Speed at scale",
    keypoint: "Optimize for both, but know which matters"
  },
  {
    id: 15,
    section: "Day 1",
    name: "Capacity Estimation",
    hue: "violet",
    icon: "🔢",
    description: "How many servers/DBs do we actually need?",
    content: `Users → DAU → Requests/user/day → Requests/day → Average RPS → Peak RPS

Example:
10M users
× 20% DAU = 2M DAU

2M × 20 requests/day = 40M requests/day

40M / 86,400 ≈ 463 RPS average

Peak: 463 × peak factor

Do estimates approximately.
Goal → understand scale`,
    diagram: "Users\n  ↓\nDAU\n  ↓\nRequests/day\n  ↓\nRPS\n  ↓\nPeak RPS",
    keypoint: "Math beats guessing"
  },
  {
    id: 16,
    section: "Day 1",
    name: "Read / Write Ratio",
    hue: "green",
    icon: "⚙️",
    description: "Different ratios require different optimizations.",
    content: `10,000 RPS
  ├─ 80% Read → 8,000
  └─ 20% Write → 2,000

Read-heavy:
→ Cache
→ Read replicas
→ Read optimization

Write-heavy:
→ Write optimization
→ Batching / queues where appropriate
→ Partitioning when needed`,
    diagram: "Read-heavy → Cache\nWrite-heavy → Optimize writes",
    keypoint: "Optimize based on your workload"
  },
  {
    id: 17,
    section: "Day 1",
    name: "Storage + Bandwidth",
    hue: "cyan",
    icon: "💾",
    description: "Calculate data growth and network requirements.",
    content: `Storage:
Users × Data generated/user/day = Data/day

Bandwidth:
→ Data transferred per unit time

Example:
5 TB/day ≈ 58 MB/sec average

Think:
Requests → Data generated → Storage → Network bandwidth`,
    diagram: "Users\n  ↓\nData/day\n  ↓\nStorage\n  ↓\nBandwidth",
    keypoint: "Account for both space and network"
  },
  {
    id: 18,
    section: "Day 1",
    name: "Maintainability + Extensibility",
    hue: "teal",
    icon: "🔧",
    description: "Easy to understand, modify, and extend.",
    content: `Maintainability:
→ Easy to understand, fix and modify

Extensibility:
→ Easy to ADD new features

Bad:
if(card)
else if(UPI)
else if(PayPal)
...
→ More features = more modification = complexity

Solution:
→ SOLID
→ Interfaces
→ Strategy
→ Factory
→ Dependency Injection`,
    diagram: "Maintainability = Easy to fix\nExtensibility = Easy to add",
    keypoint: "Design for change"
  },
  {
    id: 19,
    section: "Day 1",
    name: "Trade-offs",
    hue: "amber",
    icon: "⚖️",
    description: "No perfect architecture. Everything is a trade-off.",
    content: `No perfect architecture.

Common trade-offs:
→ Latency ↔ Throughput
→ Cost ↔ Performance
→ Consistency ↔ Availability
→ Vertical ↔ Horizontal Scaling
→ Simplicity ↔ Scalability

Always ask:
"What does THIS system require?"`,
    diagram: "Latency ↔ Throughput\nCost ↔ Performance\nSimplicity ↔ Scalability",
    keypoint: "Every choice has consequences"
  },
  {
    id: 20,
    section: "Day 1",
    name: "Requirements",
    hue: "indigo",
    icon: "📋",
    description: "Functional vs Non-Functional. Constraints matter.",
    content: `Functional:
→ WHAT does system do?

Non-Functional:
→ HOW WELL does it do it?

Example:
Functional:
→ Login
→ Modify attendance

Non-functional:
→ Modification ≤ 200 ms

Constraint:
→ Support up to 10K teachers

Architecture comes AFTER:
Requirements + Constraints`,
    diagram: "Functional = What\nNon-Functional = How well\nConstraints = Limits",
    keypoint: "Requirements drive architecture"
  },
  {
    id: 21,
    section: "Day 2",
    name: "DNS",
    hue: "blue",
    icon: "🌐",
    description: "Domain name to IP address resolution.",
    content: `example.com
  ↓
DNS
  ↓
IP address

DNS:
→ Finds destination for the domain

Critical step in request lifecycle`,
    diagram: "example.com\n  ↓\nDNS\n  ↓\n192.168.1.1",
    keypoint: "DNS is first step in web request"
  },
  {
    id: 22,
    section: "Day 2",
    name: "TCP + TLS",
    hue: "cyan",
    icon: "🔒",
    description: "Reliable connection with encryption.",
    content: `TCP:
→ Reliable delivery
→ Ordering
→ Retransmission
→ Flow control

System Design lesson:
→ Networks can fail

TLS:
→ Secure communication

HTTPS:
→ HTTP over TLS`,
    diagram: "TCP = Reliability\nTLS = Encryption\nHTTPS = Secure HTTP",
    keypoint: "TCP guarantees delivery, TLS guarantees privacy"
  },
  {
    id: 23,
    section: "Day 2",
    name: "HTTP",
    hue: "teal",
    icon: "🔗",
    description: "Request/response protocol with methods.",
    content: `HTTP Request contains:
→ Method
→ Path
→ Headers
→ Body

GET → Read
POST → Create / trigger operation
PUT → Replace
PATCH → Partial update
DELETE → Delete`,
    diagram: "GET /users\nPOST /users\nPUT /users/1\nDELETE /users/1",
    keypoint: "HTTP methods have semantic meaning"
  },
  {
    id: 24,
    section: "Day 2",
    name: "REST",
    hue: "emerald",
    icon: "📡",
    description: "Resources and stateless communication.",
    content: `Resources:
/users
/products
/orders

Client → HTTP Request → API → Server → Response

Common REST APIs:
→ Stateless

Principle:
→ Everything is a resource
→ Use standard HTTP methods`,
    diagram: "Client\n  ↓\nREST API\n  ↓\nResources",
    keypoint: "REST = Resource + Stateless"
  },
  {
    id: 25,
    section: "Day 2",
    name: "Authentication vs Authorization",
    hue: "lime",
    icon: "🔐",
    description: "WHO are you? WHAT can you do?",
    content: `Authentication:
→ WHO are you?

Authorization:
→ WHAT can you do?

Authentication = Identity
Authorization = Permissions

Both needed for security
Independent concerns`,
    diagram: "Auth = WHO\nAuthz = WHAT",
    keypoint: "Don't confuse the two"
  },
  {
    id: 26,
    section: "Day 2",
    name: "Session vs JWT",
    hue: "violet",
    icon: "🎫",
    description: "How to maintain authenticated state?",
    content: `SESSION ID:
Login → Create session → Session ID → Client
Request → Session ID → Session Storage → Find user/session → Respond

JWT:
Login → JWT → Client
Request → JWT → ANY server → Verify token → Identify user

Key note:
JWT: Every server can independently verify token
Session ID: Server needs access to session storage to match ID

JWT can enable stateless authentication`,
    diagram: "Session = Stateful\nJWT = Stateless",
    keypoint: "JWT for distributed systems, Session for simplicity"
  },
  {
    id: 27,
    section: "Day 2",
    name: "Cookies",
    hue: "rose",
    icon: "🍪",
    description: "Browser storage/transport mechanism.",
    content: `Cookie:
→ Browser storage/transport mechanism

Server → Set-Cookie → Browser → Future requests → Cookie sent

Cookie ≠ Authentication itself

Cookie can carry:
→ Session ID
→ JWT`,
    diagram: "Server\n  ↓\nSet-Cookie\n  ↓\nBrowser\n  ↓\nFuture Requests",
    keypoint: "Cookie is transport, not authentication"
  },
  {
    id: 28,
    section: "Day 2",
    name: "Idempotency",
    hue: "orange",
    icon: "🔁",
    description: "Same request = same result, no duplicates.",
    content: `Problem:
Payment request → Server processes → Response lost → Client retries → Payment twice ❌

Solution: Idempotency Key

Request (Key = XYZ123) → Process → Store result
Retry (same XYZ123) → Already processed → Return ORIGINAL result → No duplicate

Important:
SAME key = Same operation = No duplicate
NEW key = New intentional operation = Process

Used for:
→ Payments
→ Bookings
→ Transfers`,
    diagram: "Key XYZ123\n  ↓\nProcess ✅\n  ↓\nRetry XYZ123\n  ↓\nReturn cached",
    keypoint: "Critical for payments"
  },
  {
    id: 29,
    section: "Day 2",
    name: "WebSocket",
    hue: "sky",
    icon: "📡",
    description: "Persistent two-way communication.",
    content: `Normal HTTP:
Client → Request → Server → Response

Polling:
Client → "Any new message?"
Client → "Any new message?"

WebSocket:
Client ↕ Persistent connection ↕ Server

→ Two-way communication
→ Useful for real-time systems

Used for:
→ Chat
→ Gaming
→ Live notifications
→ Live tracking
→ Collaboration`,
    diagram: "Client\n  ↕\nPersistent WS\n  ↕\nServer",
    keypoint: "Enables real-time communication"
  },
  {
    id: 30,
    section: "Day 2",
    name: "WebSocket + Multiple Servers",
    hue: "fuchsia",
    icon: "🌍",
    description: "How to route messages across servers?",
    content: `User A → Server 1
User B → Server 3

Server 3 receives message for User A.

Problem:
→ Server 3 doesn't automatically know where User A's connection exists

Possible solution:
User A → Server 1 → Shared Store
Server 3 → Shared Store → Find User A → Server 1 → User A

Shared store example:
→ Redis

Reason:
→ Multiple servers need shared connection information`,
    diagram: "User A ↔ S1\nUser B ↔ S3\n\nShared Store (Redis)",
    keypoint: "Use shared store for connection info"
  },
  {
    id: 31,
    section: "Day 2",
    name: "WebSocket Failure",
    hue: "pink",
    icon: "⚠️",
    description: "Connections fail. Plan for it.",
    content: `User A → WebSocket → Server 1 ❌
→ Connection lost

Need mechanisms such as:
→ Reconnection
→ Heartbeats
→ Connection cleanup
→ TTL / expiration

Stale mapping:
User A → Server 1
Server 1 crashes → Mapping becomes stale → Cleanup / TTL / heartbeat`,
    diagram: "Connection\n  ↓\nFail\n  ↓\nReconnect\n  ↓\nHeartbeat",
    keypoint: "Handle disconnections gracefully"
  }
];

const HUE_MAP = {
  blue: { border: "border-blue-200 dark:border-blue-500/25", bg: "bg-blue-50/70 dark:bg-blue-500/[0.06]", text: "text-blue-600 dark:text-blue-300", badge: "bg-blue-500", accent: "text-blue-500 dark:text-blue-400" },
  cyan: { border: "border-cyan-200 dark:border-cyan-500/25", bg: "bg-cyan-50/70 dark:bg-cyan-500/[0.06]", text: "text-cyan-600 dark:text-cyan-300", badge: "bg-cyan-500", accent: "text-cyan-500 dark:text-cyan-400" },
  teal: { border: "border-teal-200 dark:border-teal-500/25", bg: "bg-teal-50/70 dark:bg-teal-500/[0.06]", text: "text-teal-600 dark:text-teal-300", badge: "bg-teal-500", accent: "text-teal-500 dark:text-teal-400" },
  emerald: { border: "border-emerald-200 dark:border-emerald-500/25", bg: "bg-emerald-50/70 dark:bg-emerald-500/[0.06]", text: "text-emerald-600 dark:text-emerald-300", badge: "bg-emerald-500", accent: "text-emerald-500 dark:text-emerald-400" },
  lime: { border: "border-lime-200 dark:border-lime-500/25", bg: "bg-lime-50/70 dark:bg-lime-500/[0.06]", text: "text-lime-700 dark:text-lime-300", badge: "bg-lime-500", accent: "text-lime-600 dark:text-lime-400" },
  green: { border: "border-green-200 dark:border-green-500/25", bg: "bg-green-50/70 dark:bg-green-500/[0.06]", text: "text-green-600 dark:text-green-300", badge: "bg-green-500", accent: "text-green-500 dark:text-green-400" },
  sky: { border: "border-sky-200 dark:border-sky-500/25", bg: "bg-sky-50/70 dark:bg-sky-500/[0.06]", text: "text-sky-600 dark:text-sky-300", badge: "bg-sky-500", accent: "text-sky-500 dark:text-sky-400" },
  indigo: { border: "border-indigo-200 dark:border-indigo-500/25", bg: "bg-indigo-50/70 dark:bg-indigo-500/[0.06]", text: "text-indigo-600 dark:text-indigo-300", badge: "bg-indigo-500", accent: "text-indigo-500 dark:text-indigo-400" },
  violet: { border: "border-violet-200 dark:border-violet-500/25", bg: "bg-violet-50/70 dark:bg-violet-500/[0.06]", text: "text-violet-600 dark:text-violet-300", badge: "bg-violet-500", accent: "text-violet-500 dark:text-violet-400" },
  purple: { border: "border-purple-200 dark:border-purple-500/25", bg: "bg-purple-50/70 dark:bg-purple-500/[0.06]", text: "text-purple-600 dark:text-purple-300", badge: "bg-purple-500", accent: "text-purple-500 dark:text-purple-400" },
  pink: { border: "border-pink-200 dark:border-pink-500/25", bg: "bg-pink-50/70 dark:bg-pink-500/[0.06]", text: "text-pink-600 dark:text-pink-300", badge: "bg-pink-500", accent: "text-pink-500 dark:text-pink-400" },
  rose: { border: "border-rose-200 dark:border-rose-500/25", bg: "bg-rose-50/70 dark:bg-rose-500/[0.06]", text: "text-rose-600 dark:text-rose-300", badge: "bg-rose-500", accent: "text-rose-500 dark:text-rose-400" },
  red: { border: "border-red-200 dark:border-red-500/25", bg: "bg-red-50/70 dark:bg-red-500/[0.06]", text: "text-red-600 dark:text-red-300", badge: "bg-red-500", accent: "text-red-500 dark:text-red-400" },
  orange: { border: "border-orange-200 dark:border-orange-500/25", bg: "bg-orange-50/70 dark:bg-orange-500/[0.06]", text: "text-orange-600 dark:text-orange-300", badge: "bg-orange-500", accent: "text-orange-500 dark:text-orange-400" },
  amber: { border: "border-amber-200 dark:border-amber-500/25", bg: "bg-amber-50/70 dark:bg-amber-500/[0.06]", text: "text-amber-600 dark:text-amber-300", badge: "bg-amber-500", accent: "text-amber-500 dark:text-amber-400" },
  fuchsia: { border: "border-fuchsia-200 dark:border-fuchsia-500/25", bg: "bg-fuchsia-50/70 dark:bg-fuchsia-500/[0.06]", text: "text-fuchsia-600 dark:text-fuchsia-300", badge: "bg-fuchsia-500", accent: "text-fuchsia-500 dark:text-fuchsia-400" },
};

function useRevealOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -10px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function ConceptCard({ concept }) {
  const h = HUE_MAP[concept.hue];
  const [ref, visible] = useRevealOnScroll();

  return (
    <div
      ref={ref}
      className={`rounded-3xl border ${h.border} ${h.bg} p-7 sm:p-9 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${h.badge} text-base font-bold text-white shadow-sm`}
          >
            {concept.id}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
            {concept.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {concept.description}
        </p>
      </div>

      {/* Content */}
      <div className="mb-6 rounded-2xl bg-white dark:bg-white/5 px-6 py-5 shadow-sm">
        <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm">
          {concept.content}
        </p>
      </div>

      {/* diagram / code block */}
      {concept.diagram && (
        <pre className="mb-6 overflow-x-auto rounded-xl bg-gray-900 dark:bg-black/40 px-6 py-5 text-sm sm:text-base leading-relaxed text-emerald-300 font-mono">
          {concept.diagram}
        </pre>
      )}

      {/* key takeaway */}
      {concept.keypoint && (
        <div className="flex items-start gap-3 rounded-xl bg-white dark:bg-white/5 px-5 py-4 shadow-sm">
          <span className="text-lg flex-shrink-0">🔑</span>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{concept.keypoint}</p>
        </div>
      )}
    </div>
  );
}

function RevealSection({ children, className = "" }) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <section
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </section>
  );
}

const SystemDesign1 = ({ pdfUrl = "/System_Design_Notes.pdf" }) => {
  const [progress, setProgress] = useState(0);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      setShowTopArrow(scrollTop > 200);
      setShowBottomArrow(scrollTop > 200 && scrollTop < scrollHeight - 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const day1Concepts = CONCEPTS.filter(c => c.section === "Day 1");
  const day2Concepts = CONCEPTS.filter(c => c.section === "Day 2");

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* scroll progress */}
      <div className="fixed top-0 left-0 h-[3px] bg-blue-500 z-50 print:hidden" style={{ width: `${progress}%` }} />

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

      {/* Page header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14 flex items-start justify-between gap-6">
          <div>
            {/* Back to Blogs button */}
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-mono text-sm font-bold px-5 py-2.5 shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all mb-6"
            >
              <span className="text-base">←</span>
              <span className="hidden sm:inline">Back to Blogs</span>
              <span className="sm:hidden">Blogs</span>
            </Link>

            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              🏗️ System Architecture
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              System Design
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
              31 concepts covering scaling, databases, protocols, and real-time systems
            </p>
          </div>
          <a
            href={pdfUrl}
            download
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-5 py-3 text-sm sm:text-base font-bold text-white dark:text-gray-900 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Download size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-16">
        {/* Intro */}
        <RevealSection className="mb-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 p-8 sm:p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-3">
            The core principle
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6">
            Identify bottlenecks. Remove them. Repeat.
          </h2>
          <p className="text-lg text-white/90 font-semibold">
            System Design ≠ Memorizing architectures. It's learning WHERE the system breaks, WHY, WHAT fixes it, and WHAT BECOMES THE NEXT PROBLEM.
          </p>
        </RevealSection>

        {/* Day 1 Section */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 1: Scaling & Architecture
          </h2>
          <div className="flex flex-col gap-10">
            {day1Concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </RevealSection>

        {/* Divider */}
        <RevealSection className="my-16">
          <div className="text-center py-8 border-t border-b border-gray-200 dark:border-white/10">
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">━━━ Day 2 ━━━</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Request Lifecycle · Protocols · Communication</p>
          </div>
        </RevealSection>

        {/* Day 2 Section */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 2: Request Lifecycle & Communication
          </h2>
          <div className="flex flex-col gap-10">
            {day2Concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </RevealSection>

        {/* Final Flow */}
        <RevealSection className="mt-16 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-500/30 bg-orange-50/40 dark:bg-orange-500/[0.04] p-8 sm:p-10 mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">🧭</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Final Flow to Remember
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-bold text-gray-900 dark:text-white mb-2">When user enters: https://example.com/products/123</p>
              <pre className="text-sm bg-gray-100 dark:bg-black/30 p-4 rounded-lg overflow-x-auto text-gray-700 dark:text-emerald-300 font-mono">
{`Browser → DNS → IP → TCP → TLS → HTTPS Request
  ↓
Load Balancer
  ↓
Backend
  ↓
Database
  ↓
Backend
  ↓
Response
  ↓
Browser`}
              </pre>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white mb-2">Main System Design Question:</p>
              <p className="text-gray-700 dark:text-gray-300">At which step can it: Fail? Slow down? Become a bottleneck?</p>
            </div>
          </div>
        </RevealSection>

        {/* Golden Rule */}
        <RevealSection className="rounded-3xl bg-gray-900 dark:bg-white/5 p-10 sm:p-14 text-white border border-white/10 text-center">
          <span className="text-4xl">🔥</span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">The Golden Rule</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed">
            DO NOT MEMORIZE: Load Balancer → Redis → Database → Kafka
          </p>
          <div className="mt-8 space-y-3 max-w-2xl mx-auto text-left">
            <div className="text-lg text-white/80">
              <span className="font-bold text-white">ASK:</span> Where is the system struggling?
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-white">WHY?</span> What's causing the bottleneck?
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-white">WHAT REMOVES IT?</span> What change fixes it?
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-white">WHAT BECOMES NEXT?</span> What's the new problem?
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-white">TRADE-OFFS?</span> What do we gain/lose?
            </div>
          </div>
          <p className="mt-8 text-base font-bold tracking-wide text-white/70">
            This is System Design thinking.
          </p>
        </RevealSection>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SystemDesign1;