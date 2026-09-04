import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from '../../UI/Footer';

const CONCEPTS = [
  {
    id: 1,
    section: "Day 3",
    name: "Why OOP for LLD?",
    hue: "indigo",
    icon: "🧠",
    description: "OOP ≠ syntax. It's turning requirements into interacting objects with clear state + behavior + responsibilities.",
    content: `Requirement
    ↓
What THINGS exist?
    ↓
Candidate OBJECTS
    ↓
What does each object KNOW?
    ↓
What can each object DO?
    ↓
What RULES does it own?
    ↓
RESPONSIBILITIES
    ↓
How do objects RELATE?
    ↓
Design`,
    diagram: "Requirement → Objects → State/Behavior → Responsibilities → Relationships",
    keypoint: "OOP for LLD is about responsibility-driven design."
  },
  {
    id: 2,
    section: "Day 3",
    name: "Class & Object",
    hue: "blue",
    icon: "🏗️",
    description: "Class = blueprint. Object = actual instance.",
    content: `C++:
class Car {
public:
    string brand;
    void drive() { cout << "Driving"; }
};

Car car1;   // object
Car car2;   // object`,
    diagram: "CLASS (Car) → car1, car2 (objects)",
    keypoint: "Classes define structure; objects hold state."
  },
  {
    id: 3,
    section: "Day 3",
    name: "Object → Responsibility",
    hue: "cyan",
    icon: "🎯",
    description: "The most important LLD skill: assign responsibilities based on what the object knows and does.",
    content: `OBJECT
  ↓
KNOWS (state) + DOES (actions) + RULES (validity)
  ↓
RESPONSIBILITY

Example: Order
KNOWS: orderId, customerId, items, status
DOES: changeStatus, cancel, complete
RESPONSIBLE FOR: maintaining valid order lifecycle`,
    diagram: "KNOWS → DOES → RULES → RESPONSIBILITY",
    keypoint: "Who naturally has the information to perform the responsibility?"
  },
  {
    id: 4,
    section: "Day 3",
    name: "Encapsulation",
    hue: "teal",
    icon: "🔒",
    description: "Protect internal state and control how it changes.",
    content: `C++:
class BankAccount {
private:
    double balance = 0;
public:
    void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    double getBalance() const { return balance; }
};`,
    diagram: "Object owns state → controls access → enforces rules",
    keypoint: "Protect the inside; control how it changes."
  },
  {
    id: 5,
    section: "Day 3",
    name: "Abstraction",
    hue: "emerald",
    icon: "🧠",
    description: "Hide unnecessary complexity; expose only what the outside needs.",
    content: `C++:
class Payment {
public:
    void pay() {
        validate(); process(); sendReceipt();
    }
private:
    void validate() { /* ... */ }
    void process() { /* ... */ }
    void sendReceipt() { /* ... */ }
};`,
    diagram: "Complex implementation hidden → expose essential behavior",
    keypoint: "Abstraction = what to show; encapsulation = how to protect."
  },
  {
    id: 6,
    section: "Day 3",
    name: "Inheritance",
    hue: "lime",
    icon: "🌳",
    description: "Specialized class extends a general class (IS-A relationship).",
    content: `C++:
class Vehicle {
public:
    void start() { cout << "Starting"; }
};
class Car : public Vehicle {
public:
    void openTrunk() { cout << "Trunk opened"; }
};`,
    diagram: "Vehicle ← Car (IS-A)",
    keypoint: "Use inheritance for genuine IS‑A, not just code reuse."
  },
  {
    id: 7,
    section: "Day 3",
    name: "Polymorphism",
    hue: "rose",
    icon: "🔥",
    description: "Same contract, different implementations.",
    content: `C++:
class Payment {
public:
    virtual void pay() = 0;
    virtual ~Payment() = default;
};
class UPI : public Payment {
    void pay() override { cout << "UPI payment"; }
};`,
    diagram: "Payment (contract) → UPI, Card, Wallet (different behaviors)",
    keypoint: "Polymorphism = same interface, different runtime behavior."
  },
  {
    id: 8,
    section: "Day 3",
    name: "Association",
    hue: "orange",
    icon: "🔗",
    description: "Two objects have a meaningful relationship or interaction.",
    content: `Example:
Doctor ───── Patient

C++ concept:
class Doctor {
private:
    Patient* patient;
};`,
    diagram: "Doctor ↔ Patient (related/interacts)",
    keypoint: "Association = related to / interacts with."
  },
  {
    id: 9,
    section: "Day 3",
    name: "Aggregation",
    hue: "amber",
    icon: "🧩",
    description: "HAS‑A or groups, but the contained can exist independently.",
    content: `Team ◇──── Player
Team destroyed → players can still exist

C++:
class Team {
private:
    vector<Player*> players;
};`,
    diagram: "Team ◇── Player (independent lifecycle)",
    keypoint: "Aggregation = HAS‑A + independent lifecycle."
  },
  {
    id: 10,
    section: "Day 3",
    name: "Composition",
    hue: "red",
    icon: "💥",
    description: "Strong ownership; lifecycle of contained is tied to owner.",
    content: `House
  ◆──── Room
House disappears → rooms don't exist meaningfully without it

C++:
class House {
private:
    Room room1;
    Room room2;
};`,
    diagram: "House ◆── Room (tied lifecycle)",
    keypoint: "Composition = OWNS‑A + lifecycle dependency."
  },
  {
    id: 11,
    section: "Day 3",
    name: "Dependency",
    hue: "fuchsia",
    icon: "⚡",
    description: "A temporarily uses B to perform work.",
    content: `A ───── uses ─────→ B

Example:
ReportGenerator uses Printer

C++:
class ReportGenerator {
public:
    void generate(Printer& printer);
};`,
    diagram: "A → uses → B (temporary)",
    keypoint: "Dependency = temporarily relies on another."
  },
  {
    id: 12,
    section: "Day 3",
    name: "Interface",
    hue: "purple",
    icon: "🔌",
    description: "Contract defining required behavior (WHAT, not HOW).",
    content: `C++ representation (abstract class with pure virtual):
class Payment {
public:
    virtual void pay() = 0;
    virtual ~Payment() = default;
};`,
    diagram: "Interface → pay() → implemented by UPI, Card, Wallet",
    keypoint: "Interface = contract for behavior."
  },
  {
    id: 13,
    section: "Day 3",
    name: "Abstract Class",
    hue: "violet",
    icon: "🧱",
    description: "Common base with shared state/behavior, leaving some methods to subclasses.",
    content: `C++:
class Vehicle {
public:
    virtual void move() = 0;   // pure virtual
    void start() { cout << "Starting"; }
    virtual ~Vehicle() = default;
};`,
    diagram: "Vehicle (abstract) ← Car, Bike",
    keypoint: "Abstract class = common base + shared implementation."
  },
  {
    id: 14,
    section: "Day 3",
    name: "Interface vs Abstract Class",
    hue: "sky",
    icon: "⚖️",
    description: "Interface = contract; Abstract class = common base.",
    content: `INTERFACE
→ Contract / capability
→ WHAT must be provided

ABSTRACT CLASS
→ Common base
→ Shared state/behavior possible
→ WHAT is common + WHAT must vary`,
    diagram: "Interface = WHAT; Abstract = common + variation",
    keypoint: "Use interface for capability; abstract class for shared foundation."
  },
  {
    id: 15,
    section: "Day 3",
    name: "Composition vs Inheritance",
    hue: "indigo",
    icon: "⚔️",
    description: "IS‑A vs HAS‑A. Prefer composition over inheritance.",
    content: `Inheritance (IS‑A):
Vehicle ← Car

Composition (HAS‑A):
Car
 └── Engine`,
    diagram: "Inheritance = specialization; Composition = assembly",
    keypoint: "Prefer composition for flexibility; inheritance for true specialization."
  },
  {
    id: 16,
    section: "Day 3",
    name: "Relationship Cheat Sheet",
    hue: "teal",
    icon: "📋",
    description: "Quick reference for object relationships.",
    content: `Association → Related to / interacts with
Aggregation → HAS‑A / groups (independent lifecycle)
Composition → Strong HAS‑A / owns (tied lifecycle)
Dependency → Temporarily uses`,
    diagram: "Association ↔ Aggregation ◇ Composition ◆ Dependency →",
    keypoint: "Know the differences: strength and lifecycle."
  },
  {
    id: 17,
    section: "Day 3",
    name: "The Complete Object-Thinking Machine",
    hue: "emerald",
    icon: "🧠",
    description: "Full mental flow for LLD design.",
    content: `REQUIREMENT
  ↓
What THINGS exist? → OBJECTS
  ↓
KNOWS (state) + DOES (behavior) + RULES
  ↓
RESPONSIBILITY
  ↓
Who naturally owns it? → RELATIONSHIPS
  ↓
Need abstraction? → Interface / Abstract Class
  ↓
Different implementations? → Polymorphism
  ↓
Genuine IS‑A? → Inheritance`,
    diagram: "Requirement → Objects → State/Behavior → Responsibilities → Relationships → Abstraction → Polymorphism → Inheritance",
    keypoint: "This is the LLD design flow."
  },
  {
    id: 18,
    section: "Day 3",
    name: "When You Go Blank About Responsibilities",
    hue: "amber",
    icon: "👀",
    description: "Ask these questions to assign responsibilities.",
    content: `OBJECT
  ↓
What does it KNOW?
  ↓
What can it DO?
  ↓
What RULES must remain valid?
  ↓
What does it OWN?
  ↓
What responsibility naturally follows?

Examples: Create, Validate, Calculate, Maintain state, Change state, Enforce rules, Find/retrieve, Coordinate, Perform operation.`,
    diagram: "KNOWS → DOES → RULES → OWN → RESPONSIBILITY",
    keypoint: "Which object has the information needed?"
  },
  {
    id: 19,
    section: "Day 3",
    name: "Class in 2 Lines",
    hue: "rose",
    icon: "❤️‍🔥",
    description: "Class = meaningful entity/responsibility.",
    content: `CLASS
→ Represents a meaningful entity/responsibility.

CLASS contains:
→ STATE it owns
→ BEHAVIOR it is responsible for`,
    diagram: "Class = State + Behavior",
    keypoint: "Keep it simple."
  },
  {
    id: 20,
    section: "Day 3",
    name: "Final LLD Mindset",
    hue: "fuchsia",
    icon: "🚀",
    description: "Don't ask 'which classes?' Ask 'what things exist?'",
    content: `What things exist?
  ↓
What does each one know?
  ↓
What does each one do?
  ↓
What rules does each own?
  ↓
Which object naturally owns this responsibility?
  ↓
How are they related?
  ↓
Do I need abstraction?
  ↓
Do I need a common contract?
  ↓
Do different implementations behave differently?
  ↓
Is there a genuine IS‑A?
  ↓
Inheritance or Composition?`,
    diagram: "Things → Knows → Does → Rules → Responsibility → Relationships → Abstraction → Contract → Polymorphism → IS‑A → Decision",
    keypoint: "Always start with the things and their responsibilities."
  },
  {
    id: 21,
    section: "Day 3",
    name: "Day 3 — One-Glance Recall",
    hue: "indigo",
    icon: "🔥",
    description: "The entire Day 3 in one flow.",
    content: `CLASS → OBJECT → KNOWS+DOES+RULES → RESPONSIBILITY → ENCAPSULATION → ABSTRACTION → RELATIONSHIPS (Association, Aggregation, Composition, Dependency) → INTERFACE → ABSTRACT CLASS → POLYMORPHISM → INHERITANCE → COMPOSITION vs INHERITANCE → OBJECT-THINKING FRAMEWORK`,
    diagram: "Class → Object → Responsibility → Encapsulation → Abstraction → Relationships → Interface → Abstract → Polymorphism → Inheritance → Composition vs Inheritance",
    keypoint: "This is the complete mental model."
  }
];

const HUE_MAP = {
  blue: { border: "border-blue-200 dark:border-blue-500/25", bg: "bg-blue-50/70 dark:bg-blue-500/[0.06]", text: "text-blue-600 dark:text-blue-300", badge: "bg-blue-500", accent: "text-blue-500 dark:text-blue-400" },
  cyan: { border: "border-cyan-200 dark:border-cyan-500/25", bg: "bg-cyan-50/70 dark:bg-cyan-500/[0.06]", text: "text-cyan-600 dark:text-cyan-300", badge: "bg-cyan-500", accent: "text-cyan-500 dark:text-cyan-400" },
  teal: { border: "border-teal-200 dark:border-teal-500/25", bg: "bg-teal-50/70 dark:bg-teal-500/[0.06]", text: "text-teal-600 dark:text-teal-300", badge: "bg-teal-500", accent: "text-teal-500 dark:text-teal-400" },
  emerald: { border: "border-emerald-200 dark:border-emerald-500/25", bg: "bg-emerald-50/70 dark:bg-emerald-500/[0.06]", text: "text-emerald-600 dark:text-emerald-300", badge: "bg-emerald-500", accent: "text-emerald-500 dark:text-emerald-400" },
  lime: { border: "border-lime-200 dark:border-lime-500/25", bg: "bg-lime-50/70 dark:bg-lime-500/[0.06]", text: "text-lime-700 dark:text-lime-300", badge: "bg-lime-500", accent: "text-lime-600 dark:text-lime-400" },
  green: { border: "border-green-200 dark:border-green-500/25", bg: "bg-green-50/70 dark:bg-green-500/[0.06]", text: "text-green-600 dark:text-green-300", badge: "bg-green-500", accent: "text-green-500 dark:text-green-400" },
  sky: { border: "border-sky-200 dark:border-sky-500/25", bg: "bg-sky-50/70 dark:bg-sky-500/[0.06]", text: "text-sky-600 dark:text-sky-300", badge: "bg-sky-500", accent: "text-sky-500 dark:text-sky-400" },
  indigo: { border: "border-indigo-200 dark:border-indigo-500/25", bg: "bg-indigo-50/70 dark:bg-indigo-500/[0.06]", text: "text-indigo-600 dark:text-indigo-300", badge: "bg-indigo-500", accent: "text-indigo-500 dark:text-indigo-400" },
  violet: { border: "border-violet-200 dark:border-violet-500/25", bg: "bg-violet-50/70 dark:bg-violet-500/[0.06]", text: "text-violet-600 dark:text-violet-300", badge: "bg-violet-500", accent: "text-violet-500 dark:text-violet-400" },
  purple: { border: "border-purple-200 dark:border-purple-500/25", bg: "bg-purple-50/70 dark:bg-purple-500/[0.06]", text: "text-purple-600 dark:text-purple-300", badge: "bg-purple-500", accent: "text-purple-500 dark:text-purple-400" },
  pink: { border: "border-pink-200 dark:border-pink-500/25", bg: "bg-pink-50/70 dark:bg-pink-500/[0.06]", text: "text-pink-600 dark:text-pink-300", badge: "bg-pink-500", accent: "text-pink-500 dark:text-pink-400" },
  rose: { border: "border-rose-200 dark:border-rose-500/25", bg: "bg-rose-50/70 dark:bg-rose-500/[0.06]", text: "text-rose-600 dark:text-rose-300", badge: "bg-rose-500", accent: "text-rose-500 dark:text-rose-400" },
  red: { border: "border-red-200 dark:border-red-500/25", bg: "bg-red-50/70 dark:bg-red-500/[0.06]", text: "text-red-600 dark:text-red-300", badge: "bg-red-500", accent: "text-red-500 dark:text-red-400" },
  orange: { border: "border-orange-200 dark:border-orange-500/25", bg: "bg-orange-50/70 dark:bg-orange-500/[0.06]", text: "text-orange-600 dark:text-orange-300", badge: "bg-orange-500", accent: "text-orange-500 dark:text-orange-400" },
  amber: { border: "border-amber-200 dark:border-amber-500/25", bg: "bg-amber-50/70 dark:bg-amber-500/[0.06]", text: "text-amber-600 dark:text-amber-300", badge: "bg-amber-500", accent: "text-amber-500 dark:text-amber-400" },
  fuchsia: { border: "border-fuchsia-200 dark:border-fuchsia-500/25", bg: "bg-fuchsia-50/70 dark:bg-fuchsia-500/[0.06]", text: "text-fuchsia-600 dark:text-fuchsia-300", badge: "bg-fuchsia-500", accent: "text-fuchsia-500 dark:text-fuchsia-400" },
};

function useRevealOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px -10px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function ConceptCard({ concept }) {
  const h = HUE_MAP[concept.hue];
  const [ref, visible] = useRevealOnScroll();

  return (
    <div
      ref={ref}
      className={`rounded-3xl border ${h.border} ${h.bg} p-7 sm:p-9 transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <span
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${h.badge} text-base font-bold text-white shadow-sm`}
          >
            {concept.id}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
            {concept.name}
          </h3>
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {concept.description}
        </p>
      </div>

      {/* Content (code/notes) */}
      <div className="mb-6 rounded-2xl bg-white dark:bg-white/5 px-6 py-5 shadow-sm">
        <pre className="text-base leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm">
          {concept.content}
        </pre>
      </div>

      {/* diagram */}
      {concept.diagram && (
        <pre className="mb-6 overflow-x-auto rounded-xl bg-gray-900 dark:bg-black/40 px-6 py-5 text-sm sm:text-base leading-relaxed text-emerald-300 font-mono">
          {concept.diagram}
        </pre>
      )}

      {/* key takeaway */}
      {concept.keypoint && (
        <div className="flex items-start gap-3 rounded-xl bg-white dark:bg-white/5 px-5 py-4 shadow-sm">
          <span className="text-lg flex-shrink-0">🔑</span>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{concept.keypoint}</p>
        </div>
      )}
    </div>
  );
}

function RevealSection({ children, className = "" }) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <section
      ref={ref}
      className={`transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </section>
  );
}

const SystemDesign2_OOPS = () => {
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
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const concepts = CONCEPTS; // all are Day 3

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* scroll progress */}
      <div className="fixed top-0 left-0 h-[3px] bg-indigo-500 z-50 print:hidden" style={{ width: `${progress}%` }} />

      {/* floating scroll arrows */}
      {showTopArrow && (
        <button
          onClick={scrollToBottom}
          className="fixed top-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all"
          title="Go to bottom"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
      )}

      {showBottomArrow && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-500 transition-all"
          title="Go to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Page header */}
      <div className="w-full border-b border-gray-100 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14 flex items-start justify-between gap-6">
          <div>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-sm font-bold px-5 py-2.5 shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all mb-6"
            >
              <span className="text-base">←</span>
              <span className="hidden sm:inline">Back to Blogs</span>
              <span className="sm:hidden">Blogs</span>
            </Link>

            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
              🧠 Object Oriented Programming
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              OOP + Object Thinking
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
              Day 3 — LLD Master Revision Sheet
            </p>
          </div>
          {/* Optional download if you have a PDF; we can skip or keep generic */}
          <a
            href="#"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-5 py-3 text-sm sm:text-base font-bold text-white dark:text-gray-900 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <Download size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-16">
        {/* Intro */}
        <RevealSection className="mb-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 sm:p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-3">
            The core principle
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6">
            Turn requirements into interacting objects.
          </h2>
          <p className="text-lg text-white/90 font-semibold">
            OOP for LLD is about responsibility-driven design — identify things, their state, behavior, rules, relationships, and abstractions.
          </p>
        </RevealSection>

        {/* All concepts */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 3: OOP + Object Thinking
          </h2>
          <div className="flex flex-col gap-10">
            {concepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} />
            ))}
          </div>
        </RevealSection>

        {/* Final Recap */}
        <RevealSection className="mt-16 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-500/30 bg-orange-50/40 dark:bg-orange-500/[0.04] p-8 sm:p-10 mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">🧭</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              The LLD Mindset
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
              Requirement → Things → KNOWS + DOES + RULES → Responsibility → Relationships → Abstraction → Polymorphism → Inheritance/Composition
            </p>
            <div className="bg-gray-100 dark:bg-black/30 p-4 rounded-lg">
              <p className="font-bold text-gray-900 dark:text-white mb-2">Always ask:</p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Which object has the information needed for this responsibility?</li>
                <li>Is this a genuine IS‑A or a HAS‑A?</li>
                <li>What contract should implementations follow?</li>
                <li>What are the trade‑offs?</li>
              </ul>
            </div>
          </div>
        </RevealSection>

        {/* Golden Rule */}
        <RevealSection className="rounded-3xl bg-gray-900 dark:bg-white/5 p-10 sm:p-14 text-white border border-white/10 text-center">
          <span className="text-4xl">❤️‍🔥</span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">The Golden Rule</h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed">
            Don't ask "which classes?" — ask <span className="font-bold text-white">"what things exist, what do they know, what do they do, and what rules do they own?"</span>
          </p>
          <p className="mt-8 text-base font-bold tracking-wide text-white/70">
            Responsibilities drive the design.
          </p>
        </RevealSection>
      </main>

      <Footer />
    </div>
  );
};

export default SystemDesign2_OOPS;