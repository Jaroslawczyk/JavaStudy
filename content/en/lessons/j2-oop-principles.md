"List the principles of OOP" comes up in almost every Junior developer interview. We cover **encapsulation, inheritance and polymorphism** with real-life and code examples — and add what the video doesn't: **abstraction**, composition and the **SOLID** principles.

## Video timestamps

- {{t j2 7:17:14}} — revisiting OOP in an interview format
- {{t j2 7:17:30}} — what OOP is
- {{t j2 7:17:53}} — the main paradigms (principles) of OOP
- {{t j2 7:18:17}} — encapsulation
- {{t j2 7:18:34}} — example: a driver and a car
- {{t j2 7:19:06}} — inheritance: the cat family
- {{t j2 7:19:26}} — polymorphism: an `Employee` interface
- {{t j2 7:21:25}} — one `work()` call — different behaviour
- {{t j2 7:21:46}} — "one interface — many implementations"
- {{t j2 7:22:03}} — example: a cheap car and an expensive one

## What OOP is

Object-oriented programming is an approach where a program is built from **objects**: each combines data (fields) and behaviour (methods) and interacts with others through their public interface. A class is a "blueprint", an object is an instance built from it.

## Encapsulation

**Hiding the implementation** and protecting an object's state: data changes only through methods that enforce the rules.

```java
public class BankAccount {
    private long balance;                       // can't be changed directly from outside

    public void deposit(long amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be > 0");
        balance += amount;
    }
    public long getBalance() { return balance; } // read only — no setter
}
```

In Java encapsulation is achieved with access modifiers (`private`, package-private, `protected`, `public`) and [modules](#/extra/modules). The example from the video: a driver uses the steering wheel and pedals without directly controlling the fuel supply.

:::tip "Encapsulation ≠ a getter and setter for every field"
If every field has a public setter, the object protects nothing. Provide methods with **meaning** (`deposit`, `withdraw`), not `setBalance`. Immutable objects (`record`, `final` fields) are the strongest encapsulation.
:::

## Inheritance

A subclass gets its parent's fields and methods and adds its own: `class Lion extends Feline`. The common traits of felines go in the parent, the unique ones in the lion, the tiger, the cat. In Java a class extends **only one** class but can implement any number of interfaces.

## Polymorphism

**One interface — many implementations**: code works with a common type, and the behaviour is determined by the actual object at runtime (dynamic binding).

```java
interface Employee { void work(); }
class Programmer implements Employee { public void work() { System.out.println("The programmer writes code"); } }
class Cook implements Employee { public void work() { System.out.println("The cook cooks"); } }

List<Employee> staff = List.of(new Programmer(), new Cook());
for (Employee e : staff) e.work();     // one call — different behaviour
```

Kinds of polymorphism: **overriding** (runtime, as above) and **overloading** (compile time — one method name with different parameters). More on binding in the article [Static vs dynamic binding](#/extra/binding).

## Abstraction — the fourth principle

The video names three principles, but many sources and interviews list **four**: **abstraction** is added — singling out the essential characteristics of an object and dropping the inessential ones. The `Employee` interface is an abstraction: what matters is that an employee can `work()`, not how their working day is organised. Naming all four is never a mistake.

:::interview "Interview questions"
**List the principles of OOP.** — Encapsulation, inheritance, polymorphism (+ abstraction).

**Give a real-life example of polymorphism.** — A car: one interface (steering wheel, pedals), but different implementations: an expensive car drives smoother and faster than a cheap one.

**Composition or inheritance?** — "Favour composition over inheritance": inheritance tightly couples classes and breaks when the parent changes; composition (an object contains another and delegates to it) is more flexible. Use inheritance when it truly "is a" (is-a) and the Liskov substitution principle holds.
:::

## SOLID (not from the video, but asked from Junior+)

| Letter | Principle | In short |
|---|---|---|
| **S** | Single Responsibility | A class has one reason to change |
| **O** | Open/Closed | Open for extension, closed for modification (new behaviour — in a new class) |
| **L** | Liskov Substitution | A subclass can replace its parent without surprises (a square isn't a rectangle with setters) |
| **I** | Interface Segregation | Many small interfaces are better than one "fat" one |
| **D** | Dependency Inversion | Depend on abstractions, not concrete classes (the basis of DI in Spring) |

Also worth knowing: **DRY**, **KISS**, **YAGNI** and the main GoF patterns (Singleton, Factory, Builder, Strategy, Observer, Decorator — you've already seen the last one in I/O streams).

## Homework

The video has no tasks — practice.

:::task easy "An encapsulated account"
Rewrite a class with public fields `balance` and `owner` so the balance can't go negative and the owner can't be changed after creation. Write tests for the forbidden operations.
:::

:::task medium "Polymorphism instead of switch"
There's a method `double area(String type, double… params)` with a big `switch` on the shape type. Rewrite it with a `Shape` interface with an `area()` method and implementation classes. Add a new shape — how many places in the code did you have to change before and after?
:::

:::task hard "SOLID violations"
Given an `OrderService` class that validates an order itself, computes a discount via `if (customer.type == VIP)`, saves to the DB via `new MySqlRepository()` and sends an email via `new SmtpClient()`. Find the violations of each SOLID letter and refactor: extract the interfaces `DiscountPolicy`, `OrderRepository`, `Notifier`, pass dependencies through the constructor and cover the service with tests using fake implementations. About dependency injection — [DI](#/extra/dependency-injection).
:::
