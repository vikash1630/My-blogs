import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from "../../../UI/Footer";

/* ------------------------------------------------------------------ */
/*  DATA  (only the content from the notes)                            */
/* ------------------------------------------------------------------ */

const CONCEPTS = [
  {
    id: "simple-linear-regression",
    name: "Simple Linear Regression",
    blocks: [
      {
        type: "text",
        text: "Simple Linear Regression predicts a number (output) from ONE input column by fitting the best straight line through the data.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "y = m·x + b" }],
        points: [
          "`m` = slope = how much y changes when x increases by 1.",
          "`b` = intercept = value of y when x = 0.",
        ],
      },
      { type: "example", text: "salary = m × (years of experience) + b" },
      {
        type: "points",
        title: "How it finds the best line",
        points: [
          "It tries many lines and picks the one with the smallest total squared error (actual - predicted)². This is called Least Squares.",
        ],
      },
      {
        type: "formula",
        lines: [
          { f: "m = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²" },
          { f: "b = ȳ − m·x̄", n: "x̄ = mean of x, ȳ = mean of y" },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Only ONE input column. More than one input = Multiple Linear Regression (next topic).",
          "Output must be a continuous number (price, bill, salary), not a category.",
          'Input X must be 2D (`df[["tenure"]]`), output y is 1D (`df["TotalCharges"]`).',
          "Positive slope = y increases with x, negative slope = y decreases with x.",
          "Outliers pull the line towards them, so check for outliers first.",
          "Same rule: fit only on train data, predict on test, otherwise it is DATA LEAKAGE.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)          # learns m and b from train only

model.coef_[0]                       # slope (m)
model.intercept_                     # intercept (b)
model.predict(X_test)                # uses what train learned
model.predict([[24]])                # predict for a new value (tenure = 24)`,
      },
    ],
  },
  {
    id: "multiple-linear-regression",
    name: "Multiple Linear Regression",
    blocks: [
      {
        type: "text",
        text: "Multiple Linear Regression predicts a number (output) from TWO OR MORE input columns by fitting the best flat plane (hyperplane) through the data.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "y = b0 + b1·x1 + b2·x2 + ... + bn·xn" }],
        points: [
          "`b0` = intercept.",
          "`b1`, `b2` ... = coefficients, one for each input column.",
          "`b1` = how much y changes when x1 increases by 1, keeping all other columns FIXED.",
        ],
      },
      { type: "example", text: "price = b0 + b1·(area) + b2·(bedrooms) + b3·(location score)" },
      {
        type: "points",
        title: "How it finds the best line",
        points: [
          "Same as Simple LR: Least Squares (smallest total squared error).",
          "With many columns it solves it using matrices (Normal Equation): `B = (XᵀX)⁻¹ Xᵀy`.",
          "sklearn does this for us, we only call `fit()`.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Simple LR = 1 input, Multiple LR = 2 or more inputs, code is almost the same.",
          "Output must still be a continuous number.",
          "Text columns must be encoded first (One-Hot / Ordinal), model only takes numbers.",
          "Coefficients can be compared with each other only if columns are on the same scale, so use Standardization first.",
          "If two input columns are highly correlated (Multicollinearity), the coefficients become unstable and unreliable.",
          "Adding a useless column can still increase R², so check Adjusted R².",
          "Same rule: fit only on train data, predict on test, otherwise it is DATA LEAKAGE.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.linear_model import LinearRegression

X = df[["tenure", "MonthlyCharges"]]      # 2 or more columns
y = df["TotalCharges"]

model = LinearRegression()
model.fit(X_train, y_train)               # learns b0, b1, b2 from train only

model.coef_                               # [b1, b2]
model.intercept_                          # b0
model.predict(X_test)                     # uses what train learned
model.predict([[24, 70]])                 # new value (tenure=24, MonthlyCharges=70)`,
      },
    ],
  },
  {
    id: "regression-metrics",
    name: "Regression Metrics",
    blocks: [
      {
        type: "text",
        text: "Regression metrics are numbers that tell how good the model's predictions are, by comparing actual values (y) with predicted values (ŷ).",
      },
      {
        type: "formula",
        title: "Error",
        lines: [{ f: "eᵢ = yᵢ − ŷᵢ", n: "actual − predicted, n = number of predictions" }],
      },
      {
        type: "formula",
        title: "Formulas",
        lines: [
          { f: "MAE = (1/n) · Σ |eᵢ|", n: "Mean Absolute Error" },
          { f: "MSE = (1/n) · Σ eᵢ²", n: "Mean Squared Error" },
          { f: "RMSE = √MSE", n: "Root Mean Squared Error" },
          { f: "R² = 1 − (SS_res / SS_tot)" },
          { f: "SS_res = Σ (yᵢ − ŷᵢ)²", n: "model's error", indent: true },
          { f: "SS_tot = Σ (yᵢ − ȳ)²", n: "error if we always predict the mean", indent: true },
          { f: "Adjusted R² = 1 − (1 − R²)(n − 1) / (n − k − 1)", n: "k = number of input columns" },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "MAE, MSE, RMSE = error, LOWER is better. R², Adjusted R² = score, HIGHER is better (max 1).",
          "MAE and RMSE are in the same unit as y (₹, $). MSE is in squared unit, so it is hard to read.",
          "MAE treats all errors equally, RMSE punishes big errors much more (RMSE >= MAE always).",
          "MAE = easy to explain. RMSE = use when big mistakes are costly.",
          "R² = 1 -> perfect, R² = 0 -> no better than predicting the mean, R² < 0 -> worse than the mean.",
          "R² always goes UP when a column is added, even a useless one. Adjusted R² goes up only if the column really helps.",
          "Adjusted R² <= R² always.",
          "Calculate metrics on TEST data, not train data.",
        ],
      },
      {
        type: "code",
        code: `import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

y_pred = model.predict(X_test)

mae  = mean_absolute_error(y_test, y_pred)
mse  = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2   = r2_score(y_test, y_pred)

n, k = X_test.shape
adj_r2 = 1 - (1 - r2) * (n - 1) / (n - k - 1)      # sklearn has no built-in for this`,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  SMALL HELPERS                                                      */
/* ------------------------------------------------------------------ */

// Lightweight Python highlighter: comments, strings, keywords, numbers
const TOKEN =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(from|import|as|class|def|return|True|False|None)\b|\b(\d+(?:\.\d+)?)\b/gm;

const TOKEN_CLASS = [
  null,
  "italic text-stone-400 dark:text-stone-500", // comment
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
        className="absolute right-2 top-2 z-10 rounded-md border border-stone-200 dark:border-white/10 bg-white/90 dark:bg-stone-900/90 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 print:hidden"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-lg border border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-black/40 px-4 sm:px-5 pt-12 pb-4 sm:pt-4 text-[12.5px] sm:text-sm leading-relaxed font-mono text-stone-800 dark:text-stone-200">
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
        className="rounded bg-stone-200/70 dark:bg-white/10 px-1.5 py-0.5 font-mono text-[0.86em] text-stone-900 dark:text-stone-100 break-words"
      >
        {chunk}
      </code>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

function Label({ children }) {
  return <p className="mb-3 text-sm font-semibold tracking-wide text-teal-800 dark:text-teal-300">{children}</p>;
}

function Points({ points }) {
  return (
    <ul className="space-y-3">
      {points.map((p, i) => (
        <li key={i} className="flex gap-3.5 text-base sm:text-[17px] leading-7 text-stone-700 dark:text-stone-300">
          <span
            className="mt-[0.8em] h-1 w-3 flex-shrink-0 rounded-full bg-teal-700 dark:bg-teal-400"
            aria-hidden="true"
          />
          <span className="min-w-0 break-words">
            <Inline text={p} />
          </span>
        </li>
      ))}
    </ul>
  );
}

// Formula panel: serif italic, like a textbook equation
function Formula({ title, lines, points }) {
  return (
    <div>
      {title && <Label>{title}</Label>}
      <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-5 py-4 space-y-2">
        {lines.map((line, i) => (
          <div key={i} className={line.indent ? "pl-6" : ""}>
            <div className="whitespace-nowrap font-serif text-lg sm:text-xl italic leading-8 text-stone-900 dark:text-stone-100">
              {line.f}
            </div>
            {line.n && <div className="text-sm leading-6 text-stone-500 dark:text-stone-400">{line.n}</div>}
          </div>
        ))}
      </div>
      {points && (
        <div className="mt-5">
          <Points points={points} />
        </div>
      )}
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "text":
      return (
        <p className="max-w-[62ch] text-lg sm:text-xl leading-8 text-stone-800 dark:text-stone-200">
          <Inline text={block.text} />
        </p>
      );
    case "formula":
      return <Formula title={block.title} lines={block.lines} points={block.points} />;
    case "example":
      return (
        <div className="rounded-lg border border-teal-200 dark:border-teal-300/20 bg-teal-50/70 dark:bg-teal-400/10 px-4 py-3">
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">Example</p>
          <p className="mt-1 font-serif text-lg italic text-stone-900 dark:text-stone-100 break-words">
            {block.text}
          </p>
        </div>
      );
    case "points":
      return (
        <div>
          <Label>{block.title}</Label>
          <Points points={block.points} />
        </div>
      );
    case "code":
      return (
        <div>
          <Label>Code</Label>
          <CodeBlock code={block.code} />
        </div>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

function LinearAndMultipleRegression() {
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

  const arrowBtn =
    "flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg hover:bg-stone-700 dark:hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-500">
      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-teal-700 dark:bg-teal-400 z-50 print:hidden"
        style={{ width: `${progress}%` }}
      />

      {/* floating scroll arrows */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2 print:hidden">
        {showBottomArrow && (
          <button onClick={scrollToTop} className={arrowBtn} title="Go to top" aria-label="Go to top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
        )}
        {showTopArrow && (
          <button onClick={scrollToBottom} className={arrowBtn} title="Go to bottom" aria-label="Go to bottom">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Page header */}
      <header className="w-full border-b border-stone-200 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-16">
          <div className="flex items-start justify-between gap-4 sm:gap-6">
            <div className="min-w-0">
              <Link
                to="/blogs"
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-300 dark:border-white/15 px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:border-stone-900 hover:text-stone-900 dark:hover:border-white dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <span aria-hidden="true">←</span>
                <span className="hidden sm:inline">Back to Blogs</span>
                <span className="sm:hidden">Blogs</span>
              </Link>

              <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-stone-900 dark:text-white">
                Linear and Multiple Regression
              </h1>
            </div>

            <a
              href="#"
              aria-label="Download"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-stone-900 dark:bg-stone-100 px-4 sm:px-5 py-3 text-sm sm:text-base font-semibold text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 print:hidden"
            >
              <Download size={18} strokeWidth={2.25} />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>

          {/* jump links */}
          <nav className="mt-10 flex flex-wrap gap-x-7 gap-y-3" aria-label="Jump to section">
            {CONCEPTS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="border-b border-stone-300 dark:border-white/20 pb-1 text-base font-medium text-stone-700 dark:text-stone-300 transition-colors hover:text-teal-800 hover:border-teal-700 dark:hover:text-teal-300 dark:hover:border-teal-400"
              >
                {c.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-20">
        {CONCEPTS.map((c, i) => (
          <section
            key={c.id}
            id={c.id}
            className="scroll-mt-6 py-12 first:pt-0 border-t border-stone-200 dark:border-white/10 first:border-t-0"
          >
            <div className="mb-8 flex items-baseline gap-4">
              <span className="font-serif text-3xl sm:text-4xl italic leading-none text-teal-800 dark:text-teal-300">
                {i + 1}
              </span>
              <h2 className="min-w-0 font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-snug text-stone-900 dark:text-white">
                {c.name}
              </h2>
            </div>

            <div className="space-y-8">
              {c.blocks.map((b, j) => (
                <Block key={j} block={b} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default LinearAndMultipleRegression;