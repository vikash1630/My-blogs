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
    id: "accuracy-confusion-matrix",
    name: "Accuracy and Confusion Matrix",
    blocks: [
      {
        type: "text",
        text: "Accuracy tells how many answers were right out of all answers. The Confusion Matrix is a small table that shows what the model said and what really happened. It shows WHICH kind of mistakes the model makes.",
      },
      {
        type: "text",
        title: "Why",
        text: "Accuracy alone can lie when one class is much bigger than the other. The confusion matrix looks inside the answers.",
      },
      {
        type: "points",
        title: "Real life (needed to understand)",
        intro: "Spam filter. The \"Positive\" class = Spam.",
        points: [
          "1000 emails. Only 50 are spam. 950 are real mails.",
          "A lazy filter says \"not spam\" for every mail. It is right for 950 mails. Accuracy = 95%.",
          "But it caught ZERO spam. It is useless, even if accuracy looks great.",
        ],
      },
      {
        type: "terms",
        title: "Confusion Matrix (Spam filter)",
        items: [
          { term: "TP (True Positive)", desc: "model said \"spam\", and it was really spam. Good catch." },
          { term: "TN (True Negative)", desc: "model said \"not spam\", and it was really not spam. Good." },
          { term: "FP (False Positive)", desc: "model said \"spam\", but it was a real mail. Real mail lost in the spam folder." },
          { term: "FN (False Negative)", desc: "model said \"not spam\", but it was spam. Spam reached the inbox." },
        ],
      },
      {
        type: "table",
        title: "Table",
        head: ["", "Model said: Spam", "Model said: Not spam"],
        rows: [
          ["Really Spam", "TP", "FN"],
          ["Really Not Spam", "FP", "TN"],
        ],
      },
      {
        type: "points",
        title: "How to read the names",
        points: [
          "Second word (Positive / Negative) = what the MODEL said.",
          "First word (True / False) = was the model right or wrong.",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [{ f: "Accuracy = (TP + TN) / (TP + TN + FP + FN)" }],
      },
      {
        type: "terms",
        title: "Type 1 and Type 2 errors",
        items: [
          {
            term: "Type 1 error",
            desc: "False Positive (FP) = false alarm. Fire alarm rings, but there is no fire. Spam filter: real mail goes to spam.",
          },
          {
            term: "Type 2 error",
            desc: "False Negative (FN) = missed it. Fire, but no alarm. Spam filter: spam reaches the inbox.",
          },
        ],
      },
      {
        type: "points",
        title: "Which one is worse depends on the job",
        points: [
          "Spam filter: Type 1 is worse (you may lose an important mail).",
          "Cancer test: Type 2 is worse (a sick person is missed).",
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Never report accuracy alone. Always show the confusion matrix with it.",
          "Always compare with a lazy baseline (always say the biggest class). Our model must beat it.",
          "Check class balance first. If one class is much bigger, accuracy is not trusted.",
          "Use `stratify=y` in `train_test_split`, so train and test have the same share of each class.",
          "Report on TEST data only.",
          "Business decides which mistake costs more, then the metric and threshold are chosen from that.",
          "sklearn layout: `confusion_matrix` gives [[TN, FP], [FN, TP]].",
        ],
      },
      {
        type: "code",
        code: `from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

lazy = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
accuracy_score(y_test, lazy.predict(X_test))          # baseline to beat

y_pred = model.predict(X_test)
accuracy_score(y_test, y_pred)                        # model accuracy
cm = confusion_matrix(y_test, y_pred)                 # [[TN, FP], [FN, TP]]
tn, fp, fn, tp = cm.ravel()`,
      },
    ],
  },
  {
    id: "precision-recall-f1",
    name: "Precision, Recall and F1 Score",
    blocks: [
      {
        type: "terms",
        items: [
          { term: "Precision", desc: "when the model says \"positive\", how often is it right?" },
          { term: "Recall", desc: "of all the real positives, how many did the model catch?" },
          { term: "F1 Score", desc: "one number that joins precision and recall. It is low if either one is low." },
        ],
      },
      {
        type: "text",
        title: "Why",
        text: "Accuracy can lie. Precision and recall show how good the model is on the rare class (like spam or churn). F1 gives one number to compare models.",
      },
      {
        type: "points",
        title: "Real life (needed to understand)",
        intro: "Spam filter. 1000 mails, 100 are spam.",
        points: [
          "TP = 80 (spam caught), FN = 20 (spam missed), FP = 10 (real mails sent to spam), TN = 890.",
          "Accuracy = 97%, looks great. Now the better questions:",
          "Precision: look at mails the filter called spam (80 + 10 = 90). Really spam = 80. Precision = 80 / 90 = 0.89.",
          "Recall: look at mails that were really spam (80 + 20 = 100). Caught = 80. Recall = 80 / 100 = 0.80.",
          "Lazy filter (\"never spam\") has TP = 0, so recall = 0. This shows it is useless, even if accuracy is 95%.",
        ],
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "Precision", f: "TP / (TP + FP)" },
          { l: "Recall", f: "TP / (TP + FN)" },
          { l: "F1 (same as 2 / (1/P + 1/R))", f: "F1 = 2 · P · R / (P + R)" },
          { l: "F-beta", f: "Fβ = (1 + β²) · P · R / (β² · P + R)" },
        ],
      },
      {
        type: "points",
        title: "Easy way to remember",
        points: [
          "Precision = quality of my \"positive\" calls. Look at what the model SAID.",
          "Recall = how much of the real positives I FOUND. Look at what REALLY happened.",
          "High precision = few false alarms. High recall = few misses.",
        ],
      },
      {
        type: "points",
        title: "Tug of war (threshold)",
        points: [
          "Model says \"positive\" when p >= threshold (default 0.5).",
          "Raise threshold (0.9): fewer false alarms, precision UP, but more misses, recall DOWN.",
          "Lower threshold (0.2): catches more, recall UP, but more false alarms, precision DOWN.",
          "We cannot get both to the top. We must choose.",
        ],
      },
      {
        type: "points",
        title: "Why F1 and not a normal average",
        points: [
          "Cheater model says \"spam\" for every mail (10% are spam). Recall = 1.0, Precision = 0.1.",
          "Normal average = (0.1 + 1.0) / 2 = 0.55. Looks okay, but the filter is useless.",
          "F1 = 0.18. It tells the truth.",
          "F1 is the harmonic mean. Think of two kids tied together in a race. The team runs at the slow kid's speed.",
          "F1 stays close to the smaller number. If precision OR recall is low, F1 is low. It says \"be good at both\".",
        ],
      },
      {
        type: "table",
        head: ["Precision", "Recall", "Normal average", "F1"],
        rows: [
          ["0.9", "0.9", "0.90", "0.90"],
          ["0.9", "0.5", "0.70", "0.64"],
          ["1.0", "0.0", "0.50", "0.00"],
        ],
      },
      {
        type: "terms",
        title: "F-beta (F2 and F0.5)",
        items: [
          { term: "F1 (beta = 1)", desc: "precision and recall equally important." },
          { term: "F2 (beta = 2)", desc: "recall is 2 times more important. Use when MISSING a case is worse." },
          { term: "F0.5 (beta = 0.5)", desc: "precision is 2 times more important. Use when FALSE ALARMS are worse." },
        ],
      },
      {
        type: "points",
        intro: "beta is a dial. It says how much more you care about recall.",
        points: [
          "Example, P = 0.9 and R = 0.5: F1 = 0.64, F2 = 0.55 (recall is weak, so lower), F0.5 = 0.78 (precision is strong, so higher).",
        ],
      },
      {
        type: "table",
        title: "Which one to use (industry standard)",
        head: ["Job", "Use"],
        rows: [
          ["Spam filter (real mail lost is worse)", "Precision, F0.5"],
          ["Cancer test, fraud (missing a case is worse)", "Recall, F2"],
          ["Churn model (missing a leaver is worse)", "Recall, F2 or F1"],
          ["Both mistakes equal, or just comparing models", "F1 (the default)"],
        ],
      },
      {
        type: "points",
        title: "Important points",
        points: [
          "Business decides which mistake costs more. Then we choose the metric and the threshold.",
          "Look at the rare class (class 1). The big class always looks good.",
          "Print the full report with `classification_report`, not one number.",
          "Move the threshold to match the need, ex: \"we need recall of at least 80%\".",
          "Show precision, recall and F1 together, with the confusion matrix.",
          "Calculate on TEST data only.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.metrics import precision_score, recall_score, f1_score, fbeta_score, classification_report

precision_score(y_test, y_pred)
recall_score(y_test, y_pred)
f1_score(y_test, y_pred)
fbeta_score(y_test, y_pred, beta=2)             # F2, recall matters more
fbeta_score(y_test, y_pred, beta=0.5)           # F0.5, precision matters more
classification_report(y_test, y_pred)           # full report per class

# move the threshold
p = model.predict_proba(X_test)[:, 1]
y_t = (p >= 0.3).astype(int)                    # lower threshold = higher recall`,
      },
    ],
  },
  {
    id: "roc-auc",
    name: "ROC Curve and AUC",
    blocks: [
      {
        type: "terms",
        items: [
          {
            term: "ROC Curve",
            desc: "a picture. For every threshold, it plots one point: FPR on the x-axis and TPR on the y-axis. Join all points to get the curve.",
          },
          {
            term: "AUC",
            desc: "Area Under the Curve. It turns the curve into one number between 0 and 1.",
          },
        ],
      },
      {
        type: "text",
        title: "Why",
        text: "Precision and recall change when we move the threshold. So the same model has many scores. To compare Model A and Model B fairly, we need ONE score for the model itself that does not depend on the threshold. That score is AUC.",
      },
      {
        type: "formula",
        title: "Formula",
        lines: [
          { l: "True Positive Rate (same as Recall, higher is better)", f: "TPR = TP / (TP + FN)" },
          { l: "False Positive Rate (false alarm rate, lower is better)", f: "FPR = FP / (FP + TN)" },
        ],
        points: ["We want TPR high and FPR low."],
      },
      {
        type: "points",
        title: "How to draw the curve",
        points: [
          "Try every threshold. For each one, calculate TPR and FPR. Plot the point (FPR, TPR).",
          "Threshold very high (model says \"positive\" for nothing) = point at (0, 0), bottom-left.",
          "Threshold very low (model says \"positive\" for everything) = point at (1, 1), top-right.",
          "Join all the points.",
        ],
      },
      {
        type: "image",
        src: "/roc-auc-curves.png",
        alt: "Six ROC curves for AUC values 1.0, 0.95, 0.85, 0.75, 0.5 and 0.25. The curve bends closer to the top-left corner as AUC rises, follows the dashed diagonal at 0.5, and falls below it at 0.25.",
        caption: "Dashed line = coin flip. Coloured curve = the model. Shaded area = AUC. Closer to the top-left corner = better model.",
      },
      {
        type: "points",
        title: "Reading guidelines (how to read the ROC picture)",
        points: [
          "x-axis = FPR = false alarms. Left is good (few false alarms).",
          "y-axis = TPR = recall = real positives caught. Top is good (many caught).",
          "The dashed diagonal line = coin flip. A random guesser follows this line.",
          "Curve above the dashed line = the model is better than a coin flip.",
          "Curve bends towards the TOP-LEFT corner = better model. Top-left means high TPR with low FPR.",
          "Bigger shaded area under the curve = bigger AUC = better model.",
          "Curve on the dashed line = useless model (AUC = 0.5).",
          "Curve BELOW the dashed line = answers are upside down. Flip the answers and you get a good model.",
          "Each point on the curve is one threshold. Moving along the curve to the right = lower threshold = more caught, but more false alarms.",
          "To compare two models, draw both curves in one picture. The curve that is higher (more top-left) is the better model.",
        ],
      },
      {
        type: "table",
        title: "AUC meaning (the six pictures)",
        head: ["AUC", "Meaning"],
        rows: [
          ["1.0", "perfect model (curve goes up the left side, then across the top)"],
          ["0.9 to 1.0", "excellent"],
          ["0.8 to 0.9", "good"],
          ["0.7 to 0.8", "okay"],
          ["0.5", "coin flip, useless (curve is the diagonal)"],
          ["below 0.5", "worse than a coin flip, the model has things upside down"],
        ],
      },
      {
        type: "points",
        title: "Easy way to understand AUC",
        points: [
          "Pick one random positive (ex: spam mail) and one random negative (ex: real mail).",
          "AUC = the chance that the model gives a higher score to the positive one.",
          "AUC 0.9 = 90 times out of 100, the model ranks the spam above the real mail.",
          "AUC 0.5 = just a coin flip.",
          "So AUC measures how well the model SORTS positives above negatives. It does not depend on any threshold.",
        ],
      },
      {
        type: "points",
        title: "Industry standard",
        points: [
          "Use AUC to choose the model. Then choose the threshold as a separate step, using the business cost.",
          "Pick the threshold from the ROC curve. Common way: the point with the biggest (TPR − FPR). This is called Youden's J. Better: use the real cost of each mistake.",
          "When the positive class is very rare (ex: 1 fraud in 1000), AUC can look great even for a weak model. Use the Precision-Recall curve and PR-AUC (`average_precision_score`) instead.",
          "Never use AUC alone. It does not tell if \"0.8\" really means 80%. Also check precision, recall and the confusion matrix at the chosen threshold.",
          "Use cross-validation for AUC, so the number does not depend on one lucky split.",
          "Compare with a baseline. The lazy model has AUC 0.5. Your model must be clearly above it.",
          "AUC needs chances (`predict_proba`), not classes (`predict`). With only 0 and 1 you get just one point on the curve.",
        ],
      },
      {
        type: "code",
        code: `from sklearn.metrics import roc_curve, roc_auc_score, average_precision_score
from sklearn.model_selection import cross_val_score

p = model.predict_proba(X_test)[:, 1]            # chances, not 0/1

fpr, tpr, thresholds = roc_curve(y_test, p)      # one point for each threshold
roc_auc_score(y_test, p)                         # AUC

best = (tpr - fpr).argmax()                      # biggest (TPR - FPR)
thresholds[best]                                 # best threshold (Youden's J)

cross_val_score(model, X, y, cv=5, scoring="roc_auc").mean()    # AUC with cross-validation
average_precision_score(y_test, p)               # PR-AUC, for rare classes`,
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

function ClassificationMetrics_11() {
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
                Classification Metrics: Evaluation, ROC and AUC
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

export default ClassificationMetrics_11;