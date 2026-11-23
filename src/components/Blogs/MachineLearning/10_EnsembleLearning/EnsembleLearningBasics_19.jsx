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
    id: "intro-ensemble",
    name: "Introduction to Ensemble Learning",
    blocks: [
      {
        type: "text",
        text: "Ensemble Learning combines predictions from multiple models to produce a better final prediction.",
      },
      {
        type: "points",
        title: "Core Idea",
        points: [
          "Instead of depending on one model, combine multiple models.",
          "Individual models = Base Learners.",
          "Combined model = Ensemble Model.",
        ],
      },
      {
        type: "points",
        title: "Why Ensemble Learning?",
        points: [
          "Reduces the impact of individual model errors.",
          "Can improve prediction accuracy.",
          "Often improves generalization.",
        ],
      },
    ],
  },
  {
    id: "model-diversity",
    name: "Model Diversity",
    blocks: [
      {
        type: "text",
        text: "Diversity means models should make different errors.",
      },
      {
        type: "points",
        points: [
          "Identical models making identical mistakes provide little benefit.",
          "Different models making different errors can improve ensemble performance.",
        ],
      },
      {
        type: "points",
        title: "Ensemble performance depends on",
        points: [
          "Individual model quality.",
          "Diversity between models.",
          "How predictions are combined.",
        ],
      },
    ],
  },
  {
    id: "types-of-ensembles",
    name: "Types of Ensemble Techniques",
    blocks: [
      {
        type: "points",
        title: "1. Voting",
        points: [
          "Combines predictions from multiple models.",
          "Classification = Voting Classifier.",
          "Regression = Averaging predictions.",
        ],
      },
      {
        type: "image",
        src: "/ensemble-voting.png",
        alt: "Voting: a training data set feeds classification models LR, SVM, NB and KNN. Each gives a prediction P1 to Pn, and a voting step combines them into one final prediction Pf.",
        caption: "Voting: several different models predict on the same data, and a vote gives the final prediction.",
      },
      {
        type: "points",
        title: "2. Bagging (Bootstrap Aggregating)",
        points: [
          "Trains multiple models independently on different data samples.",
          "Main goal = Reduce Variance.",
        ],
      },
      {
        type: "image",
        src: "/ensemble-bagging.png",
        alt: "Bagging: the original data is bootstrapped into several samples, a decision tree is trained on each sample, and their predictions are combined into one prediction.",
        caption: "Bagging: each tree trains on its own bootstrapped sample. The predictions are then combined.",
      },
      {
        type: "points",
        title: "3. Boosting",
        points: [
          "Trains models sequentially.",
          "Later models focus on previous errors.",
          "Often reduces Bias.",
        ],
      },
      {
        type: "image",
        src: "/ensemble-boosting.png",
        alt: "Boosting: training data goes through models h1 to h4 in a chain. Each model corrects the previous model's mistakes, and weights alpha 1 to alpha 4 combine them into a strong learner.",
        caption: "Boosting: models are trained one after another. Each one focuses on the mistakes left by the one before it.",
      },
      {
        type: "points",
        title: "4. Stacking",
        points: [
          "Combines predictions using another model called Meta Learner.",
          "Base models make predictions; Meta Learner produces final output.",
        ],
      },
      {
        type: "image",
        src: "/ensemble-stacking.png",
        alt: "Stacking: data goes to Base Learner 1 to n. Their predictions go into a Meta Learner, which gives the final prediction.",
        caption: "Stacking: the Meta Learner takes the base models' predictions and produces the final output.",
      },
    ],
  },
  {
    id: "important-differences",
    name: "Important Differences",
    blocks: [
      {
        type: "terms",
        items: [
          { term: "Voting", desc: "Combines independent model predictions." },
          { term: "Bagging", desc: "Independent models trained on different samples." },
          { term: "Boosting", desc: "Sequential model training." },
          { term: "Stacking", desc: "Meta-model combines base model predictions." },
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
          "High Bias = Underfitting.",
          "High Variance = Overfitting.",
          "Bagging typically reduces Variance.",
          "Boosting often reduces Bias.",
          "Voting and Stacking combine different model predictions.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Ensemble Learning = Combining multiple models. Base Learners = Individual models. Diversity = Different prediction errors. Bagging = Parallel training. Boosting = Sequential training. Voting = Prediction combination. Stacking = Meta Learner.",
      },
    ],
  },
  {
    id: "voting-intro",
    name: "Voting Ensemble: Introduction",
    blocks: [
      {
        type: "text",
        text: "Voting Ensemble combines predictions from multiple ML models to produce one final prediction.",
      },
      {
        type: "points",
        title: "Core Idea",
        points: [
          "Train multiple models.",
          "Collect predictions from each model.",
          "Combine predictions to get final output.",
        ],
      },
      {
        type: "table",
        title: "Example (Logistic Regression, Decision Tree, KNN)",
        head: ["Model", "Prediction"],
        rows: [
          ["Logistic Regression", "Class A"],
          ["Decision Tree", "Class B"],
          ["KNN", "Class A"],
        ],
        note: "Final Prediction = Class A (Majority votes).",
      },
      {
        type: "points",
        title: "Why Voting Ensemble?",
        points: [
          "Different algorithms learn patterns differently.",
          "Combining models can reduce individual prediction errors.",
          "Works best when models are reasonably accurate and make different errors.",
        ],
      },
      {
        type: "points",
        title: "Important Characteristics",
        points: [
          "Models are trained independently.",
          "Different algorithms can be combined.",
          "Models can use the same training dataset.",
          "Supports classification and regression.",
        ],
      },
      {
        type: "compare",
        title: "Voting vs Bagging",
        items: [
          {
            title: "Voting",
            text: "Combines predictions from multiple models. Often combines different algorithms. Models can use the same dataset.",
          },
          {
            title: "Bagging",
            text: "Trains models on different bootstrap samples. Often uses the same algorithm.",
          },
        ],
      },
      {
        type: "terms",
        title: "Types of Voting",
        items: [
          { term: "1. Hard Voting", desc: "Combines predicted class labels. Final class = Majority votes." },
          { term: "2. Soft Voting", desc: "Combines predicted class probabilities. Final class = Highest average probability." },
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Voting = Combining model predictions. Hard Voting = Class labels. Soft Voting = Class probabilities.",
      },
    ],
  },
  {
    id: "voting-classifier",
    name: "Voting Classifier: Hard vs Soft Voting",
    blocks: [
      {
        type: "text",
        text: "Voting Classifier combines predictions from multiple classification models.",
      },
      {
        type: "points",
        title: "1. Hard Voting",
        points: [
          "Uses predicted class labels.",
          "Final class = Class receiving maximum votes.",
          "Example: Logistic Regression = Pass. Decision Tree = Fail. KNN = Pass. Final Prediction = Pass (2 votes).",
        ],
      },
      {
        type: "points",
        title: "2. Soft Voting",
        points: [
          "Uses predicted class probabilities.",
          "Calculates average probability for each class.",
          "Final class = Class with highest average probability.",
        ],
      },
      {
        type: "table",
        title: "Example",
        head: ["", "Class A", "Class B"],
        rows: [
          ["Model 1", "0.80", "0.20"],
          ["Model 2", "0.40", "0.60"],
          ["Model 3", "0.70", "0.30"],
        ],
      },
      {
        type: "formula",
        lines: [
          { l: "Average Class A", f: "(0.80 + 0.40 + 0.70) / 3 = 0.633" },
          { l: "Average Class B", f: "(0.20 + 0.60 + 0.30) / 3 = 0.367" },
        ],
        points: ["Final Prediction = Class A."],
      },
      {
        type: "text",
        title: "Weighted Voting",
        text: "Assigns different weights to models based on their importance.",
      },
      {
        type: "formula",
        lines: [
          { l: "Weighted Probability", f: "Σ (weight × probability) / Σ weights" },
          { l: "Example: Model 1 (p = 0.80, weight 3), Model 2 (p = 0.40, weight 1)", f: "(0.80×3 + 0.40×1) / (3 + 1) = 0.70" },
        ],
        points: ["Higher weight = More influence on final prediction."],
      },
      {
        type: "compare",
        title: "Hard vs Soft Voting",
        items: [
          {
            title: "Hard Voting",
            text: "Uses class labels. Majority voting. Does not consider prediction confidence.",
          },
          {
            title: "Soft Voting",
            text: "Uses class probabilities. Considers model confidence. Requires predict_proba().",
          },
        ],
      },
      {
        type: "points",
        title: "Important",
        points: ["Soft Voting is often preferred when probability estimates are well calibrated."],
      },
      {
        type: "code",
        title: "Python Implementation",
        code: `from sklearn.ensemble import VotingClassifier

model = VotingClassifier(
    estimators=[
        ('lr', LogisticRegression()),
        ('dt', DecisionTreeClassifier()),
        ('knn', KNeighborsClassifier())
    ],
    voting='hard'    # Use 'soft' for Soft Voting
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)`,
      },
      {
        type: "callout",
        title: "Remember",
        text: "Hard Voting = Majority of class labels. Soft Voting = Average of class probabilities. Weighted Voting = Different model weights. predict() = Class prediction. predict_proba() = Class probabilities.",
      },
    ],
  },
  {
    id: "voting-regression",
    name: "Voting Ensemble: Regression",
    blocks: [
      {
        type: "text",
        text: "Voting Regressor combines predictions from multiple regression models by calculating their average.",
      },
      {
        type: "table",
        title: "Example",
        head: ["Model", "Prediction"],
        rows: [
          ["Linear Regression", "100"],
          ["Decision Tree", "120"],
          ["KNN", "110"],
        ],
        note: "Final Prediction = (100 + 120 + 110) / 3 = 110",
      },
      {
        type: "formula",
        title: "Mathematical Formula",
        lines: [
          { l: "Simple Average", f: "y_pred = Σ model_predictions / n" },
          { l: "Weighted Average", f: "y_pred = Σ (weight × prediction) / Σ weights" },
        ],
      },
      {
        type: "table",
        title: "Weighted example",
        head: ["Model", "Prediction", "Weight"],
        rows: [
          ["Model 1", "100", "2"],
          ["Model 2", "120", "1"],
          ["Model 3", "110", "1"],
        ],
        note: "Weighted Prediction = (100×2 + 120×1 + 110×1) / (2+1+1) = 107.5",
      },
      {
        type: "points",
        title: "Important",
        points: [
          "Higher weight = More influence on final prediction.",
          "Weights are chosen based on validation performance.",
          "Voting Regressor does not automatically learn optimal weights.",
        ],
      },
      {
        type: "code",
        title: "Python Implementation",
        code: `from sklearn.ensemble import VotingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor

model = VotingRegressor(
    estimators=[
        ('lr', LinearRegression()),
        ('dt', DecisionTreeRegressor(max_depth=4)),
        ('knn', KNeighborsRegressor())
    ],
    weights=[2, 1, 1]
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)`,
      },
      {
        type: "compare",
        title: "Voting Classifier vs Regressor",
        items: [
          {
            title: "Voting Classifier",
            text: "Predicts categories. Uses Hard or Soft Voting. Final output = Class label.",
          },
          {
            title: "Voting Regressor",
            text: "Predicts numerical values. Uses Averaging. Final output = Average prediction.",
          },
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Voting Regressor = Combines regression predictions. Simple Voting = Arithmetic average. Weighted Voting = Weighted average. Higher Weight = More influence.",
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

function EnsembleLearningBasics_19() {
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
                Ensemble Learning: Voting, Bagging, Boosting and Stacking
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

export default EnsembleLearningBasics_19;