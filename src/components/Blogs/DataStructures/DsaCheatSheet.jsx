import { useState, useEffect, useRef } from "react";
import { Zap, Timer, Download } from "lucide-react";

const PATTERNS = [
  {
    id: 1,
    name: "Sliding Window — Fixed Size",
    hue: "rose",
    clues: [
      "\u201csubarray/substring of size K\u201d — contiguous portion with exactly K elements",
      "\u201cevery window of length K\u201d — process each K-sized window",
      "\u201cmaximum/minimum sum of K consecutive elements\u201d — fixed number of elements",
      "\u201caverage of every K elements\u201d — fixed-size window",
    ],
    think: "Contiguous + exact K → Fixed Sliding Window",
    complexity: "O(n)",
  },
  {
    id: 2,
    name: "Sliding Window — Variable Size",
    hue: "orange",
    clues: [
      "\u201clongest subarray/substring\u201d — find the largest valid contiguous portion",
      "\u201cshortest/minimum length subarray\u201d — find the smallest valid contiguous portion",
      "\u201cat most K\u201d — maximum allowed quantity is K",
      "\u201csum \u2265 target\u201d / \u201csum \u2264 target\u201d — window must satisfy a sum bound",
      "\u201ccontains at most K distinct elements\u201d — limit the number of unique values",
    ],
    think: "Contiguous + condition + longest/shortest → Variable Sliding Window",
    examples: ["Longest Substring Without Repeating Characters", "Minimum Size Subarray Sum", "Fruit Into Baskets"],
  },
  {
    id: 3,
    name: "Two Pointers",
    hue: "amber",
    clues: [
      "Array is sorted — ordering can help eliminate possibilities",
      "\u201cfind a pair\u201d — usually two elements must satisfy a condition",
      "\u201cfind a triplet\u201d — often reduce the problem using two pointers",
      "\u201ctwo ends of an array matter\u201d — left and right boundaries are useful",
      "Need to move left and right — two indices scan the data",
    ],
    think: "Sorted + pair/triplet → Two Pointers",
    diagram: "[-4, -1, 0, 2, 5, 7]",
  },
  {
    id: 4,
    name: "Fast & Slow Pointers",
    hue: "yellow",
    clues: [
      "Linked list cycle — detect whether nodes form a loop",
      "Detect cycle — determine whether traversal repeats",
      "Find middle of linked list — use different pointer speeds",
      "Find cycle starting point — locate where the loop begins",
      "\u201cMove one pointer twice as fast\u201d — classic slow/fast technique",
    ],
    think: "Linked list + cycle/middle → Fast & Slow",
    diagram: "slow → 1 step\nfast → 2 steps",
  },
  {
    id: 5,
    name: "HashMap / HashSet",
    hue: "lime",
    clues: [
      "Need frequency — count how often values occur",
      "Need to know whether something appeared before — fast existence check",
      "Duplicate detection — check repeated values",
      "\u201cHave we seen this?\u201d — track previously encountered values",
      "Need O(1) lookup — constant-time average lookup",
    ],
    think: "Need fast lookup/count → Hashing",
    examples: ["Two Sum", "Contains Duplicate", "Frequency Counting", "Anagram"],
  },
  {
    id: 6,
    name: "Prefix Sum",
    hue: "emerald",
    clues: [
      "Repeated range sum — calculate many subarray/range sums",
      "\u201csum from L to R\u201d — query a specific range",
      "Subarray sum — calculate sums of contiguous portions",
      "Need cumulative information — store running totals",
      "Many queries on ranges — answer repeated range calculations efficiently",
    ],
    think: "Repeated range calculations → Prefix Sum",
    diagram: "prefix[i] = prefix[i-1] + arr[i]",
  },
  {
    id: 7,
    name: "Prefix Sum + HashMap",
    hue: "teal",
    clues: [
      "\u201cCount subarrays with sum K\u201d — count contiguous ranges whose sum equals K",
      "\u201cDoes a subarray have sum K?\u201d — check whether such a range exists",
      "Negative numbers present — normal sliding window may fail",
      "Need number of subarrays satisfying a sum condition — count valid ranges",
    ],
    think: "Subarray sum + arbitrary/negative numbers → Prefix Sum + HashMap",
    diagram: "prefixSum - K",
  },
  {
    id: 8,
    name: "Binary Search",
    hue: "cyan",
    clues: [
      "Array is sorted — ordered data allows elimination of half the search space",
      "Search efficiently — avoid linear scanning",
      "Find first/last occurrence — boundary search",
      "Lower bound / upper bound — find insertion boundaries",
      "Find minimum/maximum satisfying a condition — search for a valid boundary",
    ],
    think: "Sorted/search space → Binary Search",
    complexity: "O(log n)",
  },
  {
    id: 9,
    name: "Binary Search on Answer",
    hue: "sky",
    hot: true,
    clues: [
      "\u201cminimum possible...\u201d — find the smallest feasible answer",
      "\u201cmaximum possible...\u201d — find the largest feasible answer",
      "\u201csmallest X such that...\u201d / \u201clargest X such that...\u201d — search for a valid boundary",
      "\u201cCan we do it in X?\u201d — turn optimization into yes/no checking",
      "Answer lies within a range — there is a searchable answer space",
      "You can write a check(mid) function — test whether a candidate answer works",
    ],
    think: "Optimization + Yes/No feasibility → Binary Search on Answer",
  },
  {
    id: 10,
    name: "Stack — Monotonic Stack",
    hue: "blue",
    clues: [
      "Next greater element — first larger element to the right",
      "Next smaller element — first smaller element to the right",
      "Previous greater/smaller — nearest qualifying element on the left",
      "Nearest greater/smaller — find the closest element satisfying a comparison",
      "Histogram — bars often require nearest smaller boundaries",
    ],
    think: "Nearest greater/smaller → Monotonic Stack",
    examples: ["Next Greater Element", "Daily Temperatures", "Largest Rectangle in Histogram"],
  },
  {
    id: 11,
    name: "Stack — Parentheses / Expression",
    hue: "indigo",
    clues: [
      "Balanced parentheses — match opening and closing brackets",
      "Valid brackets — check correct nesting/order",
      "Nested expressions — last opened structure closes first",
      "Undo-like behavior — most recent operation is handled first",
      "Last opened → first closed — LIFO behavior",
    ],
    think: "Nested / matching structure → Stack",
    diagram: "{ [ ( ) ] }",
  },
  {
    id: 12,
    name: "Heap / Priority Queue",
    hue: "violet",
    clues: [
      "Top K — only the K most important elements are needed",
      "K largest/smallest — maintain K extreme elements",
      "Repeatedly get minimum/maximum — always need the smallest or largest current value",
      "Maintain current smallest/largest — dynamic min/max tracking",
      "Scheduling based on priority — process the highest-priority item first",
    ],
    think: "Repeated min/max → Heap",
    examples: ["Kth Largest", "Top K Frequent", "Merge K Sorted Lists", "Meeting Rooms"],
  },
  {
    id: 13,
    name: "Greedy",
    hue: "purple",
    warning: "Do not assume greedy only because the question asks for a maximum/minimum.",
    clues: [
      "Make the best choice now — choose the locally optimal option",
      "Maximize/minimize something — optimization objective",
      "Choice doesn't need to be revisited — decision can be permanently committed",
      "\u201cEarliest finishing\u201d — choose the activity that leaves maximum future space",
      "Sorting enables local decisions — ordering reveals the greedy choice",
    ],
    think: "Local optimal choice → possibly Greedy",
  },
  {
    id: 14,
    name: "Interval Pattern",
    hue: "fuchsia",
    clues: [
      "[start, end] — each item represents a range",
      "Meetings / Events / Jobs — time ranges that may overlap",
      "Overlapping intervals — ranges intersect",
      "Merge intervals — combine overlapping ranges",
      "Insert interval — add a new range while preserving order",
    ],
    think: "Start/end ranges → Sort by start/end",
    diagram: "sort(intervals.begin(), intervals.end());",
  },
  {
    id: 15,
    name: "Backtracking",
    hue: "pink",
    clues: [
      "\u201cGenerate all...\u201d — need every valid possibility",
      "\u201cFind all possible...\u201d — explore multiple choices",
      "Combinations — choose elements without caring about order",
      "Permutations — arrange elements in different orders",
      "Subsets — choose or skip each element",
      "Choices at every step — multiple decisions create a search tree",
    ],
    think: "All possibilities → Backtracking",
    diagram: "        []\n       / | \\\n      A  B  C\n     / \\\n    AB  AC",
  },
  {
    id: 16,
    name: "Bit Manipulation",
    hue: "rose",
    clues: [
      "XOR — use properties of binary bits",
      "Set/unset bits — modify individual bits",
      "Odd/even bit behavior — inspect binary representation",
      "Powers of 2 — binary numbers with one set bit",
      "\u201cOnly one number appears once\u201d — XOR can cancel duplicates",
      "\u201cEvery number appears twice except...\u201d — XOR pairs cancel to zero",
    ],
    think: "Binary properties → Bits",
    diagram: "x ^ x = 0\nx ^ 0 = x",
  },
  {
    id: 17,
    name: "Recursion / Tree DFS",
    hue: "orange",
    clues: [
      "Binary tree — naturally represented recursively",
      "Subtree — solve the same problem on a smaller tree",
      "Height/depth — combine information from children",
      "Root-to-leaf / Path — combine information along tree paths",
      "Left/right child — process both subtrees",
      "\u201cFor every node...\u201d — perform the same operation recursively",
    ],
    think: "Tree → Ask the left and right subtrees",
    diagram: "solve(node->left);\nsolve(node->right);",
  },
  {
    id: 18,
    name: "Tree BFS / Level Order",
    hue: "amber",
    clues: [
      "Level by level — process nodes based on depth",
      "Level order — visit each tree level together",
      "Distance from root — depth can be measured using BFS",
      "Minimum number of levels — find the closest level",
      "Zigzag traversal — alternate direction at each level",
      "Nodes at distance K — process nodes by distance",
    ],
    think: "Tree + levels → BFS / Queue",
    diagram: "      1\n    /   \\\n   2     3\n  / \\\n 4   5\n\nLevel 0 → 1\nLevel 1 → 2,3\nLevel 2 → 4,5",
  },
  {
    id: 19,
    name: "BST Pattern",
    hue: "lime",
    clues: [
      "Binary Search Tree — left < root < right ordering",
      "Sorted order — inorder traversal produces sorted values",
      "Find predecessor/successor — use BST ordering",
      "Kth smallest — inorder gives sorted sequence",
      "Search/insert/delete — BST property reduces search area",
    ],
    think: "BST → Exploit ordering",
    hot: true,
    note: "Inorder traversal of BST = sorted order",
  },
  {
    id: 20,
    name: "Graph BFS / DFS",
    hue: "emerald",
    clues: [
      "Connected components — find separate connected groups",
      "Islands — grid cells form connected components",
      "Reachability — determine whether one node can reach another",
      "\u201cCan we reach...\u201d — graph traversal problem",
      "Visit all connected nodes — explore one component",
      "Grid with neighboring cells — treat cells as graph nodes",
    ],
    think: "Connectivity → DFS/BFS",
    examples: ["Number of Islands", "Flood Fill", "Connected Components"],
  },
  {
    id: 21,
    name: "Graph BFS — Shortest Path",
    hue: "teal",
    clues: [
      "Shortest path — minimum distance between nodes",
      "Minimum number of steps — each move has equal cost",
      "Every edge has equal weight — BFS levels represent distance",
      "Grid movement — each move usually costs one step",
      "\u201cFewest moves\u201d — minimum number of transitions",
    ],
    think: "Unweighted graph + shortest path → BFS",
    diagram: "distance 0\n   ↓\ndistance 1\n   ↓\ndistance 2\n   ↓\ndistance 3",
  },
  {
    id: 22,
    name: "Dijkstra",
    hue: "cyan",
    clues: [
      "Shortest path — find minimum total path cost",
      "Weighted graph — edges have costs/weights",
      "Edge weights are non-negative — Dijkstra requires non-negative weights",
      "Need minimum distance from source — single-source shortest path",
    ],
    think: "Weighted + non-negative → Dijkstra",
    diagram: "priority_queue<\n  pair<int,int>,\n  vector<pair<int,int>>,\n  greater<pair<int,int>>\n> pq;",
  },
  {
    id: 23,
    name: "Topological Sort",
    hue: "sky",
    clues: [
      "Prerequisite — one task must happen before another",
      "Dependency — tasks depend on other tasks",
      "Course schedule — courses have prerequisite relationships",
      "Build order — dependencies determine execution order",
      "\u201cA must happen before B\u201d — directed dependency",
      "Directed graph — topological ordering applies to DAGs",
    ],
    think: "Dependency/order → Topological Sort",
    examples: ["Kahn's Algorithm → BFS + indegree", "DFS"],
  },
  {
    id: 24,
    name: "Dynamic Programming",
    hue: "blue",
    hot: true,
    clues: [
      "\u201cMaximum/minimum number of...\u201d — optimize a result",
      "\u201cNumber of ways...\u201d — count different valid choices",
      "\u201cCan we achieve...\u201d — determine whether a state is reachable",
      "Repeated subproblems — same smaller problem appears multiple times",
      "Choices at every position — different decisions lead to different states",
      "Brute force recursion has overlapping states — memoization removes repeated work",
    ],
    think: "Choices + overlapping subproblems → DP",
    note: "What is my state? What choices do I have? What is the transition?",
  },
  {
    id: 25,
    name: "Union Find / DSU",
    hue: "violet",
    clues: [
      "Dynamic connectivity — connections change over time",
      "Merge groups — combine two components",
      "Are A and B connected? — check whether two nodes belong to the same component",
      "Number of connected components — track separate groups",
      "Detect cycle in undirected graph — cycle detection using components",
      "Kruskal's algorithm — MST algorithm based on DSU",
    ],
    think: "Repeatedly merge/check groups → DSU",
    diagram: "find(x)\nunion(a,b)",
  },
];

const TRIGGER_TABLE = [
  ["Subarray + size K", "Fixed Sliding Window"],
  ["Longest/shortest subarray", "Variable Sliding Window"],
  ["Sorted + pair", "Two Pointers"],
  ["Linked list + cycle", "Fast/Slow"],
  ["Frequency/count/seen", "HashMap"],
  ["Range sum", "Prefix Sum"],
  ["Subarray sum K", "Prefix Sum + HashMap"],
  ["Sorted/search space", "Binary Search"],
  ["Minimum possible X", "Binary Search on Answer"],
  ["Next greater/smaller", "Monotonic Stack"],
  ["Balanced brackets", "Stack"],
  ["Top K", "Heap"],
  ["Repeated min/max", "Heap"],
  ["Start/end ranges", "Intervals"],
  ["All possible", "Backtracking"],
  ["Binary/XOR", "Bit Manipulation"],
  ["Tree path/height", "DFS"],
  ["Tree levels", "BFS"],
  ["BST", "Inorder / BST properties"],
  ["Connected components", "DFS/BFS/DSU"],
  ["Shortest unweighted path", "BFS"],
  ["Shortest weighted path", "Dijkstra"],
  ["Prerequisites/dependencies", "Topological Sort"],
  ["Choices + overlapping states", "DP"],
  ["Merge/check groups", "DSU"],
  ["Local optimal choice", "Greedy"],
];

const HUE_MAP = {
  rose: { border: "border-rose-200 dark:border-rose-500/25", bg: "bg-rose-50/70 dark:bg-rose-500/[0.06]", text: "text-rose-600 dark:text-rose-300", badge: "bg-rose-500", accent: "text-rose-500 dark:text-rose-400" },
  orange: { border: "border-orange-200 dark:border-orange-500/25", bg: "bg-orange-50/70 dark:bg-orange-500/[0.06]", text: "text-orange-600 dark:text-orange-300", badge: "bg-orange-500", accent: "text-orange-500 dark:text-orange-400" },
  amber: { border: "border-amber-200 dark:border-amber-500/25", bg: "bg-amber-50/70 dark:bg-amber-500/[0.06]", text: "text-amber-600 dark:text-amber-300", badge: "bg-amber-500", accent: "text-amber-500 dark:text-amber-400" },
  yellow: { border: "border-yellow-200 dark:border-yellow-500/25", bg: "bg-yellow-50/70 dark:bg-yellow-500/[0.06]", text: "text-yellow-700 dark:text-yellow-300", badge: "bg-yellow-500", accent: "text-yellow-600 dark:text-yellow-400" },
  lime: { border: "border-lime-200 dark:border-lime-500/25", bg: "bg-lime-50/70 dark:bg-lime-500/[0.06]", text: "text-lime-700 dark:text-lime-300", badge: "bg-lime-500", accent: "text-lime-600 dark:text-lime-400" },
  emerald: { border: "border-emerald-200 dark:border-emerald-500/25", bg: "bg-emerald-50/70 dark:bg-emerald-500/[0.06]", text: "text-emerald-600 dark:text-emerald-300", badge: "bg-emerald-500", accent: "text-emerald-500 dark:text-emerald-400" },
  teal: { border: "border-teal-200 dark:border-teal-500/25", bg: "bg-teal-50/70 dark:bg-teal-500/[0.06]", text: "text-teal-600 dark:text-teal-300", badge: "bg-teal-500", accent: "text-teal-500 dark:text-teal-400" },
  cyan: { border: "border-cyan-200 dark:border-cyan-500/25", bg: "bg-cyan-50/70 dark:bg-cyan-500/[0.06]", text: "text-cyan-600 dark:text-cyan-300", badge: "bg-cyan-500", accent: "text-cyan-500 dark:text-cyan-400" },
  sky: { border: "border-sky-200 dark:border-sky-500/25", bg: "bg-sky-50/70 dark:bg-sky-500/[0.06]", text: "text-sky-600 dark:text-sky-300", badge: "bg-sky-500", accent: "text-sky-500 dark:text-sky-400" },
  blue: { border: "border-blue-200 dark:border-blue-500/25", bg: "bg-blue-50/70 dark:bg-blue-500/[0.06]", text: "text-blue-600 dark:text-blue-300", badge: "bg-blue-500", accent: "text-blue-500 dark:text-blue-400" },
  indigo: { border: "border-indigo-200 dark:border-indigo-500/25", bg: "bg-indigo-50/70 dark:bg-indigo-500/[0.06]", text: "text-indigo-600 dark:text-indigo-300", badge: "bg-indigo-500", accent: "text-indigo-500 dark:text-indigo-400" },
  violet: { border: "border-violet-200 dark:border-violet-500/25", bg: "bg-violet-50/70 dark:bg-violet-500/[0.06]", text: "text-violet-600 dark:text-violet-300", badge: "bg-violet-500", accent: "text-violet-500 dark:text-violet-400" },
  purple: { border: "border-purple-200 dark:border-purple-500/25", bg: "bg-purple-50/70 dark:bg-purple-500/[0.06]", text: "text-purple-600 dark:text-purple-300", badge: "bg-purple-500", accent: "text-purple-500 dark:text-purple-400" },
  fuchsia: { border: "border-fuchsia-200 dark:border-fuchsia-500/25", bg: "bg-fuchsia-50/70 dark:bg-fuchsia-500/[0.06]", text: "text-fuchsia-600 dark:text-fuchsia-300", badge: "bg-fuchsia-500", accent: "text-fuchsia-500 dark:text-fuchsia-400" },
  pink: { border: "border-pink-200 dark:border-pink-500/25", bg: "bg-pink-50/70 dark:bg-pink-500/[0.06]", text: "text-pink-600 dark:text-pink-300", badge: "bg-pink-500", accent: "text-pink-500 dark:text-pink-400" },
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

function PatternCard({ p }) {
  const h = HUE_MAP[p.hue];
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
            {p.id}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
            {p.name}
          </h3>
        </div>
        {p.hot && (
          <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gray-900 dark:bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            <Zap size={13} strokeWidth={3} className={h.accent} />
            High leverage
          </span>
        )}
      </div>

      {/* trigger clues */}
      <div className="mb-6">
        <p className={`mb-3 text-sm font-bold uppercase tracking-wide ${h.text}`}>
          Trigger clues
        </p>
        <ul className="space-y-2.5">
          {p.clues.map((clue, i) => (
            <li key={i} className="flex gap-3 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <span className={`mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${h.badge}`} />
              <span>{clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {p.warning && (
        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-500/25 bg-red-50 dark:bg-red-500/10 px-5 py-4 text-base font-medium text-red-700 dark:text-red-300 leading-relaxed">
          ⚠️ {p.warning}
        </div>
      )}

      {/* Think line */}
      <div className="mb-6 rounded-2xl bg-white dark:bg-white/5 px-6 py-5 shadow-sm">
        <p className="text-lg sm:text-xl leading-relaxed">
          <span className="font-bold text-gray-900 dark:text-white">Think: </span>
          <span className="text-gray-600 dark:text-gray-300">{p.think}</span>
        </p>
      </div>

      {/* diagram / code block */}
      {p.diagram && (
        <pre className="mb-6 overflow-x-auto rounded-xl bg-gray-900 dark:bg-black/40 px-6 py-5 text-sm sm:text-base leading-relaxed text-emerald-300 font-mono">
          {p.diagram}
        </pre>
      )}

      {/* note */}
      {p.note && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-white dark:bg-white/5 px-5 py-4 shadow-sm">
          <span className="text-lg">🔥</span>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{p.note}</p>
        </div>
      )}

      {/* examples */}
      {p.examples && (
        <div className="mb-2">
          <p className={`mb-3 text-sm font-bold uppercase tracking-wide ${h.text}`}>
            Examples
          </p>
          <div className="flex flex-wrap gap-2">
            {p.examples.map((ex, i) => (
              <span
                key={i}
                className="rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* complexity */}
      {p.complexity && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white/10 px-4 py-2 text-sm font-bold text-white dark:text-gray-200 font-mono">
          <Timer size={14} strokeWidth={2.5} />
          {p.complexity}
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

const DSAPatternCheatSheet = ({ pdfUrl = "/DSA_Pattern_Recognition_Cheat_Sheet.pdf" }) => {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* Page header — theme handled by site Navbar, not here */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              🧠 Interview prep
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              DSA Pattern Recognition
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
              25 patterns for coding interview preparation
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
            The goal is not to memorize solutions
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6">
            Memorize the trigger clues.
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-bold">
            {["Question", "Clues", "Pattern", "Algorithm"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-white/15 px-4 py-2">{step}</span>
                {i < arr.length - 1 && <span className="text-white/50">→</span>}
              </span>
            ))}
          </div>
        </RevealSection>

        {/* Pattern list — one after another */}
        <div className="flex flex-col gap-10">
          {PATTERNS.map((p) => (
            <PatternCard key={p.id} p={p} />
          ))}
        </div>

        {/* Trigger table — 150% width of the max-w-3xl column above */}
        <RevealSection className="mt-16 w-full flex justify-center">
          <div className="w-full max-w-[1152px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                The Ultimate Trigger Table
              </h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2">
              {TRIGGER_TABLE.map(([clue, pattern], i) => (
                <div
                  key={clue}
                  className={`flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-base sm:text-lg ${
                    i % 2 === 0 ? "bg-white dark:bg-white/[0.02]" : "bg-gray-50 dark:bg-white/[0.05]"
                  }`}
                >
                  <span className="text-gray-500 dark:text-gray-400">{clue}</span>
                  <span className="font-bold text-gray-900 dark:text-white text-right">{pattern}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* 30-second routine */}
        <RevealSection className="mt-16 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-500/30 bg-orange-50/40 dark:bg-orange-500/[0.04] p-8 sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              30-Second Pattern Recognition Routine
            </h2>
          </div>
          <ol className="space-y-4">
            {[
              "What is the input structure? Array / String / Linked List / Tree / Graph?",
              "What are the important words? longest / shortest / count / all / minimum / maximum?",
              "Is it contiguous? Subarray / substring?",
              "Is it sorted?",
              "What are the constraints? O(n), O(n log n), O(n²)?",
              "What operation is repeated? lookup / min / max / nearest / connectivity?",
              "What pattern does this remind me of?",
            ].map((q, i) => (
              <li key={i} className="flex items-start gap-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5">{q}</span>
              </li>
            ))}
          </ol>
        </RevealSection>

        {/* Quick reminders */}
        <RevealSection className="mt-16">
          <div className="flex flex-col gap-4">
            {[
              "Binary Search on Answer is one of the highest-leverage patterns — whenever you can write a check(mid) feasibility function, the problem is very likely searchable.",
              "Greedy should never be assumed just because a question asks for a maximum or minimum — verify the local-choice logic actually holds before committing to it.",
              "BST problems almost always reduce to one fact: inorder traversal of a BST produces sorted order.",
              "When brute-force recursion has overlapping subproblems, that overlap — not the recursion itself — is the real signal for Dynamic Programming.",
            ].map((tip, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] p-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                📌 {tip}
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Closing */}
        <RevealSection className="mt-16 text-center rounded-3xl bg-gray-900 dark:bg-white/5 p-10 sm:p-14 text-white border border-white/10">
          <span className="text-4xl">🎯</span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">The Goal</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed">
            Practice this deliberately for 50–100 problems and instead of seeing 100 different DSA
            questions, you'll start seeing roughly 20–30 recurring problem shapes. That's the actual
            skill you're building: <span className="font-bold text-white">Pattern Recognition.</span>
          </p>
          <p className="mt-6 text-base font-bold tracking-wide text-white/70">
            Question → Clues → Pattern → Algorithm → Code
          </p>
        </RevealSection>
      </main>
    </div>
  );
};

export default DSAPatternCheatSheet;