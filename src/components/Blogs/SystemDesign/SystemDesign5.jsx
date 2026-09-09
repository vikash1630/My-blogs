import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from "../../UI/Footer";

// ── Styling config: one entry per label type ───────────────────────
const LABEL_STYLES = {
  'PROBLEM': {
    glyph: '⚠',
    chip: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
    border: 'border-l-red-400 dark:border-l-red-600',
    bg: 'bg-red-50/60 dark:bg-red-950/40',
    text: 'text-red-900 dark:text-red-100',
  },
  'SOLUTION': {
    glyph: '✓',
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    border: 'border-l-emerald-400 dark:border-l-emerald-600',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/40',
    text: 'text-emerald-900 dark:text-emerald-100',
  },
  'NEW PROBLEM': {
    glyph: '⚡',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    border: 'border-l-amber-400 dark:border-l-amber-600',
    bg: 'bg-amber-50/60 dark:bg-amber-950/40',
    text: 'text-amber-900 dark:text-amber-100',
  },
  'TRADE-OFF': {
    glyph: '⚖',
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
    border: 'border-l-violet-400 dark:border-l-violet-600',
    bg: 'bg-violet-50/60 dark:bg-violet-950/40',
    text: 'text-violet-900 dark:text-violet-100',
  },
  'KEY IDEA': {
    glyph: '💡',
    chip: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300',
    border: 'border-l-sky-400 dark:border-l-sky-600',
    bg: 'bg-sky-50/60 dark:bg-sky-950/40',
    text: 'text-sky-900 dark:text-sky-100',
  },
  'IMPORTANT': {
    glyph: '🔑',
    chip: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
    border: 'border-l-purple-400 dark:border-l-purple-600',
    bg: 'bg-purple-50/60 dark:bg-purple-950/40',
    text: 'text-purple-900 dark:text-purple-100',
  },
  'NOTE': {
    glyph: '📌',
    chip: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    border: 'border-l-gray-400 dark:border-l-gray-600',
    bg: 'bg-gray-50/60 dark:bg-gray-900/40',
    text: 'text-gray-800 dark:text-gray-200',
  },
  'EXAMPLE': {
    glyph: '📝',
    chip: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300',
    border: 'border-l-pink-400 dark:border-l-pink-600',
    bg: 'bg-pink-50/60 dark:bg-pink-950/40',
    text: 'text-pink-900 dark:text-pink-100',
  },
  'USER NEEDS RESULT NOW': {
    glyph: '⏱️',
    chip: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300',
    border: 'border-l-green-400 dark:border-l-green-600',
    bg: 'bg-green-50/60 dark:bg-green-950/40',
    text: 'text-green-900 dark:text-green-100',
  },
  'USER DOESN\'T NEED RESULT NOW': {
    glyph: '🕒',
    chip: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
    border: 'border-l-blue-400 dark:border-l-blue-600',
    bg: 'bg-blue-50/60 dark:bg-blue-950/40',
    text: 'text-blue-900 dark:text-blue-100',
  },
};

const LABEL_ORDER = Object.keys(LABEL_STYLES).sort((a, b) => b.length - a.length);

// ── Splits raw content into typed blocks ───────────────────────────
function parseLegacyContent(raw) {
  const pattern = new RegExp(`(${LABEL_ORDER.join('|')}):?`, 'g');
  const parts = raw.split(pattern).filter((p) => p && p.trim().length);
  const blocks = [];
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim();
    if (LABEL_STYLES[trimmed]) {
      const text = (parts[i + 1] || '').replace(/^:\s*/, '').trim();
      blocks.push({ type: trimmed, text });
      i++;
    }
  }
  return blocks;
}

// ── Professional block: label chip + content in a shaded box ──────
function ContentBlock({ type, text }) {
  const style = LABEL_STYLES[type];
  return (
    <div className={`mb-4 last:mb-0 rounded-lg border-l-4 ${style.border} ${style.bg} p-4 sm:p-5`}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1
                    text-xs font-bold uppercase tracking-wide ${style.chip}`}
      >
        <span aria-hidden="true">{style.glyph}</span>
        {type}
      </span>
      <p className={`mt-2.5 text-base leading-relaxed ${style.text} whitespace-pre-line`}>
        {text}
      </p>
    </div>
  );
}

// ── Concept data (exactly from notes) ────────────────────────────
const CONCEPTS = [
  {
    id: 1,
    section: "Caching",
    name: "Repeated Database Reads",
    hue: "blue",
    icon: "⚡",
    description: "Same data requested again and again → cache it.",
    content: `PROBLEM: Same data is requested again and again.

User
 ↓
Backend
 ↓
Database
 ↓
Same data

Example:
10,000 requests → same product

SOLUTION: Use a cache such as Redis.

Request
 ↓
Cache
 ├── HIT  → return data
 └── MISS → Database → Cache → return

TRADE-OFF: ✅ Faster reads
✅ Less DB load
❌ Uses memory
❌ Data may become old`,
    diagram: null,
    keypoint: "Faster reads, less DB load, but cache may become stale.",
  },
  {
    id: 2,
    section: "Caching",
    name: "Stale Cache",
    hue: "cyan",
    icon: "🕒",
    description: "Cache has old data after DB update.",
    content: `PROBLEM: DB: Price = ₹600
Cache: Price = ₹500 ❌

SOLUTION: After changing DB:
Update DB
   ↓
Delete / invalidate cache

Next read:
Cache MISS
 ↓
DB → fresh data
 ↓
Cache → fresh data

NEW PROBLEM: What if DB update succeeds but cache delete fails?
DB ✅
Cache delete ❌
 ↓
Old cache remains`,
    diagram: null,
    keypoint: "Invalidation can fail; need TTL.",
  },
  {
    id: 3,
    section: "Caching",
    name: "TTL (Time To Live)",
    hue: "teal",
    icon: "⏳",
    description: "Expire cache entries automatically.",
    content: `PROBLEM: Cache invalidation can fail.

SOLUTION: Give cache data an expiry time.

Example:
product:123
TTL = 60 sec

After 60 sec:
Cache entry expires
      ↓
Next request → DB
      ↓
Fresh data → Cache

TRADE-OFF: Short TTL
→ Fresher data
→ More DB requests

Long TTL
→ Less DB requests
→ Stale data can stay longer

KEY IDEA: TTL = "How long can this cache value live?"`,
    diagram: null,
    keypoint: "Short TTL = fresher data, more DB hits. Long TTL = less DB hits, stale risk.",
  },
  {
    id: 4,
    section: "Caching",
    name: "Cache Stampede",
    hue: "emerald",
    icon: "🏃",
    description: "Many concurrent requests for same expired key hit DB.",
    content: `PROBLEM: A popular cache entry expires.
Thousands of users ask for it at once.

Cache
 ↓
MISS MISS MISS MISS
 ↓
Many DB requests 🔥

SOLUTION: Request coalescing / locking.

For the SAME key:
Request 1 → DB
Request 2 → WAIT
Request 3 → WAIT
Request 4 → WAIT

Request 1 gets data
 ↓
Cache updated
 ↓
Others use cache

KEY IDEA: → One request does the expensive work.
→ Others wait for that result.

IMPORTANT: This helps only when many requests want the SAME key.
If:
10,000 requests
→ 10,000 different keys
then coalescing does NOT solve the problem.`,
    diagram: null,
    keypoint: "Works only for same key; different keys still hit DB.",
  },
  {
    id: 5,
    section: "Caching",
    name: "Slow Database",
    hue: "lime",
    icon: "🐢",
    description: "DB is slow; requests wait forever.",
    content: `PROBLEM: Cache MISS
 ↓
Database
 ↓
Very slow

Requests keep waiting.

SOLUTION: Use a timeout.

Example:
DB request
 ↓
Wait max 2 sec
 ↓
No response
 ↓
Timeout

TRADE-OFF: ✅ App doesn't wait forever
❌ DB may still be processing the query even after the app stops waiting.

So timeout protects the waiting request, but does not automatically stop all DB work.`,
    diagram: null,
    keypoint: "Timeout protects the waiting request, not the DB.",
  },
  {
    id: 6,
    section: "Caching",
    name: "Database Overloaded",
    hue: "green",
    icon: "🔥",
    description: "DB getting too many requests despite timeouts.",
    content: `PROBLEM: Even with timeout:
Many requests
 ↓
Many DB queries
 ↓
DB overloaded

SOLUTION: Limit concurrent DB work / apply backpressure.

Example:
DB allows only 100 active requests.
Extra requests:
→ wait
→ reject
→ or use a suitable fallback

KEY IDEA: > Don't let an already struggling DB receive unlimited work.

TRADE-OFF: Too little concurrency → Requests wait more
Too much concurrency → DB becomes overloaded`,
    diagram: null,
    keypoint: "Don't let a struggling DB receive unlimited work.",
  },
  {
    id: 7,
    section: "Caching",
    name: "Fail Fast vs Wait",
    hue: "sky",
    icon: "⚖️",
    description: "When overloaded, reject quickly instead of making all wait.",
    content: `PROBLEM: If DB capacity is 100 but 10,000 requests arrive:
9,900 requests may wait.

SOLUTION: Fail fast when the system cannot safely handle more work.

Example:
DB overloaded
 ↓
503 Service Unavailable

KEY IDEA: > Better to reject some requests than make the whole system collapse.

IMPORTANT: This is for work that needs an answer NOW.
If work can happen later, a queue may be better.`,
    diagram: null,
    keypoint: "For work needing immediate answer; if later possible, use queue.",
  },
  {
    id: 8,
    section: "Async Systems",
    name: "Why Async?",
    hue: "orange",
    icon: "📬",
    description: "Do important work now, rest later.",
    content: `PROBLEM: User places an order.
Backend does:
Save order
 ↓
Send email
 ↓
Generate invoice
 ↓
Update analytics
 ↓
Response

User waits for tasks that can happen later.

SOLUTION: Do important work now. Put other work in a queue.

User
 ↓
Backend
 ↓
Save order ✅
 ↓
Queue
 ↓
Success ✅

Meanwhile:
Queue
 ↓
Email
 ↓
Invoice
 ↓
Analytics

KEY IDEA: > Do important work now. > Do other work later.

IMPORTANT: "Success" here can mean: "Your request was accepted."
It does NOT always mean: "Every background task is finished."`,
    diagram: null,
    keypoint: "Success means accepted, not all tasks done.",
  },
  {
    id: 9,
    section: "Async Systems",
    name: "Producer → Queue → Worker",
    hue: "rose",
    icon: "📦",
    description: "Jobs are queued; workers process them.",
    content: `PROBLEM: Jobs are now sitting in the queue. Someone must do them.

SOLUTION: Use workers.

Producer
 ↓
Queue
 ↓
Worker
 ↓
Do job

Producer → Puts job into queue
Queue → Holds job
Worker → Takes job and processes it`,
    diagram: null,
    keypoint: "Decouples producing from processing.",
  },
  {
    id: 10,
    section: "Async Systems",
    name: "Too Many Jobs",
    hue: "red",
    icon: "📈",
    description: "Queue grows with insufficient workers.",
    content: `PROBLEM: 1,000,000 jobs
 ↓
1 worker
 ↓
Queue keeps growing

SOLUTION: Add more workers.

          Queue
        /   |   \
       ↓    ↓    ↓
      W1   W2   W3

More workers → More jobs processed at the same time

TRADE-OFF: ✅ More throughput
❌ More workers consume resources
❌ Too many workers can overload the database or another dependency`,
    diagram: null,
    keypoint: "Scale workers, but watch dependencies.",
  },
  {
    id: 11,
    section: "Async Systems",
    name: "ACK — Acknowledgement",
    hue: "pink",
    icon: "✅",
    description: "Worker confirms job completion.",
    content: `PROBLEM: Queue needs to know whether the worker finished the job.

SOLUTION: Worker finishes:
Worker
 ↓
Job done
 ↓
ACK ✅

If no ACK:
Worker crashes
 ↓
No ACK
 ↓
Queue can retry the job

KEY IDEA: ACK = "I finished this job."`,
    diagram: null,
    keypoint: "ACK is essential for reliable job processing.",
  },
  {
    id: 12,
    section: "Async Systems",
    name: "Worker Crash + Retry",
    hue: "fuchsia",
    icon: "💥",
    description: "Worker crashes mid-job; need retry.",
    content: `PROBLEM: Worker takes Job A
 ↓
Worker crashes 💥
 ↓
Job may remain unfinished

SOLUTION: Use timeout + retry.

Job A
 ↓
Worker 1 💥
 ↓
No ACK
 ↓
Timeout
 ↓
Worker 2 gets Job A

TRADE-OFF: ✅ Failed jobs can be retried
❌ Same job may run more than once`,
    diagram: null,
    keypoint: "Retries are necessary but can cause duplicates.",
  },
  {
    id: 13,
    section: "Async Systems",
    name: "Duplicate Jobs",
    hue: "violet",
    icon: "🔁",
    description: "Retry can execute job twice.",
    content: `PROBLEM: Worker may finish the work but crash before ACK.

Example:
Send email ✅
 ↓
Worker crashes 💥
 ↓
No ACK
 ↓
Retry
 ↓
Email sent again ❌

SOLUTION: IDEMPOTENCY - Give every job a unique ID.

Example:
job_id = EMAIL123

If processed already:
EMAIL123
 ↓
Already done
 ↓
Skip

KEY IDEA: > Same job can come again, but its effect should not happen again.

IMPORTANT: "Exactly once execution" is hard. A safer mindset is:
> The job may run again, so make the result safe.`,
    diagram: null,
    keypoint: "Make job effects idempotent to safely handle retries.",
  },
  {
    id: 14,
    section: "Async Systems",
    name: "Where to Store Processed Jobs?",
    hue: "purple",
    icon: "🗄️",
    description: "Need to know if job ID already processed.",
    content: `PROBLEM: Workers need to know: "Was EMAIL123 already processed?"

SOLUTION: Store processed job IDs.

Example:
processed_jobs
EMAIL123
EMAIL124
EMAIL125

Worker:
Check ID
 ↓
Exists?
 ├── YES → Skip
 └── NO  → Process

NEW PROBLEM: Two workers may check at the same time:
W1 → Not found
W2 → Not found
 ↓
Both process ❌

SOLUTION: Make the check + record safe/atomic.

Example:
Use a UNIQUE job ID in the database.
W1 → insert EMAIL123 → success
W2 → insert EMAIL123 → duplicate ❌

KEY IDEA: > Let a reliable system enforce uniqueness.`,
    diagram: null,
    keypoint: "Use unique constraints to enforce exactly-once processing.",
  },
  {
    id: 15,
    section: "Async Systems",
    name: "Marking Too Early",
    hue: "indigo",
    icon: "⏱️",
    description: "Don't mark done before work actually done.",
    content: `PROBLEM: Worker says "Job done" before doing the actual work.

Worker
 ↓
Mark DONE ✅
 ↓
Crash 💥
 ↓
Actual work never happened

SOLUTION: Track job state.

PENDING
   ↓
PROCESSING
   ↓
COMPLETED

Only mark COMPLETED after the actual work succeeds.

NEW PROBLEM: Worker may:
Do work ✅
 ↓
Crash before marking COMPLETED
 ↓
Retry

So again: → Idempotent work is important.`,
    diagram: null,
    keypoint: "State tracking helps but idempotency still needed.",
  },
  {
    id: 16,
    section: "Queue Reliability",
    name: "Queue Goes Down",
    hue: "blue",
    icon: "📉",
    description: "Queue unavailable; background job might be lost.",
    content: `PROBLEM: Order saved ✅
Queue ❌
Background job may be lost.

SOLUTION: TRANSACTIONAL OUTBOX

Save both in the DB:
Database
 ├── Order
 └── Outbox Job

Then:
Database
   ↓
Outbox Worker
   ↓
Queue
   ↓
Worker

If queue is down:
Job stays safely in DB until it can be sent.

KEY IDEA: > Database remembers the job. > Queue handles the job.

TRADE-OFF: ✅ Job is less likely to be lost
❌ More complexity
❌ Need an outbox worker`,
    diagram: null,
    keypoint: "Database remembers the job; queue handles it.",
  },
  {
    id: 17,
    section: "Queue Reliability",
    name: "Duplicate Outbox Job",
    hue: "cyan",
    icon: "🔁",
    description: "Outbox retry can send same job twice.",
    content: `PROBLEM: Outbox Worker sends job to queue
 ↓
Queue accepts it ✅
 ↓
Worker crashes before recording success
 ↓
Outbox Worker retries
 ↓
Same job may enter queue twice

SOLUTION: Use unique job IDs + idempotent consumers.

EMAIL123
 ↓
First processing → effect
Second processing → skip

KEY IDEA: Retries are normal. Your system must tolerate them.`,
    diagram: null,
    keypoint: "Retries are normal; design for duplicates.",
  },
  {
    id: 18,
    section: "Queue Reliability",
    name: "Queue Too Large",
    hue: "teal",
    icon: "📊",
    description: "Incoming jobs exceed processing capacity.",
    content: `PROBLEM: Incoming jobs > Worker processing speed
Queue keeps growing.

Example:
Incoming = 10,000 jobs/sec
Workers = 5,000 jobs/sec
Queue size keeps increasing 📈

SOLUTION: Add more workers / scale workers.

Queue
 ├── W1
 ├── W2
 ├── W3
 └── W4

Also monitor queue size.

TRADE-OFF: More workers → More throughput
But:
More workers → More resource usage → Can overload DB or other services`,
    diagram: null,
    keypoint: "Scale workers, but monitor dependency load.",
  },
  {
    id: 19,
    section: "Queue Reliability",
    name: "Slow / Failed Jobs",
    hue: "emerald",
    icon: "💀",
    description: "Jobs failing repeatedly; don't retry forever.",
    content: `PROBLEM: Some jobs fail again and again.
If we retry forever:
    Retry
      ↓
    Retry
      ↓
    Retry
      ↓
    Retry forever 💀

SOLUTION: Retry a limited number of times.

Example:
Job
 ↓
Retry 1
 ↓
Retry 2
 ↓
Retry 3
 ↓
Still fails
 ↓
DLQ

DLQ = Dead Letter Queue

KEY IDEA: > Repeatedly failed jobs go somewhere separate instead of blocking normal processing.`,
    diagram: null,
    keypoint: "DLQ prevents blocking normal processing.",
  },
  {
    id: 20,
    section: "Queue Reliability",
    name: "Monitoring",
    hue: "lime",
    icon: "📡",
    description: "Check system health beyond just uptime.",
    content: `PROBLEM: System may be technically "UP" but jobs may be getting slower and slower.

Important metrics:
→ Queue size
→ Queue waiting time
→ Job processing time
→ Failed jobs
→ Retry count
→ Worker health

Example:
Queue = 100      ✅
Queue = 50,000   🚨

KEY IDEA: > Don't only ask "Is the server running?" > Ask "Is the system actually doing its work?"`,
    diagram: null,
    keypoint: "Monitor operational metrics, not just server status.",
  },
];

// ── Color mapping for card hues ──────────────────────────────────
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

// ── Reveal-on-scroll hook ─────────────────────────────────────────
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

// ── Concept card component ───────────────────────────────────────
function ConceptCard({ concept }) {
  const h = HUE_MAP[concept.hue];
  const [ref, visible] = useRevealOnScroll();
  const blocks = parseLegacyContent(concept.content);

  return (
    <div
      ref={ref}
      className={`rounded-3xl border ${h.border} ${h.bg} p-6 sm:p-9 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* header */}
      <div className="flex items-center gap-4 mb-6">
        <span
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${h.badge} text-base font-bold text-white shadow-sm`}
        >
          {concept.id}
        </span>
        <span className="text-xl opacity-70">{concept.icon}</span>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
          {concept.name}
        </h3>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {concept.description}
        </p>
      </div>

      {/* Content blocks - grouped in one outer container */}
      <div className="mb-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] p-4 sm:p-5">
        {blocks.map((block, i) => (
          <ContentBlock key={i} type={block.type} text={block.text} />
        ))}
      </div>

      {/* Keypoint as left-border accent */}
      {concept.keypoint && (
        <div className={`flex items-start gap-3 border-l-4 ${h.border} pl-5 py-1`}>
          <span className="text-lg flex-shrink-0">🔑</span>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
            {concept.keypoint}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Reveal section wrapper ───────────────────────────────────────
function RevealSection({ children, className = "" }) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <section
      ref={ref}
      className={`transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </section>
  );
}

// ── Main page component ──────────────────────────────────────────
const SystemDesign5 = ({ pdfUrl = "/System_Design_Notes.pdf" }) => {
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

  const cachingConcepts = CONCEPTS.filter(c => c.section === "Caching");
  const asyncConcepts = CONCEPTS.filter(c => c.section === "Async Systems");
  const queueReliabilityConcepts = CONCEPTS.filter(c => c.section === "Queue Reliability");

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* scroll progress */}
      <div className="fixed top-0 left-0 h-[3px] bg-[#C77DFF] z-50 print:hidden" style={{ width: `${progress}%` }} />

      {/* floating nav buttons - always rendered, bottom-right stack */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col gap-3 print:hidden">
        <button
          onClick={scrollToBottom}
          className={`h-11 w-11 flex-shrink-0 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C77DFF] bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-opacity duration-200 ${
            showTopArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          title="Go to bottom"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={scrollToTop}
          className={`h-11 w-11 flex-shrink-0 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C77DFF] bg-[#150025] text-white transition-opacity duration-200 ${
            showBottomArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          title="Go to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Page header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-[#150025] text-white font-mono text-sm font-bold px-5 py-3 shadow-lg transition-all duration-300 hover:from-indigo-500 hover:to-[#2b0044] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400"
            >
              <span className="text-base">←</span>
              <span className="hidden sm:inline">Back to Blogs</span>
              <span className="sm:hidden">Blogs</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 mt-4 sm:mt-6">
              System Design Series · Day 10
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Day 10: Caching + Async Systems
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
              20 core concepts covering caching, asynchronous processing, and queue reliability
            </p>
          </div>

          <a
            href={pdfUrl}
            download
            className="flex-shrink-0 h-11 w-11 rounded-full flex items-center justify-center p-0 bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:gap-2"
          >
            <Download size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-16">
        {/* Intro */}
        <RevealSection className="mb-12 sm:mb-16 rounded-3xl bg-gradient-to-br from-[#2b0044] to-[#150025] p-8 sm:p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-3">
            The core principle
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6">
            Avoid repeated work. Do things later. Handle failures gracefully.
          </h2>
          <p className="text-lg text-white/90 font-semibold">
            Caching avoids redoing work. Async defers non-critical work. Queues and workers process it reliably.
          </p>
        </RevealSection>

        {/* Caching Section */}
        <RevealSection className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Part A: Caching
          </h2>
          <div className="mt-3 mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
              {cachingConcepts.length} concepts
            </span>
          </div>
          <div className="flex flex-col gap-8 sm:gap-10">
            {cachingConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </RevealSection>

        {/* Async Systems Section */}
        <RevealSection className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Part B: Asynchronous Systems
          </h2>
          <div className="mt-3 mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
              {asyncConcepts.length} concepts
            </span>
          </div>
          <div className="flex flex-col gap-8 sm:gap-10">
            {asyncConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </RevealSection>

        {/* Queue Reliability Section */}
        <RevealSection className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Part C: Queue Reliability
          </h2>
          <div className="mt-3 mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
              {queueReliabilityConcepts.length} concepts
            </span>
          </div>
          <div className="flex flex-col gap-8 sm:gap-10">
            {queueReliabilityConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </RevealSection>

        {/* Complete Flow */}
        <RevealSection className="mt-16 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-500/30 bg-orange-50/40 dark:bg-orange-500/[0.04] p-8 sm:p-10 mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">🧭</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Complete Day 10 Flow
            </h2>
          </div>
          <pre className="text-sm bg-gray-100 dark:bg-black/30 p-4 rounded-lg overflow-x-auto text-gray-700 dark:text-emerald-300 font-mono">
{`                DATABASE READS
                     ↓
                  CACHE
                     ↓
              Cache may be stale
                     ↓
             Invalidate cache
                     ↓
          Invalidation may fail
                     ↓
                    TTL
                     ↓
             Cache may stampede
                     ↓
          Request coalescing
                     ↓
       DB may still be too slow
                     ↓
                  Timeout
                     ↓
       DB may still get overloaded
                     ↓
              Backpressure
                     ↓
               Fail Fast
                     ↓
     Some work doesn't need to happen now
                     ↓
                  ASYNC
                     ↓
                  QUEUE
                     ↓
                 WORKERS
                     ↓
              More jobs than workers
                     ↓
             More workers
                     ↓
            Worker can crash
                     ↓
                ACK + RETRY
                     ↓
            Retry can duplicate work
                     ↓
              IDEMPOTENCY
                     ↓
             Queue can go down
                     ↓
        TRANSACTIONAL OUTBOX
                     ↓
          Job can still duplicate
                     ↓
          UNIQUE JOB ID + IDEMPOTENCY
                     ↓
             Too many failed jobs
                     ↓
                   DLQ
                     ↓
                MONITORING`}
          </pre>
        </RevealSection>

        {/* Golden Rules */}
        <RevealSection className="rounded-3xl bg-[#150025] border border-white/10 p-10 sm:p-14 text-white text-center">
          <span className="text-4xl">🔥</span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">The Core Mental Model</h2>
          <div className="mt-8 space-y-4 max-w-2xl mx-auto text-left">
            <div className="text-lg text-white/80">
              <span className="font-bold text-blue-400">CACHE:</span> "What can I avoid doing again?" → Cache it
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-orange-400">ASYNC:</span> "What can happen later?" → Queue it
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-rose-400">WORKERS:</span> "Who will do it?" → Worker
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-red-400">FAILURE:</span> "What if it fails?" → Retry
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-violet-400">DUPLICATE:</span> "What if it happens twice?" → Idempotency
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-cyan-400">QUEUE FAILURE:</span> "What if the queue is down?" → Outbox
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-emerald-400">TOO MANY FAILURES:</span> "What if it keeps failing?" → DLQ
            </div>
            <div className="text-lg text-white/80">
              <span className="font-bold text-sky-400">TOO MUCH LOAD:</span> "What if the next component is overloaded?" → Backpressure / Fail Fast
            </div>
          </div>
          <p className="mt-8 text-base font-bold tracking-wide text-white/70">
            Always ask: PROBLEM → SOLUTION → NEW PROBLEM → SOLUTION → TRADE-OFF
          </p>
        </RevealSection>
      </main>

      <Footer />
    </div>
  );
};

export default SystemDesign5;