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
    id: "probability-basics",
    name: "Probability Basics",
    blocks: [
      {
        type: "text",
        title: "Probability",
        text: "The chance that something happens. A number from 0 to 1.",
      },
      {
        type: "formula",
        lines: [{ f: "P(A) = ways A can happen / all possible ways" }],
      },
      { type: "code", title: "Code: Probability", code: `df["Churn"].mean()` },

      {
        type: "text",
        title: "Conditional Probability",
        text: "The chance of A, when we already know B happened. Read \"|\" as \"given that\".",
      },
      {
        type: "formula",
        lines: [{ f: "P(A | B) = P(A and B) / P(B)" }],
        points: [
          "Example: P(spam) = 0.10, but P(spam | word \"free\") = 0.75.",
          "P(A | B) is NOT the same as P(B | A).",
        ],
      },
      {
        type: "code",
        title: "Code: Conditional Probability",
        code: `df[df["Contract"] == "Month-to-month"]["Churn"].mean()`,
      },

      {
        type: "text",
        title: "Independent Events",
        text: "One event does not change the chance of the other.",
      },
      {
        type: "formula",
        lines: [{ f: "P(A and B) = P(A) × P(B), or P(A | B) = P(A)" }],
        points: [
          "Example: two coin tosses. Naive Bayes assumes the columns are independent (this is the \"naive\" part).",
        ],
      },
      {
        type: "code",
        title: "Code: Independent Events",
        code: `chi2_contingency(pd.crosstab(df["gender"], df["Churn"]))[1]     # big p-value = independent`,
      },

      {
        type: "text",
        title: "Mutually Exclusive Events",
        text: "Two events that cannot happen together.",
      },
      {
        type: "formula",
        lines: [
          { f: "P(A and B) = 0, so P(A or B) = P(A) + P(B)" },
          { l: "If they can overlap", f: "P(A or B) = P(A) + P(B) − P(A and B)" },
        ],
        points: [
          "Example: one die roll cannot show 2 and 5 together. A customer has only one contract type.",
        ],
      },
      {
        type: "code",
        title: "Code: Mutually Exclusive Events",
        code: `((df["Contract"] == "Month-to-month") & (df["Contract"] == "Two year")).mean()     # 0`,
      },

      {
        type: "points",
        title: "Mix-up to avoid",
        points: [
          "Mutually exclusive = cannot happen together. Independent = do not affect each other. They are almost opposite.",
          "If A happens and B becomes impossible, then A affects B. So they are not independent.",
        ],
      },
    ],
  },
  {
    id: "bayes-theorem",
    name: "Bayes Theorem",
    blocks: [
      {
        type: "text",
        text: "Bayes Theorem flips a probability. We often know P(B | A), but we want P(A | B). Bayes gives us the second one from the first one.",
      },
      {
        type: "text",
        title: "Why",
        text: "Easy to know: \"Of all spam mails, how many have the word free?\" (look in the spam folder). What we want: \"This new mail has the word free. How likely is it spam?\"",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "P(A | B) = P(B | A) × P(A) / P(B)" }],
        points: ["In one line: new belief = old belief × how strongly the clue points to it."],
      },
      {
        type: "terms",
        items: [
          { term: "Prior  P(A)", desc: "chance BEFORE we see the clue (how common is spam?)." },
          { term: "Likelihood  P(B | A)", desc: "how often the clue shows up if A is true (how often does spam have \"free\"?)." },
          { term: "Evidence  P(B)", desc: "how often the clue shows up in ALL mails." },
          { term: "Posterior  P(A | B)", desc: "chance AFTER we see the clue. This is the answer." },
        ],
      },
      {
        type: "formula",
        title: "How to get P(B) when we don't have it",
        lines: [{ f: "P(B) = P(B | A) × P(A) + P(B | not A) × P(not A)" }],
      },
      {
        type: "points",
        title: "Example 1 (spam)",
        points: [
          "1000 mails, 100 spam. 30 spam mails have \"free\". 10 real mails have \"free\" (out of 900).",
          "Prior = 0.10, Likelihood = 0.30, Evidence = 0.30×0.10 + 0.011×0.90 = 0.04",
          "Posterior = 0.30 × 0.10 / 0.04 = 0.75",
          "One word moved the chance of spam from 10% to 75%.",
        ],
      },
      {
        type: "points",
        title: "Example 2 (medical test, needed to understand the base rate)",
        points: [
          "1% of people are sick. Test finds 99% of sick people. Test gives a false alarm for 5% of healthy people.",
          "Imagine 10,000 people: 100 sick, 9,900 healthy.",
          "Positive among sick = 99. Positive among healthy = 495. Total positive = 594.",
          "Really sick among positives = 99 / 594 = 17%, NOT 99%.",
          "Why: the disease is rare, so there are many healthy people, and even a small false alarm rate gives more false positives than real ones.",
          "This mistake is called the base rate fallacy.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "P(A | B) is NOT the same as P(B | A). Never mix them.",
          "Always use the prior (base rate). Rare events give many false alarms.",
          "Explain with counts (\"out of 10,000 people...\") not formulas. Managers and doctors understand counts.",
          "The prior is just the share of each class in the training data.",
          "Today's posterior becomes tomorrow's prior when new clues come (Bayesian updating).",
          "In Naive Bayes, P(B) is the same for all classes, so we skip it and compare only the top part.",
        ],
      },
      {
        type: "code",
        title: "Code (own small dataset, 10 mails: 4 spam, 6 real)",
        code: `import pandas as pd

mails = pd.DataFrame({
    "has_free": [1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    "spam":     [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
})

prior      = mails["spam"].mean()                                # P(spam) = 0.4
likelihood = mails[mails["spam"] == 1]["has_free"].mean()        # P(free | spam) = 0.75
evidence   = mails["has_free"].mean()                            # P(free) = 0.4
posterior  = likelihood * prior / evidence                       # P(spam | free) = 0.75

mails[mails["has_free"] == 1]["spam"].mean()                     # count directly = 0.75 (same)

def bayes(prior, hit, false_alarm):
    return hit * prior / (hit * prior + false_alarm * (1 - prior))

bayes(0.01, 0.99, 0.05)                                          # 0.167, the medical test`,
      },
    ],
  },
  {
    id: "naive-bayes-intuition",
    name: "Naive Bayes Intuition and Maths",
    blocks: [
      {
        type: "text",
        text: "Naive Bayes is a classifier that uses Bayes Theorem with many clues (columns). It \"naively\" assumes every clue is independent of the others. It scores each class and picks the class with the biggest score.",
      },
      {
        type: "text",
        title: "Why",
        text: "A real mail has many clues (free, offer, win, money). Bayes needs P(free, offer, win, money | spam), meaning how many spam mails have ALL the words together. We almost never have enough data to count that. The naive trick fixes this: count each clue alone, then multiply.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Bayes", f: "P(spam | clues) = P(clues | spam) × P(spam) / P(clues)" },
          { l: "Naive trick", f: "P(free, offer | spam) = P(free | spam) × P(offer | spam)" },
          { l: "Score of a class", f: "P(class) × P(x1 | class) × P(x2 | class) × ..." },
        ],
        points: [
          "We skip P(clues), because it is the same for every class. Pick the class with the biggest score.",
          "To get chances, divide each score by the total of all scores.",
        ],
      },
      {
        type: "points",
        title: "Why \"naive\"",
        points: [
          "We pretend the clues are independent. In real life they are not (\"free\" and \"offer\" come together).",
          "The chance numbers are a bit off, but the winning class is usually still right. That is all we need.",
        ],
      },
      {
        type: "points",
        title: "Example (10 mails, 4 spam and 6 real, new mail has \"free\" and \"offer\")",
        points: [
          "Prior: P(spam) = 0.4, P(real) = 0.6",
          "Spam: P(free | spam) = 0.75, P(offer | spam) = 0.75",
          "Real: P(free | real) = 0.167, P(offer | real) = 0.167",
          "Spam score = 0.4 × 0.75 × 0.75 = 0.225",
          "Real score = 0.6 × 0.167 × 0.167 = 0.0167",
          "Spam wins. P(spam) = 0.225 / (0.225 + 0.0167) = 0.93",
        ],
      },
      {
        type: "points",
        title: "Two problems and their fixes",
        points: [
          {
            text: "Zero problem: a word never seen in spam gives P = 0. One zero kills the whole multiplication.",
            sub: [
              "Fix: Laplace smoothing. Add 1 to every count, so nothing is exactly zero.",
              "In sklearn it is `alpha`. alpha = 1 is the default.",
            ],
          },
          {
            text: "Tiny numbers problem: multiplying 1000 small numbers gives a number so tiny the computer rounds it to 0.",
            sub: ["Fix: use logs. Log turns multiply into add. sklearn does this inside."],
          },
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Very fast. Training is just counting.",
          "Needs very little data. Handles thousands of columns (like words).",
          "Types: `BernoulliNB` (0/1 columns), `MultinomialNB` (word counts), `GaussianNB` (numbers, Topic 5), `CategoricalNB` (category columns).",
          "Keep smoothing on. Choose alpha by cross-validation (0.01, 0.1, 1).",
          "Chances are often too close to 0 or 1. Use it to rank and classify. Calibrate if you need reliable chances.",
          "If the same information is added twice (two similar columns), it is counted twice and the model gets over-confident. Remove duplicates.",
          "Good fast baseline for text. If a stronger model does not beat it by much, keep the simple one.",
          "`partial_fit` lets it learn from new data without starting again.",
        ],
      },
      {
        type: "code",
        title: "Code (own small data, sklearn)",
        code: `import pandas as pd
from sklearn.naive_bayes import BernoulliNB

mails = pd.DataFrame({
    "free":  [1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    "offer": [1, 0, 1, 1, 0, 0, 0, 1, 0, 0],
    "spam":  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
})
X = mails[["free", "offer"]]
y = mails["spam"]
new = pd.DataFrame({"free": [1], "offer": [1]})

model = BernoulliNB(alpha=1)                    # alpha = smoothing
model.fit(X, y)                                 # learns by counting

model.predict(new)                              # [1] = spam
model.predict_proba(new)                        # [chance of real, chance of spam]
np.exp(model.class_log_prior_)                  # priors: [0.6, 0.4]
np.exp(model.feature_log_prob_)                 # P(word = 1 | class), one row per class

BernoulliNB(alpha=1e-10).fit(X, y).predict_proba(new)    # almost no smoothing: about [0.07, 0.93], same as by hand`,
      },
    ],
  },
  {
    id: "naive-bayes-in-code",
    name: "Naive Bayes in Code",
    blocks: [
      {
        type: "text",
        text: "Using Naive Bayes in sklearn. Training is just counting. The 4 steps are: 1) make the data, 2) turn everything into numbers, 3) fit (count), 4) predict.",
      },
      {
        type: "text",
        title: "Why",
        text: "sklearn only takes numbers. Categories need an encoder and text needs a vectorizer. Then Naive Bayes counts each column alone.",
      },
      {
        type: "table",
        title: "Which Naive Bayes to use",
        head: ["Data", "Use"],
        rows: [
          ["Categories (Sunny, Rainy)", "`CategoricalNB`"],
          ["Word COUNTS in text", "`MultinomialNB`"],
          ["0/1 columns (word is there or not)", "`BernoulliNB`"],
          ["Numbers (25.5, 80)", "`GaussianNB` (next topic)"],
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "`alpha` = smoothing. Default 1. Tune with cross-validation (0.01, 0.1, 1).",
          "Ordinal numbers (0, 1, 2) are fine for CategoricalNB. They are only labels. Naive Bayes never treats 2 as bigger than 1.",
          "Use the SAME encoder for training and new data (`enc.transform`, not `fit_transform`).",
          "`predict_proba` columns follow `model.classes_` (alphabetical). Check it before reading.",
          "Mixed clues give unsure answers (close to 50-50).",
          "A word never seen in training is ignored, so it does not break the model.",
          "A new category never seen in training can break CategoricalNB. Clean the data or set `min_categories`.",
          "Put the vectorizer and the model in a Pipeline, so training and new data use the same steps.",
          "Small data (14 rows) is used only to learn the idea. In real work, use `train_test_split` or `cross_val_score`, and check precision, recall and F1.",
          "For real text use `TfidfVectorizer` (gives less weight to very common words). MultinomialNB works with it.",
          "Chances are often too sure. Use them to rank, not as exact numbers.",
        ],
      },
      {
        type: "code",
        title: "Code 1 (categories, play cricket or not)",
        code: `days = pd.DataFrame({
    "Weather": ["Sunny","Sunny","Overcast","Rainy","Rainy","Rainy","Overcast","Sunny","Sunny","Rainy","Sunny","Overcast","Overcast","Rainy"],
    "Temp":    ["Hot","Hot","Hot","Mild","Cool","Cool","Cool","Mild","Cool","Mild","Mild","Mild","Hot","Mild"],
    "Wind":    ["Weak","Strong","Weak","Weak","Weak","Strong","Strong","Weak","Weak","Weak","Strong","Strong","Weak","Strong"],
    "Play":    ["No","No","Yes","Yes","Yes","No","Yes","No","Yes","Yes","Yes","Yes","Yes","No"],
})
X = days[["Weather", "Temp", "Wind"]]
y = days["Play"]

enc = OrdinalEncoder()                      # words to numbers
Xn = enc.fit_transform(X)
model = CategoricalNB(alpha=1).fit(Xn, y)   # just counting

new = pd.DataFrame({"Weather": ["Sunny"], "Temp": ["Cool"], "Wind": ["Strong"]})
model.predict(enc.transform(new))           # ['No']
model.predict_proba(enc.transform(new))     # [[0.567 0.433]] = [No, Yes], a close call
np.exp(model.class_log_prior_)              # priors [0.357 0.643] = [No, Yes]`,
      },
      {
        type: "code",
        title: "Code 2 (text, spam or not)",
        code: `texts = ["win free money now", "free offer win prize", "limited offer free gift", "claim your free prize now",
         "meeting at 10 tomorrow", "lunch with the team", "project report attached", "see you at the meeting"]
labels = [1, 1, 1, 1, 0, 0, 0, 0]           # 1 = spam

model = make_pipeline(CountVectorizer(), MultinomialNB(alpha=1))
model.fit(texts, labels)                    # words to counts, then counting

model.predict(["free money offer", "team meeting tomorrow", "free lunch meeting"])    # [1 0 0]
model.predict_proba(["free lunch meeting"])                                           # [[0.564 0.436]] unsure, mixed clues`,
      },
    ],
  },
  {
    id: "gaussian-naive-bayes",
    name: "Gaussian Naive Bayes (Numerical Data)",
    blocks: [
      {
        type: "text",
        text: "Gaussian Naive Bayes is Naive Bayes for number columns. For each class and each column, it learns two things: the usual value (mean) and the spread (variance). The closer a new number is to a class's usual value, the more points that class gets.",
      },
      {
        type: "text",
        title: "Why",
        text: "Counting works for words and categories (\"3 of 4 spam mails have the word free\"). It does not work for numbers. How many apples weigh exactly 158 g? Maybe none.",
      },
      {
        type: "points",
        title: "Simple story",
        points: [
          "Closed eyes. A friend says the fruit weighs 158 g.",
          "Apples are usually about 162 g. Oranges are usually about 143 g.",
          "158 is close to 162 and far from 143. So guess apple.",
          "The model does the same thing for every column, then multiplies the points.",
        ],
      },
      {
        type: "terms",
        title: "What the model learns (only 2 numbers)",
        items: [
          { term: "Mean (μ)", desc: "the usual value of a class." },
          {
            term: "Variance (σ²)",
            desc: "how much the fruits differ from each other. Small = all almost the same. Big = some light, some heavy.",
          },
        ],
      },
      {
        type: "points",
        title: "The bell",
        points: [
          "Most apples are near the usual weight. Few are far. Drawn as a picture, it looks like a bell.",
          "The bell is just a closeness score. Near the usual value = high score. Far = low score.",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Height of the bell at x", f: "P(x | class) = 1 / (σ·√(2π)) × e^( −(x − μ)² / (2σ²) )" },
          { l: "Score of a class", f: "P(class) × height(column 1) × height(column 2) × ..." },
        ],
        points: [
          "Pick the class with the biggest score.",
          "Do not memorize the formula. Remember: closer to the usual value = higher score.",
        ],
      },
      {
        type: "points",
        title: "Example (weight 158 g, diameter 7.1 cm)",
        points: [
          "Apple is closer on weight (about 3 times better) and on diameter (about 2 times better).",
          "Multiply: 3 × 2 = about 6 times more likely to be an apple.",
          "Priors are 50-50, so nothing changes. Final: about 87% Apple.",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "The \"height\" is a density, not a real probability. It can be more than 1 for a very narrow bell. This is fine, because we only compare the scores.",
          "Scaling is not needed. Each column and class has its own mean and variance.",
          "Check that each column looks like a bell (histogram per class). If skewed (income, price), use log or `PowerTransformer` first.",
          "Related columns (weight and diameter) break the independence idea. Remove one if the score is weak.",
          "`var_smoothing` (default 1e-9) adds a tiny number to every variance, so it never divides by zero. Bigger value = wider bell, calmer model. Try 1e-9 up to 1e-1 with cross-validation.",
          "Chances are often too sure. A fruit of 200 g and 9 cm gets 100% Apple, even though no apple was ever that big. Use chances to rank, or calibrate them.",
          "Mixed data (numbers and categories): bin the numbers (`KBinsDiscretizer`) and use CategoricalNB, or use a tree model.",
          "Fast first model. Small data (12 rows) is only for learning the idea. In real work, split the data and check F1.",
        ],
      },
      {
        type: "code",
        code: `fruits = pd.DataFrame({
    "weight":   [150, 160, 170, 155, 165, 175, 130, 140, 150, 135, 145, 160],
    "diameter": [7.0, 7.5, 7.8, 7.2, 7.6, 7.9, 6.0, 6.5, 6.8, 6.2, 6.6, 7.0],
    "fruit":    ["Apple"] * 6 + ["Orange"] * 6,
})
X = fruits[["weight", "diameter"]]
y = fruits["fruit"]

model = GaussianNB()
model.fit(X, y)                                 # finds mean and variance for each class and column

model.theta_                                    # means:     [[162.5  7.5 ], [143.33  6.52]]
model.var_                                      # variances: [[ 72.92  0.1 ], [ 97.22  0.11]]
model.class_prior_                              # priors: [0.5 0.5]

new = pd.DataFrame({"weight": [158], "diameter": [7.1]})
model.predict(new)                              # ['Apple']
model.predict_proba(new)                        # [[0.866 0.134]] = [Apple, Orange]`,
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

function BasicsAndBayesTheorem_13() {
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
                Naive Bayes: Probability, Bayes Theorem and Classification
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

export default BasicsAndBayesTheorem_13;