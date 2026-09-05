import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Download, Copy, Check } from "lucide-react";
import Footer from "../../UI/Footer";

// ─── Python Code for Parking Lot LLD ──────────────────────────────
const PARKING_LOT_CODE = `from datetime import datetime
from enum import Enum
import math


# ---------------- ENUMS ----------------

class VehicleType(Enum):
    BIKE = 1
    CAR = 2
    TRUCK = 3


class SpotType(Enum):
    BIKE = 1
    CAR = 2
    TRUCK = 3


# ---------------- VEHICLE ----------------

class Vehicle:

    def __init__(self, number, vehicle_type):
        self.number = number
        self.vehicle_type = vehicle_type


# ---------------- PARKING SPOT ----------------

class ParkingSpot:

    def __init__(self, spot_id, spot_type):
        self.spot_id = spot_id
        self.spot_type = spot_type
        self.vehicle = None

    def is_available(self):
        return self.vehicle is None

    def can_park(self, vehicle):
        return self.spot_type.value == vehicle.vehicle_type.value

    def park(self, vehicle):

        if not self.is_available():
            return False

        if not self.can_park(vehicle):
            return False

        self.vehicle = vehicle
        return True

    def remove_vehicle(self):

        vehicle = self.vehicle
        self.vehicle = None

        return vehicle


# ---------------- FLOOR ----------------

class ParkingFloor:

    def __init__(self, floor_number):
        self.floor_number = floor_number
        self.spots = []

    def add_spot(self, spot):
        self.spots.append(spot)

    def find_available_spot(self, vehicle):

        for spot in self.spots:

            if (spot.is_available()
                    and spot.can_park(vehicle)):

                return spot

        return None


# ---------------- TICKET ----------------

class Ticket:

    def __init__(self, ticket_id, vehicle, spot):

        self.ticket_id = ticket_id
        self.vehicle = vehicle
        self.spot = spot

        self.entry_time = datetime.now()
        self.exit_time = None
        self.fee = 0


# ---------------- PRICING ----------------

class PricingStrategy:

    def calculate(self, ticket):
        raise NotImplementedError


class BikePricing(PricingStrategy):

    def calculate(self, ticket):

        duration = ticket.exit_time - ticket.entry_time
        hours = math.ceil(duration.total_seconds() / 3600)

        return hours * 10


class CarPricing(PricingStrategy):

    def calculate(self, ticket):

        duration = ticket.exit_time - ticket.entry_time
        hours = math.ceil(duration.total_seconds() / 3600)

        return hours * 20


class TruckPricing(PricingStrategy):

    def calculate(self, ticket):

        duration = ticket.exit_time - ticket.entry_time
        hours = math.ceil(duration.total_seconds() / 3600)

        return hours * 40


# ---------------- FEE CALCULATOR ----------------

class FeeCalculator:

    def __init__(self, pricing_strategy):
        self.pricing_strategy = pricing_strategy

    def calculate(self, ticket):
        return self.pricing_strategy.calculate(ticket)


# ---------------- PARKING LOT ----------------

class ParkingLot:

    def __init__(self, fee_calculator):

        self.floors = []
        self.ticket_counter = 1
        self.fee_calculator = fee_calculator

    def add_floor(self, floor):
        self.floors.append(floor)

    def find_spot(self, vehicle):

        for floor in self.floors:

            spot = floor.find_available_spot(vehicle)

            if spot is not None:
                return spot

        return None

    def park_vehicle(self, vehicle):

        spot = self.find_spot(vehicle)

        if spot is None:
            return None

        success = spot.park(vehicle)

        if not success:
            return None

        ticket = Ticket(
            self.ticket_counter,
            vehicle,
            spot
        )

        self.ticket_counter += 1

        return ticket

    def unpark_vehicle(self, ticket):

        ticket.exit_time = datetime.now()

        ticket.fee = self.fee_calculator.calculate(ticket)

        ticket.spot.remove_vehicle()

        return ticket.fee`;

// ─── Day 5: SOLID + Clean Design ──────────────────────────────────
const DAY5_CONCEPTS = [
  {
    id: 1,
    section: "Day 5",
    name: "SRP — Single Responsibility",
    hue: "indigo",
    icon: "🎯",
    description: "One class should have ONE PRIMARY REASON TO CHANGE.",
    content: `❌ Bad:
class OrderService {
    void createOrder() {
        // validate, calculate, save, pay, notify
    }
}
→ Multiple reasons to change.

✅ Better:
OrderService, PaymentService, OrderRepository, EmailService, InvoiceService, Logger`,
    diagram: "OrderService → separate into focused services",
    keypoint: "Do these responsibilities change for different reasons? If YES → separate.",
  },
  {
    id: 2,
    section: "Day 5",
    name: "OCP — Open/Closed",
    hue: "blue",
    icon: "🔓",
    description: "OPEN FOR EXTENSION, CLOSED FOR MODIFICATION.",
    content: `New behavior should be added without modifying existing code.

Example: Payment methods
Payment
 ├── UPI
 ├── Card
 └── Wallet

Add new payment type → just add a new class, don't touch existing.`,
    diagram: "New variant → add class → no change to existing logic",
    keypoint: "Is this likely to get new variants? → design an extension point.",
  },
  {
    id: 3,
    section: "Day 5",
    name: "LSP — Liskov Substitution",
    hue: "cyan",
    icon: "🔄",
    description: "Subtype must be usable wherever its parent is expected.",
    content: `❌ Bird → fly(); Penguin : Bird → fly() not supported – breaks substitution.

✅ Child must honour parent's contract.

Think: "If I replace parent with child, will the program still behave correctly?"`,
    diagram: "Parent contract → child must honor it",
    keypoint: "If substitution breaks → rethink inheritance.",
  },
  {
    id: 4,
    section: "Day 5",
    name: "ISP — Interface Segregation",
    hue: "teal",
    icon: "🔌",
    description: "Don't force clients to depend on methods they don't need.",
    content: `❌ Fat interface: NotificationService { sendEmail, sendSMS, sendPush, sendWhatsApp }
Better: split into EmailSender, SMSSender, PushSender, WhatsAppSender.`,
    diagram: "Fat interface → split into focused interfaces",
    keypoint: "Is this interface forcing unnecessary methods? → split it.",
  },
  {
    id: 5,
    section: "Day 5",
    name: "DIP — Dependency Inversion",
    hue: "emerald",
    icon: "🧩",
    description: "High-level logic depends on abstractions, not implementations.",
    content: `❌ OrderService → MySQLRepository
✅ OrderService → OrderRepository ← MySQLRepository / MongoDB

High-level should not care about low-level details.`,
    diagram: "Business logic → abstraction ← concrete impl",
    keypoint: "If technology changes, should business logic change? If NO → add abstraction.",
  },
  {
    id: 6,
    section: "Day 5",
    name: "DRY, KISS, YAGNI",
    hue: "lime",
    icon: "⚡",
    description: "Three key principles to avoid over‑engineering.",
    content: `DRY  → Don't duplicate the same knowledge/business rule.
KISS → Use the simplest solution that works.
YAGNI→ Don't build what you don't currently need.

Examples:
DRY → centralise discount rule instead of duplicating.
KISS → don't add Kafka/Redis for 1 feature.
YAGNI → don't build 12 auth providers upfront.`,
    diagram: "Knowledge → single source of truth; Requirement → simplest sufficient design",
    keypoint: "Keep it simple, avoid duplication, build only what's needed.",
  },
  {
    id: 7,
    section: "Day 5",
    name: "High Cohesion, Low Coupling, SoC",
    hue: "violet",
    icon: "🧹",
    description: "Keep related things together, minimise dependencies, separate concerns.",
    content: `High Cohesion → related responsibilities belong together.
Low Coupling → minimise dependencies between components.
Separation of Concerns → different concerns in different places.

Example: UserService should only do user stuff, not email or invoice.`,
    diagram: "Group related, reduce dependencies, separate concerns.",
    keypoint: "Do these responsibilities naturally belong together? Are dependencies spreading? Are concerns mixed?",
  },
  {
    id: 8,
    section: "Day 5",
    name: "Dependency Injection & Composition",
    hue: "rose",
    icon: "💉",
    description: "Give dependencies from outside; prefer HAS‑A over IS‑A.",
    content: `DI: provide dependencies externally (e.g., constructor injection).
Composition over Inheritance: use HAS‑A (Engine) instead of IS‑A (Vehicle) when flexible/swappable components needed.

Benefits of DI: lower coupling, easier testing, easier replacement.`,
    diagram: "Outside → inject dependency → object; Inheritance = IS‑A; Composition = HAS‑A",
    keypoint: "Can dependencies be provided from outside? Is inheritance truly IS‑A?",
  },
  {
    id: 9,
    section: "Day 5",
    name: "ALL 14 — One‑Line Recall",
    hue: "amber",
    icon: "🔥",
    description: "Quick summary of every principle.",
    content: `SRP  → One reason to change.
OCP  → Extend without modifying.
LSP  → Child honours parent.
ISP  → Focused interfaces.
DIP  → Depend on abstractions.
DRY  → No duplicate knowledge.
KISS → Simple design.
YAGNI→ Build only needed.
High Cohesion → related together.
Low Coupling → few dependencies.
SoC  → separate concerns.
DI   → inject dependencies.
Composition over Inheritance → HAS‑A when appropriate.
Programming to Interfaces → depend on contracts.`,
    diagram: "All principles in one glance",
    keypoint: "Keep these in mind when designing any system.",
  },
  {
    id: 10,
    section: "Day 5",
    name: "Final SDE Design Checklist",
    hue: "fuchsia",
    icon: "✅",
    description: "16 questions to ask when designing a class/system.",
    content: `1. What can change?
2. Who owns that responsibility?
3. Multiple reasons to change? → SRP
4. New variants? → OCP
5. Child replaces parent safely? → LSP
6. Unnecessary methods? → ISP
7. Business logic coupled to technology? → DIP
8. Knowledge duplicated? → DRY
9. Unnecessarily complex? → KISS
10. Building unneeded? → YAGNI
11. Related responsibilities together? → High Cohesion
12. Dependencies spreading? → Low Coupling
13. Concerns mixed? → SoC
14. Dependencies provided from outside? → DI
15. Genuine IS‑A? → Composition over Inheritance
16. Depend on contract? → Programming to Interfaces`,
    diagram: "Checklist → apply principles",
    keypoint: "Run through these questions for every major design decision.",
  },
];

// ─── Day 6: Design Patterns ──────────────────────────────────────
const DAY6_CONCEPTS = [
  {
    id: 11,
    section: "Day 6",
    name: "🏭 Factory",
    hue: "blue",
    icon: "🏭",
    description: "Centralize object creation when you have many types.",
    content: `PROBLEM: Object creation logic scattered.
THINK: "Who should create this object?"
SOLUTION: Centralize in a Factory.
TRIGGER: Many types → UPI / Card / Wallet`,
    diagram: "Client → Factory → Product",
    keypoint: "Many types → use Factory.",
  },
  {
    id: 12,
    section: "Day 6",
    name: "🔨 Builder",
    hue: "cyan",
    icon: "🔨",
    description: "Construct complex objects step‑by‑step.",
    content: `PROBLEM: Object has many optional properties.
THINK: "Construction is messy."
SOLUTION: Build step‑by‑step.
TRIGGER: User(name, email, age, address, ...)`,
    diagram: "Director → Builder → Product",
    keypoint: "Complex construction → use Builder.",
  },
  {
    id: 13,
    section: "Day 6",
    name: "🔒 Singleton",
    hue: "emerald",
    icon: "🔒",
    description: "Exactly one shared instance.",
    content: `PROBLEM: Need one shared instance.
THINK: "Do I really need only one?"
SOLUTION: Restrict to one instance.
EXAMPLES: Configuration, Logger.`,
    diagram: "Class → static getInstance() → single instance",
    keypoint: "Use only when genuinely needed.",
  },
  {
    id: 14,
    section: "Day 6",
    name: "🔌 Adapter",
    hue: "violet",
    icon: "🔌",
    description: "Make incompatible interfaces work together.",
    content: `PROBLEM: Two components have incompatible interfaces.
THINK: "They should work, but interfaces don't match."
SOLUTION: Put an Adapter between them.
FLOW: Your Code → Adapter → Third Party.`,
    diagram: "Client → Adapter → Adaptee",
    keypoint: "Incompatible interfaces → use Adapter.",
  },
  {
    id: 15,
    section: "Day 6",
    name: "🎨 Decorator",
    hue: "pink",
    icon: "🎨",
    description: "Dynamically add/combine behavior by wrapping.",
    content: `PROBLEM: Need to add optional behavior dynamically.
THINK: "Do I need different feature combinations?"
SOLUTION: Wrap object and add behavior.
FLOW: Coffee → Milk → Caramel → Cream.`,
    diagram: "Component → Decorator (wraps)",
    keypoint: "Dynamic combinations → use Decorator.",
  },
  {
    id: 16,
    section: "Day 6",
    name: "🏢 Facade",
    hue: "orange",
    icon: "🏢",
    description: "Hide subsystem complexity behind a simple interface.",
    content: `PROBLEM: Complex subsystem exposes too much.
THINK: "Can I give the client one simple entry point?"
SOLUTION: Create a simple interface over many components.
FLOW: Client → Facade → Multiple Services.`,
    diagram: "Client → Facade → Subsystem",
    keypoint: "Too complex → use Facade.",
  },
  {
    id: 17,
    section: "Day 6",
    name: "🎯 Strategy",
    hue: "purple",
    icon: "🎯",
    description: "Switch between interchangeable algorithms.",
    content: `PROBLEM: Multiple interchangeable algorithms.
THINK: "Which behavior/algorithm should I use?"
SOLUTION: Put each algorithm in its own Strategy.
EXAMPLES: Discount, Shipping, Payment, Routing.`,
    diagram: "Context → Strategy interface ← Concrete Strategies",
    keypoint: "Switchable algorithms → use Strategy.",
  },
  {
    id: 18,
    section: "Day 6",
    name: "👀 Observer",
    hue: "rose",
    icon: "👀",
    description: "Notify many objects when something changes.",
    content: `PROBLEM: One object changes → many need to know.
THINK: "When this changes, who needs notification?"
SOLUTION: Subject notifies Observers.
FLOW: Subject → Observer1, Observer2, Observer3.
EXAMPLES: Order → Email + SMS + Push.`,
    diagram: "Subject ← observers",
    keypoint: "One change → notify many → use Observer.",
  },
  {
    id: 19,
    section: "Day 6",
    name: "🔄 State",
    hue: "teal",
    icon: "🔄",
    description: "Behavior changes according to current state.",
    content: `PROBLEM: Object behavior changes according to its state.
THINK: "Why does the same action behave differently?"
SOLUTION: Move state‑specific behavior into State objects.
EXAMPLE: Order: PLACED → PAID → SHIPPED → DELIVERED.`,
    diagram: "Context delegates to current State",
    keypoint: "State‑dependent behavior → use State pattern.",
  },
  {
    id: 20,
    section: "Day 6",
    name: "📦 Command",
    hue: "amber",
    icon: "📦",
    description: "Represent an action as an object.",
    content: `PROBLEM: Need to represent/store an action.
THINK: "Do I need history, undo, queue, or logging?"
SOLUTION: Represent operation as an object.
EXAMPLES: Undo/Redo, Job Queue, Editor actions.`,
    diagram: "Invoker → Command → Receiver",
    keypoint: "Action as object → use Command.",
  },
  {
    id: 21,
    section: "Day 6",
    name: "🧠 Pattern Trigger Map",
    hue: "indigo",
    icon: "🗺️",
    description: "Quick mapping from problem to pattern.",
    content: `"How should I CREATE it?" → Factory, Builder, Singleton
"How should I CONNECT it?" → Adapter, Decorator, Facade
"How should it BEHAVE?" → Strategy, Observer, State, Command

Differentiation:
Factory → WHICH object?
Builder → HOW to construct?
Adapter → Make compatible.
Facade → Make simple.
Strategy → Choose algorithm.
State → Behavior changes with state.`,
    diagram: "Problem → Pattern",
    keypoint: "Start with the problem, not the pattern.",
  },
  {
    id: 22,
    section: "Day 6",
    name: "🔥 10 Patterns — One‑Line Recall",
    hue: "red",
    icon: "🔥",
    description: "All 10 patterns summarised.",
    content: `🏭 Factory    → Create different types.
🔨 Builder    → Build complex objects step‑by‑step.
🔒 Singleton  → One shared instance.
🔌 Adapter    → Match interfaces.
🎨 Decorator  → Add behavior by wrapping.
🏢 Facade     → Simplify complex subsystem.
🎯 Strategy   → Switch algorithms.
👀 Observer   → Notify many on change.
🔄 State      → Behavior depends on state.
📦 Command    → Action as object.`,
    diagram: "10 patterns → one line each",
    keypoint: "Keep these in your toolbox.",
  },
];

// ─── Day 7: Parking Lot LLD (condensed) ─────────────────────────
const DAY7_CONCEPTS = [
  {
    id: 23,
    section: "Day 7",
    name: "🧠 LLD Thinking Flow",
    hue: "indigo",
    icon: "🧠",
    description: "The universal LLD design process.",
    content: `Requirements
   ↓
Candidate Objects
   ↓
Responsibilities
   ↓
Relationships + Multiplicity
   ↓
Class Diagram
   ↓
Main Flows (Entry/Exit)
   ↓
Interfaces / Abstraction
   ↓
Patterns (if needed)
   ↓
Failure Cases
   ↓
Extensions

🔥 GOLDEN RULE:
"Which object naturally has the information to perform this responsibility?"`,
    diagram: "Requirement → Objects → Responsibilities → Relationships → Flows → Abstraction → Patterns → Code",
    keypoint: "Always start with responsibilities and ownership.",
  },
  {
    id: 24,
    section: "Day 7",
    name: "🚗 Requirements & Candidate Objects",
    hue: "blue",
    icon: "🚗",
    description: "Key functional requirements and the core objects.",
    content: `Functional Requirements:
1. Vehicle enters → find spot → park → generate ticket
2. Vehicle exits → calculate fee → free spot
3. Show availability

Vehicle Types: Bike, Car, Truck
Spot Types: Bike, Car, Truck

Candidate Objects:
ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, FeeCalculator, PricingStrategy`,
    diagram: "Requirements → Candidate Objects",
    keypoint: "Objects must have meaningful responsibilities.",
  },
  {
    id: 25,
    section: "Day 7",
    name: "🎯 Responsibilities & Relationships",
    hue: "cyan",
    icon: "🎯",
    description: "What each object does and how they connect.",
    content: `Responsibilities:
• ParkingLot → coordinates parking, searches floors, handles exit.
• ParkingFloor → owns spots, finds suitable spot, shows availability.
• ParkingSpot → knows type, parked vehicle, availability, compatibility, parks/removes.
• Vehicle → knows number/type.
• Ticket → represents a parking session (id, vehicle, spot, entry/exit times, fee).
• FeeCalculator → calculates fee using PricingStrategy.
• PricingStrategy → defines pricing behavior.

Relationships:
ParkingLot ◆→ ParkingFloor (Composition)
ParkingFloor ◆→ ParkingSpot (Composition)
ParkingSpot — Vehicle (Association)
Ticket — Vehicle (Association)
Ticket — ParkingSpot (Association)
FeeCalculator — PricingStrategy (Dependency)`,
    diagram: "ParkingLot → ParkingFloor → ParkingSpot ↔ Vehicle ; Ticket ↔ Vehicle/Spot ; FeeCalculator → PricingStrategy",
    keypoint: "Composition for strong ownership; Association for interactions.",
  },
  {
    id: 26,
    section: "Day 7",
    name: "🅿️ Spot Allocation & Ticket",
    hue: "teal",
    icon: "🅿️",
    description: "How to find a spot and represent a parking session.",
    content: `Spot Allocation Flow:
Vehicle enters → ParkingLot → scan floors → ParkingFloor → scan spots → check availability + compatibility (vehicle.type == spot.type) → return suitable spot.

Simple initial approach: for spot in spots: if available and compatible → return.

Ticket: represents one parking session.
Attributes: ticket_id, vehicle, spot, entry_time, exit_time, fee.

Python snippet:
class Ticket:
    def __init__(self, ticket_id, vehicle, spot):
        self.ticket_id = ticket_id
        self.vehicle = vehicle
        self.spot = spot
        self.entry_time = datetime.now()
        self.exit_time = None
        self.fee = 0`,
    diagram: "Vehicle → ParkingLot → Floor → Spot → Ticket",
    keypoint: "Start with a simple scan; optimise only if bottleneck appears.",
  },
  {
    id: 27,
    section: "Day 7",
    name: "🚪 Entry / Exit Flows",
    hue: "emerald",
    icon: "🚪",
    description: "The core parking and unparking operations.",
    content: `ENTRY:
park_vehicle(vehicle):
    spot = find_spot(vehicle)
    if spot is None: return None
    success = spot.park(vehicle)
    if not success: return None
    ticket = Ticket(self.ticket_counter, vehicle, spot)
    self.ticket_counter += 1
    return ticket

EXIT:
unpark_vehicle(ticket):
    ticket.exit_time = datetime.now()
    ticket.fee = fee_calculator.calculate(ticket)
    ticket.spot.remove_vehicle()
    return ticket.fee`,
    diagram: "Entry: Vehicle → Find Spot → Park → Ticket ; Exit: Ticket → Set Exit → Calculate Fee → Remove Vehicle → Spot Free",
    keypoint: "Keep flows simple; handle failures (no spot, occupied, invalid ticket).",
  },
  {
    id: 28,
    section: "Day 7",
    name: "💰 Fee Calculation & Strategy Pattern",
    hue: "purple",
    icon: "💰",
    description: "Use Strategy for interchangeable pricing algorithms.",
    content: `Simple pricing: Fee = Hours × Rate.
Car → ₹20/hr, Bike → ₹10/hr, Truck → ₹40/hr.

Why separate FeeCalculator? Pricing rules can change.
Architecture:
ParkingLot → FeeCalculator → PricingStrategy
                            ↑
                    ┌───────┼───────┐
                CarPricing  BikePricing  TruckPricing

Python:
class PricingStrategy:
    def calculate(self, ticket): raise NotImplementedError

class CarPricing(PricingStrategy):
    def calculate(self, ticket):
        hours = math.ceil((ticket.exit_time - ticket.entry_time).total_seconds() / 3600)
        return hours * 20

class FeeCalculator:
    def __init__(self, strategy): self.strategy = strategy
    def calculate(self, ticket): return self.strategy.calculate(ticket)

Pattern trigger: multiple interchangeable algorithms → STRATEGY.`,
    diagram: "ParkingLot → FeeCalculator → PricingStrategy ← CarPricing, BikePricing, TruckPricing",
    keypoint: "Encapsulate pricing in Strategy for easy extension.",
  },
  {
    id: 29,
    section: "Day 7",
    name: "⚠️ Failure Cases, Extensions & Scaling",
    hue: "red",
    icon: "⚠️",
    description: "What can go wrong, future additions, and performance thinking.",
    content: `Failure Cases:
• No suitable spot → return parking full.
• Wrong vehicle type → reject.
• Spot already occupied → reject.
• Invalid/closed ticket → reject exit.
• Same vehicle already parked → prevent duplicate session.
• Parking fails → don't generate ticket.

Extensions (future):
• EV parking → EVVehicle, EVParkingSpot / ChargingStation.
• New pricing → add PricingStrategy.
• Premium parking → new SpotType / pricing.
• Different allocation → AllocationStrategy.
• Payment abstraction.
• Multiple entrances/exits → Entry/Exit gates.

Scaling Thinking:
Current: ParkingLot scans floors → scans spots.
If many spots (e.g., 50,000) and scanning becomes slow:
→ Identify bottleneck.
→ Index available spots by type.

Don't prematurely add complex architecture.`,
    diagram: "Failure → handle gracefully; Extensions → plan for change; Scaling → optimise only when needed.",
    keypoint: "Always ask 'what if this fails?' and evolve the system as requirements grow.",
  },
  {
    id: 30,
    section: "Day 7",
    name: "🔥 30‑Second Recall — Parking Lot",
    hue: "amber",
    icon: "🏆",
    description: "The entire problem in one glance.",
    content: `Objects:
ParkingLot      → coordinates everything
ParkingFloor    → finds suitable spot
ParkingSpot     → owns parking state
Vehicle         → vehicle information
Ticket          → parking session
FeeCalculator   → calculates fee
PricingStrategy → different pricing behaviors

Entry Flow:
Vehicle → Find Spot → Park → Ticket

Exit Flow:
Ticket → Exit Time → Fee → Remove Vehicle → Spot FREE

Core LLD Mindset:
RESPONSIBILITY → OWNERSHIP → COLLABORATION → DESIGN

Don't ask "what classes?" — ask "what things exist, what do they know, what do they do, and what rules do they own?"`,
    diagram: "ParkingLot → Floor → Spot ↔ Vehicle ; Ticket ↔ Vehicle/Spot ; FeeCalculator → PricingStrategy",
    keypoint: "Keep it responsibility‑driven and simple.",
  },
];

// ─── Styling Helpers ──────────────────────────────────────────────
const HUE_MAP = {
  blue: {
    border: "border-blue-200 dark:border-blue-500/25",
    bg: "bg-blue-50/70 dark:bg-blue-500/[0.06]",
    text: "text-blue-600 dark:text-blue-300",
    badge: "bg-blue-500",
    accent: "text-blue-500 dark:text-blue-400",
  },
  cyan: {
    border: "border-cyan-200 dark:border-cyan-500/25",
    bg: "bg-cyan-50/70 dark:bg-cyan-500/[0.06]",
    text: "text-cyan-600 dark:text-cyan-300",
    badge: "bg-cyan-500",
    accent: "text-cyan-500 dark:text-cyan-400",
  },
  teal: {
    border: "border-teal-200 dark:border-teal-500/25",
    bg: "bg-teal-50/70 dark:bg-teal-500/[0.06]",
    text: "text-teal-600 dark:text-teal-300",
    badge: "bg-teal-500",
    accent: "text-teal-500 dark:text-teal-400",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-500/25",
    bg: "bg-emerald-50/70 dark:bg-emerald-500/[0.06]",
    text: "text-emerald-600 dark:text-emerald-300",
    badge: "bg-emerald-500",
    accent: "text-emerald-500 dark:text-emerald-400",
  },
  lime: {
    border: "border-lime-200 dark:border-lime-500/25",
    bg: "bg-lime-50/70 dark:bg-lime-500/[0.06]",
    text: "text-lime-700 dark:text-lime-300",
    badge: "bg-lime-500",
    accent: "text-lime-600 dark:text-lime-400",
  },
  green: {
    border: "border-green-200 dark:border-green-500/25",
    bg: "bg-green-50/70 dark:bg-green-500/[0.06]",
    text: "text-green-600 dark:text-green-300",
    badge: "bg-green-500",
    accent: "text-green-500 dark:text-green-400",
  },
  sky: {
    border: "border-sky-200 dark:border-sky-500/25",
    bg: "bg-sky-50/70 dark:bg-sky-500/[0.06]",
    text: "text-sky-600 dark:text-sky-300",
    badge: "bg-sky-500",
    accent: "text-sky-500 dark:text-sky-400",
  },
  indigo: {
    border: "border-indigo-200 dark:border-indigo-500/25",
    bg: "bg-indigo-50/70 dark:bg-indigo-500/[0.06]",
    text: "text-indigo-600 dark:text-indigo-300",
    badge: "bg-indigo-500",
    accent: "text-indigo-500 dark:text-indigo-400",
  },
  violet: {
    border: "border-violet-200 dark:border-violet-500/25",
    bg: "bg-violet-50/70 dark:bg-violet-500/[0.06]",
    text: "text-violet-600 dark:text-violet-300",
    badge: "bg-violet-500",
    accent: "text-violet-500 dark:text-violet-400",
  },
  purple: {
    border: "border-purple-200 dark:border-purple-500/25",
    bg: "bg-purple-50/70 dark:bg-purple-500/[0.06]",
    text: "text-purple-600 dark:text-purple-300",
    badge: "bg-purple-500",
    accent: "text-purple-500 dark:text-purple-400",
  },
  pink: {
    border: "border-pink-200 dark:border-pink-500/25",
    bg: "bg-pink-50/70 dark:bg-pink-500/[0.06]",
    text: "text-pink-600 dark:text-pink-300",
    badge: "bg-pink-500",
    accent: "text-pink-500 dark:text-pink-400",
  },
  rose: {
    border: "border-rose-200 dark:border-rose-500/25",
    bg: "bg-rose-50/70 dark:bg-rose-500/[0.06]",
    text: "text-rose-600 dark:text-rose-300",
    badge: "bg-rose-500",
    accent: "text-rose-500 dark:text-rose-400",
  },
  red: {
    border: "border-red-200 dark:border-red-500/25",
    bg: "bg-red-50/70 dark:bg-red-500/[0.06]",
    text: "text-red-600 dark:text-red-300",
    badge: "bg-red-500",
    accent: "text-red-500 dark:text-red-400",
  },
  orange: {
    border: "border-orange-200 dark:border-orange-500/25",
    bg: "bg-orange-50/70 dark:bg-orange-500/[0.06]",
    text: "text-orange-600 dark:text-orange-300",
    badge: "bg-orange-500",
    accent: "text-orange-500 dark:text-orange-400",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-500/25",
    bg: "bg-amber-50/70 dark:bg-amber-500/[0.06]",
    text: "text-amber-600 dark:text-amber-300",
    badge: "bg-amber-500",
    accent: "text-amber-500 dark:text-amber-400",
  },
  fuchsia: {
    border: "border-fuchsia-200 dark:border-fuchsia-500/25",
    bg: "bg-fuchsia-50/70 dark:bg-fuchsia-500/[0.06]",
    text: "text-fuchsia-600 dark:text-fuchsia-300",
    badge: "bg-fuchsia-500",
    accent: "text-fuchsia-500 dark:text-fuchsia-400",
  },
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
      { threshold: 0.01, rootMargin: "0px 0px -10px 0px" },
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

      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {concept.description}
        </p>
      </div>

      <div className="mb-6 rounded-2xl bg-white dark:bg-white/5 px-6 py-5 shadow-sm">
        <pre className="text-base leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm">
          {concept.content}
        </pre>
      </div>

      {concept.diagram && (
        <pre className="mb-6 overflow-x-auto rounded-xl bg-gray-900 dark:bg-black/40 px-6 py-5 text-sm sm:text-base leading-relaxed text-emerald-300 font-mono">
          {concept.diagram}
        </pre>
      )}

      {concept.keypoint && (
        <div className="flex items-start gap-3 rounded-xl bg-white dark:bg-white/5 px-5 py-4 shadow-sm">
          <span className="text-lg flex-shrink-0">🔑</span>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
            {concept.keypoint}
          </p>
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

// ─── Main Component ──────────────────────────────────────────────
function SystemDesign3() {
  const [progress, setProgress] = useState(0);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PARKING_LOT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 transition-colors duration-500">
      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-indigo-500 z-50 print:hidden"
        style={{ width: `${progress}%` }}
      />

      {/* floating arrows */}
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

      {/* header */}
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
              🧠 LLD Master Revision
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              SOLID + Patterns + Parking Lot
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-500 dark:text-gray-400">
              Days 5, 6 &amp; 7 — Complete Revision Sheets
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
      </div>

      <main className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-16">
        {/* Intro Mindset */}
        <RevealSection className="mb-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 sm:p-10 text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-3">
            The SDE Mindset
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-6">
            Don't memorise — recognise the problem.
          </h2>
          <ul className="text-white/80 space-y-1 font-mono text-sm">
            <li>❓ What can change?</li>
            <li>❓ Who owns that responsibility?</li>
            <li>❓ Am I creating unnecessary coupling?</li>
            <li>❓ Am I duplicating knowledge?</li>
            <li>❓ Am I adding unnecessary complexity?</li>
            <li>❓ Am I building something I don't need?</li>
            <li>❓ What is becoming complicated?</li>
            <li>❓ Which behavior should be isolated?</li>
          </ul>
        </RevealSection>

        {/* Day 5 */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 5: SOLID + Clean Design
          </h2>
          <div className="flex flex-col gap-10">
            {DAY5_CONCEPTS.map((c) => (
              <ConceptCard key={c.id} concept={c} />
            ))}
          </div>
        </RevealSection>

        {/* Day 6 */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 6: Design Patterns
          </h2>
          <div className="flex flex-col gap-10">
            {DAY6_CONCEPTS.map((c) => (
              <ConceptCard key={c.id} concept={c} />
            ))}
          </div>
        </RevealSection>

        {/* Day 7 */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            Day 7: Parking Lot LLD
          </h2>
          <div className="flex flex-col gap-10">
            {DAY7_CONCEPTS.map((c) => (
              <ConceptCard key={c.id} concept={c} />
            ))}
          </div>
        </RevealSection>

        {/* ─── Python Code Block (single card with copy button) ── */}
        <RevealSection className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
            🐍 Complete Python Implementation
          </h2>
          <div className="relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-6 shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Copy code"
            >
              {copied ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap leading-relaxed pr-10">
              {PARKING_LOT_CODE}
            </pre>
          </div>
        </RevealSection>

        {/* Final Golden Rule */}
        <RevealSection className="mt-16 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-500/30 bg-orange-50/40 dark:bg-orange-500/[0.04] p-8 sm:p-10 mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">🧭</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              The Golden Rule
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">
              <strong>Don't start with patterns or principles.</strong> Start with the problem.<br />
              Analyse → Identify what changes → Isolate responsibilities → Then choose the right structure.
            </p>
            <div className="bg-gray-100 dark:bg-black/30 p-4 rounded-lg">
              <p className="font-bold text-gray-900 dark:text-white mb-2">
                Always ask:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>What can change and who owns that responsibility?</li>
                <li>Am I depending on abstractions or concretions?</li>
                <li>Is this design as simple as possible, but no simpler?</li>
                <li>Am I building only what I need right now?</li>
                <li>Which pattern fits the problem, not the other way around?</li>
              </ul>
            </div>
          </div>
        </RevealSection>

        {/* Final Word */}
        <RevealSection className="rounded-3xl bg-gray-900 dark:bg-white/5 p-10 sm:p-14 text-white border border-white/10 text-center">
          <span className="text-4xl">❤️‍🔥</span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">
            Recognise, Don't Memorise
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed">
            <span className="font-bold text-white">SOLID</span> gives you principles —<br />
            <span className="font-bold text-white">Design Patterns</span> give proven solutions —<br />
            <span className="font-bold text-white">Parking Lot</span> shows you how to apply them.
          </p>
          <p className="mt-8 text-base font-bold tracking-wide text-white/70">
            Problem → Analysis → Solution
          </p>
        </RevealSection>
      </main>

      <Footer />
    </div>
  );
}

export default SystemDesign3;