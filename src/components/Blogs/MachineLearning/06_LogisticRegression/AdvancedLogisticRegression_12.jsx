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
    id: "softmax-regression",
    name: "Softmax Regression",
    blocks: [
      {
        type: "text",
        text: "Softmax Regression is Logistic Regression for 3 or more choices. The model makes one score for each choice. Softmax then turns all the scores into chances that add up to 1.",
      },
      {
        type: "text",
        title: "Why",
        text: "Sigmoid gives only one chance. That works for 2 choices (leave or stay). For 3 or more choices (which contract?), we need one chance for each choice.",
      },
      {
        type: "points",
        title: "What is z",
        points: [
          "z is the score. Multiply each input by its weight and add them up.",
          "z = w0 + w1·tenure + w2·MonthlyCharges",
          "Example: w0 = 1, w1 = −0.5, w2 = 0.05, tenure = 2, MonthlyCharges = 80, so z = 1 − 1 + 4 = 4.",
          "z can be any number (big, small, negative). It is NOT a chance yet. We need a squeezer.",
        ],
      },
      {
        type: "compare",
        title: "Sigmoid vs Softmax",
        items: [
          {
            title: "Logistic (sigmoid)",
            text: "2 choices. ONE score z. One chance. The other chance = 1 − first chance.",
          },
          {
            title: "Softmax",
            text: "3 or more choices. ONE score for EACH choice. A list of chances that add up to 1.",
          },
        ],
      },
      {
        type: "text",
        text: "Why \"1 minus it\" stops working: if Month-to-month is 0.7, the leftover 0.3 must be shared by 2 choices. So each choice needs its own score.",
      },
      {
        type: "table",
        title: "Example (one customer)",
        head: ["Choice", "Score z", "Chance"],
        rows: [
          ["Month-to-month", "4.0", "0.93"],
          ["One year", "1.0", "0.05"],
          ["Two year", "0.5", "0.03"],
        ],
        note: "Model picks the biggest chance: Month-to-month.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Chance of choice k", f: "p_k = e^(z_k) / (e^(z_1) + e^(z_2) + ... + e^(z_K))" },
          { l: "Loss = Categorical Cross Entropy", f: "loss = −log(chance of the correct choice)" },
        ],
        points: ["Raise e to each score, then divide each one by the total."],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Chances are between 0 and 1 and add up to 1. Biggest score gets the biggest chance.",
          "Softmax with 2 choices = Sigmoid. Logistic Regression is the 2-choice case of Softmax.",
          "One set of weights for each class. For 3 classes and 2 inputs, weights shape = (3, 2).",
          "In sklearn, use `LogisticRegression` for both. With 3 or more classes it uses Softmax by itself.",
          "Scale the columns first (`StandardScaler`).",
          "Confusion matrix is N x N. The diagonal is the correct answers.",
          "Use macro-F1 (plain average over classes) when rare classes matter. Weighted avg follows class size.",
          "Last step of most deep learning classifiers is a Softmax.",
        ],
      },
      {
        type: "code",
        code: `def softmax(z):
    z = z - np.max(z)             # safety trick, answer stays the same
    e = np.exp(z)
    return e / e.sum()

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)                   # y has 3 classes, so Softmax is used
model.predict_proba(X_test)                   # 3 chances per row, adding up to 1`,
      },
    ],
  },
  {
    id: "polynomial-features",
    name: "Polynomial Features in Logistic Regression",
    blocks: [
      {
        type: "text",
        text: "Add new columns made from the old ones (x1², x1·x2, x2²), then fit a normal Logistic Regression. The boundary becomes a curve, not a straight line.",
      },
      {
        type: "text",
        title: "Why",
        text: "A straight line cannot split data when one class sits in the middle and the other is around it. Example: pass is at 6 hours of study, fail is at 1 hour and 14 hours.",
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Degree 1 = straight line. Degree 2 = curve. Higher degree = more twisty, more risk of overfitting.",
          "Same trick as Polynomial Regression (Group 3).",
          "Order: `PolynomialFeatures`, then `StandardScaler`, then `LogisticRegression`.",
          "Choose the degree by cross-validation, not by train score. Degree 2 or 3 is usually the limit.",
          "Start with plain Logistic Regression as baseline. Use polynomial only if the score goes up.",
          "Control overfitting with `C` (smaller C = stronger punishment).",
          "For very curvy data, tree models (Random Forest, XGBoost) are used.",
        ],
      },
      {
        type: "code",
        code: `model = make_pipeline(
    PolynomialFeatures(2, include_bias=False),
    StandardScaler(),
    LogisticRegression(max_iter=1000),
)
cross_val_score(model, X, y, cv=5, scoring="roc_auc").mean()`,
      },
    ],
  },
  {
    id: "what-is-a-hyperparameter",
    name: "What is a Hyperparameter",
    blocks: [
      {
        type: "text",
        text: "A hyperparameter is a setting we choose BEFORE training starts. The model does not learn it. Weights (w0, w1, w2) are learned from data. Hyperparameters are chosen by us.",
      },
      {
        type: "points",
        title: "Real life (needed to understand)",
        intro: "An oven.",
        points: [
          "You set the temperature and the time before baking. The oven does not learn them.",
          "If the settings are wrong, the cake is bad, even if the recipe is good.",
          "Same with a model. Wrong settings give a bad model, even with good data.",
        ],
      },
      {
        type: "text",
        title: "Why",
        text: "The same model with different settings can overfit, underfit, or fail to finish. Good settings give a good model.",
      },
    ],
  },
  {
    id: "c-parameter",
    name: "C: How Strongly We Punish Big Weights",
    blocks: [
      {
        type: "points",
        points: [
          "Same idea as Ridge (Group 3). Big weights mean the model is overreacting.",
          "C works like the opposite of alpha. C is about 1 divided by alpha.",
        ],
      },
      {
        type: "compare",
        items: [
          {
            title: "SMALL C",
            text: "STRONG punishment. Weights stay small. The model is simple. Risk: underfitting.",
          },
          {
            title: "BIG C",
            text: "WEAK punishment. Weights can grow big. The model is flexible. Risk: overfitting.",
          },
        ],
      },
      {
        type: "points",
        title: "How to use it",
        points: [
          "Default is 1.0. Try values like 0.001, 0.01, 0.1, 1, 10, 100.",
          "Model overfits (train score high, test score low)? Make C smaller.",
          "Model underfits (both scores low)? Make C bigger.",
          "C = infinity means no punishment at all.",
        ],
      },
    ],
  },
  {
    id: "l1-ratio",
    name: "l1_ratio: Which Kind of Punishment",
    blocks: [
      {
        type: "table",
        head: ["l1_ratio", "Punishment", "What it does"],
        rows: [
          ["0", "L2 (Ridge style)", "Makes weights small, never zero. This is the default."],
          ["1", "L1 (Lasso style)", "Can make weights exactly zero, so it removes useless columns."],
          ["Between 0 and 1", "ElasticNet", "Mix of both."],
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Use L1 when you have many columns and most are useless.",
          "L1 and ElasticNet need the `saga` solver.",
        ],
      },
    ],
  },
  {
    id: "solver-and-max-iter",
    name: "solver and max_iter",
    blocks: [
      {
        type: "text",
        title: "solver = the method used to find the weights",
        text: "Think of it as different ways to walk down the hill (Gradient Descent idea). All reach the bottom, in different ways.",
      },
      {
        type: "terms",
        items: [
          { term: "lbfgs", desc: "good default for most data." },
          { term: "liblinear", desc: "good for small data." },
          { term: "saga", desc: "good for big data, and needed for L1 and ElasticNet." },
        ],
      },
      {
        type: "text",
        text: "Scale the columns first. Some solvers (sag, saga) work well only when columns have a similar scale.",
      },
      {
        type: "points",
        title: "max_iter = the most steps the solver may take",
        points: [
          "Default is 100. Sometimes 100 steps are not enough to reach the bottom.",
          "You will then see a ConvergenceWarning. It means \"I ran out of steps before I settled\".",
          "Fix: scale the columns first, then raise max_iter (like 1000).",
          "A warning is not an error, but the weights may not be the best. Do not ignore it.",
        ],
      },
    ],
  },
  {
    id: "class-weight-threshold",
    name: "class_weight and Threshold",
    blocks: [
      {
        type: "points",
        title: "class_weight = give the rare class more importance",
        points: [
          "Problem: only about 27 of 100 customers leave. The model can get lazy and say \"stay\" too often.",
          "`class_weight=\"balanced\"` makes a mistake on a leaver count more than a mistake on a stayer.",
          "How it works: weight = total rows / (2 x rows of that class).",
        ],
      },
      {
        type: "table",
        head: ["Class", "Weight", "Effect"],
        rows: [
          ["Leavers", "100 / (2 x 27) = 1.85", "mistake counts almost double"],
          ["Stayers", "100 / (2 x 73) = 0.68", "mistake counts less"],
        ],
      },
      {
        type: "points",
        points: [
          "Result: recall goes UP, precision goes DOWN. It acts like lowering the threshold.",
          "It changes F1 and recall a lot. It barely changes AUC, because AUC is about sorting, not about the cut-off.",
        ],
      },
      {
        type: "points",
        title: "Threshold = the cut-off for saying \"positive\"",
        points: [
          "Not a sklearn setting, but we choose it (Topic 2). Default is 0.5.",
          "Lower threshold = more caught (recall up), more false alarms (precision down).",
          "Choose it using the business cost of each mistake.",
        ],
      },
    ],
  },
  {
    id: "search-the-settings",
    name: "Search the Settings",
    blocks: [
      {
        type: "points",
        title: "Important points",
        points: [
          "Start with the defaults and get a baseline score first.",
          "Search settings with cross-validation. `GridSearchCV` tries every combination. `RandomizedSearchCV` tries random ones and is faster.",
          "Search C on a log scale (0.001, 0.01, 0.1, 1, 10, 100), not 1, 2, 3, 4.",
          "Put the scaler inside the pipeline. Then each fold scales using only its own training part. No data leakage.",
          "Choose the score that matches the business goal.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.model_selection import GridSearchCV

pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
params = {"logisticregression__C": [0.001, 0.01, 0.1, 1, 10, 100]}

search = GridSearchCV(pipe, params, cv=5, scoring="roc_auc")
search.fit(X_train, y_train)
search.best_params_, search.best_score_`,
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

function AdvancedLogisticRegression_12() {
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
                Advanced Logistic Regression
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

export default AdvancedLogisticRegression_12;