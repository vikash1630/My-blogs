import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from "../../UI/Footer";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const GROUPS = [
  {
    id: "overview",
    title: "Missing Data & Deletion",
    intro: "Why missing values are a problem, and the simplest fix: deleting rows.",
    accent: "indigo",
    concepts: [
      {
        id: 1,
        name: "Handling Missing Data (Overview)",
        problem:
          "Real data has missing values (NaN). Most ML models cannot train on them, so we must handle them first.",
        definition: "There are two options: remove the missing data, or fill (impute) the missing values.",
        cards: [
          { title: "Remove (CCA)", text: "Delete every row that has a missing value." },
          { title: "Univariate imputation", text: "Fill a column using only that column's own data (mean, median, mode...)." },
          { title: "Multivariate imputation", text: "Fill a column using the other columns too (KNN, iterative)." },
        ],
        keypoint: "Remove if little is missing and it is random. Otherwise impute.",
      },
      {
        id: 2,
        name: "Complete Case Analysis (CCA)",
        definition:
          "Also called list-wise deletion. It deletes every row that has a missing value in any column. Only the complete rows stay.",
        points: [
          "Data is Missing Completely At Random (no pattern, not related to other columns).",
          "The missing part is small, less than 5% of the data.",
        ],
        pointsLabel: "When to use",
        pros: [
          "Simple and fast.",
          "Does not change the distribution of the remaining data (if missing is random).",
        ],
        cons: [
          "We lose data. Too many rows gone means too much information lost.",
          "Biased result if data is not missing at random.",
          "Cannot handle missing values in new data in production.",
        ],
        extra: {
          title: "How to check it is safe",
          items: [
            ["Step 1", "Find the % of missing in each column."],
            ["Step 2", "Delete the rows, then compare the distribution before and after."],
            ["Result", "If both look similar, CCA is safe."],
          ],
          head: ["", ""],
        },
        code: `df.isnull().mean() * 100                                  # % missing per column

cols = [var for var in df.columns if 0 < df[var].isnull().mean() < 0.05]
new_df = df[cols].dropna()                                # the CCA step

df["Age"].plot.density()                                  # before
new_df["Age"].plot.density()                              # after

df["city"].value_counts(normalize=True)                   # categorical: compare proportions
new_df["city"].value_counts(normalize=True)`,
        keypoint: "CCA = dropna(). The checks decide if it is safe.",
      },
    ],
  },
  {
    id: "univariate",
    title: "Univariate Imputation",
    intro: "Filling a missing value using only the data of that same column.",
    accent: "emerald",
    concepts: [
      {
        id: 3,
        name: "Handling Missing Numerical Data (Simple Imputer)",
        problem:
          "Deleting rows (CCA) loses data or causes bias when too much is missing or it is not missing at random. So we fill the missing values instead.",
        definition: "Univariate imputation fills the missing values of a column using only that column's own data.",
        table: {
          head: ["Technique", "Fill with", "Use when"],
          rows: [
            ["Mean / Median", "Mean (normal data) or median (skewed data or outliers)", "Missing completely at random and less than 5% missing"],
            ["Arbitrary Value", "A fixed value like `0`, `-1`, `999` that stands out from real data", "Not missing at random. The model can learn \"this value means missing\""],
            ["End of Distribution", "A value at the far end of the data", "Not missing at random. Same as arbitrary, but the value is picked automatically"],
          ],
        },
        points: [
          "End of distribution for normal data: `mean + 3 * std`.",
          "End of distribution for skewed data: `Q3 + 1.5 * IQR`.",
          "Mean/median changes the shape and variance (values pile up at the mean/median) and reduces correlation with other columns.",
          "All three learn a value from data, so fit only on train data and transform on both train and test. Otherwise it is data leakage.",
          "`SimpleImputer` handles mean, median and constant. End of distribution is done by hand.",
        ],
        code: `from sklearn.impute import SimpleImputer

imp = SimpleImputer(strategy="median")                       # "mean" or "median"
X_train_t = imp.fit_transform(X_train[["Age"]])
X_test_t = imp.transform(X_test[["Age"]])

imp = SimpleImputer(strategy="constant", fill_value=-1)      # arbitrary value

extreme = X_train["Age"].mean() + 3 * X_train["Age"].std()   # end of distribution
X_train["Age_end"] = X_train["Age"].fillna(extreme)
X_test["Age_end"] = X_test["Age"].fillna(extreme)`,
        keypoint: "Missing at random and small: mean or median. Missing has a meaning: arbitrary value or end of distribution.",
      },
      {
        id: 4,
        name: "Handling Missing Categorical Data",
        problem: "Mean and median only work on numbers. A text column (City, Embarked) needs a different way to fill the missing values.",
        definition: "Categorical imputation fills the missing values of a text column using that column's own data.",
        table: {
          head: ["Method", "Example", "Use when"],
          rows: [
            ["Most Frequent (Mode)", "S, S, C, NaN, S: NaN becomes `S`", "Missing at random and less than 5% missing"],
            ["Missing Category", "S, S, C, NaN, S: NaN becomes `Missing`", "A lot is missing, or missing values may carry meaning"],
          ],
        },
        cards: [
          {
            title: "Mode",
            text: "Simple and fast. But if many values are missing, the most frequent category becomes too big (distorts data, adds bias).",
          },
          {
            title: "Missing Category",
            text: "No assumption, and the model can learn \"missing\" as a pattern. But if very few values are missing, it creates a tiny useless category.",
          },
        ],
        points: [
          "Mode learns a value from data, so fit only on train data and transform on both train and test. Otherwise it is data leakage.",
          "After imputing, the column is still text, so encode it next.",
        ],
        code: `from sklearn.impute import SimpleImputer

imp = SimpleImputer(strategy="most_frequent")                         # mode
X_train_t = imp.fit_transform(X_train[["Embarked"]])
X_test_t = imp.transform(X_test[["Embarked"]])

imp = SimpleImputer(strategy="constant", fill_value="Missing")        # missing category`,
        keypoint: "Small and random: mode. Many missing or has meaning: Missing category.",
      },
      {
        id: 5,
        name: "Random Sample Imputation",
        problem:
          "Mean/median imputation squeezes many values to one point, so the shape and variance of the column change.",
        definition:
          "Fill each missing value with a randomly picked value from the column's own observed (non-missing) values. Works for numerical and categorical columns.",
        formula: "Age 22, 25, 28, NaN, 30  ->  NaN becomes a random pick from 22, 25, 28, 30",
        why: "It keeps the distribution (mean, variance) close to the original.",
        points: ["Use it when data is missing completely at random."],
        pointsLabel: "When to use",
        cons: [
          "Randomness. The result changes each run unless `random_state` is fixed.",
          "Training data must stay available to pick values from, even in production.",
          "Does not keep the relationship with other columns.",
        ],
        code: `observed = X_train["Age"].dropna()                         # observed values, train only
n_train = X_train["Age"].isnull().sum()

X_train["Age_imputed"] = X_train["Age"]                    # copy, fill only the copy
X_train.loc[X_train["Age"].isnull(), "Age_imputed"] = observed.sample(n_train, random_state=0).values

# Same for test, but pick from train's observed values (no leakage).
# .values places the picked values by position, not by index.`,
        keypoint: "Random imputation keeps the shape of the data.",
      },
      {
        id: 6,
        name: "Missing Indicator",
        problem: "Once a value is filled, the model no longer knows it was missing.",
        definition: "Adds a new 1/0 column showing whether the value was missing (1) or not (0), next to the imputed column.",
        why: "It keeps the information \"this was missing\", which the model can learn from when missing values carry meaning.",
        points: [
          "Used together with an imputation (mean, median, mode or random), not alone.",
          "Adds extra columns.",
          "Fit only on train data and transform on both train and test. Otherwise it is data leakage.",
        ],
        code: `X_train["Age_missing"] = X_train["Age"].isnull().astype(int)     # by hand

from sklearn.impute import SimpleImputer
imp = SimpleImputer(strategy="median", add_indicator=True)       # imputed column + indicator column
X_train_t = imp.fit_transform(X_train[["Age"]])
X_test_t = imp.transform(X_test[["Age"]])`,
        keypoint: "Missing indicator keeps the \"was missing\" information.",
      },
    ],
  },
  {
    id: "multivariate",
    title: "Multivariate Imputation",
    intro: "Filling a missing value using the other columns, because columns are often related.",
    accent: "amber",
    concepts: [
      {
        id: 7,
        name: "KNN Imputer",
        problem:
          "Mean, median and mode fill a column using only its own values. But a missing value (like Age) may depend on other columns (Fare, Class). Univariate methods ignore that.",
        definition:
          "Multivariate imputation fills a missing value using the other columns too. KNN Imputer fills it with the average of the same feature from the k nearest rows in the training data.",
        steps: [
          { title: "Take a row with a missing value", text: "Pick the row that needs filling." },
          { title: "Find the k nearest rows", text: "Use the other columns to calculate the distance." },
          {
            title: "Fill with their average",
            text: "Row D (Fare 11, Pclass 3, Age NaN) is closest to A (Age 22) and B (Age 24), so Age = 23.",
          },
        ],
        table: {
          head: ["Parameter", "What it does"],
          rows: [
            ["`n_neighbors`", "Number of neighbours k (default 5)"],
            ["`weights`", "`uniform` (plain average) or `distance` (closer neighbours count more)"],
          ],
        },
        points: [
          "Distance used is nan-Euclidean: normal Euclidean distance using only the columns that are not missing in both rows.",
          "Scale the data first (fit scaler on train only). Otherwise big-range columns dominate the distance.",
          "Fit only on train data and transform on both train and test. Otherwise it is data leakage.",
          "Works on numbers only, so encode text columns first.",
          "Output is a NumPy array. Put the column names back with a DataFrame.",
          "Only the columns you pass are used, so choose columns related to the missing column.",
        ],
        pros: ["More accurate than mean/median, because it uses other columns."],
        cons: [
          "Slow on big data (distance for every row).",
          "Training data must be kept, even in production.",
          "Sensitive to outliers and column scales.",
        ],
        code: `from sklearn.preprocessing import StandardScaler
from sklearn.impute import KNNImputer

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

knn = KNNImputer(n_neighbors=3, weights="distance")
X_train_i = knn.fit_transform(X_train_s)
X_test_i = knn.transform(X_test_s)

X_train_final = pd.DataFrame(scaler.inverse_transform(X_train_i), columns=X_train.columns)   # back to original scale

# specific columns only
cols = ["Age", "Fare", "Pclass"]
X_train_t = knn.fit_transform(X_train[cols])`,
        keypoint: "KNN Imputer fills with the average of the nearest rows.",
      },
      {
        id: 8,
        name: "MICE (Iterative Imputer)",
        problem: "KNN Imputer needs distance calculation, which is slow. We want a method that learns the relationship between columns and uses it to fill missing values.",
        definition:
          "MICE (Multivariate Imputation by Chained Equations), also called Iterative Imputer, predicts each column that has missing values from the other columns using a regression model, again and again, until the filled values stop changing.",
        steps: [
          { title: "Initial fill", text: "Fill all missing values with the column mean." },
          { title: "Pick one column", text: "Put its missing values back to NaN." },
          {
            title: "Train a regression model",
            text: "On rows where that column is known (target = this column, inputs = other columns), then predict the NaN values.",
          },
          { title: "Repeat for every column", text: "Every column with missing values gets its turn. That is one iteration." },
          { title: "Compare", text: "Subtract the previous iteration's values from the new ones." },
          { title: "Repeat until it settles", text: "Stop when the difference is close to 0 or `max_iter` is reached." },
        ],
        pros: [
          "Usually more accurate than mean, median or KNN.",
          "Keeps the relationships between columns.",
        ],
        cons: ["Slower and more complex (trains many models).", "Heavy on big data."],
        points: [
          "Works best when the columns are related to each other.",
          "Fit only on train data and transform on both train and test. Otherwise it is data leakage.",
          "Works on numbers only, so encode text columns first.",
          "Output is a NumPy array. Put the column names back with a DataFrame.",
          "`max_iter` is the maximum rounds (stops earlier if values settle).",
          "`estimator` is the regression model used for each column (default `BayesianRidge`).",
        ],
        code: `from sklearn.experimental import enable_iterative_imputer      # must come first
from sklearn.impute import IterativeImputer

imp = IterativeImputer(max_iter=10, random_state=0)
X_train_t = imp.fit_transform(X_train)
X_test_t = imp.transform(X_test)`,
        keypoint: "MICE predicts each column from the others, and repeats until the values settle.",
      },
      {
        id: 9,
        name: "Which Imputation to Use",
        definition: "A quick rule of thumb for choosing a method.",
        table: {
          head: ["Situation", "Use"],
          rows: [
            ["Little missing (under 5%), completely random", "CCA, or mean / median / mode"],
            ["Missing has a meaning (numerical)", "Arbitrary value or end of distribution"],
            ["Missing has a meaning (categorical)", "Missing category"],
            ["Keep the shape of the data", "Random sample imputation"],
            ["Keep the \"was missing\" information", "Missing indicator, along with any imputation"],
            ["Columns are related, small or medium data", "KNN Imputer"],
            ["Columns are related, want best accuracy", "MICE (Iterative Imputer)"],
          ],
        },
        keypoint: "Fit every imputer on train data only, then transform both train and test.",
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
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(from|import|as|class|def|return|for|in|if|else|True|False|None)\b|\b(\d+(?:\.\d+)?)\b/gm;

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

// A real sequence, so numbered markers are justified here
function Steps({ steps, accent }) {
  const a = ACCENTS[accent];
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200 dark:bg-white/15"
              aria-hidden="true"
            />
          )}
          <span
            className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${a.badge}`}
          >
            {i + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">
              <Inline text={s.title} />
            </p>
            <p className="mt-1 text-base leading-relaxed text-gray-600 dark:text-gray-400">
              <Inline text={s.text} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Cards({ cards, accent }) {
  const a = ACCENTS[accent];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((c) => (
        <div key={c.title} className={`rounded-xl border px-4 py-4 ${a.soft}`}>
          <p className="font-bold text-gray-900 dark:text-white">{c.title}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
            <Inline text={c.text} />
          </p>
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

// Advantages / Disadvantages. Either side can be shown alone.
function ProsCons({ pros, cons }) {
  const both = pros && cons;
  return (
    <div className={`grid gap-3 ${both ? "sm:grid-cols-2" : ""}`}>
      {pros && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-400/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-4">
          <p className="mb-2 font-bold text-emerald-700 dark:text-emerald-300">Advantages</p>
          <ul className="space-y-2">
            {pros.map((p, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                <span className="mt-[0.6em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="min-w-0 break-words">
                  <Inline text={p} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-400/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-4">
          <p className="mb-2 font-bold text-rose-700 dark:text-rose-300">Disadvantages</p>
          <ul className="space-y-2">
            {cons.map((p, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                <span className="mt-[0.6em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" aria-hidden="true" />
                <span className="min-w-0 break-words">
                  <Inline text={p} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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
          <Label accent={accent}>Problem</Label>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <Inline text={concept.problem} />
          </p>
        </div>
      )}

      <p className="text-lg sm:text-xl leading-relaxed text-gray-800 dark:text-gray-200 mb-6">
        <Inline text={concept.definition} />
      </p>

      {concept.why && (
        <div className="mb-6">
          <Label accent={accent}>Why it helps</Label>
          <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <Inline text={concept.why} />
          </p>
        </div>
      )}

      {concept.formula && (
        <div className="mb-6">
          <Label accent={accent}>{concept.formula.includes("->") ? "Example" : "Formula"}</Label>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 px-4 sm:px-5 py-4 font-mono text-sm sm:text-lg text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {concept.formula}
          </div>
        </div>
      )}

      {concept.steps && (
        <div className="mb-6">
          <Label accent={accent}>Steps</Label>
          <Steps steps={concept.steps} accent={accent} />
        </div>
      )}

      {concept.cards && (
        <div className="mb-6">
          <Cards cards={concept.cards} accent={accent} />
        </div>
      )}

      {concept.table && (
        <div className="mb-6">
          <DataTable head={concept.table.head} rows={concept.table.rows} />
        </div>
      )}

      {concept.points && (
        <div className="mb-6">
          <Label accent={accent}>{concept.pointsLabel || "Important points"}</Label>
          <Points points={concept.points} accent={accent} />
        </div>
      )}

      {(concept.pros || concept.cons) && (
        <div className="mb-6">
          <ProsCons pros={concept.pros} cons={concept.cons} />
        </div>
      )}

      {extra && extra.items && (
        <div className="mb-6">
          <Label accent={accent}>{extra.title}</Label>
          <DataTable head={extra.head || ["Name", "What it does"]} rows={extra.items} />
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

const MissingValuesPart3 = () => {
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
                Machine Learning Notes
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
                Handling missing values: deletion, univariate and multivariate imputation, with short sklearn code.
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
};

export default MissingValuesPart3;