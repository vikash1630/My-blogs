import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from "../../UI/Footer";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const GROUPS = [
  {
    id: "shape",
    title: "Changing the Shape",
    intro: "Transformers that fix skewed columns so the distribution looks closer to a bell curve.",
    accent: "indigo",
    concepts: [
      {
        id: 1,
        name: "Function Transformer",
        problem:
          "Some columns are highly skewed, but ML models perform well on bell shaped (normal) distributions.",
        definition:
          "FunctionTransformer is a Feature Transformation technique used to apply a mathematical function to existing features.",
        why: "Transformers like this make a column's distribution bell shaped. Standardization is different: it only brings columns to a common scale, so no single column dominates.",
        table: {
          head: ["Function", "Transformation"],
          rows: [
            ["`np.log1p(x)`", "Log transformation"],
            ["`np.sqrt(x)`", "Square root"],
            ["`np.square(x)`", "Squaring"],
            ["`1 / x`", "Reciprocal (x must not be zero)"],
          ],
        },
        formula: "x' = log(1 + x)",
        points: [
          "Log transformation reduces right skewness.",
          "It compresses large values more than small values.",
          "It does not guarantee better model accuracy. Compare results on validation data.",
          "StandardScaler changes the scale but does not remove skewness.",
          "FunctionTransformer changes the shape, when the chosen function does so.",
        ],
        code: `from sklearn.preprocessing import FunctionTransformer
import numpy as np

transformer = FunctionTransformer(np.log1p)
X_transformed = transformer.fit_transform(X)`,
        keypoint: "Skewed column? Try a function transformer. Then compare on validation data.",
      },
      {
        id: 2,
        name: "StandardScaler vs FunctionTransformer",
        definition: "They fix two different problems, so they can be used together.",
        table: {
          head: ["", "FunctionTransformer", "StandardScaler"],
          rows: [
            ["Fixes", "Distribution (shape)", "Scale"],
            ["Used when", "A feature needs its distribution changed", "Features need to be on a comparable scale"],
            ["Example", "Salary has extremely large values, so apply log to reduce right skewness", "Age is 18-60 but Salary is 20,000-10,00,000"],
            ["Helps", "Models that like bell shaped data", "Algorithms like KNN and SVM"],
          ],
        },
        points: [
          "FunctionTransformer can be applied to one or multiple columns.",
          "Both together: apply log to Salary first, then StandardScaler to Age and the transformed Salary.",
        ],
        keypoint: "Skewness problem: consider a transformation. Scale problem: consider a scaler. Both: use both.",
      },
      {
        id: 3,
        name: "Power Transformer",
        problem: "In Function Transformer we guess the function by trial and error.",
        definition:
          "Power Transformer (Box-Cox and Yeo-Johnson) automatically finds the best power (λ) to make a skewed column look more like a normal distribution.",
        why: "It learns the best λ from the data for us. The best λ is the one that makes the data most bell shaped.",
        formula: "y = (x^λ - 1) / λ      (when λ = 0, y = log(x))",
        table: {
          head: ["λ", "Same as"],
          rows: [
            ["1", "No change"],
            ["0.5", "Square root"],
            ["0", "Log"],
            ["-1", "Reciprocal"],
            ["2", "Square"],
          ],
        },
        points: [
          "The earlier functions are special cases of this formula.",
          "It learns λ from data, so fit only on train data. Fitting on test data is data leakage.",
          "By default sklearn also standardizes the output (mean 0, std 1).",
          "Check before and after with a histogram or QQ plot.",
          "Not needed for tree models.",
        ],
        code: `from sklearn.preprocessing import PowerTransformer

pt = PowerTransformer(method="yeo-johnson")   # or "box-cox"
X_train_t = pt.fit_transform(X_train)         # learns λ from train only
X_test_t = pt.transform(X_test)               # reuses train's λ

pt.lambdas_                                   # λ of each column

# QQ plot check
import scipy.stats as stats
import matplotlib.pyplot as plt
stats.probplot(X_train["Fare"], dist="norm", plot=plt)`,
        keypoint: "Function Transformer: you pick the function. Power Transformer: the data picks λ.",
      },
      {
        id: 4,
        name: "Box-Cox vs Yeo-Johnson",
        definition: "The two methods inside PowerTransformer. They differ in which values they accept.",
        table: {
          head: ["", "Box-Cox", "Yeo-Johnson"],
          rows: [
            ["Accepts", "Only x > 0", "Any x (positive, zero, negative)"],
            ["Choice", "Use when all values are positive", "Safer choice"],
          ],
        },
        extra: {
          title: "Yeo-Johnson formula (4 cases)",
          items: [
            ["`x >= 0`, `λ != 0`", "`((x + 1)^λ - 1) / λ`"],
            ["`x >= 0`, `λ = 0`", "`log(x + 1)`"],
            ["`x < 0`, `λ != 2`", "`-((-x + 1)^(2 - λ) - 1) / (2 - λ)`"],
            ["`x < 0`, `λ = 2`", "`-log(-x + 1)`"],
          ],
          head: ["Case", "Formula"],
        },
        points: ["The positive side is Box-Cox on (x + 1). The negative side is the mirrored version."],
        keypoint: "Not sure? Use Yeo-Johnson.",
      },
    ],
  },
  {
    id: "binning",
    title: "Binning & Binarization",
    intro: "When the range or a yes/no matters more than the exact value.",
    accent: "emerald",
    concepts: [
      {
        id: 5,
        name: "Binning (Discretization)",
        problem:
          "Numerical columns have many values, outliers and uneven spread. Often we only care about the range, not the exact value.",
        definition: "Converts a continuous column into groups (bins). Example: Age to Child, Teenager, Adult, Senior.",
        why: "It simplifies data, captures range patterns, and handles outliers because they fall in the first or last bin.",
        table: {
          head: ["Strategy", "How the bins are made"],
          rows: [
            ["`uniform`", "Equal width: same width for every bin"],
            ["`quantile`", "Equal frequency: same number of values in every bin"],
            ["`kmeans`", "Bins from clusters of similar values"],
          ],
        },
        points: [
          "Fit only on train data, transform on both train and test. Anything else is data leakage.",
          "Input must be 2D, so use `X_train[[\"Age\"]]` with double brackets.",
          "`encode` can be `\"ordinal\"`, `\"onehot\"` or `\"onehot-dense\"`.",
        ],
        code: `from sklearn.preprocessing import KBinsDiscretizer

kbin = KBinsDiscretizer(n_bins=5, encode="ordinal", strategy="quantile")
X_train_t = kbin.fit_transform(X_train[["Age"]])
X_test_t = kbin.transform(X_test[["Age"]])
kbin.bin_edges_`,
        keypoint: "Binning: values to groups.",
      },
      {
        id: 6,
        name: "Binarization",
        problem: "Sometimes we only need a yes/no answer from a numerical column.",
        definition:
          "Converts values into 0 or 1 using a threshold. Above the threshold becomes 1, the rest become 0. Example: Age > 18 gives 1.",
        why: "It creates a yes/no indicator.",
        code: `from sklearn.preprocessing import Binarizer

bz = Binarizer(threshold=10)
X_train_b = bz.fit_transform(X_train[["Fare"]])`,
        keypoint: "Binning: values to groups. Binarization: values to 0 or 1.",
      },
    ],
  },
  {
    id: "mixed",
    title: "Mixed, Date & Time Columns",
    intro: "Columns the model cannot use as they are, until we pull out the useful parts.",
    accent: "amber",
    concepts: [
      {
        id: 7,
        name: "Handling Mixed Variables",
        problem:
          "Some columns hold both numbers and text, so the model cannot use them as they are. Example: Titanic Cabin values like A15, B22, C85.",
        definition: "A mixed variable is a column that contains both numerical and categorical values.",
        table: {
          head: ["Type", "Meaning", "Example"],
          rows: [
            ["Type 1", "Numbers and text in separate rows (a value is either a number or text)", "`1, 2, A, B, 3`"],
            ["Type 2", "Text and number in the same value", "Cabin `A15` (letter A + number 15)"],
          ],
        },
        why: "Solution: split the column into two new columns, one numerical and one categorical. Each part then gets the right treatment (scaling for numerical, encoding for categorical), and each part may carry useful information. For Cabin, the letter is the deck and the number is the position.",
        points: [
          "Split first, then apply normal feature engineering on the new columns.",
          "NaN in the original stays NaN in the new columns.",
          "Some cabins have many values (\"C23 C25 C27\"). We take only the first.",
        ],
        code: `df["cabin_letter"] = df["Cabin"].str[0]                             # first letter
df["cabin_num"] = df["Cabin"].str.extract(r"(\\d+)").astype(float)   # the digits`,
        keypoint: "Mixed variable: split into a number part and a text part.",
      },
      {
        id: 8,
        name: "Handling Date and Time Variables",
        problem:
          "Date and time columns (2023-05-14, 10:30 AM) are stored as text, so the model cannot use them. A full date is also too specific, and the useful information is hidden inside it.",
        definition:
          "Convert the column to datetime type and extract useful parts (year, month, day, hour...) as new columns.",
        why: "The parts carry patterns, like December sales being higher or weekends differing from weekdays. Models cannot learn from a raw date string.",
        cards: [
          { title: "Date parts", text: "year, month, day, day of week, quarter" },
          { title: "Names", text: "month name, day name" },
          { title: "Flag", text: "is weekend (1 or 0)" },
          { title: "Time parts", text: "hour, minute, second" },
          { title: "Time elapsed", text: "Gap between a date and today. Useful for age, tenure, days since last purchase." },
        ],
        points: ["Always convert to datetime first. Extraction works only after that."],
        code: `import pandas as pd
import numpy as np
import datetime

df["date"] = pd.to_datetime(df["date"])

df["year"] = df["date"].dt.year                      # same way: month, day, quarter, hour, minute
df["day_name"] = df["date"].dt.day_name()            # same way: month_name()
df["is_weekend"] = np.where(df["day_name"].isin(["Saturday", "Sunday"]), 1, 0)

df["days_passed"] = (datetime.datetime.today() - df["date"]).dt.days`,
        keypoint: "Convert to datetime first, then use .dt for everything.",
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
  const { extra } = concept;
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

      {concept.cards && (
        <div className="mb-6">
          <Label accent={accent}>What we extract</Label>
          <Cards cards={concept.cards} accent={accent} />
        </div>
      )}

      {concept.table && (
        <div className="mb-6">
          <DataTable head={concept.table.head} rows={concept.table.rows} />
        </div>
      )}

      {extra && extra.items && (
        <div className="mb-6">
          <Label accent={accent}>{extra.title}</Label>
          <DataTable head={extra.head} rows={extra.items} />
        </div>
      )}

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

function TransformersPart2() {
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
                Feature Transformers
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
                Function and Power transformers, binning, mixed columns, and date and time features.
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

export default TransformersPart2;