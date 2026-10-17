import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import Footer from '../../UI/Footer';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const GROUPS = [
  {
    id: "pillars",
    title: "The 4 Pillars",
    intro: "The four ideas every other OOP concept builds on.",
    accent: "indigo",
    concepts: [
      {
        id: 1,
        name: "Encapsulation",
        definition: "Wrapping data and methods together in a class, and restricting direct access to the data.",
        code: `class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}`,
        keypoint: "Make fields private, expose them through public methods.",
      },
      {
        id: 2,
        name: "Abstraction",
        definition: "Hiding implementation details and showing only what is essential.",
        code: `abstract class Shape {
    abstract double area();   // what, not how
}

class Circle extends Shape {
    double r = 5;
    double area() { return Math.PI * r * r; }
}`,
        keypoint: "Abstraction is about what an object does, not how it does it.",
      },
      {
        id: 3,
        name: "Inheritance",
        definition: "A child class acquiring the fields and methods of a parent class using `extends`.",
        code: `class Animal {
    void eat() { System.out.println("Eating"); }
}

class Dog extends Animal {
    void bark() { System.out.println("Barking"); }
}

// Dog d = new Dog();
// d.eat();  d.bark();`,
        keypoint: "Java supports single inheritance for classes; multiple only through interfaces.",
      },
      {
        id: 4,
        name: "Polymorphism",
        definition: "One method name behaving differently depending on context: overloading (compile-time) and overriding (runtime).",
        code: `// Compile-time: overloading
int add(int a, int b)          { return a + b; }
double add(double a, double b) { return a + b; }

// Runtime: overriding
class Animal {
    void sound() { System.out.println("Some sound"); }
}
class Cat extends Animal {
    @Override
    void sound() { System.out.println("Meow"); }
}

Animal a = new Cat();
a.sound();   // Meow`,
        keypoint: "The reference type decides what is accessible; the actual object decides which method runs.",
      },
    ],
  },
  {
    id: "blocks",
    title: "Core Building Blocks",
    intro: "The language features used to put the pillars into practice.",
    accent: "teal",
    concepts: [
      {
        id: 5,
        name: "Class & Object",
        definition: "A class is a blueprint that defines fields and methods. An object is an instance of that class, created using `new`.",
        code: `class Car {
    String brand;
    void drive() { System.out.println("Driving"); }
}

Car c1 = new Car();   // object
Car c2 = new Car();   // another object`,
        keypoint: "One class, many objects, each with its own state.",
      },
      {
        id: 6,
        name: "Constructor",
        definition: "A special method with the same name as the class, called automatically when an object is created, used to initialize it.",
        code: `class Car {
    String brand;

    Car(String brand) {
        this.brand = brand;
    }
}

Car c = new Car("Toyota");`,
        keypoint: "Java has no destructor; the garbage collector reclaims memory automatically.",
      },
      {
        id: 7,
        name: "Access Modifiers",
        definition: "Keywords that control who can access a class, field, or method: `private`, default, `protected`, `public`.",
        table: {
          head: ["Modifier", "Same class", "Same package", "Subclass", "Everywhere"],
          rows: [
            ["`private`", "✅", "❌", "❌", "❌"],
            ["default", "✅", "✅", "❌", "❌"],
            ["`protected`", "✅", "✅", "✅", "❌"],
            ["`public`", "✅", "✅", "✅", "✅"],
          ],
        },
        keypoint: "Use the most restrictive modifier that works.",
      },
      {
        id: 8,
        name: "Abstract Class",
        definition: "A class declared with `abstract` that cannot be instantiated and can have both abstract and concrete methods.",
        code: `abstract class Vehicle {
    void start() { System.out.println("Starting"); }
    abstract void move();
}

class Bike extends Vehicle {
    void move() { System.out.println("Bike moves"); }
}`,
        keypoint: "Use it when related subclasses share common state or behavior.",
      },
      {
        id: 9,
        name: "Interface",
        definition: "A contract of methods that a class must implement using `implements`.",
        code: `interface Payment {
    void pay(double amount);
}

class UPI implements Payment {
    public void pay(double amount) {
        System.out.println("Paid " + amount + " via UPI");
    }
}`,
        keypoint: "An interface defines what a class can do. A class can implement many.",
      },
      {
        id: 10,
        name: "Abstract Class vs Interface",
        definition: "An abstract class is for related classes sharing common code (single inheritance). An interface is for unrelated classes sharing a capability (multiple inheritance).",
        table: {
          head: ["", "Abstract Class", "Interface"],
          rows: [
            ["Keyword", "`extends`", "`implements`"],
            ["Inheritance", "Only one", "Multiple"],
            ["Fields", "Any type", "Only constants (`public static final`)"],
            ["Constructor", "Yes", "No"],
            ["Use when", "Related classes share code", "Unrelated classes share a capability"],
          ],
        },
        keypoint: "Need shared code? Abstract class. Need a capability? Interface.",
      },
      {
        id: 11,
        name: "Method Overloading vs Overriding",
        definition: "Overloading is the same method name with different parameters in the same class. Overriding is a subclass redefining a parent method with the same signature.",
        code: `// Overloading: same class, different parameters
int add(int a, int b)          { return a + b; }
double add(double a, double b) { return a + b; }

// Overriding: parent and child, same signature
class Animal { void sound() { } }

class Dog extends Animal {
    @Override
    void sound() { System.out.println("Bark"); }
}`,
        keypoint: "Overloading = same class, different parameters. Overriding = parent and child, same signature.",
      },
    ],
  },
  {
    id: "relationships",
    title: "Relationships",
    intro: "How classes connect to each other, from the weakest link to the strongest.",
    accent: "amber",
    concepts: [
      {
        id: 12,
        name: "Association",
        definition: "A relationship where two classes know and interact with each other, but neither owns the other.",
        code: `class Patient { String name; }

class Doctor {
    Patient patient;                 // knows a patient

    void assign(Patient p) {
        this.patient = p;
    }
}`,
        keypoint: "Both objects live independently; they just know each other.",
      },
      {
        id: 13,
        name: "Aggregation",
        definition: "A HAS-A relationship where the part can exist independently of the whole.",
        code: `class Team {
    private List<Player> players;

    Team(List<Player> players) {     // players created outside
        this.players = players;
    }
}`,
        keypoint: "Weak ownership, independent lifecycle. Players survive if the team is deleted.",
      },
      {
        id: 14,
        name: "Composition",
        definition: "A strong HAS-A relationship where the part cannot exist without the whole.",
        code: `class House {
    private final Room room = new Room();   // created and owned by House
}`,
        keypoint: "Strong ownership, dependent lifecycle. Destroy the house and the rooms go with it.",
      },
      {
        id: 15,
        name: "Dependency",
        definition: "A class temporarily using another class, usually as a method parameter.",
        code: `class ReportGenerator {
    void generate(Printer printer) {   // no field stored
        printer.print();
    }
}`,
        keypoint: "The weakest relationship: the other class is used, never stored.",
      },
    ],
  },
];

const LADDER = [
  { name: "Dependency", note: "uses temporarily" },
  { name: "Association", note: "knows" },
  { name: "Aggregation", note: "has, independent" },
  { name: "Composition", note: "owns, dependent" },
];

/* Static class strings so Tailwind can see every one of them */
const ACCENTS = {
  indigo: {
    bar: "bg-indigo-500",
    badge: "bg-indigo-600 dark:bg-indigo-500 text-white",
    text: "text-indigo-700 dark:text-indigo-300",
    key: "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
    chip: "hover:border-indigo-400 hover:text-indigo-700 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300",
  },
  teal: {
    bar: "bg-teal-500",
    badge: "bg-teal-700 dark:bg-teal-500 text-white dark:text-gray-950",
    text: "text-teal-700 dark:text-teal-300",
    key: "border-teal-500 bg-teal-50 dark:bg-teal-500/10",
    chip: "hover:border-teal-400 hover:text-teal-700 dark:hover:border-teal-400/60 dark:hover:text-teal-300",
  },
  amber: {
    bar: "bg-amber-500",
    badge: "bg-amber-700 dark:bg-amber-500 text-white dark:text-gray-950",
    text: "text-amber-700 dark:text-amber-300",
    key: "border-amber-500 bg-amber-50 dark:bg-amber-500/10",
    chip: "hover:border-amber-400 hover:text-amber-700 dark:hover:border-amber-400/60 dark:hover:text-amber-300",
  },
};

/* ------------------------------------------------------------------ */
/*  SMALL HELPERS                                                      */
/* ------------------------------------------------------------------ */

// Lightweight Java highlighter: comments, strings, annotations, keywords, numbers
const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(@\w+)|\b(class|abstract|interface|extends|implements|private|public|protected|static|final|void|new|return|if|int|double|String|List|this|boolean)\b|\b(\d+(?:\.\d+)?)\b/gm;

const TOKEN_CLASS = [
  null,
  "italic text-gray-400 dark:text-gray-500",        // comment
  "text-emerald-700 dark:text-emerald-300",          // string
  "text-amber-700 dark:text-amber-300",              // annotation
  "font-semibold text-violet-700 dark:text-violet-300", // keyword
  "text-sky-700 dark:text-sky-300",                  // number
];

function CodeBlock({ code }) {
  const parts = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) parts.push(code.slice(last, m.index));
    const group = [1, 2, 3, 4, 5].find((i) => m[i] !== undefined);
    parts.push(
      <span key={m.index} className={TOKEN_CLASS[group]}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
  }
  parts.push(code.slice(last));

  return (
    <pre className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/40 px-5 py-4 text-[13px] sm:text-sm leading-relaxed font-mono text-gray-800 dark:text-gray-200">
      <code>{parts}</code>
    </pre>
  );
}

// Renders `inline code` inside plain strings
function Inline({ text }) {
  return text.split("`").map((chunk, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded-md bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em] text-gray-900 dark:text-gray-100"
      >
        {chunk}
      </code>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );
}

function DataTable({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
      <table className="w-full min-w-[480px] text-left text-sm sm:text-base">
        <thead className="bg-gray-50 dark:bg-white/5">
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 font-bold text-gray-900 dark:text-white whitespace-nowrap"
              >
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
                  className={`px-4 py-3 ${
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

function Concept({ concept, accent }) {
  const a = ACCENTS[accent];
  return (
    <article className="py-10 first:pt-2 border-t border-gray-100 dark:border-white/10 first:border-t-0">
      <div className="flex items-center gap-4 mb-4">
        <span
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-base font-bold ${a.badge}`}
        >
          {concept.id}
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
          {concept.name}
        </h3>
      </div>

      <p className="text-lg sm:text-xl leading-relaxed text-gray-800 dark:text-gray-200 mb-6">
        <Inline text={concept.definition} />
      </p>

      {concept.code && (
        <div className="mb-6">
          <CodeBlock code={concept.code} />
        </div>
      )}

      {concept.table && (
        <div className="mb-6">
          <DataTable head={concept.table.head} rows={concept.table.rows} />
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

const OOP1 = () => {
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
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mono text-sm font-bold px-5 py-2.5 shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all mb-6"
              >
                <span className="text-base">←</span>
                <span className="hidden sm:inline">Back to Blogs</span>
                <span className="sm:hidden">Blogs</span>
              </Link>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
                Core OOP Concepts
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
                Definitions, short Java examples, and one key point for each.
              </p>
            </div>

            <a
              href="#"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-white px-5 py-3 text-sm sm:text-base font-bold text-white dark:text-gray-900 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
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
                <span className={`w-1.5 rounded-full ${a.bar}`} aria-hidden="true" />
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {g.title}
                  </h2>
                  <p className="mt-1 text-base sm:text-lg text-gray-500 dark:text-gray-400">
                    {g.intro}
                  </p>
                </div>
              </div>

              {g.concepts.map((c) => (
                <Concept key={c.id} concept={c} accent={g.accent} />
              ))}

              {g.id === "relationships" && (
                <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Relationship strength
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Weakest to strongest.</p>
                  <ol className="grid gap-3 sm:grid-cols-4">
                    {LADDER.map((item, i) => (
                      <li
                        key={item.name}
                        className={`rounded-xl px-4 py-4 ${
                          [
                            "bg-amber-50 dark:bg-amber-500/[0.06]",
                            "bg-amber-100/80 dark:bg-amber-500/10",
                            "bg-amber-200/70 dark:bg-amber-500/20",
                            "bg-amber-300/70 dark:bg-amber-500/30",
                          ][i]
                        }`}
                      >
                        <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.note}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
};

export default OOP1;