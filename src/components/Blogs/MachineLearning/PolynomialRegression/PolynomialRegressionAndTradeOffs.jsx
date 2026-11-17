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
    id: "polynomial-regression",
    name: "Polynomial Regression",
    blocks: [
      {
        type: "text",
        text: "Polynomial Regression fits a CURVE instead of a straight line. It adds powers of the input as new columns (x², x³ ...) and then fits a normal Linear Regression on them.",
      },
      {
        type: "text",
        title: "Why",
        text: "Data is often not a straight line (rises then flattens, rises then falls). A straight line underfits it, a curve follows it.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Degree 1", f: "y = b0 + b1·x", n: "straight line" },
          { l: "Degree 2", f: "y = b0 + b1·x + b2·x²", n: "parabola" },
          { l: "Degree 3", f: "y = b0 + b1·x + b2·x² + b3·x³", n: "S-shaped curve" },
          { l: "Degree d", f: "y = b0 + b1·x + b2·x² + ... + bd·xᵈ" },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          'It is still "linear" regression, because the model is linear in the coefficients (b0, b1, b2). Only the input columns are changed.',
          "`degree` = highest power used. It is a hyperparameter, we choose it.",
          "Low degree = underfitting (too simple). Very high degree = overfitting (follows noise, wiggly curve).",
          "Choose degree by checking TEST score (or cross-validation). Train score always keeps going up with degree, so never choose by train score.",
          "Multiple input columns: `PolynomialFeatures` also creates interaction terms. Ex: degree 2 on (a, b) gives a, b, a², ab, b².",
          "Number of columns grows very fast with degree and with number of input columns, which makes it slow and prone to overfitting.",
          "x, x², x³ are highly correlated with each other (multicollinearity). Standardize the column first to reduce this.",
          "Poor at extrapolation: outside the training range, the curve can shoot up or down wildly. Don't trust predictions outside the data range.",
          "`include_bias=False`, because `LinearRegression` already adds the intercept b0.",
          "Same rule: fit only on train data, transform on both train and test, otherwise it is DATA LEAKAGE.",
          "Regularization (Ridge, Lasso, coming in this group) is used with polynomial features to control overfitting.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

poly = PolynomialFeatures(degree=2, include_bias=False)
X_train_poly = poly.fit_transform(X_train)      # learns from train only, creates [x, x²]
X_test_poly = poly.transform(X_test)            # uses what train learned

model = LinearRegression()
model.fit(X_train_poly, y_train)                # normal linear regression on new columns
model.score(X_test_poly, y_test)                # R2 on test data

# shortcut using Pipeline
from sklearn.pipeline import make_pipeline
pipe = make_pipeline(PolynomialFeatures(degree=2, include_bias=False), LinearRegression())
pipe.fit(X_train, y_train)`,
      },
    ],
  },
  {
    id: "bias-variance-trade-off",
    name: "Bias-Variance Trade-off",
    blocks: [
      {
        type: "text",
        text: "Every model makes mistakes (errors). These mistakes come from 3 things: Bias, Variance and Noise.",
      },
      {
        type: "points",
        points: [
          "Bias = the model is too simple. It cannot catch the real pattern in the data. It makes the same kind of mistake again and again.",
          "Variance = the model is too sensitive to the training data. If the training data changes a little, the model changes a lot.",
          "Noise = random error that is already in the data. No model can remove it.",
        ],
      },
      {
        type: "text",
        title: "Why",
        text: "When a model gives bad results, we must know the reason. Is the model too simple (high bias)? Or is it too complex (high variance)? The fix is different for each. So we need this idea.",
      },
      {
        type: "points",
        title: "Real life (needed to understand)",
        intro: "3 students before an exam.",
        points: [
          "Student A reads only 1 chapter. He fails in practice papers and in the real exam. = High Bias (Underfitting).",
          "Student B learns old papers word by word. He gets 100% in old papers. But in the real exam the questions come in a new way, and he fails. = High Variance (Overfitting).",
          "Student C understands the concepts. He does well in both. = Good Fit.",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "Total Error = Bias² + Variance + Noise" }],
        points: [
          "Bias goes DOWN when the model becomes more complex.",
          "Variance goes UP when the model becomes more complex.",
          "This is the trade-off: we cannot make both zero. We need the middle point.",
        ],
      },
      {
        type: "points",
        title: "Underfitting vs Overfitting",
        points: [
          "Underfitting = High Bias, Low Variance. Train error HIGH, Test error HIGH. Example: straight line on curved data.",
          "Overfitting = Low Bias, High Variance. Train error VERY LOW, Test error HIGH. Example: degree 12 curve on small data.",
          "Good Fit = Low Bias, Low Variance. Train error LOW, Test error LOW (and close to train).",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          {
            text: "Easy way to find the problem: compare train score and test score.",
            sub: [
              "Both low = underfitting",
              "Train high, test much lower = overfitting",
              "Both high and close to each other = good fit",
            ],
          },
          "Big gap between train score and test score = high variance.",
          "Train score alone never tells the truth. A model can have a perfect train score and still be bad.",
          "Always check the score on TEST data (data the model has never seen).",
          "Noise cannot be removed. Even the best model will have some error.",
        ],
      },
      {
        type: "points",
        title: "How to fix Underfitting (High Bias)",
        intro: "Make the model stronger.",
        points: [
          "Add more features",
          "Use a higher degree (Polynomial)",
          "Use a more powerful model",
          "Reduce regularization (Ridge / Lasso, coming next)",
        ],
      },
      {
        type: "points",
        title: "How to fix Overfitting (High Variance)",
        intro: "Make the model simpler, or give it more data.",
        points: [
          "Get more training data",
          "Remove useless features",
          "Use a lower degree",
          "Use regularization (Ridge / Lasso, coming next)",
          "Use cross-validation",
        ],
      },
      {
        type: "code",
        code: `for degree in [1, 2, 3, 5, 8, 12]:
    model = make_pipeline(
        PolynomialFeatures(degree, include_bias=False),
        StandardScaler(),
        LinearRegression()
    )
    model.fit(X_train, y_train)

    train_r2 = r2_score(y_train, model.predict(X_train))    # score on seen data
    test_r2  = r2_score(y_test,  model.predict(X_test))     # score on unseen data
    print(degree, train_r2, test_r2, train_r2 - test_r2)    # last one = gap

# How to read the output:
# -> Train R2 keeps going up as degree goes up
# -> Test R2 goes up, then stops, then falls at high degree
# -> Gap (train - test) grows with degree = variance is growing
# -> Best degree = where TEST R2 is highest (not train R2)`,
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
      {points.map((p, i) => {
        const text = typeof p === "string" ? p : p.text;
        const sub = typeof p === "string" ? null : p.sub;
        return (
          <li key={i} className="flex gap-3 sm:gap-3.5 text-[16px] sm:text-[17px] leading-[1.7] sm:leading-[1.75] text-stone-700 dark:text-stone-300">
            <span
              className="mt-[0.85em] h-1 w-3 flex-shrink-0 rounded-full bg-teal-700 dark:bg-teal-400"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1 break-words">
              <Inline text={text} />
              {sub && (
                <ul className="mt-2.5 space-y-2">
                  {sub.map((s, j) => (
                    <li key={j} className="flex gap-3 text-stone-600 dark:text-stone-400">
                      <span
                        className="mt-[0.8em] h-1 w-1 flex-shrink-0 rounded-full bg-stone-400 dark:bg-stone-500"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 break-words">
                        <Inline text={s} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
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
            {line.l && <div className="text-[13px] sm:text-sm font-medium text-stone-500 dark:text-stone-400">{line.l}</div>}
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
          {block.intro && (
            <p className="mb-3.5 text-[16px] sm:text-[17px] leading-[1.7] text-stone-800 dark:text-stone-200">
              {block.intro}
            </p>
          )}
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

function PolynomialRegressionAndTradeOffs() {
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
                Polynomial Regression and Bias-Variance Trade-off
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

export default PolynomialRegressionAndTradeOffs;