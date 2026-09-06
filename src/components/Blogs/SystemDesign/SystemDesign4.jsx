import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Download, Copy, Check } from "lucide-react";
import Footer from "../../UI/Footer";

// ─── Python Code for Load Balancer + Health Checks ───────────────
const LOAD_BALANCER_CODE = `import time
from enum import Enum


# ---------------- HEALTH STATUS ----------------

class ServerStatus(Enum):
    HEALTHY = 1
    UNHEALTHY = 0


# ---------------- BACKEND SERVER ----------------

class BackendServer:

    def __init__(self, server_id, host, port):
        self.server_id = server_id
        self.host = host
        self.port = port
        self.status = ServerStatus.HEALTHY
        self.active_connections = 0
        self.total_requests = 0
        self.last_health_check = time.time()

    def process_request(self):
        self.total_requests += 1
        self.active_connections += 1
        time.sleep(0.001)
        self.active_connections -= 1


# ---------------- LOAD BALANCING ALGORITHMS ----------------

class LoadBalancer:

    def __init__(self, servers):
        self.servers = servers
        self.round_robin_index = 0

    def get_healthy_servers(self):
        return [s for s in self.servers if s.status == ServerStatus.HEALTHY]

    # 1. ROUND ROBIN
    def round_robin(self):
        healthy = self.get_healthy_servers()
        if not healthy:
            return None
        server = healthy[self.round_robin_index % len(healthy)]
        self.round_robin_index += 1
        return server

    # 2. LEAST CONNECTIONS
    def least_connections(self):
        healthy = self.get_healthy_servers()
        if not healthy:
            return None
        return min(healthy, key=lambda s: s.active_connections)

    # 3. IP HASH
    def ip_hash(self, client_ip):
        healthy = self.get_healthy_servers()
        if not healthy:
            return None
        index = hash(client_ip) % len(healthy)
        return healthy[index]


# ---------------- HEALTH CHECKER ----------------

class HealthChecker:

    def __init__(self, load_balancer, interval=5):
        self.load_balancer = load_balancer
        self.interval = interval

    def check_health(self):
        for server in self.load_balancer.servers:
            is_healthy = True  # Replace with actual HTTP check
            if is_healthy:
                server.status = ServerStatus.HEALTHY
            else:
                server.status = ServerStatus.UNHEALTHY
                print(f"Server {server.server_id} marked UNHEALTHY")`

// ─── Day 8: Scalability + Load Balancing ─────────────────────────
const DAY8_CONCEPTS = [
  {
    id: 1,
    section: "Day 8",
    name: "🧠 Core Mental Model",
    hue: "indigo",
    icon: "🧠",
    description: "Don't memorize architecture — think in bottlenecks.",
    content: `Don't memorize:\n    LB → Redis → Kafka → DB\n\nInstead think:\n    Problem\n       ↓\n    Find bottleneck\n       ↓\n    Apply solution\n       ↓\n    New bottleneck\n       ↓\n    Repeat`,
    diagram: "Problem → Bottleneck → Solution → New Bottleneck → Repeat",
    keypoint: "Scalability is an iterative process, not a destination.",
    tradeoff: "Mindset only — no specific tradeoff, but applying any solution creates a new bottleneck.",
  },
  {
    id: 2,
    section: "Day 8",
    name: "📈 Scaling — Vertical vs Horizontal",
    hue: "blue",
    icon: "📈",
    description: "Two ways to handle increasing load: stronger machine or more machines.",
    content: `VERTICAL SCALING (Scale Up)\nMake one machine stronger.\n\n    4 CPU + 8 GB RAM\n          ↓\n    16 CPU + 64 GB RAM\n\nPros:\n✓ Simple\n✓ Usually no application architecture change\n\nCons:\n✗ Hardware limits\n✗ Expensive at high end\n✗ Single-machine failure risk\n\n\nHORIZONTAL SCALING (Scale Out)\nAdd more machines.\n\n             ┌── Server 1\nUsers → LB → ├── Server 2\n             └── Server 3\n\nPros:\n✓ Handles large traffic\n✓ Better redundancy\n✓ Can add/remove capacity\n\nCons:\n✗ More infrastructure complexity\n✗ Shared state becomes a problem\n✗ Requires request distribution`,
    diagram: "Vertical → Stronger machine | Horizontal → More machines",
    keypoint: "Vertical = Stronger machine. Horizontal = More machines.",
    tradeoff: "Vertical is simple but hits hard limits; horizontal is scalable but introduces complexity.",
  },
  {
    id: 3,
    section: "Day 8",
    name: "⚖️ Why Horizontal Scaling?",
    hue: "cyan",
    icon: "⚖️",
    description: "When one server becomes the bottleneck, add more servers behind a load balancer.",
    content: `One server:\n    Users → Server → DB\n\nTraffic increases:\n    Server becomes bottleneck\n\nInstead of endlessly upgrading it:\n    Users\n      ↓\n      LB\n      ↓\n    S1 S2 S3\n\nSame application can run on multiple servers.`,
    diagram: "Users → LB → S1, S2, S3 (horizontal scaling)",
    keypoint: "Scale out when scaling up hits physical or cost limits.",
    tradeoff: "Adds LB and statelessness requirements; more moving parts.",
  },
  {
    id: 4,
    section: "Day 8",
    name: "🔄 Load Balancer — Round Robin & Least Connections",
    hue: "teal",
    icon: "🔄",
    description: "Distribute requests among backend servers using simple algorithms.",
    content: `LOAD BALANCER JOB:\nDistribute incoming requests among backend servers.\n\n    Users\n      ↓\n    Load Balancer\n      ↓\n   ┌──┼──┐\n   ↓  ↓  ↓\n  S1  S2  S3\n\n\n1. ROUND ROBIN\n---------------\nR1 → S1\nR2 → S2\nR3 → S3\nR4 → S1\nR5 → S2\n\nConcept:\n    server = servers[index]\n    index = (index + 1) % len(servers)\n\nGood when servers have roughly similar capacity/workload.\n\n\n2. LEAST CONNECTIONS\n--------------------\nChoose server with fewest active connections.\n\n    S1 = 20\n    S2 = 5   ← selected\n    S3 = 12\n\nUseful when requests have different processing times.`,
    diagram: "Round Robin → rotate servers | Least Connections → pick least busy",
    keypoint: "Round Robin for uniform load; Least Connections for variable load.",
    tradeoff: "Round robin assumes equal capacity; least connections may not capture other metrics like CPU.",
  },
  {
    id: 5,
    section: "Day 8",
    name: "🔗 IP Hash & Sticky Sessions",
    hue: "emerald",
    icon: "🔗",
    description: "Routing strategies that tie clients to specific servers.",
    content: `3. IP HASH\n----------\n    hash(client_IP) % number_of_servers\n\nCan consistently route the same client toward\nthe same server.\n\nUseful for certain session-affinity cases,\nbut shared/stateless designs are generally preferable.\n\n\n4. STICKY SESSIONS\n------------------\nLB remembers:\n    User A → S1\n    User B → S2\n\nUser A keeps going to S1.\n\nProblem:\n    S1 becomes overloaded\n    OR\n    S1 crashes → local session may be lost\n\nTherefore sticky sessions can make horizontal\nscaling harder.`,
    diagram: "IP Hash → client IP → same server | Sticky Session → user stays with server",
    keypoint: "Prefer stateless designs over sticky sessions for better scalability.",
    tradeoff: "Affinity can cause uneven load and server loss issues; statelessness avoids this but requires shared state.",
  },
  {
    id: 6,
    section: "Day 8",
    name: "🩺 Health Checks & Failover",
    hue: "green",
    icon: "🩺",
    description: "Detect unhealthy servers and keep traffic flowing after failures.",
    content: `HEALTH CHECKS\n---------------\nLB periodically checks servers.\n\nExample:\n    GET /health\n\nHealthy:\n    S1 → 200 OK\n    S2 → 200 OK\n    S3 → 200 OK\n\nIf:\n    S2 → timeout / 500\n\nLB removes S2:\n             LB\n           /    \\\n          S1    S3\n\nTraffic goes only to healthy servers.\n\n\nFAILOVER\n--------\nFailover = continue operating when a component fails.\n\n    LB\n   / | \\\n  S1 S2 S3\n     ❌\n\nLB detects failure:\n    LB\n   / \\\n  S1 S3\n\nIMPORTANT:\nFailover ≠ zero errors.\nA request already being processed by a\ncrashed server may still fail.\nFailover mainly protects future traffic.`,
    diagram: "Health Check → 200 OK = healthy | Failover → remove unhealthy, keep serving",
    keypoint: "Health checks enable automatic failover; failover protects future traffic.",
    tradeoff: "Failover reduces future failures but in-flight requests may still fail; detection adds overhead.",
  },
  {
    id: 7,
    section: "Day 8",
    name: "🌐 L4 vs L7 Load Balancing",
    hue: "sky",
    icon: "🌐",
    description: "Two levels of understanding that a load balancer can operate at.",
    content: `L4 = Transport Layer\n-------------------\nUnderstands mainly:\n    IP\n    Port\n    TCP\n    UDP\n\nThink:\n    "Where is this connection going?"\n\n\nL7 = Application Layer\n----------------------\nUnderstands:\n    HTTP\n    URL/path\n    Headers\n    Cookies\n    HTTP method\n\nExample:\n    /api/users\n          ↓\n       User Service\n\n    /api/orders\n          ↓\n       Order Service\n\nThink:\n    "What does this request want?"`,
    diagram: "L4 → connection-level (IP, port) | L7 → application-level (HTTP, path)",
    keypoint: "L4 = Where is the connection going? L7 = What does the request want?",
    tradeoff: "L4 is simpler and faster; L7 is more flexible but adds latency and processing overhead.",
  },
  {
    id: 8,
    section: "Day 8",
    name: "🧹 Stateless Servers & Shared State",
    hue: "violet",
    icon: "🧹",
    description: "Keep critical state out of local server memory for horizontal scaling.",
    content: `Bad for horizontal scaling:\n    let logged_in_users = new Set()\n\nIf user logs into S1:\n    S1 knows User A\n\nThen request goes to S3:\n    S3 doesn't know User A\n\nProblem = state exists only inside one server.\n\n\nBetter:\n    S1 ─┐\n    S2 ─┼──→ Shared State\n    S3 ─┘     ↓\n           Redis / DB /\n           Object Storage\n\n\nStateless server means:\nImportant request state is NOT dependent on\none server's local memory.\n\nIt does NOT mean:\n"There is no state anywhere."\n\nShared state can still exist in DB/Redis/etc.\n\n\nLOCAL FILES & SESSIONS\n----------------------\nAvoid important shared data in:\n    Server RAM\n    Server local filesystem\n    Local-only sessions\n\nExample:\n    S1 stores uploaded image locally\n\nLater:\n    User request → S3\n\nS3 doesn't have that file.\n\nFor shared files use:\n    Object Storage / shared storage`,
    diagram: "S1, S2, S3 → shared Redis/DB/Object Storage (stateless servers)",
    keypoint: "Stateless servers = no critical local-only state; shared state belongs in shared stores.",
    tradeoff: "Statelessness enables scalability but requires external shared state, adding latency and complexity.",
  },
  {
    id: 9,
    section: "Day 8",
    name: "🚀 Autoscaling",
    hue: "purple",
    icon: "🚀",
    description: "Automatically add or remove servers based on traffic metrics.",
    content: `Traffic changes over time.\n\nExample:\n    2 AM  → 200 req/s\n    6 PM  → 10,000 req/s\n\nInstead of permanently running many servers:\n    Autoscaler monitors metrics\n          ↓\n    Add/remove servers automatically\n\n\nExample:\n    CPU > 70%\n        ↓\n    Add servers\n\n    CPU < 30%\n        ↓\n    Remove servers\n\n\nPossible scaling signals:\n    CPU\n    Memory\n    Requests/sec\n    Latency\n    Active connections\n    Queue length\n\n\nIMPORTANT:\nApplication code usually doesn't create servers.\nInfrastructure/orchestration handles:\n    Create server\n    Destroy server\n    Monitor health\n    Register/remove server`,
    diagram: "Autoscaler → monitors metrics → adds/removes servers automatically",
    keypoint: "Autoscaling = capacity adjusts to demand without manual intervention.",
    tradeoff: "Elasticity can cause instability (rapid scale in/out) and requires careful metric selection.",
  },
  {
    id: 10,
    section: "Day 8",
    name: "🐢 Bottlenecks & Shared Bottlenecks",
    hue: "rose",
    icon: "🐢",
    description: "A bottleneck limits the whole system; scaling one part doesn't fix everything.",
    content: `BOTTLENECKS\n------------\nA bottleneck = component limiting system performance.\n\nPossible bottlenecks:\n    CPU\n    RAM\n    Disk I/O\n    Network\n    Database\n    Connection pool\n    External API\n    Queue\n    Locks/contention\n    Application code\n\nExample:\n    S1 ─┐\n    S2 ─┤\n    S3 ─┼──→ DB 🐌\n    S4 ─┤\n    S5 ─┘\n\nAdding more servers may NOT help.\nWhy? Database is the bottleneck.\n\n\nCORE RULE:\n    Find bottleneck\n          ↓\n    Fix bottleneck\n          ↓\n    Measure again\n          ↓\n    Find next bottleneck\n\n\nSHARED BOTTLENECK\n-----------------\nExample:\n1 server:\n    S1 → DB\n    1,000 req/s\n\n10 servers:\n    S1 ─┐\n    S2 ─┤\n    ... ├──→ DB\n    S10─┘\n\nYou might expect:\n    10 × 1,000 = 10,000 req/s\n\nBut if DB can't handle it:\n    Actual = maybe 2,000 req/s\n\nBecause the DB is the shared bottleneck.\nScaling one component doesn't automatically\nscale the entire system.`,
    diagram: "Scaling servers ≠ scaling system | DB is often the shared bottleneck",
    keypoint: "Find the bottleneck, fix it, measure again, find the next one.",
    tradeoff: "Scaling one layer may not help if another layer is the bottleneck; requires holistic analysis.",
  },
  {
    id: 11,
    section: "Day 8",
    name: "📐 Capacity Estimation & Headroom",
    hue: "orange",
    icon: "📐",
    description: "Estimate required servers roughly, then leave room for spikes.",
    content: `CAPACITY ESTIMATION\n---------------------\nUse rough numbers to understand required capacity.\n\nExample:\nUsers = 1,000,000\n\n10% active:\n    1,000,000 × 10%\n    = 100,000 active users\n\nEach makes 1 request / 10 sec:\n    100,000 / 10\n    = 10,000 req/sec\n\n\nIf one server handles ~1,000 req/sec:\n    10,000 / 1,000\n    = 10 servers\n\nThen add headroom/redundancy.\nMaybe: 12–15 servers\n\n\nExact numbers aren't the point.\nReasoning is the point.\n\n\nHEADROOM\n--------\nDon't operate servers permanently at 100%.\n\nExample:\n    Capacity = 1,000 req/s\nRunning constantly: 999 req/s\n\nTiny traffic spike:\n    999 → 1,300\n\nResults:\n    ↑ latency\n    ↑ timeout\n    ↑ failures\n\nLeave capacity headroom.\nAutoscaling can add capacity before\nthe system reaches its hard limit.`,
    diagram: "Estimate → add headroom → autoscale before hitting limits",
    keypoint: "Rough math guides capacity; headroom prevents cascading failures.",
    tradeoff: "Headroom avoids overload but wastes resources (cost) when traffic is low.",
  },
  {
    id: 12,
    section: "Day 8",
    name: "🏗️ Complete Architecture Evolution",
    hue: "amber",
    icon: "🏗️",
    description: "How a system evolves from one server to a fault-tolerant, scalable architecture.",
    content: `STAGE 1:\n    Users → Server → DB\n\nSTAGE 2 — Vertical scaling:\n    Users → Bigger Server → DB\n\nSTAGE 3 — Horizontal scaling:\n              ┌── S1\n    Users → LB├── S2\n              └── S3\n                  ↓\n                  DB\n\nSTAGE 4 — Autoscaling:\n                Autoscaler\n                    ↑\n                    │\n    Users → LB → S1 S2 S3 S4 S5 ...\n\nSTAGE 5 — Failure handling:\n              LB\n            / | \\\n           S1 S2 S3\n              ❌\n    → remove unhealthy S2\n\nSTAGE 6 — Shared state:\n           S1 ─┐\n           S2 ─┼──→ Redis / DB\n           S3 ─┘\n\nNow requests can go to any healthy server.`,
    diagram: "Single server → Vertical → Horizontal → Autoscale → Failover → Stateless + Shared State",
    keypoint: "Architecture evolves iteratively: scale → distribute → automate → decouple.",
    tradeoff: "Each stage adds complexity, operational overhead, and new failure modes.",
  },
  {
    id: 13,
    section: "Day 8",
    name: "🔥 System Design Loop & Final Mental Model",
    hue: "fuchsia",
    icon: "🔥",
    description: "The iterative design cycle and the questions to always ask.",
    content: `SYSTEM DESIGN LOOP\n------------------\n             Traffic increases\n                    ↓\n            Find bottleneck\n                    ↓\n             Scale/optimize\n                    ↓\n            Measure again\n                    ↓\n          New bottleneck appears\n                    ↓\n             Solve it\n                    ↓\n                  Repeat\n\n\nFINAL MENTAL MODEL\n------------------\nDon't ask:\n"Which architecture should I memorize?"\n\nAsk:\n    1. What is the load?\n    2. What is the bottleneck?\n    3. Can I scale vertically?\n    4. If not, can I scale horizontally?\n    5. How do I distribute traffic?\n    6. What happens if a server dies?\n    7. Where should shared state live?\n    8. Can capacity change automatically?\n    9. What becomes the NEXT bottleneck?\n\nThat is Day 8 system-design thinking.`,
    diagram: "Traffic ↑ → Bottleneck → Scale → Measure → New Bottleneck → Repeat",
    keypoint: "Scalability is not an architecture — it's a continuous problem-solving loop.",
    tradeoff: "Every solution introduces a new bottleneck; the process never ends.",
  },
];

// ─── Day 9: Database System Design ───────────────────────────────
const DAY9_CONCEPTS = [
  {
    id: 1,
    section: "Day 9",
    name: "🧠 Database Thinking Rule",
    hue: "indigo",
    icon: "🧠",
    description: "Start with the problem, not the solution.",
    content: `DON'T START WITH:\n"Should I use replication / sharding / Redis?"\n\nSTART WITH:\n          DATABASE\n             ↓\n      What is struggling?\n             ↓\n     Reads / Writes / Data /\n     Query speed / Connections /\n     Failure / Consistency\n             ↓\n       Solve that problem\n             ↓\n      What new problem appears?\n             ↓\n            Repeat\n\n🔥 DATABASE DESIGN = PROBLEM → SOLUTION → NEW TRADE-OFF`,
    diagram: "DB Problem → Identify Bottleneck → Apply Solution → New Trade-off → Repeat",
    keypoint: "Always ask: what is the current bottleneck?",
    tradeoff: "Mindset only — but every solution introduces a new trade-off.",
  },
  {
    id: 2,
    section: "Day 9",
    name: "📊 Read vs Write Workload",
    hue: "blue",
    icon: "📊",
    description: "Identify whether the DB is struggling with reads or writes.",
    content: `READ\n→ Get existing data.\nExample: SELECT * FROM users WHERE id = 10;\n\nWRITE\n→ INSERT / UPDATE / DELETE.\n\nExample:\n10,000 requests/sec\n9,000 READ\n1,000 WRITE\n→ READ-HEAVY\n\nKey question:\n"What type of workload is hurting the DB?"\n\nREAD problem? → replication / cache / indexes\nWRITE or DATA problem? → sharding / write optimization`,
    diagram: "Read-heavy → Replication/Cache/Index | Write-heavy → Sharding/Optimization",
    keypoint: "Diagnose workload type before choosing a solution.",
    tradeoff: "Read scaling solutions add staleness; write scaling solutions add complexity.",
  },
  {
    id: 3,
    section: "Day 9",
    name: "⚡ Indexing & Trade-offs",
    hue: "cyan",
    icon: "⚡",
    description: "Indexes speed up reads but cost writes and storage.",
    content: `Without index:\nQuery → scan many/all rows → 🐌\n\nWith index:\nQuery → Index → find matching row(s) → ⚡\n\nConcept: Index = additional data structure (often B-tree/B+ tree) that helps DB locate data faster.\n\nExample:\nCREATE INDEX idx_users_email ON users(email);\n\nThink:\nBook without index → scan pages\nBook with index → jump to relevant page\n\n🔥 TRADE-OFF:\nMore index → faster relevant READS\n+ more storage + more work on INSERT/UPDATE/DELETE\n\nSo don't index everything. Ask: "What queries does my application actually run?"`,
    diagram: "Index → faster reads | cost → slower writes + storage",
    keypoint: "Index only what your queries actually use.",
    tradeoff: "Faster reads at the cost of slower writes and increased storage.",
  },
  {
    id: 4,
    section: "Day 9",
    name: "🔍 Composite Index & Query Optimizer",
    hue: "teal",
    icon: "🔍",
    description: "Order matters in composite indexes; optimizer may skip index.",
    content: `Composite Index:\nWHERE user_id = ? AND status = ?\n\nCREATE INDEX idx_user_status\nON orders(user_id, status);\n\n🔥 ORDER MATTERS.\n(user_id, status) ≠ automatically the same as (status, user_id)\n\nQuery Optimizer:\nDB doesn't blindly use an index.\nIt chooses execution plan:\n- Index scan\n- Table scan\n\nSometimes a table scan is better (e.g., when a huge fraction of rows match).`,
    diagram: "Composite index → order matters | Query Optimizer → chooses best plan",
    keypoint: "Design indexes based on query patterns; optimizer may override.",
    tradeoff: "More indexes mean more write overhead; optimizer may skip an index if not beneficial.",
  },
  {
    id: 5,
    section: "Day 9",
    name: "📑 Replication (Copy)",
    hue: "emerald",
    icon: "📑",
    description: "Copy data to multiple DBs to scale reads and improve availability.",
    content: `Problem: ONE DB struggling mainly with READS.\n\nSolution:\n             Primary\n            /       \\\n           ↓         ↓\n       Replica 1  Replica 2\n\nSame data copied.\n\nFlow:\nWRITE → Primary → Replication → Replicas\nREAD  → Replica(s)\n\n🔥 REPLICATION = SAME DATA, MORE COPIES\n\nPurpose:\n→ Read scaling\n→ Redundancy\n→ Availability`,
    diagram: "Primary → replicas (copy)",
    keypoint: "Replication copies data to offload reads and add redundancy.",
    tradeoff: "Read scaling and availability at the cost of replication lag and stale reads.",
  },
  {
    id: 6,
    section: "Day 9",
    name: "⚠️ Replication Lag",
    hue: "green",
    icon: "⚠️",
    description: "Replicas may be slightly behind primary, causing stale reads.",
    content: `Replication is usually not instantaneous.\n\nBefore:\nPrimary → ₹500\nReplica → ₹500\n\nWrite:\nPrimary → ₹400\nReplica → ₹500  (temporarily old)\n\nImmediate read from replica → ₹500 ❌\n\nThis is REPLICATION LAG.\n\nTrade-off:\nReplication → more read capacity + redundancy\n→ possible stale reads\n\n🔥 Requirement decides whether stale data is acceptable.`,
    diagram: "Primary updated → replica lags → stale read possible",
    keypoint: "Replication lag = temporary inconsistency; know your tolerance.",
    tradeoff: "More replicas improve read scalability but increase lag and potential staleness.",
  },
  {
    id: 7,
    section: "Day 9",
    name: "🗂️ Sharding (Split)",
    hue: "violet",
    icon: "🗂️",
    description: "Split data across multiple DBs to scale writes and storage.",
    content: `Problem: Too many WRITES / too much DATA / one DB too large.\n\nOne DB:\n        DB\n ┌───────────────┐\n │ All the data  │\n └───────────────┘\n\nSplit into shards:\n             DATA\n               ↓\n       ┌───────┼───────┐\n       ↓       ↓       ↓\n      DB1     DB2     DB3\n\nEach DB owns DIFFERENT data.\n\n🔥 SHARDING = DIFFERENT DATA, SPLIT ACROSS DBS\n\nPurpose:\n→ Write scaling\n→ Storage scaling\n→ Workload distribution`,
    diagram: "One DB → multiple shards (split)",
    keypoint: "Sharding partitions data to scale writes and storage.",
    tradeoff: "Scales writes and storage but adds cross-shard complexity, hotspot risk, and operational overhead.",
  },
  {
    id: 8,
    section: "Day 9",
    name: "🆚 Replication vs Sharding",
    hue: "purple",
    icon: "🆚",
    description: "Copy vs Split — the most important distinction.",
    content: `REPLICATION:\n              Primary\n             /       \\\n            R1        R2\n→ COPY (same data)\n\nSHARDING:\n          All Data\n             ↓\n       ┌─────┼─────┐\n       ↓     ↓     ↓\n      DB1   DB2   DB3\n→ SPLIT (different data)\n\n🔥 Replication = COPY\n🔥 Sharding = SPLIT\n\nWhen to use:\nREAD problem → Replication\nWRITE/DATA problem → Sharding\nBoth? → Shard + Replicate`,
    diagram: "Replication = copy | Sharding = split",
    keypoint: "Copy for reads, split for writes/storage.",
    tradeoff: "Replication duplicates data; sharding partitions it. Each addresses different bottlenecks.",
  },
  {
    id: 9,
    section: "Day 9",
    name: "🔑 Shard Key & Range vs Hash",
    hue: "pink",
    icon: "🔑",
    description: "How to decide which shard holds which data.",
    content: `Shard Key = attribute used to route data.\n\nExample: user_id\n\nhash(user_id) % 3 → shard number\n\nRANGE SHARDING:\nDB1 → IDs 1–1M\nDB2 → IDs 1M–2M\nDB3 → IDs 2M–3M\nAdvantage: simple routing.\nProblem: possible HOT SHARDS (uneven traffic).\n\nHASH SHARDING:\nhash(user_id) % N\nGoal: more even distribution.\nProblem: changing shard count remaps many keys.\n(Consistent hashing can help.)\n\nGood shard key:\n→ Good distribution\n→ High cardinality\n→ Few hotspots\n→ Query locality`,
    diagram: "Shard key → route to DB | Range → simple but hotspots | Hash → balanced but remapping",
    keypoint: "Choose shard key balancing distribution, workload, and query locality.",
    tradeoff: "Range sharding is simple but risks hot shards; hash sharding is balanced but complicates resharding.",
  },
  {
    id: 10,
    section: "Day 9",
    name: "🔀 Cross-Shard Queries & Transactions",
    hue: "rose",
    icon: "🔀",
    description: "Sharding can complicate queries and transactions spanning multiple shards.",
    content: `Cross-shard query (scatter-gather):\n        Query\n          ↓\n    ┌─────┼─────┐\n    ↓     ↓     ↓\n   DB1   DB2   DB3\n    ↓     ↓     ↓\n results results results\n    └─────┼─────┘\n          ↓\n        MERGE\n\nProblem: more network calls, latency, complexity.\n\nCross-shard transaction:\nA → DB1\nB → DB2\nIf DB1 succeeds but DB2 fails → partial result.\n\n🔥 Shard key affects not only distribution,\n   but also transaction complexity.\nChoose shard key to keep related data together.`,
    diagram: "Scatter-gather: query all shards | Cross-shard txn: partial failure risk",
    keypoint: "Shard key should minimize cross-shard operations for common use cases.",
    tradeoff: "Sharding improves scalability but sacrifices single-DB transaction guarantees and may require scatter-gather.",
  },
  {
    id: 11,
    section: "Day 9",
    name: "🔌 Connection Pooling",
    hue: "orange",
    icon: "🔌",
    description: "Reuse DB connections to avoid per-request overhead.",
    content: `BAD:\nRequest → Open connection → Query → Close connection\n(high overhead)\n\nGOOD:\n             Connection Pool\n          ┌────┬────┬────┬────┐\n          ↓    ↓    ↓    ↓    ↓\n          C1   C2   C3   C4   C5\n                    ↓\n                    DB\n\nRequest → Borrow → Query → Return (reuse)\n\nTrade-off:\nPool too small → requests wait\nPool too large → DB overwhelmed\n\n🔥 Connection pool itself can become a bottleneck.`,
    diagram: "Pool → reuse connections | Too small → waiting | Too large → DB overload",
    keypoint: "Reuse connections to cut overhead; tune pool size carefully.",
    tradeoff: "Reusing connections cuts overhead but sizing must balance latency vs resource exhaustion.",
  },
  {
    id: 12,
    section: "Day 9",
    name: "🚀 Caching & Cache-Aside",
    hue: "amber",
    icon: "🚀",
    description: "Reduce DB reads by storing frequently accessed data in a fast cache.",
    content: `Without cache:\nRequest → DB\n\nWith cache:\nRequest → Cache\n   /    \\\nHIT   MISS\n |      |\nReturn  DB\n        ↓\n      Cache\n        ↓\n      Return\n\nCommon cache: Redis\n\n🔥 CACHE = TEMPORARY FAST COPY\n🔥 DATABASE = SOURCE OF TRUTH\n\nCACHE-ASIDE:\nREAD: check cache → if miss, load from DB → store in cache → return.\nWRITE: update DB → delete/invalidate cache.\n\nBenefit: 90% hit rate → DB load drops drastically.`,
    diagram: "Cache aside: read → cache; write → DB + invalidate",
    keypoint: "Cache reduces repeated reads; DB remains source of truth.",
    tradeoff: "Faster reads but introduces staleness and cache invalidation complexity.",
  },
  {
    id: 13,
    section: "Day 9",
    name: "🧊 Cache Consistency, TTL, Eviction & Stampede",
    hue: "fuchsia",
    icon: "🧊",
    description: "Managing staleness, expiry, and thundering herds.",
    content: `Cache Consistency:\nDB → ₹600\nCache → ₹500 ❌\nSolution: update DB → delete cache → next read repopulates.\n\nTTL (Time To Live):\nexpires after duration.\nShort TTL → fresher but more DB traffic.\nLong TTL → less DB traffic but more stale risk.\n\nEviction:\nCache full → which item to remove?\n- LRU: least recently used\n- LFU: least frequently used\n- TTL: expired by time\n\nCache Stampede:\nPopular entry expires → many MISS → DB storm.\nMitigations: randomized TTL, request coalescing, locking, background refresh.`,
    diagram: "Staleness → delete cache | TTL → expiry | LRU/LFU → eviction | Stampede → DB overload",
    keypoint: "TTL is a safety net; eviction policies manage limited cache space.",
    tradeoff: "Short TTL improves freshness but increases DB load; long TTL reduces load but risks staleness.",
  },
  {
    id: 14,
    section: "Day 9",
    name: "⚖️ Strong vs Eventual Consistency",
    hue: "red",
    icon: "⚖️",
    description: "Trade-off between freshness and scalability.",
    content: `STRONG CONSISTENCY\n→ Reads reflect latest committed value.\nExamples: bank balance, critical state.\n\nEVENTUAL CONSISTENCY\n→ Temporary differences acceptable; system converges later.\nExamples: social counts, recommendations.\n\nTrade-off:\nStrong → stronger guarantees, more coordination/cost/latency.\nEventual → more flexible/scalable, temporary stale data possible.\n\n🔥 BUSINESS REQUIREMENT DECIDES.`,
    diagram: "Strong → latest value | Eventual → converges later",
    keypoint: "Choose consistency model based on business needs.",
    tradeoff: "Strong consistency guarantees freshness but costs performance; eventual consistency scales better but allows staleness.",
  },
  {
    id: 15,
    section: "Day 9",
    name: "🛡️ DB Failure, Backups, RPO/RTO",
    hue: "cyan",
    icon: "🛡️",
    description: "Replication helps availability, backups enable recovery.",
    content: `DB Failure:\nUsers → Backend → DB ❌ → Application down.\n\nWith replicas:\n             Primary\n            /       \\\n           R1       R2\nIf Primary fails:\n             R1 → NEW PRIMARY (FAILOVER)\n\n⚠️ Replication lag may cause data loss during failover.\n\nBackups ≠ Replication.\nBackup = historical recovery copy.\nReplication = live copies.\n\nIf data accidentally deleted:\nBackup/logs → Restore → previous state.\nPoint-in-Time Recovery (PITR) uses backups + logs.\n\nRPO = How much data can we afford to lose? (e.g., 5 min)\nRTO = How long can recovery take? (e.g., 10 min)\n\nRecall:\nRPO → DATA LOSS tolerance\nRTO → DOWNTIME tolerance`,
    diagram: "Failover → replica promoted | Backup → restore | RPO/RTO → recovery targets",
    keypoint: "Replication for availability; backups for recovery; RPO/RTO define acceptable loss/downtime.",
    tradeoff: "Replication improves availability but may lose recent writes; backups consume storage and require recovery time.",
  },
];

// ─── Styling Helpers ──────────────────────────────────────────────
const HUE_MAP = {
  blue: {
    border: "border-blue-200 dark:border-blue-500/25",
    bg: "bg-blue-50/70 dark:bg-blue-500/[0.06]",
    text: "text-blue-600 dark:text-blue-300",
    badge: "bg-blue-500",
    accent: "text-blue-500 dark:text-blue-400",
  },
  cyan: {
    border: "border-cyan-200 dark:border-cyan-500/25",
    bg: "bg-cyan-50/70 dark:bg-cyan-500/[0.06]",
    text: "text-cyan-600 dark:text-cyan-300",
    badge: "bg-cyan-500",
    accent: "text-cyan-500 dark:text-cyan-400",
  },
  teal: {
    border: "border-teal-200 dark:border-teal-500/25",
    bg: "bg-teal-50/70 dark:bg-teal-500/[0.06]",
    text: "text-teal-600 dark:text-teal-300",
    badge: "bg-teal-500",
    accent: "text-teal-500 dark:text-teal-400",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-500/25",
    bg: "bg-emerald-50/70 dark:bg-emerald-500/[0.06]",
    text: "text-emerald-600 dark:text-emerald-300",
    badge: "bg-emerald-500",
    accent: "text-emerald-500 dark:text-emerald-400",
  },
  lime: {
    border: "border-lime-200 dark:border-lime-500/25",
    bg: "bg-lime-50/70 dark:bg-lime-500/[0.06]",
    text: "text-lime-700 dark:text-lime-300",
    badge: "bg-lime-500",
    accent: "text-lime-600 dark:text-lime-400",
  },
  green: {
    border: "border-green-200 dark:border-green-500/25",
    bg: "bg-green-50/70 dark:bg-green-500/[0.06]",
    text: "text-green-600 dark:text-green-300",
    badge: "bg-green-500",
    accent: "text-green-500 dark:text-green-400",
  },
  sky: {
    border: "border-sky-200 dark:border-sky-500/25",
    bg: "bg-sky-50/70 dark:bg-sky-500/[0.06]",
    text: "text-sky-600 dark:text-sky-300",
    badge: "bg-sky-500",
    accent: "text-sky-500 dark:text-sky-400",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-500/25",
    bg: "bg-indigo-50/70 dark:bg-indigo-500/[0.06]",
    text: "text-indigo-600 dark:text-indigo-300",
    badge: "bg-indigo-500",
    accent: "text-indigo-500 dark:text-indigo-400",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-500/25",
    bg: "bg-violet-50/70 dark:bg-violet-500/[0.06]",
    text: "text-violet-600 dark:text-violet-300",
    badge: "bg-violet-500",
    accent: "text-violet-500 dark:text-violet-400",
  },
  purple: {
    border: "border-purple-200 dark:border-purple-500/25",
    bg: "bg-purple-50/70 dark:bg-purple-500/[0.06]",
    text: "text-purple-600 dark:text-purple-300",
    badge: "bg-purple-500",
    accent: "text-purple-500 dark:text-purple-400",
  },
  pink: {
    border: "border-pink-200 dark:border-pink-500/25",
    bg: "bg-pink-50/70 dark:bg-pink-500/[0.06]",
    text: "text-pink-600 dark:text-pink-300",
    badge: "bg-pink-500",
    accent: "text-pink-500 dark:text-pink-400",
  },
  rose: {
    border: "border-rose-200 dark:border-rose-500/25",
    bg: "bg-rose-50/70 dark:bg-rose-500/[0.06]",
    text: "text-rose-600 dark:text-rose-300",
    badge: "bg-rose-500",
    accent: "text-rose-500 dark:text-rose-400",
  },
  red: {
    border: "border-red-200 dark:border-red-500/25",
    bg: "bg-red-50/70 dark:bg-red-500/[0.06]",
    text: "text-red-600 dark:text-red-300",
    badge: "bg-red-500",
    accent: "text-red-500 dark:text-red-400",
  },
  orange: {
    border: "border-orange-200 dark:border-orange-500/25",
    bg: "bg-orange-50/70 dark:bg-orange-500/[0.06]",
    text: "text-orange-600 dark:text-orange-300",
    badge: "bg-orange-500",
    accent: "text-orange-500 dark:text-orange-400",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-500/25",
    bg: "bg-amber-50/70 dark:bg-amber-500/[0.06]",
    text: "text-amber-600 dark:text-amber-300",
    badge: "bg-amber-500",
    accent: "text-amber-500 dark:text-amber-400",
  },
  fuchsia: {
    border: "border-fuchsia-200 dark:border-fuchsia-500/25",
    bg: "bg-fuchsia-50/70 dark:bg-fuchsia-500/[0.06]",
    text: "text-fuchsia-600 dark:text-fuchsia-300",
    badge: "bg-fuchsia-500",
    accent: "text-fuchsia-500 dark:text-fuchsia-400",
  },
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
      { threshold: 0.01, rootMargin: "0px 0px -10px 0px" },
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

      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {concept.description}
        </p>
      </div>

      <div className="mb-6 rounded-2xl bg-white dark:bg-white/5 px-6 py-5 shadow-sm">
        <pre className="text-base leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm">
          {concept.content}
        </pre>
      </div>

      {concept.diagram && (
        <pre className="mb-6 overflow-x-auto rounded-xl bg-gray-900 dark:bg-black/40 px-6 py-5 text-sm sm:text-base leading-relaxed text-emerald-300 font-mono">
          {concept.diagram}
        </pre>
      )}

      {concept.tradeoff && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border-2 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-5 py-4 shadow-sm">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-red-700 dark:text-red-300 mb-1">Trade-off:</p>
            <p className="text-base font-semibold text-red-800 dark:text-red-200 leading-relaxed">
              {concept.tradeoff}
            </p>
          </div>
        </div>
      )}

      {concept.keypoint && (
        <div className="flex items-start gap-3 rounded-xl bg-white dark:bg-white/5 px-5 py-4 shadow-sm">
          <span className="text-lg flex-shrink-0">🔑</span>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
            {concept.keypoint}
          </p>
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

// ─── Main Component ──────────────────────────────────────────────
function SystemDesign4() {
  const [progress, setProgress] = useState(0);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight =
        (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      setShowTopArrow(scrollTop > 200);
      setShowBottomArrow(scrollTop > 200 && scrollTop < scrollHeight - 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(LOAD_BALANCER_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-indigo-500 z-50 print:hidden"
        style={{ width: `${progress}%` }}
      />

      {/* floating arrows */}
      {showTopArrow && (
        <button
          onClick={scrollToBottom}
          className="fixed top-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all"
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
          className="fixed bottom-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all"
          title="Go to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      )}

      {/* header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14 flex items-start justify-between gap-6">
          <div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-sm font-bold px-5 py-2.5 shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all mb-6"
            >
              <span className="text-base">←</span>
              <span className="hidden sm:inline">Back to Blogs</span>
              <span className="sm:hidden">Blogs</span>
            </Link>

            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              ⚡ System Design Master Revision
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Scalability + Load Balancing
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
              Day 8 & Day 9 — Complete Revision Sheets
            </p>
          </div>
          <a
            href="#"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-5 py-3 text-sm sm:text-base font-bold text-white dark:text-gray-900 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Download size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-16">
        {/* Intro Mindset */}
        <RevealSection className="mb-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 sm:p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-3">
            The Bottleneck Mindset
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6">
            Don't memorize architectures — solve bottlenecks.
          </h2>
          <ul className="text-white/80 space-y-1 font-mono text-sm">
            <li>❓ What is the current load?</li>
            <li>❓ What is the bottleneck?</li>
            <li>❓ Can I scale vertically?</li>
            <li>❓ If not, can I scale horizontally?</li>
            <li>❓ How do I distribute traffic?</li>
            <li>❓ What happens if a server dies?</li>
            <li>❓ Where should shared state live?</li>
            <li>❓ What becomes the NEXT bottleneck?</li>
          </ul>
        </RevealSection>

        {/* Day 8 Concepts */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 8: Scalability + Load Balancing
          </h2>
          <div className="flex flex-col gap-10">
            {DAY8_CONCEPTS.map((c) => (
              <ConceptCard key={c.id} concept={c} />
            ))}
          </div>
        </RevealSection>

        {/* Python Code Block (Load Balancer) */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            🐍 Python Implementation — Load Balancer + Health Checks
          </h2>
          <div className="relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-6 shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Copy code"
            >
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed pr-10">
              {LOAD_BALANCER_CODE}
            </pre>
          </div>
        </RevealSection>

        {/* Day 9 Concepts */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 9: Database System Design
          </h2>
          <div className="flex flex-col gap-10">
            {DAY9_CONCEPTS.map((c) => (
              <ConceptCard key={c.id} concept={c} />
            ))}
          </div>
        </RevealSection>

        {/* Quick Recall Table for Day 9 */}
        <RevealSection className="mt-16 rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-500/[0.04] p-8 sm:p-10 mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Quick Recall — Database Distinctions
            </h2>
          </div>
          <div className="space-y-3">
            {[
              ["Replication", "COPY (same data on multiple DBs)"],
              ["Sharding", "SPLIT (different data on different DBs)"],
              ["Database", "Source of truth"],
              ["Cache", "Temporary fast copy"],
              ["Primary", "Main write/replication source"],
              ["Replica", "Copy used for reads/redundancy"],
              ["RPO", "How much data can be lost?"],
              ["RTO", "How much downtime can be tolerated?"],
              ["LRU", "Least recently used eviction"],
              ["LFU", "Least frequently used eviction"],
              ["TTL", "Time-based expiry"],
              ["Strong consistency", "Latest value expected"],
              ["Eventual consistency", "Temporary stale values acceptable"],
            ].map(([term, def]) => (
              <div
                key={term}
                className="flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-white/5 px-5 py-3.5 shadow-sm"
              >
                <span className="text-base font-bold text-gray-800 dark:text-gray-200 font-mono">
                  {term}
                </span>
                <span className="text-base text-gray-600 dark:text-gray-300 font-mono">
                  {def}
                </span>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Final Word */}
        <RevealSection className="rounded-3xl bg-gray-900 dark:bg-white/5 p-10 sm:p-14 text-white border border-white/10 text-center">
          <span className="text-4xl">🧭</span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">
            Think in Bottlenecks, Not Architectures
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed">
            <span className="font-bold text-white">Scaling</span> is an iterative process —<br />
            <span className="font-bold text-white">Load balancing</span> distributes traffic —<br />
            <span className="font-bold text-white">Databases</span> have their own scaling patterns —<br />
            <span className="font-bold text-white">Always ask: what's the bottleneck now?</span>
          </p>
          <p className="mt-8 text-base font-bold tracking-wide text-white/70">
            Problem → Bottleneck → Solution → Measure → Repeat
          </p>
        </RevealSection>
      </main>

      <Footer />
    </div>
  );
}

export default SystemDesign4;