import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../UI/Footer";

/* ---------- category system (encodes React concept layers, not decoration) ---------- */

const CATEGORIES = {
  foundation: {
    ring: "border-blue-200 dark:border-blue-500/25",
    bg: "bg-blue-50/70 dark:bg-blue-500/[0.06]",
    top: "border-t-blue-400 dark:border-t-blue-500",
    badge:
      "bg-blue-100 text-blue-600 border-blue-400 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/50",
    dot: "bg-blue-400",
    label: "Foundation",
  },
  mental: {
    ring: "border-purple-200 dark:border-purple-500/25",
    bg: "bg-purple-50/70 dark:bg-purple-500/[0.06]",
    top: "border-t-purple-400 dark:border-t-purple-500",
    badge:
      "bg-purple-100 text-purple-700 border-purple-400 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/50",
    dot: "bg-purple-400",
    label: "Mental Model",
  },
  pattern: {
    ring: "border-green-200 dark:border-green-500/25",
    bg: "bg-green-50/70 dark:bg-green-500/[0.06]",
    top: "border-t-green-400 dark:border-t-green-500",
    badge:
      "bg-green-100 text-green-700 border-green-400 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/50",
    dot: "bg-green-400",
    label: "Pattern",
  },
  hook: {
    ring: "border-amber-200 dark:border-amber-500/25",
    bg: "bg-amber-50/70 dark:bg-amber-500/[0.06]",
    top: "border-t-amber-400 dark:border-t-amber-500",
    badge:
      "bg-amber-100 text-amber-700 border-amber-400 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/50",
    dot: "bg-amber-400",
    label: "Hook",
  },
  advanced: {
    ring: "border-rose-200 dark:border-rose-500/25",
    bg: "bg-rose-50/70 dark:bg-rose-500/[0.06]",
    top: "border-t-rose-400 dark:border-t-rose-500",
    badge:
      "bg-rose-100 text-rose-700 border-rose-400 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/50",
    dot: "bg-rose-400",
    label: "Advanced",
  },
};

const CALLOUT = {
  aha: {
    border: "border-yellow-200 dark:border-yellow-500/25",
    bg: "bg-yellow-50/70 dark:bg-yellow-500/[0.06]",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  trap: {
    border: "border-red-200 dark:border-red-500/25",
    bg: "bg-red-50/70 dark:bg-red-500/[0.06]",
    text: "text-red-700 dark:text-red-300",
  },
  common: {
    border: "border-orange-200 dark:border-orange-500/25",
    bg: "bg-orange-50/70 dark:bg-orange-500/[0.06]",
    text: "text-orange-700 dark:text-orange-300",
  },
};

/* ---------- shared visual primitives ---------- */

function P({ children }) {
  return (
    <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
      {children}
    </p>
  );
}

function Label({ children }) {
  return (
    <p className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
      {children}
    </p>
  );
}

function Bullets({ items }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300"
        >
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CodeBox({ children }) {
  return (
    <div className="overflow-hidden rounded-xl bg-gray-900 dark:bg-black/40 shadow-sm my-3">
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
      </div>
      <pre className="overflow-x-auto px-5 py-4 text-sm sm:text-base leading-relaxed text-emerald-300 font-mono whitespace-pre-wrap break-words">
        {children}
      </pre>
    </div>
  );
}

function FlowChart({ steps, direction = "horizontal" }) {
  const isVertical = direction === "vertical";
  return (
    <div
      className={`flex ${isVertical ? "flex-col items-center" : "flex-row flex-wrap items-center justify-center"} gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-5 my-3`}
    >
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <span
            className={`${isVertical ? "w-full text-center" : "whitespace-nowrap"} rounded-lg bg-gray-900 dark:bg-white/10 px-3.5 py-2 font-mono text-xs sm:text-sm font-bold text-white dark:text-gray-100 leading-snug`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <span
              className={`text-xl text-gray-300 dark:text-gray-600 flex-shrink-0 ${isVertical ? "my-1" : ""}`}
            >
              {isVertical ? "↓" : "→"}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Callout({ icon, label, color, children }) {
  return (
    <div
      className={`rounded-xl border ${color.border} ${color.bg} px-5 py-4 my-4`}
    >
      <p
        className={`mb-1.5 font-mono text-xs font-bold uppercase tracking-widest ${color.text}`}
      >
        {icon} {label}
      </p>
      <div className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

function WrongRight({ wrong, right }) {
  return (
    <div className="flex flex-col gap-3 my-4">
      <div className="rounded-xl border border-red-200 dark:border-red-500/25 bg-red-50 dark:bg-red-500/10 px-5 py-4 text-base sm:text-lg leading-relaxed text-red-700 dark:text-red-300">
        ❌ {wrong}
      </div>
      <div className="rounded-xl border border-green-200 dark:border-green-500/25 bg-green-50 dark:bg-green-500/10 px-5 py-4 text-base sm:text-lg leading-relaxed text-green-700 dark:text-green-300">
        ✅ {right}
      </div>
    </div>
  );
}

function TwoCol({ left, right }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
      <div className="rounded-lg bg-white dark:bg-white/5 px-4 py-3.5 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
        {left}
      </div>
      <div className="rounded-lg bg-white dark:bg-white/5 px-4 py-3.5 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
        {right}
      </div>
    </div>
  );
}

function Section({ number, title, category, isLast, children }) {
  const c = CATEGORIES[category];
  const num = String(number).padStart(2, "0");
  return (
    <div className="flex gap-3 sm:gap-4 print:break-inside-avoid">
      <div className="flex-none w-9 sm:w-10 flex flex-col items-center">
        <span
          className={`flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs sm:text-sm font-bold ${c.badge}`}
        >
          {num}
        </span>
        {!isLast && (
          <span className="flex-1 w-0.5 mt-1 bg-gray-200 dark:bg-white/10" />
        )}
      </div>
      <section
        className={`flex-1 min-w-0 mb-7 rounded-2xl border ${c.ring} ${c.bg} border-t-4 ${c.top} p-5 sm:p-7`}
      >
        <h2 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug mb-5">
          {title}
        </h2>
        <div className="flex flex-col gap-4">{children}</div>
      </section>
    </div>
  );
}

function RevisionPanel({ title, className = "", children }) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] p-5 sm:p-8 mb-6 print:break-inside-avoid ${className}`}
    >
      {title && (
        <h3 className="font-mono text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white mb-5">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

/* ---------- main component ---------- */

function React1() {
  const [progress, setProgress] = useState(0);
  const [celebration, setCelebration] = useState(false);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollTop = h.scrollTop || document.body.scrollTop;
      const scrollHeight =
        (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);

      setShowTopArrow(scrollTop > 200);
      setShowBottomArrow(scrollTop > 200 && scrollTop < scrollHeight - 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!celebration) return;
    const handleKey = () => setCelebration(false);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [celebration]);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerCelebration = () => {
    setCelebration(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      {/* scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-blue-500 z-50 print:hidden transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* floating scroll arrows */}
      {showTopArrow && (
        <button
          onClick={scrollToBottom}
          className="fixed top-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-all"
          title="Go to bottom"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
      )}

      {showBottomArrow && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-500 transition-all"
          title="Go to top"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      )}

      {/* celebration overlay */}
      {celebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center print:hidden cursor-pointer"
          onClick={() => setCelebration(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-center px-6 py-8">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono mb-3 tracking-tight">
              React Mastered!
            </h2>
            <p className="text-lg sm:text-xl text-white/80 font-mono mb-4">
              Components → Rendering → Reconciliation → Effects → Optimization
            </p>
            <p className="text-base text-white/60 font-mono">
              You understand the system now.
            </p>
            <div className="mt-6 flex justify-center gap-4 text-3xl">
              <span
                className="animate-bounce"
                style={{ animationDelay: "0ms" }}
              >
                ⚛️
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "200ms" }}
              >
                🎊
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "400ms" }}
              >
                ✨
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "600ms" }}
              >
                🚀
              </span>
              <span
                className="animate-bounce"
                style={{ animationDelay: "800ms" }}
              >
                💪
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-16">
          <div className="flex items-start justify-between gap-4 sm:gap-8 flex-col sm:flex-row">
            <div className="min-w-0 flex-1">
              {/* Back to Blogs button – top left, high visibility */}
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-mono text-sm font-bold px-5 py-2.5 shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all mb-4"
              >
                <span className="text-base">←</span>
                <span className="hidden sm:inline">Back to Blogs</span>
                <span className="sm:hidden">Blogs</span>
              </Link>

              <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                ⚛️ React · First-Principles Handbook
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight font-mono">
                Think Like React
              </h1>
            </div>

            <button
              onClick={() => window.print()}
              className="flex-none flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs font-bold px-4 py-2.5 shadow-md hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors print:hidden mt-1 whitespace-nowrap"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 flex-none"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>

          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-md mb-6 mt-3">
            Twenty-eight concepts. One connected system. Build React in your
            head before writing code.
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-5 border-t border-dashed border-gray-200 dark:border-white/10">
            {Object.values(CATEGORIES).map((c) => (
              <span
                key={c.label}
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-5 sm:px-8 py-12 sm:py-14">
        {/* How to Use This Handbook */}
        <RevisionPanel title="📘 How to Use This Handbook">
          <P>
            Don't read this like documentation. Every section starts with a
            problem, not a definition. Before each "Aha" box, stop and genuinely
            guess the answer. The goal isn't to memorize 28 features - it's to
            build one connected mental model you can simulate in your head
            before writing code.
          </P>
          <div className="mt-4">
            <Label>The Core Ownership Model</Label>
            <div className="rounded-lg bg-white dark:bg-white/5 p-4 border border-gray-200 dark:border-white/10">
              <p className="font-mono text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-bold">Parent</span> owns state
                <br />
                <span className="ml-4">
                  ├─ <span className="font-bold">Child A</span> ← receives props
                  (data flows DOWN)
                </span>
                <br />
                <span className="ml-8">
                  └─ sends requests via callbacks (flows UP)
                </span>
                <br />
                <span className="ml-4">
                  └─ <span className="font-bold">Child B</span>
                </span>
              </p>
            </div>
            <Callout icon="⚠️" label="Rule" color={CALLOUT.trap}>
              The component that owns state controls it. Children can REQUEST a
              change. Children cannot MUTATE the parent's state directly.
            </Callout>
          </div>
          <div className="mt-4">
            <Label>The Master React Flow</Label>
            <FlowChart
              direction="vertical"
              steps={[
                "USER",
                "Browser Event",
                "React Handler",
                "State Update",
                "React Schedules a Render",
                "RENDER (component functions run → JSX)",
                "RECONCILIATION",
                "COMMIT",
                "Browser DOM",
                "EFFECTS",
              ]}
            />
            <P>
              This single loop is the spine of every topic in this handbook.
              Everything you learn will attach to one of these stages.
            </P>
          </div>
        </RevisionPanel>

        {/* Intro */}
        <Section
          number={0}
          title="What React Is Actually Solving"
          category="foundation"
        >
          <div>
            <Label>The Problem</Label>
            <P>
              Before React, developers manually created and mutated DOM nodes to
              keep the screen in sync with changing data. That manual
              bookkeeping doesn't scale.
            </P>
          </div>
          <div>
            <Label>React's Core Idea</Label>
            <P>
              Describe what the UI should look like for the current data, and
              let React figure out how to update the real DOM. Everything else
              in React — state, rendering, reconciliation, effects, hooks —
              exists to make that one idea work reliably.
            </P>
          </div>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            React solves: "Keep the UI in sync with data without manual DOM
            manipulation."
          </Callout>
        </Section>

        {/* 1 */}
        <Section
          number={1}
          title="Components — Dividing UI Responsibility"
          category="foundation"
        >
          <div>
            <Label>The Problem</Label>
            <P>
              If you built an entire UI using plain JavaScript, manually
              creating and updating DOM nodes, every feature touches shared,
              tangled DOM-mutation code. Nobody can reason about "just this
              piece" of the screen.
            </P>
          </div>
          <div>
            <Label>React's Solution</Label>
            <P>
              A component is just a JavaScript function that returns a
              description of UI. React lets you split one big UI problem into
              many small, independently-reasoned-about functions.
            </P>
          </div>
          <FlowChart
            direction="vertical"
            steps={[
              "Application",
              "Tree of Components",
              "App",
              "Navbar / Home / Footer",
            ]}
          />
          <Callout icon="✨" label="Aha" color={CALLOUT.aha}>
            Components are functions that describe UI. They organize the problem
            space.
          </Callout>
        </Section>

        {/* 2 */}
        <Section
          number={2}
          title="JSX — Describing UI, Not Building It"
          category="foundation"
        >
          <div>
            <Label>The Misconception</Label>
            <P>
              JSX is not HTML. JSX is syntax sugar that compiles to plain
              JavaScript calls that build a UI description — an object tree —
              which React later turns into real DOM.
            </P>
          </div>
          <CodeBox>{`<h1>Hi</h1>

Compiles to:

React.createElement('h1', null, 'Hi')

Which is just:

{ type: 'h1', props: { children: 'Hi' } }`}</CodeBox>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.trap}>
            JSX is a JavaScript expression. You can put {} and drop any JS value
            inside it. It's not HTML.
          </Callout>
        </Section>

        {/* 3 */}
        <Section number={3} title="Parent & Child Components" category="mental">
          <div>
            <Label>The Hierarchy</Label>
            <P>
              As an app grows, who is responsible for which piece of the tree —
              and who owns what?
            </P>
          </div>
          <CodeBox>{`App
├── Navbar
├── Home
│   ├── Sidebar
│   └── Feed
└── Footer`}</CodeBox>
          <P>
            Each component owns its own local concerns. A parent can render,
            position, and pass data to its children — but a child never reaches
            sideways or upward into another component's internals.
          </P>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            Components form a hierarchy. Parents control, children obey.
          </Callout>
        </Section>

        {/* 4 */}
        <Section
          number={4}
          title="Props — Data Flowing Down"
          category="foundation"
        >
          <div>
            <Label>What Props Are</Label>
            <P>
              Props are just function arguments. A component is a function;
              props are the inputs. Data flows down. Requests flow up.
            </P>
          </div>
          <CodeBox>{`Parent
  ↓
Child({ title: "Hello" })
  ↓
Child renders "Hello"`}</CodeBox>
          <Callout icon="⚠️" label="Common Confusion" color={CALLOUT.common}>
            Props are read-only from the child's perspective. A child cannot
            reassign its own props — it can only ask its owner (via a callback)
            to change the data that produced them.
          </Callout>
        </Section>

        {/* 5 */}
        <Section number={5} title="State — useState" category="hook">
          <div>
            <Label>The Problem</Label>
            <P>
              A component needs to remember a value between renders. If the
              component function reruns from scratch each time, where should
              that value live?
            </P>
          </div>
          <div>
            <Label>Think First</Label>
            <P>
              If you wrote{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                let count = 0
              </code>{" "}
              inside the component function, and the function runs again on the
              next render — what happens to count?
            </P>
          </div>
          <P>
            It resets to 0. A normal variable dies with the function call. React
            needs to store the value outside the function execution, in React
            itself, and hand it back in on the next call.
          </P>
          <CodeBox>{`Render 1: count = 0 (React stores 0)
  ↓ setCount(1)
Render 2: count = 1 (React hands back 1)
  ↓
Function reruns with it`}</CodeBox>
          <Callout icon="✨" label="Aha" color={CALLOUT.aha}>
            State lives inside React, not inside the component function. The
            function execution is thrown away every render. React's memory of
            state survives.
          </Callout>
        </Section>

        {/* 6 */}
        <Section number={6} title="State Ownership" category="mental">
          <div>
            <Label>The Rule</Label>
            <P>
              Two sibling components both need the same piece of information.
              Who should hold the state?
            </P>
          </div>
          <P>
            State should live where it is needed — but no lower in the tree than
            necessary. If two children need it, it cannot live in either child;
            it must live in their closest common parent.
          </P>
          <CodeBox>{`Parent (owns state)
  / \\
Child A    Child B
(receives data) (receives data + callback)`}</CodeBox>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            Before writing useState anywhere, ask: "Who else in the tree needs
            this value?" That answer decides where state is declared.
          </Callout>
        </Section>

        {/* 7 */}
        <Section
          number={7}
          title="The React Rendering Cycle"
          category="foundation"
        >
          <div>
            <Label>What Actually Happens</Label>
            <P>
              A state update happened. What does React actually do, step by
              step, before pixels change?
            </P>
          </div>
          <FlowChart
            direction="vertical"
            steps={["TRIGGER", "RENDER", "RECONCILE", "COMMIT", "EFFECTS"]}
          />
          <Bullets
            items={[
              "TRIGGER: State, prop, or parent update initiates the cycle",
              "RENDER: Component functions run, produce JSX (pure computation)",
              "RECONCILE: Compare new description to previous one",
              "COMMIT: Apply only the necessary DOM changes",
              "EFFECTS: Run side effects now that DOM reflects new UI",
            ]}
          />
          <Callout icon="⚠️" label="Critical" color={CALLOUT.trap}>
            "Render" never means "touch the DOM." Render means "call functions
            and compute a new UI description." DOM writes only happen in Commit
            — and only for what actually changed.
          </Callout>
        </Section>

        {/* 8 */}
        <Section number={8} title="Why Components Rerender" category="pattern">
          <div>
            <Label>Rerender Triggers</Label>
            <P>
              You only changed state in App. Why did a totally different
              component also run again?
            </P>
          </div>
          <Bullets
            items={[
              "State changes in a component → that component rerenders",
              "Parent rerenders → its children may rerender too",
              "Context value changes → consuming components rerender",
            ]}
          />
          <Callout icon="⚠️" label="Trap" color={CALLOUT.trap}>
            Rerender, remount, and DOM update are three different things. A
            child can rerender (function runs again) with zero DOM changes and
            without ever unmounting.
          </Callout>
        </Section>

        {/* 9 */}
        <Section number={9} title="The Virtual DOM" category="mental">
          <div>
            <Label>Why It Exists</Label>
            <P>
              Why not simply throw away and rebuild the browser DOM on every
              render?
            </P>
          </div>
          <P>
            DOM operations are comparatively expensive; plain JavaScript object
            comparisons are cheap. React computes what's needed in cheap JS
            first.
          </P>
          <CodeBox>{`Old UI description (JS objects)
  ↓
New UI description (JS objects)
  ↓
Compare (fast)
  ↓
Only necessary DOM operations produced`}</CodeBox>
          <Callout icon="⚠️" label="Misconception" color={CALLOUT.common}>
            Not: "the Virtual DOM makes React fast." Rather: DOM operations are
            expensive; JS object comparisons are cheap.
          </Callout>
        </Section>

        {/* 10 */}
        <Section
          number={10}
          title="Reconciliation — Diffing"
          category="foundation"
        >
          <div>
            <Label>How React Decides What Changed</Label>
            <P>
              Given an old tree and a new tree, does React need to recreate
              everything from scratch?
            </P>
          </div>
          <CodeBox>{`Old: App → Header, Button
New: App → Header, Button

Same type, same position?
→ React reuses existing nodes
→ Only updates changed props`}</CodeBox>
          <Callout icon="✨" label="Aha" color={CALLOUT.aha}>
            React matches elements by type and position (and key in lists) to
            decide what's "the same thing, just updated" versus "a new thing
            entirely."
          </Callout>
        </Section>

        {/* 11 */}
        <Section number={11} title="Rerender vs. DOM Update" category="pattern">
          <div>
            <Label>Are They The Same?</Label>
            <P>Does every state update change what the user sees?</P>
          </div>
          <CodeBox>{`Scenario 1:
STATE UPDATE → RERENDER → NEW JSX → 
RECONCILIATION → NO DOM CHANGE
(output was identical)

Scenario 2:
STATE UPDATE → RERENDER → NEW JSX → 
RECONCILIATION → DOM CHANGE
(output actually differed)`}</CodeBox>
          <Callout icon="✨" label="Aha" color={CALLOUT.aha}>
            React can rerender without ever touching the DOM. "Rerender" is a
            JavaScript-only computation; "DOM update" is a separate, conditional
            consequence.
          </Callout>
        </Section>

        {/* 12 */}
        <Section
          number={12}
          title="Internal Working of useState"
          category="hook"
        >
          <div>
            <Label>Where State Actually Lives</Label>
            <P>
              The component function is recreated every render. So where,
              precisely, does React keep the value between calls?
            </P>
          </div>
          <CodeBox>{`Component Function
  ↓ (React calls it THIS render)
  ↓
React associates this call with a stored slot
for this component instance
  ↓
Slot holds current value → returned as [value, setter]
  ↓
setter(newValue) called
  ↓
React updates the slot, schedules re-render`}</CodeBox>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            React keeps a per-component-instance memory (conceptually a list of
            slots, one per hook call, in call order). That's why hooks must be
            called in the same order every render — React is walking that same
            slot list.
          </Callout>
        </Section>

        {/* 13 */}
        <Section number={13} title="Component Communication" category="pattern">
          <div>
            <Label>Two Directions</Label>
            <P>
              A child needs to affect data that its parent owns. How, if it
              cannot touch that state directly?
            </P>
          </div>
          <CodeBox>{`Parent → Child
───────────────
Parent
  │ (props)
  ↓
Child

Child → Parent
───────────────
Parent
  │ (callback)
  ↓
Child
  │ (calls callback())
  ↑
Parent's state changes`}</CodeBox>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            The child does not own the parent's state — it only sends a request.
            The parent decides whether, and how, to act on it.
          </Callout>
        </Section>

        {/* 14 */}
        <Section number={14} title="Lifting State Up" category="pattern">
          <div>
            <Label>The Scenario</Label>
            <P>
              Child A needs a value. Child B also needs it — and needs to know
              when it changes. Where should the state live?
            </P>
          </div>
          <CodeBox>{`Parent (owns shared state)
  / \\
Child A    Child B
(receives data) (receives data + callback)`}</CodeBox>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            "Lifting state up" isn't a special technique — it's just applying
            Ownership once you notice two components need the same data.
          </Callout>
        </Section>

        {/* 15 */}
        <Section number={15} title="Context API" category="hook">
          <div>
            <Label>The Problem</Label>
            <P>
              Data must travel from App down through A → B → C just to reach D,
              and B / C don't even use it ("prop drilling").
            </P>
          </div>
          <CodeBox>{`Without Context:
App(state) → A → B → C → D
(props threaded through every layer)

With Context:
App(state) ──Provider──→ ... ──→ D
(useContext, direct access)`}</CodeBox>
          <Callout icon="⚠️" label="Misconception" color={CALLOUT.common}>
            Context is not global state and does not create state. It only
            changes how data is reached — the state is still owned wherever it
            was declared with useState.
          </Callout>
        </Section>

        {/* 16 */}
        <Section number={16} title="useEffect" category="hook">
          <div>
            <Label>What It Solves</Label>
            <P>
              Some work should happen only because the rendered UI now exists,
              or because a specific value changed — network requests,
              subscriptions, timers, DOM measurements.
            </P>
          </div>
          <FlowChart
            direction="vertical"
            steps={["RENDER", "COMMIT", "EFFECT"]}
          />
          <P>
            Rendering must stay a pure calculation (input → UI description). So
            where does "impure," outside-world work belong? After the commit.
          </P>
          <Callout icon="✨" label="Aha" color={CALLOUT.aha}>
            useEffect isn't "component lifecycle." It's synchronization: after
            the DOM is committed, React runs code that keeps something external
            in sync with the latest render's data (its dependencies).
          </Callout>
        </Section>

        {/* 17 */}
        <Section number={17} title="useRef" category="hook">
          <div>
            <Label>The Unique Behavior</Label>
            <P>
              What if a value must persist across renders, but changing it
              should NOT cause a rerender?
            </P>
          </div>

          <CodeBox>{`useState  → Changing the value triggers a rerender
useRef    → No rerender — silent mutation
useRef    → Persists across renders like state`}</CodeBox>

          <P>
            A ref is a React-managed persistent box:{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {"{ current: value }"}
            </code>
            . Also used to hold direct references to real DOM nodes.
          </P>

          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            Ref = persistent, no rerender. Good for DOM references, timer IDs,
            previous values.
          </Callout>
        </Section>

        {/* 18 */}
        <Section number={18} title="Custom Hooks" category="hook">
          <div>
            <Label>Sharing Logic</Label>
            <P>
              Two unrelated components both need the same stateful behavior
              (e.g. tracking window width). Copy-pasting the logic duplicates
              bugs.
            </P>
          </div>
          <CodeBox>{`Component A ─┐
             ├── useWindowWidth() ← shared logic
Component B ─┘     (NOT shared UI)

Each caller gets its own
independent state`}</CodeBox>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            A custom hook is just a function that calls other hooks. It shares
            behavior; each caller still gets its own independent state.
          </Callout>
        </Section>

        {/* 19 */}
        <Section number={19} title="React Router" category="pattern">
          <div>
            <Label>Client-Side Navigation</Label>
            <P>
              How can an app show different "pages" without a full browser
              reload each time?
            </P>
          </div>
          <FlowChart
            direction="vertical"
            steps={["URL", "Router", "Route Match", "Component Tree renders"]}
          />
          <Callout icon="⚠️" label="Trap" color={CALLOUT.trap}>
            Router controls navigation. It is not your general application state
            manager — it just decides which component tree matches the current
            URL.
          </Callout>
        </Section>

        {/* 20 */}
        <Section number={20} title="Link vs a" category="pattern">
          <div>
            <Label>The Difference</Label>
            <P>
              Why does clicking an{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                &lt;a&gt;
              </code>{" "}
              feel different from clicking a{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                &lt;Link&gt;
              </code>
              ?
            </P>
          </div>
          <CodeBox>{`<a href="/x">
  ↓
Browser controls navigation
  ↓
Full page reload
  ↓
React app restarts

<Link to="/x">
  ↓
React Router intercepts click
  ↓
URL updates, no reload
  ↓
React stays alive`}</CodeBox>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.trap}>
            A full reload via{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              &lt;a&gt;
            </code>{" "}
            destroys all in-memory React state — the entire JS runtime restarts,
            not just one component.
          </Callout>
        </Section>

        {/* 21 */}
        <Section
          number={21}
          title="Mounting & Unmounting"
          category="foundation"
        >
          <div>
            <Label>Disappearing Components</Label>
            <P>
              What does it actually mean for a component to "disappear" from the
              screen?
            </P>
          </div>
          <CodeBox>{`RERENDER (same component identity)
  → STATE SURVIVES

UNMOUNT (component removed from tree)
  → STATE IS DESTROYED

REFRESH (entire JS app restarts)
  → ALL React state is lost`}</CodeBox>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.trap}>
            Rerender ≠ Remount. A component can rerender a thousand times and
            keep the same state; the moment it's removed from the tree (even
            briefly), that state is gone for good.
          </Callout>
        </Section>

        {/* 22 */}
        <Section
          number={22}
          title="Controlled Components — Forms"
          category="pattern"
        >
          <div>
            <Label>Who Owns the Input Value</Label>
            <P>
              Who should know the current value of an input: the browser's
              native DOM, or React's state?
            </P>
          </div>
          <CodeBox>{`React State ──value──→ <input>
               ↑
User types ──browser event──→ React handler
                ↓
               setState
                ↓
              Render
                ↓
           input value updates`}</CodeBox>
          <P>
            In a controlled component, React owns the value. The input never
            manages its own truth — it only displays whatever React's state
            currently says.
          </P>
        </Section>

        {/* 23 */}
        <Section
          number={23}
          title="Browser vs. React Ownership"
          category="mental"
        >
          <div>
            <Label>Drawing The Line</Label>
            <P>What belongs to the browser, and what belongs to React?</P>
          </div>
          <TwoCol
            left={
              <span className="font-bold">
                React owns:
                <br />
                <br />• component tree
                <br />• state
                <br />• props
                <br />• rendering decisions
                <br />• reconciliation
              </span>
            }
            right={
              <span className="font-bold">
                Browser owns:
                <br />
                <br />• actual DOM nodes
                <br />• native events
                <br />• native input mechanics
                <br />• URL/navigation (with &lt;a&gt;)
              </span>
            }
          />
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            Browser reports events. React decides the UI. Neither side silently
            reaches into the other's territory.
          </Callout>
        </Section>

        {/* 24 */}
        <Section number={24} title="Form Submission" category="pattern">
          <div>
            <Label>The Default Behavior</Label>
            <P>What does the browser do by default when a form is submitted?</P>
          </div>
          <CodeBox>{`Native default:
  form submit → browser sends request
  → full page navigation/reload

That default predates React entirely,
and would blow away all component state`}</CodeBox>
        </Section>

        {/* 25 */}
        <Section number={25} title="preventDefault()" category="pattern">
          <div>
            <Label>Intercepting the Default</Label>
            <P>
              The browser has a built-in default action for this event. How does
              React stop it and take control?
            </P>
          </div>
          <CodeBox>{`Submit
  ↓
Browser event fires
  ↓
React handler runs
  ↓
event.preventDefault()
  ↓
Browser's default action is stopped
  ↓
React stays in control`}</CodeBox>
          <Callout icon="🧠" label="Remember" color={CALLOUT.aha}>
            The browser always fires the event first. React never "blocks" the
            event — it only cancels the browser's follow-up default behavior.
          </Callout>
        </Section>

        {/* 26 */}
        <Section number={26} title="React.memo" category="advanced">
          <div>
            <Label>When to Optimize</Label>
            <P>
              A parent rerenders. A child receives the exact same props as last
              time. Does it need to run again?
            </P>
          </div>
          <P>
            By default, yes — a parent rerender reruns children regardless of
            whether their props changed. React.memo lets React compare new props
            to old props and skip re-running the child if they're the same.
          </P>
          <Callout icon="⚠️" label="Misconception" color={CALLOUT.common}>
            This is a performance optimization, not a correctness feature — a
            non-memoized child still renders correct output, just possibly more
            often than strictly needed.
          </Callout>
        </Section>

        {/* 27 */}
        <Section number={27} title="useCallback" category="advanced">
          <div>
            <Label>Function Identity Matters</Label>
            <P>
              Functions declared inside a component are recreated on every call
              of that function.
            </P>
          </div>
          <CodeBox>{`Render 1: handleClick → Function A (new object)
Render 2: handleClick → Function B (different object,
                        same logic)`}</CodeBox>
          <P>
            Even identical-looking functions are new references each render. If
            that function is passed as a prop to a React.memo child, the "props
            changed" check fails every time — memoization is defeated.
            useCallback remembers the function identity across renders.
          </P>
          <Callout icon="⚠️" label="Trap" color={CALLOUT.trap}>
            useCallback does not make a tiny function "faster" to create. It
            matters purely because of identity — for dependency arrays and
            memoized children, not raw speed.
          </Callout>
        </Section>

        {/* 28 */}
        <Section number={28} title="useMemo" category="advanced" isLast>
          <div>
            <Label>Memoizing Calculations</Label>
            <P>
              An expensive calculation reruns on every render, even when the
              values it depends on haven't changed.
            </P>
          </div>
          <CodeBox>{`Render → recompute expensive value
  → remember it
  → reuse until dependencies change`}</CodeBox>
          <TwoCol
            left={
              <span>
                <strong>useState</strong>
                <br />
                State that participates
                <br />
                in rendering
              </span>
            }
            right={
              <span>
                <strong>useRef</strong>
                <br />
                Persistent value that
                <br />
                does not trigger rendering
              </span>
            }
          />
          <TwoCol
            left={
              <span>
                <strong>useMemo</strong>
                <br />A calculated value
              </span>
            }
            right={
              <span>
                <strong>useCallback</strong>
                <br />A function's identity
              </span>
            }
          />
          <Callout icon="⚠️" label="Trap" color={CALLOUT.trap}>
            None of these are automatically "good." Each solves one specific,
            provable problem. Reach for them once that problem is observed — not
            by default.
          </Callout>
        </Section>

        {/* Master Revision */}
        <RevisionPanel title="⭐ The Complete Mental Model">
          <P>Not 28 separate features — one connected machine.</P>
          <FlowChart
            direction="vertical"
            steps={[
              "USER EVENT",
              "REACT HANDLER",
              "STATE UPDATE",
              "RENDER",
              "RECONCILE",
              "COMMIT",
              "DOM UPDATE",
              "EFFECTS",
            ]}
          />
          <div className="mt-6 bg-white dark:bg-white/5 p-5 rounded-xl">
            <Label>The Flow</Label>
            <Bullets
              items={[
                "Props: data flows downward",
                "Callbacks: requests flow upward",
                "State: owned by React, survives rerenders",
                "Context: shares access to data (not a state store)",
                "Ref: persistent value, no rerender",
                "Router: controls client-side navigation",
                "React.memo: remembers a component's render-relevant prop identity",
                "useCallback: remembers function identity",
                "useMemo: remembers a calculated value",
              ]}
            />
          </div>
        </RevisionPanel>

        {/* If You Remember Only One Thing */}
        <RevisionPanel title="🎯 If You Remember Only One Thing">
          <Bullets
            items={[
              "Components are functions. Functions rerun. React remembers state outside those function executions — state survives rerenders.",
              "Unmounting destroys component state. Refreshing destroys the entire React runtime's state.",
              "Props move data downward. Callbacks allow requests upward. The owner controls the state.",
              "A rerender does not necessarily mean a DOM update. React computes a new UI description and reconciles it against the previous one — DOM writes happen only if the result actually changed.",
              "Browser events come from the browser. React decides what the UI should become.",
              "Context shares data; it does not create state. Router controls navigation; it is not your application state.",
              "Render → Commit → Effects — in that order, every time.",
              "React.memo remembers component-relevant rendering decisions. useCallback remembers function identity. useMemo remembers calculated values.",
            ]}
          />
        </RevisionPanel>

        {/* Interview Checklist */}
        <RevisionPanel title="⚡ Interview Checklist">
          <div className="space-y-3">
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                1. Who owns the data?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Identify state ownership before designing the component tree.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                2. Who can change it?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Only the owner can mutate — children can request.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                3. What triggered the render?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                State change, prop change, parent render, or context change?
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                4. Did the component rerender?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Function ran again? Or did React skip it?
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                5. Did the component remount?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Was it removed from the tree and re-inserted?
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                6. Did the DOM actually change?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Reconciliation might find zero changes.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                7. What survives the render?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                State, refs, and DOM nodes persist across rerenders.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                8. What gets destroyed on unmount?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                All component state and local refs are gone.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                9. Is React or the browser controlling this?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Who owns the behavior?
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2">
                10. Is this feature solving a real, observed problem?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Memoization, refs, and callbacks are tools — not defaults.
              </p>
            </div>
          </div>
        </RevisionPanel>

        {/* Mini Interview Thinking Questions */}
        <RevisionPanel title="🧠 Mini Interview Thinking Questions">
          <div className="space-y-4">
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q1: If a parent rerenders, does the child always update the DOM?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                No. The child function runs again, but reconciliation may find
                identical output — no DOM write occurs.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q2: If a component rerenders, does its state disappear?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                No. Rerendering keeps the same component identity, so React's
                stored state for it survives untouched.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q3: Why can a child call a parent's callback but not directly
                change the parent's state?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Ownership. The parent's useState slot belongs to the parent's
                function instance — a child has no reference to mutate it, only
                a function reference to request a change.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q4: Why does &lt;Link&gt; behave differently from &lt;a&gt;?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                &lt;a&gt; hands navigation to the browser (full reload, state
                lost). &lt;Link&gt; is intercepted by React Router, which
                updates the URL while React — and all its state — stays alive.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q5: Why would useRef be preferable to useState for some values?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                When a value must persist but changing it shouldn't cause a
                rerender (e.g. a timer ID, a DOM node reference, a
                previous-value cache).
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q6: Why does React.memo sometimes provide no benefit?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                If the props passed in aren't referentially stable (new
                object/array/function every render), the props-equality check
                always fails, so memoization never skips anything.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q7: Why can useCallback matter even when the function itself is
                tiny?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Because what matters is identity, not execution cost — a new
                function reference each render breaks memoized children and
                effect dependency arrays regardless of how small the function
                is.
              </p>
            </div>
            <div className="bg-white dark:bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-sm mb-2 text-gray-900 dark:text-white">
                Q8: Does changing state always mean React changes the DOM?
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                No. State change guarantees a render (a recomputation), not a
                DOM write. The DOM only changes if reconciliation finds an
                actual difference.
              </p>
            </div>
          </div>
        </RevisionPanel>

        {/* Final Word */}
        <RevisionPanel title="🏁 Final Word">
          <P>
            Don't memorize React. Build React in your head. Once you know who
            owns the data, what triggers a render, what React remembers, what
            gets destroyed, and what the browser controls versus what React
            controls — React stops feeling like a collection of mysterious hooks
            and becomes a predictable system. Understand the chain → understand
            React.
          </P>
        </RevisionPanel>

        {/* End */}
        <section className="rounded-2xl bg-gray-900 dark:bg-white/5 p-6 sm:p-9 text-white border border-white/10 mb-6 print:break-inside-avoid">
          <h2 className="font-mono text-xl sm:text-2xl font-extrabold mb-2">
            React Fundamentals Complete
          </h2>
          <p className="text-white/70 text-base sm:text-lg mb-4">
            You've built React in your head. You understand who owns data, what
            triggers renders, what gets destroyed, and what the browser controls
            versus what React controls. React stops feeling like a collection of
            mysterious hooks and becomes a predictable system.
          </p>
          <p className="text-white/70 text-base sm:text-lg mb-6">
            <strong className="text-white">Next phase:</strong> Practice
            building components → Master hooks patterns → Real-world scenarios.
          </p>
          <button
            onClick={triggerCelebration}
            className="inline-flex items-center gap-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-mono text-sm sm:text-base font-bold px-8 py-4 shadow-lg transition-colors print:hidden"
          >
            <span className="text-xl">⚛️</span>
            Mark as Complete
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </section>
      </main>

      <style>{`
        @media print {
          @page { margin: 16mm 14mm; }
          body { background: #fff !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
}

export default React1;
