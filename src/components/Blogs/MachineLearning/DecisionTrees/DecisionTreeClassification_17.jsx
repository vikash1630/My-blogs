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

.gd-page  { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; -webkit-text-size-adjust: 100%; -webkit-tap-highlight-color: transparent; }
.gd-serif { font-family: 'Newsreader', Georgia, 'Times New Roman', serif; font-optical-sizing: auto; }
.gd-mono  { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-ligatures: none; }
.gd-noscrollbar { scrollbar-width: none; }
.gd-noscrollbar::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
`;

/* ------------------------------------------------------------------ */
/*  DATA  (only the content from the notes)                            */
/* ------------------------------------------------------------------ */

const CONCEPTS = [
  {
    id: "geometric-intuition",
    name: "Decision Trees: Geometric Intuition",
    blocks: [
      {
        type: "text",
        text: "Decision Tree is a supervised ML algorithm that makes predictions by repeatedly splitting data based on feature conditions.",
      },
      {
        type: "points",
        title: "Core idea",
        points: [
          "Ask a question about a feature and divide data based on the answer.",
          "Repeat until we reach a final prediction.",
        ],
      },
      {
        type: "terms",
        title: "Terminology",
        items: [
          { term: "Root Node", desc: "Starting point containing the entire dataset." },
          { term: "Decision Node", desc: "Checks a condition and splits data." },
          { term: "Leaf Node", desc: "Final node containing the prediction." },
          { term: "Branch", desc: "Connection between nodes." },
        ],
      },
      {
        type: "image",
        src: "/decision-tree-terminology.png",
        alt: "A decision tree diagram: a yellow root node at the top, blue decision nodes below it, green leaf nodes at the bottom, and two dotted boxes marking branches.",
        caption: "Root node (yellow) starts the tree. Decision nodes (blue) split the data. Leaf nodes (green) give the final prediction. A dotted box marks one branch.",
      },
      {
        type: "points",
        title: "Geometric Intuition",
        points: [
          "Each split creates a decision boundary.",
          "Numerical features create horizontal or vertical boundaries in 2D.",
          "Multiple splits create rectangular decision regions.",
          "Each region represents a leaf node.",
          "Decision Trees create axis-aligned boundaries.",
        ],
      },
      {
        type: "points",
        title: "Split Selection",
        points: [
          "Goal = Create child nodes containing similar classes.",
          "Use Entropy or Gini to measure impurity.",
          "Use Information Gain to measure impurity reduction.",
        ],
      },
    ],
  },
  {
    id: "entropy",
    name: "Decision Trees: Entropy",
    blocks: [
      {
        type: "text",
        text: "Entropy measures impurity or uncertainty based on class distribution.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "H(S) = −Σ pᵢ · log₂(pᵢ)" }],
      },
      {
        type: "table",
        title: "Examples",
        head: ["Node", "Entropy"],
        rows: [
          ["10 Pass, 0 Fail", "0 (Pure)"],
          ["5 Pass, 5 Fail", "1 (Maximum impurity)"],
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Pure node = Entropy 0.",
          "Equal class distribution = Maximum entropy.",
          "Binary classification maximum = 1.",
          "Higher entropy = More impurity.",
          "0·log₂(0) is treated as 0.",
        ],
      },
    ],
  },
  {
    id: "gini-impurity",
    name: "Decision Trees: Gini Impurity",
    blocks: [
      {
        type: "text",
        text: "Gini measures the probability of incorrect classification when assigning a class randomly according to the node's class distribution.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "Gini(S) = 1 − Σ pᵢ²" }],
      },
      {
        type: "table",
        title: "Examples",
        head: ["Node", "Gini"],
        rows: [
          ["10 Pass, 0 Fail", "0"],
          ["5 Pass, 5 Fail", "0.5"],
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Pure node = Gini 0.",
          "Binary classification maximum = 0.5.",
          "Higher Gini = More impurity.",
          "Computationally simpler than Entropy.",
        ],
      },
    ],
  },
  {
    id: "entropy-vs-gini",
    name: "Entropy vs Gini",
    blocks: [
      {
        type: "table",
        head: ["", "Entropy", "Gini"],
        rows: [
          ["Uses", "logarithms", "squared probabilities"],
          ["Maximum (binary)", "1", "0.5"],
        ],
      },
      {
        type: "points",
        points: [
          "Both measure impurity and prefer purer child nodes.",
          "Scikit-learn default criterion = Gini.",
        ],
      },
    ],
  },
  {
    id: "information-gain",
    name: "Decision Trees: Information Gain",
    blocks: [
      {
        type: "text",
        text: "Information Gain measures how much entropy decreases after splitting a dataset.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { f: "IG = Parent Entropy − Weighted Child Entropy" },
          { f: "IG = H(S) − Σ ( |Sj| / |S| ) · H(Sj)" },
        ],
      },
      {
        type: "points",
        title: "Example",
        points: [
          "Parent: 5 Pass, 5 Fail. Parent Entropy = 1.",
          "After splitting: Left = 4 Pass, 1 Fail. Right = 1 Pass, 4 Fail.",
          "Each child entropy = 0.722.",
        ],
      },
      {
        type: "formula",
        lines: [
          { l: "Weighted Child Entropy", f: "(5/10 × 0.722) + (5/10 × 0.722) = 0.722" },
          { l: "Information Gain", f: "1 − 0.722 = 0.278" },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Higher Information Gain = Better split.",
          "Choose the split with maximum Information Gain.",
          "With Gini, choose maximum Gini reduction.",
          "Splitting continues recursively.",
        ],
      },
    ],
  },
  {
    id: "python-implementation",
    name: "Python Implementation",
    blocks: [
      {
        type: "code",
        code: `from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(
    criterion="entropy",       # Entropy (default is gini)
    max_depth=3
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)`,
      },
      {
        type: "points",
        title: "Important",
        points: [
          "`criterion=\"gini\"` = Gini Impurity.",
          "`criterion=\"entropy\"` = Entropy.",
          "`max_depth` = Maximum tree depth.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Decision Tree = Feature-based Splitting. Entropy = Uncertainty. Gini = Impurity. Information Gain = Reduction in Entropy. Best Split = Maximum Information Gain.",
      },
    ],
  },
  {
    id: "hyperparameters",
    name: "Decision Tree Hyperparameters",
    blocks: [
      {
        type: "text",
        text: "Hyperparameters control the complexity and behavior of a Decision Tree.",
      },
      {
        type: "terms",
        items: [
          { term: "1. max_depth", desc: "Maximum depth of the tree. Smaller value = Simpler tree. Larger value = More complex tree." },
          { term: "2. min_samples_split", desc: "Minimum samples required to split a node. Higher value = Fewer splits." },
          { term: "3. min_samples_leaf", desc: "Minimum samples required in each leaf. Prevents leaves with very few samples." },
          { term: "4. max_features", desc: "Maximum features considered when finding the best split." },
          { term: "5. criterion", desc: "Defines split quality. \"gini\" = Gini Impurity. \"entropy\" = Entropy. \"log_loss\" = Log Loss." },
          { term: "6. ccp_alpha", desc: "Controls cost-complexity pruning. Higher value = More pruning. Removes unnecessary branches." },
        ],
      },
    ],
  },
  {
    id: "overfitting-underfitting",
    name: "Overfitting and Underfitting",
    blocks: [
      {
        type: "text",
        title: "Overfitting",
        text: "Model learns training data too closely, including noise.",
      },
      {
        type: "compare",
        items: [
          {
            title: "Causes",
            text: "Excessive tree depth. Too many branches. Very few samples in leaf nodes.",
          },
          {
            title: "Prevention",
            text: "Decrease max_depth. Increase min_samples_split. Increase min_samples_leaf. Apply pruning using ccp_alpha.",
          },
        ],
      },
      {
        type: "image",
        src: "/decision-tree-pruning.png",
        alt: "Left: an overfit tree with many deep splits and a boundary with tiny regions around noise points. Middle: pruning shears with max_depth, min_samples_leaf and ccp_alpha. Right: a small pruned tree with smooth decision regions.",
        caption: "An overfit tree memorizes noise points in tiny regions. Pruning (max_depth, min_samples_leaf, ccp_alpha) removes that complexity, so the pruned tree draws smoother regions and generalizes better.",
      },
      {
        type: "text",
        title: "Underfitting",
        text: "Model is too simple to learn important patterns.",
      },
      {
        type: "compare",
        items: [
          {
            title: "Causes",
            text: "Very small max_depth. Too few splits. Excessive pruning.",
          },
          {
            title: "Solution",
            text: "Allow more splits. Increase max_depth. Reduce excessive pruning.",
          },
        ],
      },
    ],
  },
  {
    id: "bias-variance-connection",
    name: "Bias-Variance Connection",
    blocks: [
      {
        type: "points",
        points: [
          "Underfitting = High Bias, Low Variance.",
          "Overfitting = Low Bias, High Variance.",
          "Good fit = Balanced Bias and Variance.",
        ],
      },
      {
        type: "compare",
        title: "Tree complexity",
        items: [
          { title: "Shallow tree", text: "More bias, less variance." },
          { title: "Deep tree", text: "Less bias, more variance." },
        ],
      },
    ],
  },
  {
    id: "python-train-test",
    name: "Python: Train vs Test Score",
    blocks: [
      {
        type: "code",
        code: `from sklearn.tree import DecisionTreeClassifier

model = DecisionTreeClassifier(
    max_depth=4,
    min_samples_split=10,
    min_samples_leaf=5,
    criterion="gini"
)

model.fit(X_train, y_train)

print("Train:", model.score(X_train, y_train))
print("Test:", model.score(X_test, y_test))`,
      },
      {
        type: "points",
        title: "Interpretation",
        points: [
          "High train + Low test score = Possible overfitting.",
          "Low train + Low test score = Possible underfitting.",
          "Good train + Test scores = Better generalization.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "max_depth = Tree depth. min_samples_split = Minimum samples to split. min_samples_leaf = Minimum samples per leaf. ccp_alpha = Pruning strength.",
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
  return String(text)
    .split("`")
    .map((chunk, i) =>
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

// Term + description rows: stacked on phones, side by side on larger screens
function Terms({ title, items }) {
  return (
    <div>
      {title && <Label>{title}</Label>}
      <dl className="divide-y divide-stone-200 dark:divide-white/10 rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-white/[0.03]">
        {items.map((it, i) => (
          <div key={i} className="px-4 sm:px-5 py-4 sm:grid sm:grid-cols-[13rem_1fr] sm:gap-6">
            <dt className="gd-serif text-[19px] sm:text-xl font-medium leading-snug text-stone-900 dark:text-stone-100">
              {it.term}
            </dt>
            <dd className="mt-1.5 sm:mt-0 min-w-0 break-words text-[16px] sm:text-[17px] leading-[1.7] text-stone-700 dark:text-stone-300">
              <Inline text={it.desc} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Side by side comparison: stacked on phones
function Compare({ title, items }) {
  return (
    <div>
      {title && <Label>{title}</Label>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-4 sm:px-5 py-4 sm:py-5"
          >
            <div className="gd-serif mb-2 text-[21px] sm:text-2xl font-medium text-teal-800 dark:text-teal-300">
              {it.title}
            </div>
            <p className="break-words text-[16px] sm:text-[17px] leading-[1.7] text-stone-700 dark:text-stone-300">
              <Inline text={it.text} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Table: scrolls sideways inside its own box on narrow phones
function DataTable({ title, head, rows, note }) {
  return (
    <div>
      {title && <Label>{title}</Label>}
      <div className="gd-noscrollbar overflow-x-auto rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-white/[0.03]">
        <table className="w-full min-w-[420px] border-collapse text-left text-[15px] sm:text-[16px] leading-[1.6]">
          <thead>
            <tr className="bg-stone-100 dark:bg-white/[0.06]">
              {head.map((h, i) => (
                <th key={i} className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100 align-bottom">
                  <Inline text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-stone-200 dark:border-white/10">
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={
                      "px-4 py-3 align-top " +
                      (j === 0
                        ? "font-medium text-stone-900 dark:text-stone-100"
                        : "text-stone-700 dark:text-stone-300")
                    }
                  >
                    <Inline text={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-3 text-sm leading-6 text-stone-500 dark:text-stone-400">{note}</p>}
    </div>
  );
}

// Image from the public folder
function Figure({ src, alt, caption }) {
  return (
    <figure className="-mx-4 sm:mx-0">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-auto w-full border-y sm:border sm:rounded-lg border-stone-200 dark:border-white/10 bg-white"
      />
      {caption && (
        <figcaption className="mt-3 px-4 sm:px-0 text-sm leading-6 text-stone-500 dark:text-stone-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// The one thing to remember
function Callout({ title, text }) {
  return (
    <div className="rounded-lg border-l-4 border-teal-700 dark:border-teal-400 bg-teal-50 dark:bg-teal-400/10 px-4 sm:px-6 py-5">
      {title && <Label>{title}</Label>}
      <p className="gd-serif break-words text-[21px] sm:text-2xl italic leading-[1.5] text-stone-900 dark:text-stone-100">
        {text}
      </p>
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
    case "terms":
      return <Terms title={block.title} items={block.items} />;
    case "compare":
      return <Compare title={block.title} items={block.items} />;
    case "table":
      return <DataTable title={block.title} head={block.head} rows={block.rows} note={block.note} />;
    case "image":
      return <Figure src={block.src} alt={block.alt} caption={block.caption} />;
    case "callout":
      return <Callout title={block.title} text={block.text} />;
    case "points":
      return (
        <div>
          {block.title && <Label>{block.title}</Label>}
          {block.intro && (
            <p className="mb-3.5 text-[16px] sm:text-[17px] leading-[1.7] text-stone-800 dark:text-stone-200">
              <Inline text={block.intro} />
            </p>
          )}
          <Points points={block.points} />
        </div>
      );
    case "code":
      return (
        <div>
          <Label>{block.title || "Code"}</Label>
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

function DecisionTreeClassification_17() {
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
                Decision Trees: Classification, Entropy and Information Gain
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

export default DecisionTreeClassification_17;