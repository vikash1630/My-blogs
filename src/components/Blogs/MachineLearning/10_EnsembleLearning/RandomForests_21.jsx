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
  /* ---------------------------------------------------------------- */
  {
    id: "rf-intro",
    name: "Random Forest: Introduction",
    blocks: [
      {
        type: "text",
        text: "Random Forest is an Ensemble Learning algorithm that combines multiple Decision Trees to produce a final prediction.",
      },
      {
        type: "points",
        title: "Core Idea",
        points: [
          "Random Forest = Bagging + Random Feature Selection.",
          "Each tree is trained on a different bootstrap sample.",
          "At every node, a random subset of features is selected.",
          "Best split is chosen only from those selected features.",
          "Multiple trees produce diverse predictions.",
        ],
      },
      {
        type: "points",
        title: "How Random Forest Works",
        points: [
          "1. Generate different bootstrap samples from training data.",
          "2. Train a Decision Tree on each sample.",
          "3. At every node, randomly select a subset of features.",
          "4. Find the best split among the selected features.",
          "5. Grow multiple trees independently.",
          "6. Combine predictions to get the final output.",
        ],
      },
      {
        type: "table",
        title: "Random Feature Selection",
        head: ["Node", "Randomly selected features"],
        rows: [
          ["Node 1", "Age, Credit Score"],
          ["Node 2", "Salary, Experience"],
          ["Node 3", "Location, Age"],
        ],
        note: "Original features: Age, Salary, Experience, Credit Score, Location.",
      },
      {
        type: "points",
        title: "Important",
        points: [
          "Feature selection happens at every node split.",
          "Different nodes can receive different feature subsets.",
          "`max_features` controls the number of candidate features.",
        ],
      },
      {
        type: "terms",
        title: "Prediction Aggregation",
        items: [
          { term: "Classification", desc: "Majority Voting. Final class = Most frequently predicted class." },
          { term: "Regression", desc: "Averaging. Final prediction = Mean of all tree predictions." },
        ],
      },
      {
        type: "compare",
        title: "Decision Tree vs Random Forest",
        items: [
          {
            title: "Decision Tree",
            text: "Uses a single tree. Can overfit easily. Makes predictions using one model.",
          },
          {
            title: "Random Forest",
            text: "Combines multiple trees. Usually provides more stable predictions. Reduces correlation using random feature selection. Combines predictions using voting or averaging.",
          },
        ],
      },
      {
        type: "code",
        title: "Random Forest Classifier",
        code: `from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,
    max_features="sqrt",
    bootstrap=True,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)`,
      },
      {
        type: "code",
        title: "Random Forest Regressor",
        code: `from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=100,
    max_features=0.5,
    bootstrap=True,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
y_pred = model.predict(X_test)`,
      },
      {
        type: "points",
        title: "Important Points",
        points: [
          "Bootstrap Sampling = Diversity through different training rows.",
          "Random Feature Selection = Diversity through different features.",
          "`max_features` = Controls candidate features at each split.",
          "`n_estimators` = Number of Decision Trees.",
          "Classification = Majority Voting.",
          "Regression = Averaging.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Random Forest = Multiple Decision Trees + Bagging + Random Features. Main Benefit = More diverse trees and reduced variance.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "rf-bias-variance",
    name: "Random Forest: Bias-Variance Trade-off",
    blocks: [
      {
        type: "points",
        title: "Problem with Decision Trees",
        points: [
          "Usually Low Bias + High Variance.",
          "Small changes in training data can create very different trees.",
        ],
      },
      {
        type: "points",
        title: "How Random Forest Solves This",
        points: [
          "Combines predictions from multiple Decision Trees.",
          "Averaging reduces variance.",
          "Random feature selection reduces correlation between trees.",
          "Produces more stable predictions.",
        ],
      },
      {
        type: "terms",
        title: "Bias and Variance",
        items: [
          {
            term: "Bias",
            desc: "Error due to overly simple model assumptions. High Bias = Underfitting. Low Bias = Can capture complex patterns.",
          },
          {
            term: "Variance",
            desc: "Measures how much predictions change across different training datasets. High Variance = Model is sensitive to training data. Low Variance = More stable predictions.",
          },
        ],
      },
      {
        type: "formula",
        title: "Bias-Variance Decomposition (Squared Error)",
        lines: [{ l: "Expected Error", f: "Expected Error = Bias² + Variance + Irreducible Noise" }],
      },
      {
        type: "formula",
        title: "Mathematical Intuition",
        lines: [
          {
            l: "Variance of Random Forest (average of B trees)",
            f: "Var(Forest) = ρσ² + ((1 − ρ)σ² / B)",
          },
        ],
        points: [
          "B = Number of trees.",
          "σ² = Variance of individual tree predictions.",
          "ρ = Average correlation between trees.",
        ],
      },
      {
        type: "terms",
        title: "Important Cases",
        items: [
          { term: "Independent Trees (ρ = 0)", desc: "Variance = σ² / B. More trees reduce variance." },
          { term: "Fully Correlated Trees (ρ = 1)", desc: "Variance = σ². No variance reduction." },
        ],
      },
      {
        type: "points",
        title: "Conclusion",
        points: [
          "Lower correlation = Greater variance reduction.",
          "Averaging alone is less effective when trees are highly correlated.",
        ],
      },
      {
        type: "points",
        title: "Why Random Feature Selection?",
        intro: "Random Forest creates diversity using:",
        points: [
          "1. Bootstrap Sampling: Different trees receive different training samples.",
          "2. Random Feature Selection: Each node considers a random subset of features. Reduces correlation between trees.",
          "Random Forest = Bagging + Random Feature Selection.",
        ],
      },
      {
        type: "points",
        title: "Effect of Number of Trees",
        points: [
          "Few trees = Less stable predictions.",
          "More trees = Generally lower variance.",
          "Eventually performance reaches a plateau.",
          "More trees increase computational cost.",
          "Adding trees does not typically cause overfitting.",
        ],
      },
      {
        type: "compare",
        title: "Decision Tree vs Random Forest",
        items: [
          {
            title: "Decision Tree",
            text: "Usually Low Bias, High Variance.",
          },
          {
            title: "Random Forest",
            text: "Usually Low Bias, Reduced Variance. More stable predictions. Better generalization in many cases.",
          },
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Averaging = Reduces Variance. Random Features = Reduces Correlation. More Trees = More Stable Predictions. Random Forest performs well by combining diverse trees.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "bagging-vs-rf",
    name: "Bagging vs Random Forest",
    blocks: [
      {
        type: "text",
        text: "Bagging combines multiple models trained on different bootstrap samples. Random Forest is an extension of Bagging that uses Decision Trees with random feature selection.",
      },
      {
        type: "points",
        title: "Limitation of Bagging",
        points: [
          "Different bootstrap samples create different trees.",
          "But trees may select the same dominant features.",
          "This can make trees highly correlated.",
          "Highly correlated trees provide less variance reduction.",
        ],
      },
      {
        type: "points",
        title: "How Random Forest Improves",
        points: [
          "Uses Bootstrap Sampling (different rows).",
          "Uses Random Feature Selection (different candidate features).",
          "Reduces correlation between trees.",
          "Improves variance reduction and prediction stability.",
        ],
      },
      {
        type: "compare",
        title: "Feature Selection Difference",
        items: [
          {
            title: "Bagging with Decision Trees",
            text: "Randomly selects a feature subset for each tree. Selected subset remains fixed throughout that tree. Controlled by `max_features`.",
          },
          {
            title: "Random Forest",
            text: "Randomly selects candidate features at every node. A fresh subset is selected at each split. Best split is chosen from those candidates. Controlled by `max_features`.",
          },
        ],
      },
      {
        type: "points",
        title: "Example: Total features = 10, max_features = 4",
        points: [
          "Root node: Select 4 from original 10.",
          "Child node: Again select 4 from original 10.",
          "Grandchild: Again select 4 from original 10.",
        ],
      },
      {
        type: "points",
        title: "Important",
        points: [
          "Selection is always from the original feature set.",
          "Previous selections are not permanently removed.",
          "A feature can be selected again at another node.",
        ],
      },
      {
        type: "compare",
        title: "Complete Comparison",
        items: [
          {
            title: "Bagging",
            text: "Can use different base estimators. Uses bootstrap or pasting for row sampling. Feature sampling is optional. Feature subset is selected per estimator.",
          },
          {
            title: "Random Forest",
            text: "Uses Decision Trees. Usually uses bootstrap sampling. Random feature selection at every node. Generally produces less-correlated trees.",
          },
        ],
      },
      {
        type: "code",
        title: "Bagging Classifier",
        code: `from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier

bag = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=100,
    max_samples=0.8,
    max_features=0.5,
    bootstrap=True,
    random_state=42
)

bag.fit(X_train, y_train)`,
      },
      {
        type: "code",
        title: "Random Forest",
        code: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=100,
    max_features="sqrt",
    bootstrap=True,
    random_state=42,
    n_jobs=-1
)

rf.fit(X_train, y_train)`,
      },
      {
        type: "terms",
        title: "Prediction Aggregation",
        items: [
          { term: "Bagging Classifier", desc: "Majority voting by default." },
          { term: "Random Forest Classifier", desc: "Averages class probabilities and selects the highest." },
          { term: "Both Regressors", desc: "Average numerical predictions." },
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "Bagging = Bootstrap Sampling + Aggregation. Random Forest = Bagging with Decision Trees + Random Features. Bagging Feature Selection = Per estimator. Random Forest Feature Selection = At every node. Main Benefit of Random Forest: Reduced correlation between trees, so better variance reduction.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "rf-hyperparameters",
    name: "Random Forest Hyperparameters",
    blocks: [
      {
        type: "terms",
        items: [
          { term: "n_estimators", desc: "Number of Decision Trees in the forest." },
          {
            term: "criterion",
            desc: "Measures split quality. Classification: gini, entropy, log_loss. Regression: squared_error, absolute_error, etc.",
          },
          { term: "max_depth", desc: "Maximum depth of each tree. Controls tree complexity." },
          { term: "min_samples_split", desc: "Minimum samples required to split a node." },
          { term: "min_samples_leaf", desc: "Minimum samples required in a leaf." },
          {
            term: "max_features ⭐",
            desc: 'Number of random candidate features at each node. "sqrt", "log2", None, integer or fraction. Controls diversity between trees.',
          },
          {
            term: "bootstrap",
            desc: "True = Sampling with replacement. False = Uses the full dataset for each tree.",
          },
          { term: "max_samples", desc: "Number or proportion of rows per tree. Used when bootstrap=True." },
          { term: "oob_score", desc: "Enables Out-of-Bag evaluation. Requires bootstrap=True." },
        ],
      },
      {
        type: "points",
        title: "Other Parameters",
        points: [
          "`n_jobs` = Parallel execution; -1 uses all cores.",
          "`random_state` = Reproducibility.",
          "`ccp_alpha` = Controls pruning.",
        ],
      },
      {
        type: "points",
        title: "Important Points",
        points: [
          "Increasing n_estimators generally improves stability.",
          "Lower max_depth = Simpler trees.",
          "Higher min_samples_leaf = Less complex trees.",
          "Lower max_features = More feature randomness.",
          "Tune parameters using GridSearchCV or RandomizedSearchCV.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "n_estimators = Number of trees. max_features = Random features per split. max_depth = Tree complexity. max_samples = Bootstrap sample size.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "rf-tuning",
    name: "Random Forest: Hyperparameter Tuning",
    blocks: [
      {
        type: "text",
        text: "Goal: Find the best hyperparameter combination to improve model generalization.",
      },
      {
        type: "terms",
        title: "Two Techniques",
        items: [
          { term: "1. GridSearchCV", desc: "Tests every specified combination." },
          { term: "2. RandomizedSearchCV", desc: "Tests a fixed number of randomly selected combinations." },
        ],
      },
      {
        type: "text",
        title: "GridSearchCV",
        text: "Tests all possible combinations from the given parameter grid using cross-validation.",
      },
      {
        type: "formula",
        title: "Example: n_estimators = [100, 200], max_depth = [10, 20]",
        lines: [
          { l: "Total combinations", f: "2 × 2 = 4" },
          { l: "With cv=5, total model fits", f: "4 × 5 = 20" },
        ],
      },
      {
        type: "code",
        title: "GridSearchCV in Python",
        code: `from sklearn.model_selection import GridSearchCV

grid = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid={
        'n_estimators': [100, 200],
        'max_depth': [10, 20]
    },
    cv=5,
    n_jobs=-1
)

grid.fit(X_train, y_train)`,
      },
      {
        type: "text",
        title: "RandomizedSearchCV",
        text: "Randomly selects a fixed number of hyperparameter combinations instead of testing every combination.",
      },
      {
        type: "points",
        title: "Important",
        points: [
          "`n_iter` = Number of combinations to test.",
          "`param_distributions` = Parameters and their possible values or probability distributions.",
          "Useful for large search spaces.",
        ],
      },
      {
        type: "code",
        title: "RandomizedSearchCV in Python",
        code: `from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint

search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions={
        'n_estimators': randint(100, 500),
        'max_depth': [None, 10, 20],
    },
    n_iter=20,
    cv=5,
    random_state=42,
    n_jobs=-1
)

search.fit(X_train, y_train)`,
      },
      {
        type: "compare",
        title: "GridSearchCV vs RandomizedSearchCV",
        items: [
          {
            title: "GridSearchCV",
            text: "Tests all specified combinations. Uses `param_grid`. Suitable for smaller search spaces.",
          },
          {
            title: "RandomizedSearchCV",
            text: "Tests randomly selected combinations. Uses `param_distributions`. Uses `n_iter` to control search budget. Suitable for larger search spaces.",
          },
        ],
      },
      {
        type: "terms",
        title: "Important Attributes",
        items: [
          { term: "best_params_", desc: "Best hyperparameter combination." },
          { term: "best_score_", desc: "Best average cross-validation score." },
          { term: "best_estimator_", desc: "Best fitted model." },
        ],
      },
      {
        type: "code",
        title: "Final Model Evaluation",
        code: `best_model = search.best_estimator_

y_pred = best_model.predict(X_test)`,
      },
      {
        type: "points",
        points: [
          "Tune using training data and cross-validation.",
          "Evaluate final model on unseen test data.",
          "Never use test data during hyperparameter tuning.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "GridSearchCV = Exhaustive Search. RandomizedSearchCV = Random Search. cv = Cross-validation folds. n_iter = Number of random combinations.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "oob-score",
    name: "OOB Score in Random Forest",
    blocks: [
      {
        type: "text",
        text: "OOB (Out-of-Bag) score evaluates a sample using only trees that did not train on that sample.",
      },
      {
        type: "points",
        title: "Working",
        points: [
          "Each tree leaves some bootstrap samples unused.",
          "Unused samples = Out-of-Bag samples.",
          "Predict each sample using its OOB trees.",
          "Compare predictions with actual values.",
        ],
      },
      {
        type: "code",
        title: "Python Implementation",
        code: `model = RandomForestClassifier(
    n_estimators=100,
    bootstrap=True,
    oob_score=True,
    random_state=42
)

model.fit(X_train, y_train)
print(model.oob_score_)`,
      },
      {
        type: "points",
        title: "Important",
        points: [
          "bootstrap=True is required.",
          "`oob_score_` = OOB evaluation score.",
          "Classification default = Accuracy.",
          "Regression default = R².",
          "OOB evaluation does not replace final test evaluation.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "feature-importance",
    name: "Feature Importance",
    blocks: [
      {
        type: "text",
        text: "Feature Importance measures the relative contribution of each feature to a trained model's predictions.",
      },
      {
        type: "table",
        title: "Example",
        head: ["Feature", "Importance"],
        rows: [
          ["Area", "0.50"],
          ["Location", "0.30"],
          ["Bedrooms", "0.15"],
          ["Age", "0.05"],
        ],
        note: "Area contributes the most to impurity reduction. Age contributes the least.",
      },
      {
        type: "points",
        title: "Important",
        points: [
          "Higher value = Greater contribution to impurity reduction.",
          "Importance values normally sum to 1.",
          "It does not represent the percentage of predictions caused by a feature.",
        ],
      },
      {
        type: "points",
        title: "Feature Importance in Decision Trees: MDI (Mean Decrease in Impurity)",
        intro: "Core Idea:",
        points: [
          "Every time a feature is used for splitting, calculate the impurity reduction.",
          "Weight the reduction by the proportion of samples reaching that node.",
          "Add contributions from all nodes using that feature.",
          "Normalize importance values so their sum becomes 1.",
        ],
      },
      {
        type: "formula",
        title: "Weighted Impurity Reduction",
        lines: [
          {
            l: "Contribution",
            f: "(N_node / N_total) × [ I_parent − ( (N_left / N_node) × I_left + (N_right / N_node) × I_right ) ]",
          },
        ],
        points: [
          "N_node = Samples reaching the parent node.",
          "N_total = Total training samples.",
          "I_parent = Parent impurity.",
          "I_left, I_right = Child impurities.",
          "N_left, N_right = Child sample counts.",
        ],
      },
      {
        type: "text",
        title: "Numerical Example",
        text: "Suppose the root node contains 100 samples. Parent Gini = 0.5. Left child: 60 samples, Gini = 0.2. Right child: 40 samples, Gini = 0.3.",
      },
      {
        type: "formula",
        lines: [
          { l: "Weighted Child Gini", f: "(60/100 × 0.2) + (40/100 × 0.3) = 0.24" },
          { l: "Impurity Reduction", f: "0.5 − 0.24 = 0.26" },
        ],
        points: ["Feature A contribution = 0.26."],
      },
      {
        type: "text",
        title: "Importance of Child Node Splits",
        text: "Suppose Feature B splits the left child. Parent Gini = 0.2. Left grandchild: 30 samples, Gini = 0.1. Right grandchild: 30 samples, Gini = 0.15.",
      },
      {
        type: "formula",
        lines: [
          { l: "Local Impurity Reduction", f: "0.2 − (0.5 × 0.1 + 0.5 × 0.15) = 0.075" },
          { l: "Weighted Contribution", f: "(60/100) × 0.075 = 0.045" },
        ],
        points: ["Feature B contribution = 0.045."],
      },
      {
        type: "formula",
        title: "Normalizing Feature Importance",
        lines: [
          { l: "Total Contribution", f: "0.26 + 0.045 = 0.305" },
          { l: "Feature A", f: "0.26 / 0.305 = 0.8525 = 85.25%" },
          { l: "Feature B", f: "0.045 / 0.305 = 0.1475 = 14.75%" },
        ],
      },
      {
        type: "points",
        title: "Conclusion",
        points: [
          "Feature A is more important because it produces greater weighted impurity reduction.",
          "Repeat this calculation across all tree nodes.",
          "Normalize the final contributions.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "rf-feature-importance",
    name: "Feature Importance in Random Forest",
    blocks: [
      {
        type: "points",
        points: [
          "Every Decision Tree calculates its own feature importance.",
          "Random Forest averages importance across all trees.",
          "Final importance values are normalized.",
        ],
      },
      {
        type: "table",
        title: "Example",
        head: ["Feature", "Tree 1", "Tree 2", "Tree 3"],
        rows: [
          ["Area", "0.60", "0.50", "0.40"],
          ["Location", "0.30", "0.30", "0.40"],
          ["Bedrooms", "0.10", "0.20", "0.20"],
        ],
      },
      {
        type: "formula",
        title: "Final Importance",
        lines: [
          { l: "Area", f: "(0.60 + 0.50 + 0.40) / 3 = 0.50" },
          { l: "Location", f: "(0.30 + 0.30 + 0.40) / 3 = 0.333" },
          { l: "Bedrooms", f: "(0.10 + 0.20 + 0.20) / 3 = 0.167" },
        ],
      },
      {
        type: "code",
        title: "Scikit-learn Implementation",
        code: `from sklearn.ensemble import RandomForestClassifier
import pandas as pd

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

importance = pd.Series(
    model.feature_importances_,
    index=X_train.columns
)

print(importance.sort_values(ascending=False))`,
      },
      {
        type: "points",
        title: "Important",
        points: [
          "`feature_importances_` = Returns feature importance values.",
          "Higher value = Greater impurity reduction contribution.",
          "Same attribute is available for Decision Trees.",
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: "mdi-limits-permutation",
    name: "Limitations of MDI & Permutation Importance",
    blocks: [
      {
        type: "terms",
        title: "Limitations of MDI",
        items: [
          {
            term: "1. High Cardinality Bias",
            desc: "Features with many unique values can receive artificially high importance.",
          },
          {
            term: "2. Correlated Features",
            desc: "Importance may be divided between correlated features. One feature may receive more importance than another.",
          },
          {
            term: "3. Interpretation",
            desc: "Importance does not indicate positive or negative influence. It does not prove causation.",
          },
        ],
      },
      {
        type: "text",
        title: "Permutation Feature Importance",
        text: "An alternative to MDI.",
      },
      {
        type: "points",
        title: "Working",
        points: [
          "1. Calculate original model performance.",
          "2. Randomly shuffle one feature.",
          "3. Calculate performance again.",
          "4. Measure performance decrease.",
        ],
      },
      {
        type: "points",
        title: "Interpretation",
        points: [
          "Larger performance decrease = Model relies more on that feature.",
          "Useful for evaluating feature importance on unseen data.",
        ],
      },
      {
        type: "callout",
        title: "Remember",
        text: "MDI = Mean Decrease in Impurity. Decision Tree = Weighted impurity reduction across nodes. Random Forest = Average feature importance across trees. feature_importances_ = Scikit-learn attribute. Limitations = High-cardinality bias, correlated features, no causation or direction. Alternative = Permutation Importance, which measures performance drop after shuffling.",
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
            <dt className="gd-serif break-words text-[19px] sm:text-xl font-medium leading-snug text-stone-900 dark:text-stone-100">
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

function RandomForests_21() {
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
                Ensemble Learning Part 3: Random Forest &amp; Feature Importance
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

export default RandomForests_21;