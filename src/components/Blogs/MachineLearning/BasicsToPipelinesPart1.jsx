import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from "../../UI/Footer";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const GROUPS = [
  {
    id: "basics",
    title: "ML Basics",
    intro: "How models learn, the steps of an ML project, and the data structure underneath it all.",
    accent: "indigo",
    concepts: [
      {
        id: 1,
        name: "Instance vs Model Based Learning",
        definition:
          "Two ways a model can use training data. Instance based keeps the training data and compares new points to it. Model based learns an equation from the training data and then uses only the equation.",
        table: {
          head: ["", "Instance Based", "Model Based"],
          rows: [
            ["How it predicts", "Checks similarity with its nearest neighbours", "Puts the new point into the learned equation"],
            ["Training data", "Must be kept", "Can be thrown away"],
            ["Example", "KNN", "Linear Regression"],
          ],
        },
        keypoint: "Instance based remembers the data. Model based remembers only the equation.",
      },
      {
        id: 2,
        name: "Machine Learning Life Cycle",
        definition: "The 10 steps followed to take an ML project from an idea to a deployed model.",
        steps: [
          { title: "Frame the problem", text: "Understand the problem clearly before building anything, so you do not have to change the process midway." },
          { title: "Data gathering", text: "Collect data from CSV files, web scraping, online datasets, etc." },
          { title: "Data preprocessing", text: "Clean the data: remove duplicates, fix null values and noisy data." },
          { title: "Exploratory Data Analysis", text: "Understand each column using univariate, bivariate and multivariate analysis. Spend the most time here." },
          { title: "Feature engineering", text: "Create new columns or modify existing ones to suit the model." },
          { title: "Model building", text: "Build the model to predict or classify. Several models can be combined into a stronger one." },
          { title: "Model evaluation", text: "Check performance and efficiency using different metrics." },
          { title: "Testing", text: "Test the evaluated model in a production environment." },
          { title: "Optimize", text: "Improve the model using test results and feedback." },
          { title: "Deployment", text: "Release the model to all customers." },
        ],
        keypoint: "Most of the time goes into EDA and cleaning. A clear problem statement saves the most rework.",
      },
      {
        id: 3,
        name: "Tensors",
        definition: "A tensor is a structured collection of numbers arranged along one or more axes. It extends scalars, vectors and matrices to any number of dimensions.",
        table: {
          head: ["Type", "Dimension", "Example"],
          rows: [
            ["Scalar", "0D", "`5`"],
            ["Vector", "1D", "`[1, 2, 3]`"],
            ["Matrix", "2D", "`[[1, 2], [3, 4]]`"],
            ["Tensor", "3D+", "Multiple matrices stacked together"],
          ],
        },
        points: [
          "Rank (dimension) = number of axes. A 3D tensor has rank 3.",
          "Shape = size along each axis. `[1, 2, 3]` has shape `(3)`, and a tensor of shape `(2, 3, 4)` is 3D.",
        ],
        keypoint: "Tensor is just the general word. Scalar, vector and matrix are special cases of it.",
      },
    ],
  },
  {
    id: "scaling",
    title: "Feature Engineering & Scaling",
    intro: "Turning raw data into features a model can learn from, and putting columns on the same scale.",
    accent: "emerald",
    concepts: [
      {
        id: 4,
        name: "Feature Engineering",
        definition: "The process of transforming raw data into useful features that help a machine learning model learn better.",
        cards: [
          {
            title: "Feature Transformation",
            text: "Change the form or scale of existing features: imputation (missing values), encoding categorical values, outlier handling, feature scaling.",
          },
          { title: "Feature Construction", text: "Create new features from existing ones to give the model more useful information." },
          { title: "Feature Selection", text: "Keep the most useful features and remove irrelevant or unnecessary ones." },
          { title: "Feature Extraction", text: "Create new useful features from raw or complex data while reducing unnecessary information." },
        ],
        keypoint: "Transformation changes features, construction adds them, selection removes them, extraction compresses them.",
      },
      {
        id: 5,
        name: "Standardization",
        definition:
          "Also called Z-score scaling. A feature scaling technique that puts every column on the same scale by making its mean 0 and standard deviation 1.",
        why: "Age (18 to 60) and salary (20,000 to 2,000,000) have very different ranges, so models treat the bigger numbers as more important. Standardization gives every column equal footing.",
        formula: "z = (x - mean) / std",
        points: [
          "`z = 1.5` means the value is 1.5 standard deviations above the mean, whatever the original units were.",
          "It does not change the shape of the distribution. Skewed data stays skewed. Use log or power transforms to make data normal.",
          "Outliers still affect it, because mean and std are sensitive to outliers.",
        ],
        code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)   # learns mean/std from train only
X_test_scaled = scaler.transform(X_test)         # reuses train's mean/std`,
        keypoint: "Fit on train data only. Fitting on test data is data leakage.",
      },
      {
        id: 6,
        name: "Normalization",
        definition: "Also called Min-Max scaling. A feature scaling technique that squeezes every column into a fixed range, usually 0 to 1.",
        formula: "x_scaled = (x - min) / (max - min)",
        points: [
          "Min becomes 0 and max becomes 1. A value of 0.5 is halfway between the min and max of that column.",
          "Outliers affect it even more than standardization. One salary of 10 crore pushes every other value close to 0.",
          "The output range is fixed (0 to 1). Standardization is not bounded.",
          "In this topic, normalization means Min-Max. Do not mix it up with `Normalizer`, which scales each row to unit length.",
        ],
        code: `from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train)   # learns min/max from train only
X_test_scaled = scaler.transform(X_test)         # reuses train's min/max`,
        keypoint: "Use it when you need a bounded range, like image pixels (0-255 to 0-1) or neural networks.",
        extra: {
          title: "Variants",
          items: [
            ["MinMaxScaler", "The standard one above."],
            ["MaxAbsScaler", "Divides by the max absolute value. Good for sparse data."],
            ["RobustScaler", "Uses median and IQR, so it handles outliers well."],
            ["Mean Normalization", "Rarely used."],
          ],
        },
      },
      {
        id: 7,
        name: "Standardization vs Normalization",
        definition: "Both put columns on a similar scale. They differ in the formula, the output range and when to use them.",
        table: {
          head: ["", "Standardization", "Normalization"],
          rows: [
            ["Uses", "Mean and std", "Min and max"],
            ["Output", "Not bounded (about -3 to 3)", "Fixed, 0 to 1"],
            ["Use when", "Data is roughly bell shaped, or for PCA and linear models", "A bounded range is needed, like pixels or neural networks"],
          ],
        },
        keypoint: "Not sure? Start with standardization. Outliers a problem? Use RobustScaler.",
      },
      {
        id: 8,
        name: "fit vs transform",
        definition: "The three methods used by every sklearn scaler, encoder and imputer.",
        cards: [
          { title: "fit", text: "LEARN. Learns values (mean, std, min, max) from the data." },
          { title: "transform", text: "USE. Applies what was learned to the data." },
          { title: "fit_transform", text: "Learn and use together. Used on train data only (roughly 80% of the data)." },
        ],
        points: [
          "Test data only gets `transform`, to check if it follows what the train data taught the model.",
          "Do it once. Running it again and again changes the mean and standard deviation.",
        ],
        keypoint: "fit on train, transform on both train and test. Anything else is data leakage.",
      },
    ],
  },
  {
    id: "encoding",
    title: "Categorical Encoding",
    intro: "Models need numbers, so text categories must be converted.",
    accent: "amber",
    concepts: [
      {
        id: 9,
        name: "Encoding (Overview)",
        definition: "Encoding converts categorical (text) columns into numbers, because ML models need numerical data.",
        formula: "Text / Categories  ->  Encoding  ->  Numbers  ->  ML Model",
        keypoint: "Same rule as scaling: fit on train only, transform on both train and test.",
      },
      {
        id: 10,
        name: "Ordinal Encoding",
        definition: "Used when categories have a meaningful order, for example Poor = 0, Average = 1, Good = 2.",
        points: [
          "The numbers represent the order.",
          "Pass the order explicitly instead of relying on the automatically learned order.",
          "Used on input features (X).",
        ],
        code: `from sklearn.preprocessing import OrdinalEncoder

encoder = OrdinalEncoder(categories=[["Poor", "Average", "Good"]])
X_train_enc = encoder.fit_transform(X_train)   # learns categories from train only
X_test_enc = encoder.transform(X_test)         # reuses train's categories`,
        keypoint: "Order matters? Ordinal Encoding.",
      },
      {
        id: 11,
        name: "Label Encoding",
        definition: "Converts categories into numbers, but the numbers are just labels (Red = 0, Blue = 1, Green = 2). They do not represent any order.",
        points: ["Commonly used on the target column (y)."],
        code: `from sklearn.preprocessing import LabelEncoder

encoder = LabelEncoder()
y_enc = encoder.fit_transform(y)`,
        keypoint: "Ordinal: the number means order. Label: the number means category.",
      },
      {
        id: 12,
        name: "One-Hot Encoding",
        definition: "Used when categories have no order (Red, Blue, Green). Creates one separate 0/1 column for each category.",
        table: {
          head: ["", "Red", "Blue", "Green"],
          rows: [
            ["Red", "1", "0", "0"],
            ["Blue", "0", "1", "0"],
            ["Green", "0", "0", "1"],
          ],
        },
        why: "Label Encoding (Red 0, Blue 1, Green 2) makes the model think 2 > 1 > 0, which is a fake order. One-Hot avoids this.",
        code: `from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(sparse_output=False)
X_train_enc = encoder.fit_transform(X_train)
X_test_enc = encoder.transform(X_test)`,
        keypoint: "No order means One-Hot Encoding.",
      },
      {
        id: 13,
        name: "Which Encoder to Use",
        definition: "A quick rule of thumb, plus the difference between encoding and scaling.",
        table: {
          head: ["Situation", "Use"],
          rows: [
            ["Ordered categories", "Ordinal Encoding"],
            ["No order", "One-Hot Encoding"],
            ["Target / output column", "Label Encoding"],
          ],
        },
        points: [
          "Encoding converts categories into numbers (Poor to 0, Good to 1).",
          "Scaling changes the range of numbers (100 to 0.0, 200 to 1.0).",
        ],
        keypoint: "Encoding changes the type of data. Scaling changes the range.",
      },
    ],
  },
  {
    id: "pipelines",
    title: "Column Transformer & Pipelines",
    intro: "Keeping preprocessing and the model in one clean, leak-free flow.",
    accent: "rose",
    concepts: [
      {
        id: 14,
        name: "Column Transformer",
        definition: "ColumnTransformer lets us apply different steps to different columns in one go.",
        why: "Real data has number columns and text columns, and each needs different cleaning. Doing it one by one and joining the results back is messy.",
        points: [
          "We give it a list of (name, transformer, columns).",
          "Columns we do not mention are removed by default. Use `remainder=\"passthrough\"` to keep them.",
          "The output is a NumPy array, so column names are lost. Use `get_feature_names_out()` to get them back.",
        ],
        code: `from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder

ct = ColumnTransformer(
    transformers=[
        ("impute_age", SimpleImputer(), ["age"]),
        ("encode_city", OneHotEncoder(sparse_output=False), ["city"]),
    ],
    remainder="passthrough"
)

X_train_t = ct.fit_transform(X_train)   # learns from train only
X_test_t = ct.transform(X_test)         # uses what train learned`,
        keypoint: "Different columns, different steps, one object.",
      },
      {
        id: 15,
        name: "ML Pipelines",
        definition: "A Pipeline chains multiple steps (preprocessing + model) into one object, so data flows through them in a fixed order.",
        why: "Calling fit_transform and transform for every step on train and test is messy and easy to get wrong. A Pipeline does it all in one go.",
        points: [
          "Steps run in order. The output of one step becomes the input of the next.",
          "All steps except the last must be transformers (imputer, scaler, encoder). The last step is usually the model.",
          "`fit()` runs fit_transform on every step, then fits the model (train data only).",
          "`predict()` only transforms on every step, then predicts (test data).",
          "We never call fit_transform or transform ourselves when using a pipeline.",
        ],
        extra: {
          title: "Syntax",
          code: `Pipeline([
    ("name1", step1),
    ("name2", step2),
    ("model", model),
])

# shortcut: names are given automatically
make_pipeline(step1, step2, model)`,
        },
        code: `from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

num_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="mean")),
    ("scale", StandardScaler()),
])

cat_pipe = Pipeline([
    ("impute", SimpleImputer(strategy="most_frequent")),
    ("encode", OneHotEncoder(handle_unknown="ignore")),
])

ct = ColumnTransformer(
    [
        ("num", num_pipe, ["Age", "Fare"]),
        ("cat", cat_pipe, ["Sex", "Embarked"]),
    ],
    remainder="passthrough"
)

final = Pipeline([
    ("preprocess", ct),
    ("model", LogisticRegression()),
])

final.fit(X_train, y_train)     # learns from train only
final.score(X_test, y_test)     # uses what train learned`,
        keypoint: "A pipeline removes data leakage mistakes by doing fit and transform in the right places.",
      },
      {
        id: 16,
        name: "Pipeline vs ColumnTransformer",
        definition: "They solve different problems and are used together.",
        table: {
          head: ["", "ColumnTransformer", "Pipeline"],
          rows: [
            ["Steps run", "Side by side", "One after another"],
            ["Purpose", "Different steps for different columns", "Output of one step feeds the next"],
          ],
        },
        keypoint: "ColumnTransformer goes inside the Pipeline.",
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
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-snug">{s.title}</p>
            <p className="mt-1 text-base leading-relaxed text-gray-600 dark:text-gray-400">{s.text}</p>
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

      <p className="text-lg sm:text-xl leading-relaxed text-gray-800 dark:text-gray-200 mb-6">
        <Inline text={concept.definition} />
      </p>

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
          <Label accent={accent}>{concept.formula.includes("->") ? "Flow" : "Formula"}</Label>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 px-4 sm:px-5 py-4 font-mono text-sm sm:text-lg text-gray-900 dark:text-gray-100 whitespace-nowrap">
            {concept.formula}
          </div>
        </div>
      )}

      {concept.steps && (
        <div className="mb-6">
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
          <Label accent={accent}>Important points</Label>
          <Points points={concept.points} accent={accent} />
        </div>
      )}

      {extra && extra.items && (
        <div className="mb-6">
          <Label accent={accent}>{extra.title}</Label>
          <DataTable head={["Name", "What it does"]} rows={extra.items} />
        </div>
      )}

      {extra && extra.code && (
        <div className="mb-6">
          <Label accent={accent}>{extra.title}</Label>
          <CodeBlock code={extra.code} />
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

const BasicsToPipelinesPart1 = () => {
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
                ML basics, feature engineering, encoding and pipelines, with short sklearn code.
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

export default BasicsToPipelinesPart1;