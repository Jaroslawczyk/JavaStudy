What can and can't live in interfaces: `default` methods, static methods, constants, interface inheritance — and the top interview question: **how does an abstract class differ from an interface**. Plus what appeared after Java 8: `private` methods and `sealed` interfaces.

## Video timestamps

- {{t j2 7:00:17}} — a functional interface `Car` with a `go()` method
- {{t j2 7:01:15}} — adding `stop()` breaks all implementations and lambdas
- {{t j2 7:02:07}} — `default` methods (Java 8)
- {{t j2 7:02:38}} — "interfaces can't declare fields"?
- {{t j2 7:03:10}} — interface fields are `public static final`
- {{t j2 7:04:07}} — static methods in an interface
- {{t j2 7:04:45}} — an interface extends interfaces: `extends`
- {{t j2 7:05:09}} — question: abstract class vs interface

## default methods

The `Car` interface is used by hundreds of classes. Adding an abstract method `stop()` means breaking **all** implementations (and lambdas: the interface is no longer functional). The Java 8 solution is a method with a default implementation:

```java
@FunctionalInterface
public interface Car {
    void go();

    default void stop() {                       // default implementation
        System.out.println("Car stopped");
    }
}

Car car = () -> System.out.println("Car goes");  // still a lambda
car.go();
car.stop();
```

That's exactly how Java 8 added `stream()`, `removeIf`, `forEach` to `Collection` without breaking millions of classes.

### A default-method conflict

If a class implements two interfaces with the same `default` method, the compiler requires overriding it explicitly and, if desired, calling the one you want:

```java
class Amphibian implements Car, Boat {
    @Override public void stop() { Car.super.stop(); }
}
```

Rules: a class (or superclass) method always beats a `default`; a more specific interface beats its parent.

## Fields and static methods

```java
public interface Car {
    int MAX_SPEED = 200;                   // actually public static final

    static void printSpeed() {             // Java 8: called as Car.printSpeed()
        System.out.println(MAX_SPEED);
    }
}
```

- Any interface field is automatically **`public static final`** — a constant; an interface doesn't hold object state. Names are `UPPER_SNAKE_CASE`.
- An interface's static methods **aren't inherited** by implementations: only `Car.printSpeed()`.
- An interface can extend several interfaces: `interface Car extends Serializable, Comparable<Car>`.

## Abstract class vs interface

| | Abstract class | Interface |
|---|---|---|
| Meaning | A common **entity** of related classes ("is a") | A **contract**, behaviour ("can do") |
| State (instance fields) | ✅ any | ❌ constants only |
| Constructors | ✅ | ❌ |
| Methods with a body | ✅ any | `default`, `static`, `private` (Java 9) |
| Method modifiers | any | `public` (and `private` since Java 9) |
| Inheritance | only **one** class (`extends`) | any number (`implements`) |
| JDK example | `InputStream`, `AbstractList` | `Serializable`, `Comparable`, `Runnable` |

:::interview "Interview question"
**When do you choose an abstract class and when an interface?** — An interface by default: it describes a capability that unrelated classes can have and doesn't restrict inheritance. An abstract class — when a family of classes shares **state** and code and the classes really are related (the template method). They're often combined: the `List` interface + the skeletal implementation `AbstractList`.
:::

## What came later

:::outdated "Interfaces after Java 8"
- **`private` methods** (Java 9) — shared code for several `default` methods, invisible from outside.
- **`sealed` interfaces** (Java 17) — a list of permitted implementations:

```java
public sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}

double area = switch (shape) {            // pattern matching (Java 21): the compiler checks exhaustiveness
    case Circle c -> Math.PI * c.r() * c.r();
    case Square s -> s.side() * s.side();
};
```

The video says `default` methods were added "only for backward compatibility". That's the main reason, but today they're also used for convenient combinator methods (`Comparator.reversed()`, `Predicate.and()`), without abusing them to hold logic.
:::

## Homework

The video has no tasks — let's practise.

:::task easy "Default and static"
An interface `Greeter` with an abstract `String name()`, a `default String greet()` ("Hello, name!") and a `static Greeter of(String name)`. Create greeters with a lambda and via `Greeter.of`. Override `greet()` in one implementation.
:::

:::task medium "The diamond"
Two interfaces `Flyer` and `Swimmer` with the same `default void move()`. A class `Duck implements Flyer, Swimmer`: resolve the conflict so the duck first swims, then flies (`Flyer.super.move()`). What happens if you don't override it?
:::

:::task hard "A sealed payment hierarchy"
Describe `sealed interface Payment permits Card, Transfer, Cash` with record implementations and a method `fee(Payment p)` using a `switch` with pattern matching and no `default`. Add a new type `Crypto` and make sure the compiler points to every place that doesn't handle it. Compare with an abstract class and `instanceof`.
:::
