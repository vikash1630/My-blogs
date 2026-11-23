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
    id: "perceptron-trick",
    name: "Perceptron Trick",
    blocks: [
      {
        type: "text",
        text: "The Perceptron Trick finds a straight line that separates two classes (like Churn / Stay). Points on one side of the line are predicted 1, points on the other side are predicted 0.",
      },
      {
        type: "text",
        title: "Why",
        text: "Until now we predicted numbers. Now we need to predict a class. This is the first step toward Logistic Regression and neural networks (a perceptron is a single neuron).",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Line", f: "w0 + w1·x1 + w2·x2 = 0" },
          { l: "Predict", f: "ŷ = 1 if (w0 + w1·x1 + w2·x2) > 0, else ŷ = 0" },
          { l: "Update rule", f: "w = w + lr · (y − ŷ) · x" },
        ],
      },
      {
        type: "table",
        title: "How the update works (pick one random point)",
        head: ["Case", "y − ŷ", "Update", "What happens"],
        rows: [
          ["Correct prediction", "0", "no change", "line stays"],
          ["y = 1, ŷ = 0", "+1", "w = w + lr·x", "line moves toward the point"],
          ["y = 0, ŷ = 1", "−1", "w = w − lr·x", "line moves away from the point"],
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Start with any line, then fix it only when a point is wrong.",
          "x needs an extra column of 1s, so that the intercept w0 is also learned.",
          "`lr` (learning rate) = step size, same as in Gradient Descent.",
          "Scale the columns first (Standardization).",
          "It only works with straight line boundaries.",
          "If the data can be separated by a straight line, it will find a line. If not, the line keeps jumping around and never settles.",
        ],
      },
      {
        type: "points",
        title: "Weak points (why we need Logistic Regression)",
        points: [
          "It gives only 0 or 1, no probability. We cannot tell \"very sure\" from \"barely sure\".",
          "It stops when the points are separated. It does not look for the BEST line, any line is accepted.",
          "It does not settle when the data is not perfectly separable (like churn data).",
        ],
      },
      {
        type: "code",
        code: `w = w + lr * (y[i] - y_hat) * X[i]      # the whole trick: move the line only if wrong

# sklearn version
from sklearn.linear_model import Perceptron
clf = Perceptron(eta0=0.01, max_iter=1000)
clf.fit(X_train, y_train)
clf.score(X_test, y_test)`,
      },
    ],
  },
  {
    id: "sigmoid-function",
    name: "Sigmoid Function",
    blocks: [
      {
        type: "text",
        text: "Sigmoid is a squeezer. It takes any number (big or small) and squeezes it into a number between 0 and 1. This number is a chance (probability).",
      },
      {
        type: "text",
        title: "Why",
        text: "The line gives a score. The score can be any number like -40, 2.7 or 900. But a chance must be between 0 and 1. Sigmoid fixes this. Also, the Perceptron says only 0 or 1. Sigmoid gives a chance, so we know how sure the model is.",
      },
      {
        type: "points",
        title: "Real life (needed to understand)",
        points: [
          "A phone company has 1000 customers. Some will leave. It can call only 50 customers with a discount offer.",
          "Perceptron says only \"leave\" or \"stay\". 300 customers look the same. Who to call? We don't know.",
          "Logistic Regression gives a chance: Ravi 0.95, Sita 0.82, Arjun 0.55, Meena 0.10, Kiran 0.02.",
          "Sort by chance, call the top 50. Ravi and Sita first. Kiran needs no call.",
          "Same as the weather app: \"80% chance of rain\" is more useful than only \"rain\".",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Score from the line (can be any number)", f: "z = w0 + w1·x1 + w2·x2" },
          { l: "Squeeze z into 0 to 1", f: "σ(z) = 1 / (1 + e⁻ᶻ)" },
          { l: "Chance of class 1", f: "p = σ(z)" },
          { l: "Threshold", f: "p ≥ 0.5 → predict 1, else predict 0" },
        ],
      },
      {
        type: "table",
        title: "How sigmoid behaves",
        head: ["z", "σ(z)", "Meaning"],
        rows: [
          ["−10 (very small)", "0.00005", "close to 0"],
          ["−2", "0.12", ""],
          ["0", "0.5", "exactly the middle"],
          ["2", "0.88", ""],
          ["10 (very big)", "0.99995", "close to 1"],
        ],
        note: "The picture is an \"S\" shape. It never goes below 0 or above 1.",
      },
      {
        type: "points",
        title: "3 steps of Logistic Regression",
        points: [
          "Step 1: Take the data and make a score z.",
          "Step 2: Squeeze z with sigmoid to get a chance p.",
          "Step 3: If p >= 0.5 say 1, else say 0.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Name is \"Logistic Regression\", but it is used for CLASSIFICATION. It predicts a chance, then we turn the chance into a class.",
          "Threshold 0.5 can be changed (we will see why in Group 5).",
          "Chance is more useful than plain Yes/No, because we can sort customers from most risky to least risky.",
          "Scale the columns first (`StandardScaler`).",
          "`predict_proba` gives chances. `predict` gives classes.",
        ],
      },
      {
        type: "callout",
        title: "One line to remember",
        text: "Sigmoid turns any number into a chance between 0 and 1.",
      },
      {
        type: "code",
        code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
model.fit(X_train, y_train)                     # learns from train only

model.predict_proba(X_test)[:, 1]               # chance of class 1 (leaving)
model.predict(X_test)                           # class: 0 or 1 (chance >= 0.5)`,
      },
    ],
  },
  {
    id: "loss-function",
    name: "Loss Function (Binary Cross Entropy)",
    blocks: [
      {
        type: "text",
        text: "A loss is a \"bad marks\" score. It tells how wrong the model is. Big loss = very wrong. Small loss = almost right. The model learns by making the loss smaller.",
      },
      {
        type: "text",
        title: "Why",
        text: "In Linear Regression we used MSE. In Logistic Regression the answer is a chance between 0 and 1. So we use a better loss: Binary Cross Entropy (also called Log Loss).",
      },
      {
        type: "points",
        title: "Real life (needed to understand)",
        intro: "Think \"how surprised is the model?\"",
        points: [
          "Ravi: model said 0.95 chance of leaving. He really left. Model is NOT surprised. Small loss.",
          "Kiran: model said 0.02 chance of leaving. He really left. Model is VERY surprised. Big loss.",
          "A model that is sure and wrong is punished the most.",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "One row", f: "loss = −[ y·log(p) + (1 − y)·log(1 − p) ]" },
          { l: "If y = 1 (left)", f: "loss = −log(p)" },
          { l: "If y = 0 (stayed)", f: "loss = −log(1 − p)" },
          { l: "All rows", f: "BCE = −(1/n) · Σ [ y·log(p) + (1 − y)·log(1 − p) ]" },
        ],
        points: [
          "y = real answer (0 or 1), p = chance given by the model (from sigmoid).",
          "When y = 1 the second part becomes 0. When y = 0 the first part becomes 0. So only the right part is used each time.",
        ],
      },
      {
        type: "table",
        title: "How it punishes (real answer y = 1)",
        head: ["p", "Loss", "Meaning"],
        rows: [
          ["0.99", "0.01", "sure and right, tiny loss"],
          ["0.50", "0.69", "not sure, medium loss"],
          ["0.10", "2.30", "mostly wrong, big loss"],
          ["0.01", "4.61", "sure and wrong, huge loss"],
        ],
      },
      {
        type: "points",
        title: "Maximum Likelihood (where the formula comes from)",
        points: [
          "Likelihood of one row = p if he left, (1 - p) if he stayed.",
          "Likelihood of all rows = multiply all of them. Bigger = better weights.",
          "Multiplying many small numbers gives a number too tiny for the computer. So we take log (multiply becomes add).",
          "We want to minimize a loss but we wanted to maximize likelihood. So add a minus sign.",
          "BCE = negative log likelihood. Maximum Likelihood and BCE are the same idea.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Lower loss = better model. Loss 0 = perfect.",
          "A lazy model that says 0.5 for everyone has loss about 0.693. A good model must be lower than this.",
          "Why not MSE: with sigmoid, MSE makes a bumpy curve and gradient descent can get stuck. BCE makes a smooth bowl, so gradient descent finds the bottom.",
          "BCE punishes \"sure and wrong\" much harder than MSE.",
          "p can never be exactly 0 or 1 (log of 0 is a problem). sklearn handles this for us.",
          "Calculate the loss on TEST data to check the model.",
        ],
      },
      {
        type: "code",
        code: `import numpy as np
from sklearn.metrics import log_loss

def bce(y, p):
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))

p = model.predict_proba(X_test)[:, 1]           # chance of class 1
log_loss(y_test, p)                             # BCE on test data (same as bce(y_test, p))`,
      },
    ],
  },
  {
    id: "derivative-of-sigmoid",
    name: "Derivative of Sigmoid",
    blocks: [
      {
        type: "text",
        text: "The derivative is the slope. It tells how fast the sigmoid is changing. The slope of sigmoid is: σ'(z) = σ(z) · (1 − σ(z)) = p · (1 − p)",
      },
      {
        type: "text",
        title: "Why",
        text: "Gradient Descent needs the slope to know which way to step and how big the step is. We already have p from the sigmoid, so we just reuse it.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { f: "σ(z) = 1 / (1 + e⁻ᶻ)" },
          { f: "σ'(z) = σ(z) · (1 − σ(z))" },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Biggest slope is at z = 0 (p = 0.5). The biggest value is 0.25.",
          "At the two ends (z very small or very big), the slope is almost 0.",
          "Slope is never negative.",
          "Model unsure (p near 0.5) = big slope, learns fast. Model very sure (p near 0 or 1) = tiny slope, learns very little.",
          "In deep networks, this tiny slope gets multiplied many times and learning stops. This is the vanishing gradient problem.",
        ],
      },
      {
        type: "code",
        code: `p = sigmoid(z)
slope = p * (1 - p)`,
      },
    ],
  },
  {
    id: "gradient-descent-logistic",
    name: "Gradient Descent for Logistic Regression",
    blocks: [
      {
        type: "text",
        text: "The model learns its weights step by step. It makes a chance with sigmoid, checks the mistake with the loss (BCE), and then changes the weights a little to make the loss smaller. This is repeated many times.",
      },
      {
        type: "text",
        title: "Why",
        text: "There is no direct formula for the best weights in Logistic Regression. So we walk down the hill with Gradient Descent (same as Group 2). Only the loss is new.",
      },
      {
        type: "terms",
        title: "The 3 parts joined",
        items: [
          { term: "Sigmoid", desc: "turns a score into a chance p." },
          { term: "Loss (BCE)", desc: "tells how wrong the chances are." },
          { term: "Gradient Descent", desc: "changes the weights to make the loss smaller." },
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Score for every customer", f: "z = X · w" },
          { l: "Chance for every customer", f: "p = σ(z) = 1 / (1 + e⁻ᶻ)" },
          { l: "Slope for each weight", f: "slope = (1/n) · Σ (p − y) · x" },
          { l: "Matrix form", f: "gradient = Xᵀ · (p − y) / n" },
          { l: "Update", f: "w = w − lr · gradient" },
        ],
      },
      {
        type: "points",
        title: "How to read (p − y)",
        intro: "(p − y) = the mistake of one customer.",
        points: [
          "Customer LEFT (y = 1) but model said p = 0.2: p − y = −0.8 (negative), so the update ADDS to w. The chance goes up next time.",
          "Customer STAYED (y = 0) but model said p = 0.9: p − y = +0.9 (positive), so the update SUBTRACTS from w. The chance goes down next time.",
        ],
      },
      {
        type: "points",
        title: "Why the slope is so simple",
        points: [
          {
            text: "The slope has 3 small steps chained together.",
            sub: [
              "slope of loss w.r.t. p = (p − y) / (p · (1 − p))",
              "slope of sigmoid = p · (1 − p)",
              "slope of z w.r.t. w = x",
            ],
          },
          "The p · (1 − p) part cancels out. What is left is (p − y) · x.",
          "This is why BCE and sigmoid work so well together. Even when p is near 0 or 1, a wrong answer still gives a big (p − y), so the model learns fast from big mistakes.",
        ],
      },
      {
        type: "compare",
        title: "Same as Linear Regression",
        items: [
          {
            title: "Linear",
            text: "prediction = w·x, mistake = (ŷ − y), slope = (1/n) · Σ (ŷ − y) · x",
          },
          {
            title: "Logistic",
            text: "prediction = sigmoid(w·x), mistake = (p − y), slope = (1/n) · Σ (p − y) · x",
          },
        ],
      },
      {
        type: "text",
        text: "Only the prediction part changes. The update has the same shape.",
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Scale the columns first (Standardization).",
          "Add a column of 1s to X, so the intercept w0 is also learned.",
          "Start with all weights = 0.",
          "`lr` (learning rate): too small = very slow, too big = loss jumps around.",
          "Loss should go DOWN every time it is printed. If it goes up, lr is too big.",
          "Stop when the loss stops going down (flat).",
          "Batch, SGD and Mini-Batch (Group 2) all work here too. Only the rows used per step change.",
          "sklearn `LogisticRegression` does the same job. Use `penalty=None` to compare with our from-scratch weights.",
        ],
      },
      {
        type: "code",
        code: `w = np.zeros(X.shape[1])                       # start: all weights 0
lr = 0.1
n = len(y)

for epoch in range(1000):
    p = sigmoid(X @ w)                         # score, then chance for every customer

    grad = X.T @ (p - y) / n
    # grad[0] = slope for w0 (intercept)       -> average of (p - y)
    # grad[1] = slope for w1 (tenure)          -> average of (p - y) * tenure
    # grad[2] = slope for w2 (MonthlyCharges)  -> average of (p - y) * MonthlyCharges

    w = w - lr * grad                          # step downhill

# sklearn check
from sklearn.linear_model import LogisticRegression
clf = LogisticRegression(penalty=None).fit(X[:, 1:], y)
clf.intercept_, clf.coef_                      # should be almost same as our w`,
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

function LogisticRegressionCore_10() {
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
                Logistic Regression Fundamentals
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

export default LogisticRegressionCore_10;