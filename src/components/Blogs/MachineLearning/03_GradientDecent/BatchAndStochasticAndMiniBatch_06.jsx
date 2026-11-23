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

.gd-page  { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
.gd-serif { font-family: 'Newsreader', Georgia, 'Times New Roman', serif; font-optical-sizing: auto; }
.gd-mono  { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-ligatures: none; }
`;

/* ------------------------------------------------------------------ */
/*  DATA  (only the content from the notes)                            */
/* ------------------------------------------------------------------ */

const CONCEPTS = [
  {
    id: "batch-gradient-descent",
    name: "Batch Gradient Descent",
    blocks: [
      {
        type: "text",
        text: "Gradient Descent finds the best m and b step by step. It starts with a guess, measures the error, and moves m and b a small step in the direction that reduces the error, repeated many times. BATCH = every step uses ALL rows of the training data.",
      },
      {
        type: "text",
        title: "Why",
        text: "Direct formulas become too heavy for big or complex models. Gradient Descent is how Linear Regression, Logistic Regression and Neural Networks learn.",
      },
      {
        type: "points",
        title: "Real life",
        points: [
          "Walking down a hill in thick fog. You can't see the bottom, but you feel which way the ground slopes down, take a small step that way, check again, and repeat until the ground is flat.",
          "Hill = loss (error), your position = m and b, step size = lr, flat ground = best m and b.",
          "Batch = before each step, you check the slope using ALL the data (like asking every person in the city before taking one step).",
          "Used in: training linear regression, logistic regression, neural networks (ChatGPT-type models are also trained with gradient descent variants).",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { f: "Loss (MSE) = (1/n) · Σ (y − ŷ)²", n: "where ŷ = m·x + b" },
          { f: "dm = (−2/n) · Σ x · (y − ŷ)", n: "slope of loss w.r.t. m" },
          { f: "db = (−2/n) · Σ (y − ŷ)", n: "slope of loss w.r.t. b" },
          { f: "m = m − lr · dm" },
          { f: "b = b − lr · db" },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "`lr` (learning rate) = step size. Too big = jumps past the best point (loss goes up). Too small = takes forever.",
          "epoch = one full pass over all rows. One epoch = one update of m and b.",
          "Scale the columns first (Standardization), otherwise it can blow up.",
          "Positive slope (`dm > 0`) = m is too big, so m decreases. Negative slope = m is too small, so m increases.",
          "Stop when loss stops going down (flat).",
          "Batch uses all rows per step: stable and smooth, but slow on big data.",
        ],
      },
      {
        type: "code",
        code: `m, b = 0.0, 0.0                     # starting guess
lr = 0.1                            # learning rate
n = len(x)

for epoch in range(100):
    y_pred = m * x + b              # predict using current m and b

    dm = (-2 / n) * np.sum(x * (y - y_pred))
    # dm = slope of loss w.r.t. m
    # -> (y - y_pred) = error of each row, x * error = how much each row blames m
    # -> sum over ALL rows (batch), average with 1/n, -2 comes from derivative of the square
    # -> dm tells which way and how much to move m

    db = (-2 / n) * np.sum(y - y_pred)
    # db = slope of loss w.r.t. b
    # -> same as dm but without x, because b is added directly (b has no x attached)
    # -> db tells which way and how much to move b

    m = m - lr * dm                 # step downhill for m
    b = b - lr * db                 # step downhill for b`,
      },
    ],
  },
  {
    id: "stochastic-gradient-descent",
    name: "Stochastic Gradient Descent (SGD)",
    blocks: [
      {
        type: "text",
        text: "SGD is Gradient Descent where each step uses only ONE random row of the data, instead of all rows. One epoch = n updates of m and b (one per row).",
      },
      {
        type: "text",
        title: "Why",
        text: "Batch GD is slow on big data because every single step needs all rows. SGD updates after every row, so it moves much faster.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { f: "ŷᵢ = m·xᵢ + b" },
          { f: "dm = −2 · xᵢ · (yᵢ − ŷᵢ)", n: "slope of loss w.r.t. m, from ONE row" },
          { f: "db = −2 · (yᵢ − ŷᵢ)", n: "slope of loss w.r.t. b, from ONE row" },
          { f: "m = m − lr · dm" },
          { f: "b = b − lr · db" },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Batch GD = all rows per step, 1 update per epoch. SGD = 1 row per step, n updates per epoch.",
          "Path is noisy (zigzag), loss does not go down smoothly, it wobbles around the best value.",
          "Needs fewer epochs than Batch because each epoch already has n updates.",
          "Use a smaller `lr` than Batch, because each step is noisy.",
          "Good for huge data and data that comes live (online learning).",
          "Noise can help to escape bad spots in the loss, but it may never settle exactly on the best point.",
          "Pick rows randomly (shuffle), otherwise the order of data can bias the result.",
          "Scale the columns first (Standardization), same as Batch.",
          "sklearn version: `SGDRegressor`.",
        ],
      },
      {
        type: "code",
        code: `m, b = 0.0, 0.0
lr = 0.01                                # smaller lr than Batch
n = len(x)

for epoch in range(10):
    for _ in range(n):
        i = np.random.randint(0, n)      # pick ONE random row
        y_pred = m * x[i] + b            # predict for that row only

        dm = -2 * x[i] * (y[i] - y_pred)
        # dm = slope of loss w.r.t. m, from ONE row
        # -> no sum and no 1/n, because there is only one row
        # -> x[i] * error = how much THIS row blames m

        db = -2 * (y[i] - y_pred)
        # db = slope of loss w.r.t. b, from ONE row
        # -> same as dm but without x, because b has no x attached

        m = m - lr * dm                  # step downhill for m
        b = b - lr * db                  # step downhill for b`,
      },
    ],
  },
  {
    id: "mini-batch-gradient-descent",
    name: "Mini-Batch Gradient Descent",
    blocks: [
      {
        type: "text",
        text: "Mini-Batch GD is the middle path between Batch GD and SGD. Each step uses a SMALL GROUP of rows (mini-batch, ex: 32 or 64) instead of all rows or only one row.",
      },
      {
        type: "text",
        title: "Why",
        text: "Batch is smooth but slow, SGD is fast but noisy. Mini-Batch is fast and fairly smooth, so it gives the best of both.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { f: "ŷ = m·x + b" },
          { f: "dm = (−2 / batch_size) · Σ x · (y − ŷ)", n: "slope of loss w.r.t. m, over the mini-batch" },
          { f: "db = (−2 / batch_size) · Σ (y − ŷ)", n: "slope of loss w.r.t. b, over the mini-batch" },
          { f: "m = m − lr · dm" },
          { f: "b = b − lr · db" },
        ],
      },
      {
        type: "points",
        title: "Batch vs SGD vs Mini-Batch",
        points: [
          "Batch = all n rows per step, 1 update per epoch, smooth, slow.",
          "SGD = 1 row per step, n updates per epoch, noisy, fast.",
          "Mini-Batch = `batch_size` rows per step, `n / batch_size` updates per epoch, fairly smooth, fast.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "`batch_size = n` is Batch GD, `batch_size = 1` is SGD, anything in between is Mini-Batch. Same code, only `batch_size` changes.",
          "Common batch sizes: 32, 64, 128, 256 (powers of 2 work well on GPUs).",
          "Shuffle the rows at the start of every epoch.",
          "The last mini-batch can be smaller than `batch_size`, so divide by `len(xb)`, not `batch_size`.",
          "Bigger batch = smoother but slower steps. Smaller batch = noisier but faster steps.",
          "Default choice for training neural networks (TensorFlow, PyTorch).",
          "Scale the columns first (Standardization), same as Batch and SGD.",
        ],
      },
      {
        type: "code",
        code: `m, b = 0.0, 0.0
lr = 0.05
n = len(x)
batch_size = 32

for epoch in range(20):
    idx = np.random.permutation(n)           # shuffle rows every epoch
    x_s, y_s = x[idx], y[idx]

    for start in range(0, n, batch_size):
        xb = x_s[start:start + batch_size]   # one mini-batch of x
        yb = y_s[start:start + batch_size]   # one mini-batch of y
        y_pred = m * xb + b

        dm = (-2 / len(xb)) * np.sum(xb * (yb - y_pred))
        # dm = slope of loss w.r.t. m, from THIS mini-batch
        # -> sum over the mini-batch rows only, average with 1/len(xb)
        # -> x * error = how much each row blames m

        db = (-2 / len(xb)) * np.sum(yb - y_pred)
        # db = slope of loss w.r.t. b, from THIS mini-batch
        # -> same as dm but without x, because b has no x attached

        m = m - lr * dm                      # step downhill for m
        b = b - lr * db                      # step downhill for b`,
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
    <div className="relative">
      <button
        onClick={copy}
        className="absolute right-2 top-2 z-10 rounded-md border border-stone-200 dark:border-white/10 bg-white/90 dark:bg-stone-900/90 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 print:hidden"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="gd-mono overflow-x-auto rounded-lg border border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-black/40 px-4 sm:px-5 pt-12 pb-4 sm:pt-4 text-[12.5px] sm:text-[13.5px] leading-[1.7] text-stone-800 dark:text-stone-200">
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
  return <p className="mb-3 text-sm font-semibold tracking-wide text-teal-800 dark:text-teal-300">{children}</p>;
}

function Points({ points }) {
  return (
    <ul className="space-y-3.5">
      {points.map((p, i) => (
        <li key={i} className="flex gap-3.5 text-base sm:text-[17px] leading-[1.75] text-stone-700 dark:text-stone-300">
          <span
            className="mt-[0.85em] h-1 w-3 flex-shrink-0 rounded-full bg-teal-700 dark:bg-teal-400"
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
function Formula({ title, lines }) {
  return (
    <div>
      {title && <Label>{title}</Label>}
      <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-5 py-4 space-y-3">
        {lines.map((line, i) => (
          <div key={i}>
            <div className="gd-serif whitespace-nowrap text-xl sm:text-2xl italic leading-9 text-stone-900 dark:text-stone-100">
              {line.f}
            </div>
            {line.n && <div className="text-sm leading-6 text-stone-500 dark:text-stone-400">{line.n}</div>}
          </div>
        ))}
      </div>
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
                ? "max-w-[64ch] text-base sm:text-[17px] leading-[1.75] text-stone-700 dark:text-stone-300"
                : "max-w-[62ch] text-lg sm:text-xl leading-[1.7] text-stone-800 dark:text-stone-200"
            }
          >
            <Inline text={block.text} />
          </p>
        </div>
      );
    case "formula":
      return <Formula title={block.title} lines={block.lines} />;
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

function BatchAndStochasticAndMiniBatch_06() {
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
    <div className="gd-page min-h-screen w-full overflow-x-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-500">
      <style>{FONT_CSS}</style>

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

              <h1 className="gd-serif text-4xl sm:text-6xl font-medium tracking-[-0.02em] leading-[1.05] text-stone-900 dark:text-white">
                Batch, Stochastic and Mini-Batch Gradient Descent
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
              <span className="gd-serif text-4xl sm:text-5xl italic leading-none text-teal-800 dark:text-teal-300">
                {i + 1}
              </span>
              <h2 className="gd-serif min-w-0 text-3xl sm:text-4xl font-medium tracking-[-0.015em] leading-snug text-stone-900 dark:text-white">
                {c.name}
              </h2>
            </div>

            <div className="space-y-9">
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

export default BatchAndStochasticAndMiniBatch_06;