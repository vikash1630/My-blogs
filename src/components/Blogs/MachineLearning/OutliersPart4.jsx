import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from "../../UI/Footer";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const GROUPS = [
  {
    id: "basics",
    title: "Outlier Basics",
    intro: "What outliers are, which models they hurt, and the ways to detect and treat them.",
    accent: "rose",
    concepts: [
      {
        id: 1,
        name: "What are Outliers",
        problem:
          "Some values in a column are extremely far from the rest, like a salary of 10 crore among normal salaries or an age of 200. They pull the model in the wrong direction and give bad results.",
        definition:
          "Outliers are data points that differ significantly from the other observations in a dataset. Example: in ages 22, 25, 28, 30, 200, the value 200 is the outlier.",
        lists: [
          {
            title: "Why they appear",
            points: [
              "Data entry or measurement mistakes.",
              "Genuinely rare values, like a real billionaire in a salary column.",
            ],
          },
          {
            title: "Where to check",
            points: ["In the EDA step, using a histogram, box plot or density plot."],
          },
        ],
        table: {
          head: ["Effect", "Models"],
          rows: [
            ["Affected (they learn weights)", "Linear regression, logistic regression, AdaBoost, deep learning"],
            ["Not affected much", "Decision tree, random forest, gradient boosting"],
          ],
        },
        keypoint: "Outlier means an extreme value. Detect it first, then decide how to treat it.",
      },
      {
        id: 2,
        name: "Detecting and Treating Outliers",
        definition: "Three ways to detect outliers and four ways to treat them.",
        table: {
          head: ["Detection method", "Use for"],
          rows: [
            ["Z-score method", "Normally distributed data"],
            ["IQR method", "Skewed data"],
            ["Percentile method", "Any distribution"],
          ],
        },
        cardsTitle: "4 ways to treat",
        cards: [
          { title: "Trimming", text: "Remove the outlier rows." },
          { title: "Capping (winsorization)", text: "Replace outliers with a limit value. The rows stay." },
          { title: "Treat as missing values", text: "Set them to NaN and impute." },
          { title: "Discretization", text: "Put them in the last bin." },
        ],
        points: [
          "First check if the outlier is a mistake or a real value. Real values may carry important information.",
          "Trimming loses data. Capping keeps all rows.",
          "Limits are learned from train data only.",
        ],
        keypoint: "Detect with Z-score, IQR or percentile. Treat with trimming or capping.",
      },
    ],
  },
  {
    id: "methods",
    title: "Detection Methods",
    intro: "Z-score, IQR and percentile, and how to pick between them.",
    accent: "indigo",
    concepts: [
      {
        id: 3,
        name: "Z-score Method",
        problem: "We need a clear rule to find outliers in a normally distributed column.",
        definition:
          "The Z-score method measures how many standard deviations a value is from the mean. Too far means outlier.",
        formula: "z = (x - mean) / std",
        table: {
          head: ["Rule", "Limit"],
          rows: [
            ["Outlier if", "`z > 3` or `z < -3`"],
            ["Upper limit", "`mean + 3 * std`"],
            ["Lower limit", "`mean - 3 * std`"],
          ],
        },
        lists: [
          {
            title: "Treatment",
            points: ["Trimming: remove outlier rows.", "Capping: replace outliers with the limit values."],
          },
        ],
        points: [
          "Use only on roughly normal data. For skewed data use IQR.",
          "Mean and std are themselves affected by outliers.",
          "Learn limits from train data only.",
        ],
        code: `upper = X_train["Age"].mean() + 3 * X_train["Age"].std()
lower = X_train["Age"].mean() - 3 * X_train["Age"].std()

trimmed = X_train[(X_train["Age"] < upper) & (X_train["Age"] > lower)]   # trimming
X_train["Age"] = X_train["Age"].clip(lower, upper)                       # capping`,
        keypoint: "Z-score: more than 3 standard deviations away is an outlier.",
      },
      {
        id: 4,
        name: "IQR Method",
        problem: "Z-score fails on skewed data because the mean and std get dragged by the tail.",
        definition: "The IQR method finds outliers using the middle 50% of the data, so it works on skewed data.",
        formula: "IQR = Q3 - Q1",
        table: {
          head: ["Term / Rule", "Meaning"],
          rows: [
            ["Q1", "25th percentile"],
            ["Q3", "75th percentile"],
            ["Upper limit", "`Q3 + 1.5 * IQR`"],
            ["Lower limit", "`Q1 - 1.5 * IQR`"],
          ],
        },
        points: [
          "Outside the limits means outlier. These limits are the whiskers of a box plot.",
          "Use on skewed data.",
          "Trimming and capping work the same as in Z-score.",
          "Learn limits from train data only.",
        ],
        code: `q1 = X_train["Fare"].quantile(0.25)
q3 = X_train["Fare"].quantile(0.75)
iqr = q3 - q1

upper = q3 + 1.5 * iqr
lower = q1 - 1.5 * iqr`,
        keypoint: "IQR ignores the tails, so skewed data does not fool it.",
      },
      {
        id: 5,
        name: "Percentile Method and Winsorization",
        problem: "Z-score needs normal data and IQR is for skewed data. We want a method that works on any distribution.",
        definition:
          "The percentile method treats values below a lower percentile and above an upper percentile as outliers, for example the 1st and 99th.",
        lists: [
          {
            title: "Winsorization",
            points: [
              "Capping at percentile limits.",
              "Values below the lower percentile become the lower value. Values above the upper percentile become the upper value.",
            ],
          },
        ],
        points: [
          "Works on any distribution.",
          "It always flags that percentage of data (2% for 1st/99th), even if no real outliers exist.",
          "We choose the percentile cut-off ourselves.",
          "Learn limits from train data only.",
        ],
        code: `lower = X_train["Fare"].quantile(0.01)
upper = X_train["Fare"].quantile(0.99)

X_train["Fare"] = X_train["Fare"].clip(lower, upper)   # winsorization`,
        keypoint: "Percentile works on any data, but it always cuts the percentage you choose.",
      },
      {
        id: 6,
        name: "Which Method to Use",
        definition: "A quick summary of detection and treatment.",
        table: {
          head: ["Data", "Method"],
          rows: [
            ["Normal data", "Z-score"],
            ["Skewed data", "IQR"],
            ["Any data", "Percentile"],
          ],
        },
        points: ["Trimming = remove rows.", "Capping = replace with the limit."],
        keypoint: "Normal data: Z-score. Skewed data: IQR. Any data: Percentile.",
      },
    ],
  },
];

/* Static class strings so Tailwind can see every one of them */
const ACCENTS = {
  indigo: {
    bar: "bg-indigo-500",
    badge: "bg-indigo-600 dark:bg-indigo-500 text-white",
    text: "text-indigo-700 dark:text-indigo-300",
    key: "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
    dot: "bg-indigo-500",
    soft: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-400/20",
    chip: "hover:border-indigo-400 hover:text-indigo-700 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300",
  },
  emerald: {
    bar: "bg-emerald-500",
    badge: "bg-emerald-700 dark:bg-emerald-500 text-white dark:text-gray-950",
    text: "text-emerald-700 dark:text-emerald-300",
    key: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
    dot: "bg-emerald-500",
    soft: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-400/20",
    chip: "hover:border-emerald-400 hover:text-emerald-700 dark:hover:border-emerald-400/60 dark:hover:text-emerald-300",
  },
  amber: {
    bar: "bg-amber-500",
    badge: "bg-amber-700 dark:bg-amber-500 text-white dark:text-gray-950",
    text: "text-amber-700 dark:text-amber-300",
    key: "border-amber-500 bg-amber-50 dark:bg-amber-500/10",
    dot: "bg-amber-500",
    soft: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-400/20",
    chip: "hover:border-amber-400 hover:text-amber-700 dark:hover:border-amber-400/60 dark:hover:text-amber-300",
  },
  rose: {
    bar: "bg-rose-500",
    badge: "bg-rose-600 dark:bg-rose-500 text-white dark:text-gray-950",
    text: "text-rose-700 dark:text-rose-300",
    key: "border-rose-500 bg-rose-50 dark:bg-rose-500/10",
    dot: "bg-rose-500",
    soft: "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-400/20",
    chip: "hover:border-rose-400 hover:text-rose-700 dark:hover:border-rose-400/60 dark:hover:text-rose-300",
  },
};

/* ------------------------------------------------------------------ */
/*  SMALL HELPERS                                                      */
/* ------------------------------------------------------------------ */

// Lightweight Python highlighter: comments, strings, keywords, numbers
const TOKEN =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(from|import|as|class|def|return|True|False|None)\b|\b(\d+(?:\.\d+)?)\b/gm;

const TOKEN_CLASS = [
  null,
  "italic text-gray-400 dark:text-gray-500", // comment
  "text-emerald-700 dark:text-emerald-300", // string
  "font-semibold text-violet-700 dark:text-violet-300", // keyword
  "text-sky-700 dark:text-sky-300", // number
];

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const parts = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) parts.push(code.slice(last, m.index));
    const group = [1, 2, 3, 4].find((i) => m[i] !== undefined);
    parts.push(
      <span key={m.index} className={TOKEN_CLASS[group]}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  parts.push(code.slice(last));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      /* clipboard not available */
    }
  };

  return (
    <div className="relative">
      <button
        onClick={copy}
        className="absolute right-2 top-2 z-10 rounded-lg border border-gray-200 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors print:hidden"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 px-4 sm:px-5 pt-12 pb-4 sm:pt-4 sm:pb-4 text-[12.5px] sm:text-sm leading-relaxed font-mono text-gray-800 dark:text-gray-200">
        <code>{parts}</code>
      </pre>
    </div>
  );
}

// Renders `inline code` inside plain strings
function Inline({ text }) {
  return text.split("`").map((chunk, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded-md bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em] text-gray-900 dark:text-gray-100 break-words"
      >
        {chunk}
      </code>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

function Label({ children, accent }) {
  return <p className={`mb-2 text-sm font-bold ${ACCENTS[accent].text}`}>{children}</p>;
}

function DataTable({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
      <table className="w-full min-w-[420px] text-left text-sm sm:text-base">
        <thead className="bg-gray-50 dark:bg-white/5">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/10">
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`px-4 py-3 align-top ${
                    c === 0
                      ? "font-semibold text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Inline text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cards({ cards, accent }) {
  const a = ACCENTS[accent];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((c) => (
        <div key={c.title} className={`rounded-xl border px-4 py-4 ${a.soft}`}>
          <p className="font-bold text-gray-900 dark:text-white">{c.title}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">{c.text}</p>
        </div>
      ))}
    </div>
  );
}

function Points({ points, accent }) {
  const a = ACCENTS[accent];
  return (
    <ul className="space-y-3">
      {points.map((p, i) => (
        <li key={i} className="flex gap-3 text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          <span className={`mt-[0.7em] h-1.5 w-1.5 flex-shrink-0 rounded-full ${a.dot}`} aria-hidden="true" />
          <span className="min-w-0 break-words">
            <Inline text={p} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Concept({ concept, accent }) {
  const a = ACCENTS[accent];
  return (
    <article className="py-10 first:pt-2 border-t border-gray-100 dark:border-white/10 first:border-t-0">
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <span
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base font-bold ${a.badge}`}
        >
          {concept.id}
        </span>
        <h3 className="min-w-0 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
          {concept.name}
        </h3>
      </div>

      {concept.problem && (
        <div className="mb-6">
          <Label accent={accent}>The problem</Label>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <Inline text={concept.problem} />
          </p>
        </div>
      )}

      <div className="mb-6">
        {concept.problem && <Label accent={accent}>Definition</Label>}
        <p className="text-lg sm:text-xl leading-relaxed text-gray-800 dark:text-gray-200">
          <Inline text={concept.definition} />
        </p>
      </div>

      {concept.why && (
        <div className="mb-6">
          <Label accent={accent}>Why we need it</Label>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <Inline text={concept.why} />
          </p>
        </div>
      )}

      {concept.formula && (
        <div className="mb-6">
          <Label accent={accent}>Formula</Label>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 px-4 sm:px-5 py-4 font-mono text-sm sm:text-lg text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {concept.formula}
          </div>
        </div>
      )}

      {concept.table && (
        <div className="mb-6">
          <DataTable head={concept.table.head} rows={concept.table.rows} />
        </div>
      )}

      {concept.cards && (
        <div className="mb-6">
          {concept.cardsTitle && <Label accent={accent}>{concept.cardsTitle}</Label>}
          <Cards cards={concept.cards} accent={accent} />
        </div>
      )}

      {concept.lists &&
        concept.lists.map((l) => (
          <div key={l.title} className="mb-6">
            <Label accent={accent}>{l.title}</Label>
            <Points points={l.points} accent={accent} />
          </div>
        ))}

      {concept.points && (
        <div className="mb-6">
          <Label accent={accent}>Important points</Label>
          <Points points={concept.points} accent={accent} />
        </div>
      )}

      {concept.code && (
        <div className="mb-6">
          <Label accent={accent}>Code</Label>
          <CodeBlock code={concept.code} />
        </div>
      )}

      <div className={`rounded-r-xl border-l-4 px-5 py-4 ${a.key}`}>
        <p className="text-base sm:text-lg font-semibold leading-relaxed text-gray-900 dark:text-gray-100">
          {concept.keypoint}
        </p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

function OutliersPart4() {
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-indigo-500 z-50 print:hidden"
        style={{ width: `${progress}%` }}
      />

      {/* floating scroll arrows */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 print:hidden">
        {showBottomArrow && (
          <button
            onClick={scrollToTop}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all"
            title="Go to top"
            aria-label="Go to top"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        )}
        {showTopArrow && (
          <button
            onClick={scrollToBottom}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all"
            title="Go to bottom"
            aria-label="Go to bottom"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Page header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <div className="min-w-0">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-sm font-bold px-5 py-2.5 shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all mb-6"
              >
                <span className="text-base">←</span>
                <span className="hidden sm:inline">Back to Blogs</span>
                <span className="sm:hidden">Blogs</span>
              </Link>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                Handling Outliers
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
                What outliers are, and how to detect and treat them with Z-score, IQR and percentile.
              </p>
            </div>

            <a
              href="#"
              aria-label="Download"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-4 sm:px-5 py-3 text-sm sm:text-base font-bold text-white dark:text-gray-900 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 print:hidden"
            >
              <Download size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>

          {/* jump links */}
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="Jump to section">
            {GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className={`rounded-full border border-gray-200 dark:border-white/15 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors ${ACCENTS[g.accent].chip}`}
              >
                {g.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-16">
        {GROUPS.map((g) => {
          const a = ACCENTS[g.accent];
          return (
            <section key={g.id} id={g.id} className="scroll-mt-6 mb-20">
              <div className="mb-8 flex items-stretch gap-4">
                <span className={`w-1.5 flex-shrink-0 rounded-full ${a.bar}`} aria-hidden="true" />
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {g.title}
                  </h2>
                  <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-gray-400">{g.intro}</p>
                </div>
              </div>

              {g.concepts.map((c) => (
                <Concept key={c.id} concept={c} accent={g.accent} />
              ))}
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}

export default OutliersPart4;