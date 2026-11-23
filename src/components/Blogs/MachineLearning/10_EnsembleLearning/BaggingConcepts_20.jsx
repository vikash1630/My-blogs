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
    id: "bagging-intro",
    name: "Bagging: Introduction",
    blocks: [
      {
        type: "text",
        text: "Bagging (Bootstrap Aggregating) trains multiple models on different bootstrap samples and combines their predictions.",
      },
      {
        type: "terms",
        title: "Two Main Steps",
        items: [
          { term: "1. Bootstrap", desc: "Creating different datasets using sampling with replacement." },
          { term: "2. Aggregating", desc: "Combining predictions from multiple models." },
        ],
      },
    ],
  },
  {
    id: "bootstrap-sampling",
    name: "Bootstrap Sampling",
    blocks: [
      {
        type: "text",
        text: "Randomly selects samples from the original dataset with replacement.",
      },
      {
        type: "points",
        title: "Important",
        points: [
          "Selected sample is put back before the next selection.",
          "Same sample can appear multiple times.",
          "Some samples may not be selected.",
          "Usually, bootstrap sample size = Original dataset size.",
        ],
      },
      {
        type: "table",
        title: "Example (Original = [A, B, C, D, E])",
        head: ["Bootstrap Sample"],
        rows: [["[A, B, B, D, E]"], ["[A, C, C, D, D]"], ["[B, B, C, E, E]"]],
      },
    ],
  },
  {
    id: "how-bagging-works",
    name: "How Bagging Works",
    blocks: [
      {
        type: "points",
        points: [
          "1. Take the original training dataset.",
          "2. Generate multiple bootstrap samples.",
          "3. Train a separate model on each sample.",
          "4. Models train independently and can run in parallel.",
          "5. Combine predictions to get the final output.",
        ],
      },
      {
        type: "image",
        src: "/ensemble-bagging.png",
        alt: "Bagging: the original data is bootstrapped into several samples, a decision tree is trained on each sample, and their predictions are combined into one prediction.",
        caption: "Each decision tree trains on its own bootstrapped sample. The predictions are then combined.",
      },
    ],
  },
  {
    id: "aggregation-and-why",
    name: "Prediction Aggregation and Why Bagging",
    blocks: [
      {
        type: "terms",
        title: "Prediction Aggregation",
        items: [
          { term: "Classification", desc: "Majority Voting. Most predicted class wins." },
          { term: "Regression", desc: "Averaging. Final prediction = Mean of model predictions." },
        ],
      },
      {
        type: "formula",
        title: "Example",
        lines: [
          { l: "Predictions = [100, 120, 110]", f: "Final = (100 + 120 + 110) / 3 = 110" },
        ],
      },
      {
        type: "points",
        title: "Why Bagging?",
        points: [
          "Primarily reduces Variance.",
          "Makes predictions more stable.",
          "Useful with unstable models like Decision Trees.",
          "Does not necessarily reduce Bias or guarantee better performance.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Bagging = Bootstrap Aggregating. Bootstrap = Sampling with replacement. Aggregating = Combining predictions. Classification = Majority Voting. Regression = Averaging. Main Goal = Reduce Variance.",
      },
    ],
  },
  {
    id: "bagging-classifier",
    name: "Bagging Classifier",
    blocks: [
      {
        type: "text",
        text: "Bagging Classifier trains multiple copies of a classification algorithm on different samples and combines predictions using Majority Voting.",
      },
      {
        type: "points",
        title: "Core Idea",
        points: [
          "Generate different training samples.",
          "Train one model on each sample.",
          "Combine predictions using Majority Voting.",
          "Final output = Most frequently predicted class.",
        ],
      },
      {
        type: "points",
        title: "Base Estimators",
        points: ["Decision Tree", "SVM", "KNN", "Other classification algorithms"],
      },
    ],
  },
  {
    id: "practical-implementation",
    name: "Practical Implementation",
    blocks: [
      {
        type: "code",
        title: "Dataset",
        code: `from sklearn.datasets import make_classification

X, y = make_classification(
    n_samples=10000,
    n_features=10,
    n_informative=3,
    random_state=42
)`,
      },
      {
        type: "code",
        title: "Single Decision Tree",
        code: `from sklearn.tree import DecisionTreeClassifier

dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)`,
      },
      {
        type: "text",
        text: "CampusX notebook accuracy = 87.55%.",
      },
      {
        type: "code",
        title: "Bagging with Decision Trees",
        code: `from sklearn.ensemble import BaggingClassifier

bag = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=500,
    max_samples=0.5,
    bootstrap=True,
    random_state=42,
    n_jobs=-1
)

bag.fit(X_train, y_train)
y_pred = bag.predict(X_test)`,
      },
      {
        type: "points",
        points: [
          "CampusX notebook accuracy = 91.65%.",
          "Combining multiple trees improved performance.",
        ],
      },
      {
        type: "points",
        title: "Important",
        points: [
          "Bagging is not restricted to Decision Trees.",
          "SVM, KNN and other classifiers can also be used.",
          "CampusX SVM Bagging example reported 90.1% accuracy.",
        ],
      },
    ],
  },
  {
    id: "sampling-techniques",
    name: "Sampling Techniques in Bagging",
    blocks: [
      {
        type: "terms",
        items: [
          {
            term: "1. Bagging",
            desc: "Selects rows with replacement. A row can appear multiple times. Some rows may be left out.",
          },
          {
            term: "2. Pasting",
            desc: "Selects rows without replacement. A row cannot repeat within the same sample.",
          },
          {
            term: "3. Random Subspaces",
            desc: "Selects random subsets of features (columns). Uses all training rows. Different models receive different feature subsets.",
          },
          {
            term: "4. Random Patches",
            desc: "Selects random subsets of both rows and features. Combines row sampling and feature sampling.",
          },
        ],
      },
      {
        type: "points",
        points: [
          "`bootstrap=True` = Bagging.",
          "`bootstrap=False` = Pasting.",
        ],
      },
      {
        type: "table",
        title: "Comparison",
        head: ["Technique", "Rows", "Features"],
        rows: [
          ["Bagging", "With replacement", "All"],
          ["Pasting", "Without replacement", "All"],
          ["Random Subspaces", "All rows", "Subsets"],
          ["Random Patches", "Row subsets", "Subsets"],
        ],
      },
      {
        type: "points",
        title: "Important",
        points: [
          "`bootstrap` controls row sampling with replacement.",
          "`bootstrap_features` controls feature sampling with replacement.",
        ],
      },
    ],
  },
  {
    id: "oob-score",
    name: "Out-of-Bag (OOB) Score",
    blocks: [
      {
        type: "text",
        text: "Samples not selected in a particular bootstrap sample are called Out-of-Bag samples.",
      },
      {
        type: "table",
        title: "Example",
        head: ["Original", "Bootstrap", "In-bag", "OOB"],
        rows: [["[A, B, C, D, E]", "[A, B, B, D, E]", "A, B, D, E", "C"]],
      },
      {
        type: "points",
        title: "How OOB Score Works",
        points: [
          "Each model leaves some training samples unused.",
          "Use those models to predict the samples they did not train on.",
          "Combine their predictions.",
          "Compare predictions with actual labels.",
          "Calculate accuracy = OOB Score.",
        ],
      },
      {
        type: "points",
        title: "Why useful?",
        points: [
          "Estimates model performance using training data.",
          "Does not require a separate validation set.",
          "Helps evaluate generalization.",
        ],
      },
      {
        type: "formula",
        title: "OOB Probability (Full-size Bootstrap Sample)",
        lines: [
          { l: "P(sample not selected)", f: "(1 − 1/N)ᴺ" },
          { l: "As N becomes large", f: "P(OOB) ≈ e⁻¹ ≈ 36.8%" },
        ],
        points: [
          "Approximately 36.8% of unique rows are left out from each full-size bootstrap sample.",
          "Approximately 63.2% are included.",
        ],
      },
      {
        type: "points",
        title: "Important",
        points: [
          "This 36.8% applies to full-size bootstrap samples.",
          "Smaller bootstrap samples leave out a larger proportion.",
          "OOB score is an estimate, not a replacement for final test accuracy.",
        ],
      },
      {
        type: "code",
        title: "OOB Python Implementation",
        code: `bag = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=500,
    max_samples=0.25,
    bootstrap=True,
    oob_score=True,
    random_state=42
)

bag.fit(X_train, y_train)

print(bag.oob_score_)`,
      },
      {
        type: "points",
        title: "Important",
        points: [
          "`bootstrap=True` is required.",
          "Use enough estimators for reliable OOB predictions.",
          "`oob_score_` gives the OOB evaluation score.",
        ],
      },
    ],
  },
  {
    id: "bagging-classifier-hyperparameters",
    name: "Bagging Classifier Hyperparameters",
    blocks: [
      {
        type: "terms",
        items: [
          { term: "estimator", desc: "Base algorithm used by each model." },
          { term: "n_estimators", desc: "Number of base models." },
          { term: "max_samples", desc: "Number or proportion of training rows selected per model." },
          { term: "max_features", desc: "Number or proportion of features selected per model." },
          { term: "bootstrap", desc: "True = Row sampling with replacement. False = Row sampling without replacement." },
          { term: "bootstrap_features", desc: "Controls feature sampling with replacement." },
          { term: "oob_score", desc: "Enables Out-of-Bag evaluation." },
          { term: "n_jobs", desc: "Controls parallel execution. -1 = Uses all available CPU cores." },
          { term: "random_state", desc: "Controls randomness for reproducible results." },
        ],
      },
    ],
  },
  {
    id: "hyperparameter-tuning",
    name: "Hyperparameter Tuning",
    blocks: [
      {
        type: "points",
        title: "GridSearchCV",
        points: [
          "Tests different hyperparameter combinations.",
          "Uses cross-validation to evaluate them.",
          "Finds the best parameter combination.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.model_selection import GridSearchCV

parameters = {
    'n_estimators': [50, 100, 500],
    'max_samples': [0.1, 0.4, 0.7, 1.0],
    'bootstrap': [True, False],
    'max_features': [0.1, 0.4, 0.7, 1.0]
}

search = GridSearchCV(
    BaggingClassifier(),
    parameters,
    cv=5
)

search.fit(X_train, y_train)

print(search.best_params_)
print(search.best_score_)`,
      },
      {
        type: "points",
        points: [
          "`cv=5` = 5-fold cross-validation.",
          "`best_params_` = Best hyperparameter combination.",
          "`best_score_` = Best average cross-validation score.",
        ],
      },
      {
        type: "points",
        title: "Important",
        points: [
          "GridSearchCV can be computationally expensive.",
          "RandomizedSearchCV is another tuning option.",
          "Choose max_samples and max_features based on validation results.",
        ],
      },
    ],
  },
  {
    id: "important-takeaways",
    name: "Important Takeaways",
    blocks: [
      {
        type: "points",
        points: [
          "Bagging Classifier = Multiple models + Majority Voting.",
          "Pasting = Row sampling without replacement.",
          "Random Subspaces = Feature sampling.",
          "Random Patches = Row + Feature sampling.",
          "OOB Score = Evaluation using unused bootstrap samples.",
          "GridSearchCV = Hyperparameter tuning.",
        ],
      },
      {
        type: "callout",
        title: "Main Goal of Bagging",
        text: "Reduce Variance and make predictions more stable.",
      },
    ],
  },
  {
    id: "bagging-regressor",
    name: "Bagging Regressor",
    blocks: [
      {
        type: "text",
        text: "Combines predictions from multiple regression models trained on different bootstrap samples.",
      },
      {
        type: "points",
        title: "Core Idea",
        points: [
          "Train multiple regressors independently.",
          "Each model predicts a numerical value.",
          "Average all predictions to get the final output.",
        ],
      },
      {
        type: "formula",
        title: "Prediction Aggregation",
        lines: [{ f: "y_pred = (Prediction₁ + Prediction₂ + ... + Predictionₙ) / n" }],
        points: [
          "Default aggregation = Arithmetic Mean.",
          "Each model contributes equally.",
        ],
      },
      {
        type: "points",
        title: "Base Estimators",
        points: [
          "Decision Tree Regressor (Default).",
          "Linear Regression.",
          "KNN Regressor.",
          "Other regression algorithms.",
        ],
      },
      {
        type: "terms",
        title: "Important Hyperparameters",
        items: [
          { term: "estimator", desc: "Base regression algorithm." },
          { term: "n_estimators", desc: "Number of models." },
          { term: "max_samples", desc: "Number or proportion of rows per model." },
          { term: "max_features", desc: "Number or proportion of features per model." },
          { term: "bootstrap", desc: "True = Sampling with replacement. False = Sampling without replacement." },
          { term: "bootstrap_features", desc: "Controls feature sampling with replacement." },
          { term: "oob_score", desc: "Enables Out-of-Bag evaluation." },
          { term: "n_jobs", desc: "-1 = Uses all available CPU cores." },
        ],
      },
    ],
  },
  {
    id: "bagging-regressor-code",
    name: "Bagging Regressor: Evaluation and Code",
    blocks: [
      {
        type: "terms",
        title: "Evaluation",
        items: [
          {
            term: "R² Score",
            desc: "Measures how well the model explains target variation. 1 = Perfect prediction. 0 = Same as predicting the target mean. Negative = Worse than predicting the target mean.",
          },
          {
            term: "OOB Score",
            desc: "Estimates performance using unused bootstrap samples. Available through `oob_score_`. For BaggingRegressor, default OOB score uses R².",
          },
        ],
      },
      {
        type: "code",
        title: "Python Implementation",
        code: `from sklearn.ensemble import BaggingRegressor
from sklearn.tree import DecisionTreeRegressor

model = BaggingRegressor(
    estimator=DecisionTreeRegressor(),
    n_estimators=100,
    max_samples=0.5,
    bootstrap=True,
    oob_score=True,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(model.oob_score_)`,
      },
      {
        type: "points",
        title: "Hyperparameter Tuning",
        points: [
          "`GridSearchCV` = Tests parameter combinations using cross-validation.",
          "`best_params_` = Best parameter combination.",
          "`best_score_` = Best cross-validation score.",
        ],
      },
      {
        type: "points",
        title: "Important",
        points: [
          "Keep test data separate during tuning.",
          "Higher training score alone does not guarantee generalization.",
        ],
      },
    ],
  },
  {
    id: "classifier-vs-regressor",
    name: "Bagging Classifier vs Regressor",
    blocks: [
      {
        type: "compare",
        items: [
          { title: "Bagging Classifier", text: "Predicts categories. Aggregation = Majority Voting." },
          { title: "Bagging Regressor", text: "Predicts numerical values. Aggregation = Averaging." },
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Bagging Regressor = Multiple regressors + Average. Main Goal = Reduce Variance. Default Estimator = DecisionTreeRegressor.",
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

function BaggingConcepts_20() {
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
                Ensemble Learning: Bagging, Bootstrap and OOB Score
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

export default BaggingConcepts_20;