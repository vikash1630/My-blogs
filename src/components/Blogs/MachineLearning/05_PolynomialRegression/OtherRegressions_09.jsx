import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from "../../../UI/Footer";

/* ------------------------------------------------------------------ */
/*  FONTS                                                              */
/*  Newsreader (headings + formulas), Inter (body), JetBrains Mono     */
/*  (code). Loaded from Google Fonts with safe fallbacks.              */
/* ------------------------------------------------------------------ */

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&display=swap');

.gd-page  { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; -webkit-text-size-adjust: 100%; }
.gd-serif { font-family: 'Newsreader', Georgia, 'Times New Roman', serif; font-optical-sizing: auto; }
.gd-mono  { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-ligatures: none; }
.gd-noscrollbar { scrollbar-width: none; }
.gd-noscrollbar::-webkit-scrollbar { display: none; }
`;

/* ------------------------------------------------------------------ */
/*  DATA  (only the content from the notes)                            */
/* ------------------------------------------------------------------ */

const CONCEPTS = [
  {
    id: "ridge-regression",
    name: "Ridge Regression",
    blocks: [
      {
        type: "text",
        text: "Ridge Regression is Linear Regression with one extra rule. Big coefficients (b1, b2 ...) are punished. The model must keep the error small AND keep the coefficients small.",
      },
      {
        type: "text",
        title: "Why",
        text: "When a model overfits, its coefficients become very big. The model is overreacting to small changes in the data. Ridge keeps the coefficients small, so the model stays calm and does not memorize noise.",
      },
      {
        type: "points",
        title: "Real life (needed to understand)",
        points: [
          'A teacher says: "Short and simple answers get full marks. Long and complicated answers lose marks."',
          "The student must still answer correctly, but he is pushed to keep the answer simple.",
          "Ridge does the same with the model. It must fit the data, but it is pushed to stay simple.",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "Loss = Σ (y − ŷ)² + α · Σ bⱼ²" }],
        points: [
          "First part = normal error (same as Linear Regression).",
          "Second part = penalty = sum of squares of all coefficients (b0 intercept is NOT included).",
          "α (alpha) = how strong the punishment is. We choose it.",
        ],
      },
      {
        type: "formula",
        lines: [{ l: "Normal equation", f: "B = (XᵀX + αI)⁻¹ Xᵀy", n: "Linear Regression has no αI" }],
      },
      {
        type: "points",
        title: "How alpha works",
        points: [
          "α = 0 = no punishment, same as Linear Regression.",
          "small α = light punishment, coefficients shrink a little.",
          "large α = strong punishment, coefficients become very small, model becomes too simple (underfitting).",
          "Alpha controls the bias-variance trade-off: bigger alpha = more bias, less variance.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Ridge is also called L2 regularization (penalty uses squares, power 2).",
          "Ridge makes coefficients small, but NEVER exactly zero. (Lasso can make them exactly zero.)",
          "Always scale the columns first (`StandardScaler`). The penalty is the same for all coefficients, so if the columns have different scales, the punishment is unfair.",
          "It helps with multicollinearity. αI makes the matrix safe to invert, so the coefficients become stable.",
          "Use it when the model overfits, and you want to keep ALL the columns.",
          "Good for: many related columns, high degree polynomial, many columns but few rows.",
          "Choose alpha using cross-validation (`RidgeCV`).",
          "Alpha too small = still overfitting. Alpha too big = underfitting. Look for the middle.",
          "Same rule: fit only on train data, otherwise it is DATA LEAKAGE.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.linear_model import Ridge, RidgeCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Ridge with one alpha
ridge = make_pipeline(StandardScaler(), Ridge(alpha=10))
ridge.fit(X_train, y_train)                     # learns from train only
ridge.score(X_test, y_test)                     # R2 on test data

ridge[-1].coef_                                 # coefficients (small, but not zero)

# Let sklearn choose the best alpha using cross-validation
model = make_pipeline(StandardScaler(), RidgeCV(alphas=[0.001, 0.1, 1, 10, 100, 1000]))
model.fit(X_train, y_train)
model[-1].alpha_                                # best alpha found`,
      },
    ],
  },
  {
    id: "lasso-regression",
    name: "Lasso Regression",
    blocks: [
      {
        type: "text",
        text: "Lasso is like Ridge, but it punishes the absolute values of the coefficients, not the squares. It can push coefficients to exactly ZERO, so it removes useless columns. This is called automatic feature selection.",
      },
      {
        type: "text",
        title: "Why",
        text: "Ridge makes coefficients small, but keeps all columns. When many columns are useless, we want to remove them. Lasso does this.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "Loss = Σ (y − ŷ)² + α · Σ |bⱼ|" }],
        points: ["α = how strong the punishment is (same as Ridge)."],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Lasso is also called L1 regularization. (Ridge = L2)",
          "Ridge shrinks coefficients. Lasso shrinks AND removes them.",
          "Coefficient = 0 means that column is removed from the model.",
          "Bigger alpha = more coefficients become zero. Too big = model becomes too simple.",
          "If two columns are very similar, Lasso keeps one and drops the other. Ridge keeps both.",
          "Scale the columns first (`StandardScaler`).",
          "Choose alpha using cross-validation (`LassoCV`).",
          "Use it when: many columns, most are useless, or you want to know which columns really matter.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.linear_model import Lasso, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(StandardScaler(), Lasso(alpha=10))
model.fit(X_train, y_train)                     # learns from train only
model[-1].coef_                                 # zero = column removed

# Let sklearn choose the best alpha
model = make_pipeline(StandardScaler(), LassoCV(cv=5))
model.fit(X_train, y_train)
model[-1].alpha_                                # best alpha found`,
      },
    ],
  },
  {
    id: "elasticnet-regression",
    name: "ElasticNet Regression",
    blocks: [
      {
        type: "text",
        text: "ElasticNet uses BOTH penalties at the same time: the Ridge penalty (squares) and the Lasso penalty (absolute values).",
      },
      {
        type: "text",
        title: "Why",
        text: "Lasso removes useless columns, but it can drop one of two similar columns by chance. Ridge keeps all columns, but it never removes any. ElasticNet does both jobs: it removes useless columns and stays stable with related columns.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "Loss = Σ (y − ŷ)² + α · [ r · Σ|bⱼ| + (1 − r) · Σ bⱼ² ]" }],
        points: [
          "α = how strong the total punishment is.",
          "r = `l1_ratio` = how much Lasso vs Ridge.",
        ],
      },
      {
        type: "points",
        title: "How l1_ratio works",
        points: [
          "`l1_ratio` = 1 = pure Lasso.",
          "`l1_ratio` = 0 = pure Ridge.",
          "`l1_ratio` = 0.5 = half Lasso, half Ridge.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Two settings to choose: alpha and `l1_ratio`.",
          "Can make coefficients exactly zero (like Lasso), because it has the Lasso part.",
          "When two columns are very similar, it keeps both together (like Ridge). Lasso would drop one.",
          "Use it when: many columns, many of them related to each other.",
          "Scale the columns first (`StandardScaler`).",
          "Choose both settings using cross-validation (`ElasticNetCV`).",
        ],
      },
      {
        type: "code",
        code: `from sklearn.linear_model import ElasticNet, ElasticNetCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(StandardScaler(), ElasticNet(alpha=10, l1_ratio=0.5))
model.fit(X_train, y_train)                     # learns from train only
model[-1].coef_                                 # some may be exactly zero

# Let sklearn choose alpha and l1_ratio
model = make_pipeline(StandardScaler(), ElasticNetCV(l1_ratio=[0.1, 0.5, 0.9, 1], cv=5))
model.fit(X_train, y_train)
model[-1].alpha_                                # best alpha
model[-1].l1_ratio_                             # best l1_ratio`,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  SMALL HELPERS                                                      */
/* ------------------------------------------------------------------ */

// Lightweight Python highlighter: comments, strings, keywords, numbers
const TOKEN =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(from|import|as|class|def|return|for|in|True|False|None)\b|\b(\d+(?:\.\d+)?)\b/gm;

const TOKEN_CLASS = [
  null,
  "italic text-stone-400 dark:text-stone-500", // comment
  "text-emerald-700 dark:text-emerald-300", // string
  "font-medium text-violet-700 dark:text-violet-300", // keyword
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
    <div className="relative -mx-4 sm:mx-0">
      <button
        onClick={copy}
        className="absolute right-3 top-2.5 z-10 min-h-[36px] rounded-md border border-stone-200 dark:border-white/10 bg-white/90 dark:bg-stone-900/90 px-3.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 print:hidden"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="gd-mono overflow-x-auto border-y sm:border sm:rounded-lg border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-black/40 px-4 sm:px-5 pt-14 pb-4 text-[12px] sm:text-[13.5px] leading-[1.7] text-stone-800 dark:text-stone-200">
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
        className="gd-mono rounded bg-stone-200/70 dark:bg-white/10 px-1.5 py-0.5 text-[0.84em] text-stone-900 dark:text-stone-100 break-words"
      >
        {chunk}
      </code>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

function Label({ children }) {
  return (
    <p className="mb-3 text-[15px] sm:text-sm font-semibold tracking-wide text-teal-800 dark:text-teal-300">{children}</p>
  );
}

function Points({ points }) {
  return (
    <ul className="space-y-3.5">
      {points.map((p, i) => (
        <li
          key={i}
          className="flex gap-3 sm:gap-3.5 text-[16px] sm:text-[17px] leading-[1.7] sm:leading-[1.75] text-stone-700 dark:text-stone-300"
        >
          <span
            className="mt-[0.85em] h-1 w-3 flex-shrink-0 rounded-full bg-teal-700 dark:bg-teal-400"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 break-words">
            <Inline text={p} />
          </span>
        </li>
      ))}
    </ul>
  );
}

// Formula panel: serif italic, like a textbook equation. Wraps on small screens.
function Formula({ title, lines, points }) {
  return (
    <div>
      {title && <Label>{title}</Label>}
      <div className="rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 sm:px-5 py-4 space-y-4">
        {lines.map((line, i) => (
          <div key={i}>
            {line.l && (
              <div className="text-[13px] sm:text-sm font-medium text-stone-500 dark:text-stone-400">{line.l}</div>
            )}
            <div className="gd-serif break-words text-[19px] sm:text-2xl italic leading-8 sm:leading-9 text-stone-900 dark:text-stone-100">
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
        <div>
          {block.title && <Label>{block.title}</Label>}
          <p
            className={
              block.title
                ? "max-w-[64ch] text-[16px] sm:text-[17px] leading-[1.7] sm:leading-[1.75] text-stone-700 dark:text-stone-300"
                : "max-w-[62ch] text-[18px] sm:text-xl leading-[1.65] sm:leading-[1.7] text-stone-800 dark:text-stone-200"
            }
          >
            <Inline text={block.text} />
          </p>
        </div>
      );
    case "formula":
      return <Formula title={block.title} lines={block.lines} points={block.points} />;
    case "points":
      return (
        <div>
          {block.title && <Label>{block.title}</Label>}
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

function OtherRegressions_09() {
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
    "flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg hover:bg-stone-700 dark:hover:bg-white active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600";

  return (
    <div className="gd-page min-h-screen w-full overflow-x-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-500">
      <style>{FONT_CSS}</style>

      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-teal-700 dark:bg-teal-400 z-50 print:hidden"
        style={{ width: `${progress}%` }}
      />

      {/* floating scroll arrows (kept clear of the phone's home bar) */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 sm:right-4 z-40 flex flex-col gap-2 print:hidden">
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
        <div className="mx-auto max-w-3xl px-4 sm:px-8 py-8 sm:py-16">
          <div className="flex items-start justify-between gap-3 sm:gap-6">
            <div className="min-w-0">
              <Link
                to="/blogs"
                className="mb-6 sm:mb-8 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-stone-300 dark:border-white/15 px-4 text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors hover:border-stone-900 hover:text-stone-900 dark:hover:border-white dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <span aria-hidden="true">←</span>
                <span className="hidden sm:inline">Back to Blogs</span>
                <span className="sm:hidden">Blogs</span>
              </Link>

              <h1 className="gd-serif text-[2rem] sm:text-6xl font-medium tracking-[-0.02em] leading-[1.1] sm:leading-[1.05] text-stone-900 dark:text-white">
                Ridge, Lasso and ElasticNet Regression
              </h1>
            </div>

            <a
              href="#"
              aria-label="Download"
              className="flex-shrink-0 inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full bg-stone-900 dark:bg-stone-100 px-3 sm:px-5 text-sm sm:text-base font-semibold text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 print:hidden"
            >
              <Download size={18} strokeWidth={2.25} />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>

          {/* jump links: one swipeable row on phones, wrapping on larger screens */}
          <nav
            className="gd-noscrollbar -mx-4 mt-8 sm:mt-10 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
            aria-label="Jump to section"
          >
            {CONCEPTS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex min-h-[44px] flex-shrink-0 items-center whitespace-nowrap rounded-full border border-stone-300 dark:border-white/15 px-4 text-[15px] font-medium text-stone-700 dark:text-stone-300 transition-colors hover:border-teal-700 hover:text-teal-800 dark:hover:border-teal-400 dark:hover:text-teal-300"
              >
                {c.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-8 py-10 sm:py-20">
        {CONCEPTS.map((c, i) => (
          <section
            key={c.id}
            id={c.id}
            className="scroll-mt-4 py-10 sm:py-12 first:pt-0 border-t border-stone-200 dark:border-white/10 first:border-t-0"
          >
            <div className="mb-7 sm:mb-8 flex items-baseline gap-3 sm:gap-4">
              <span className="gd-serif text-4xl sm:text-5xl italic leading-none text-teal-800 dark:text-teal-300">
                {i + 1}
              </span>
              <h2 className="gd-serif min-w-0 text-[1.65rem] sm:text-4xl font-medium tracking-[-0.015em] leading-snug text-stone-900 dark:text-white">
                {c.name}
              </h2>
            </div>

            <div className="space-y-8 sm:space-y-9">
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

export default OtherRegressions_09;