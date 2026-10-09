An **enumeration** (`enum`) is a type with a fixed set of values: days of the week, order statuses, user roles. The video doesn't cover enums, but they're everywhere in real code — and they're much more than a "list of constants".

## Basic syntax

```java
public enum OrderStatus {
    NEW, PAID, SHIPPED, DELIVERED, CANCELLED
}

OrderStatus s = OrderStatus.PAID;
if (s == OrderStatus.PAID) { … }            // enums are compared with ==
```

Each constant is the single instance of the `OrderStatus` class (`public static final`). You can't create a new instance with `new`, so `==` is safe and faster than `equals`.

| Method | What it does |
|---|---|
| `values()` | An array of all constants in declaration order |
| `valueOf("PAID")` | A constant by name (`IllegalArgumentException` if absent) |
| `name()` | The constant's name as written in code |
| `ordinal()` | Its zero-based position |
| `compareTo` | Comparison by `ordinal` |

:::warning "Don't store ordinal() in the database"
If someone inserts a new constant in the middle of the list, all numbers shift and the data in the DB "changes meaning". Store `name()` (in JPA — `@Enumerated(EnumType.STRING)`) or an explicit code field.
:::

## Fields, constructors, methods

An enum is a full-fledged class:

```java
public enum Planet {
    MERCURY(3.303e23, 2.4397e6),
    EARTH(5.976e24, 6.37814e6);

    private final double mass, radius;

    Planet(double mass, double radius) {         // the constructor is always private
        this.mass = mass;
        this.radius = radius;
    }

    public double surfaceGravity() {
        return 6.67300E-11 * mass / (radius * radius);
    }
}
```

It can implement an interface and even give each constant its own behaviour:

```java
public enum Operation implements IntBinaryOperator {
    PLUS("+")  { public int applyAsInt(int a, int b) { return a + b; } },
    MINUS("-") { public int applyAsInt(int a, int b) { return a - b; } };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
}
```

## Enums and switch

```java
String text = switch (status) {                 // a switch expression, Java 14+
    case NEW, PAID -> "Processing";
    case SHIPPED -> "On the way";
    case DELIVERED -> "Delivered";
    case CANCELLED -> "Cancelled";
};                                              // no default: the compiler checks exhaustiveness
```

If you add a new constant, a switch expression without `default` stops compiling — the compiler itself shows every place that needs updating.

## EnumSet and EnumMap

Special collections for enum keys — very fast (a bit mask / an array inside):

```java
EnumSet<DayOfWeek> weekend = EnumSet.of(DayOfWeek.SATURDAY, DayOfWeek.SUNDAY);
EnumSet<DayOfWeek> workdays = EnumSet.complementOf(weekend);

EnumMap<OrderStatus, Long> stats = new EnumMap<>(OrderStatus.class);
stats.merge(OrderStatus.PAID, 1L, Long::sum);
```

## A singleton via enum

```java
public enum AppConfig {
    INSTANCE;
    private final Properties props = load();
    public String get(String key) { return props.getProperty(key); }
}
```

Joshua Bloch calls this the best way to implement a singleton: thread-safe initialisation and protection against reflection and serialisation out of the box.

:::interview "Interview questions"
**Can you extend an enum?** — No: an enum is implicitly `final` and already extends `java.lang.Enum`. But an enum can implement interfaces.

**Why are enums compared with `==`?** — Each constant exists as a single instance; `==` is safe, faster and doesn't fail on `null`.
:::

## Homework

:::task easy "A traffic light"
Create `enum TrafficLight { RED, YELLOW, GREEN }` with a `next()` method returning the next colour in a cycle, and a `durationSeconds` field. Print a cycle of 6 switches.
:::

:::task medium "An enum calculator"
Implement `enum Operation` with the constants `PLUS, MINUS, MULTIPLY, DIVIDE`, a `symbol` field and an abstract method `apply(double, double)`. Add a static `fromSymbol(String)` using a lookup in a `Map` built once from `values()`. Handle division by zero.
:::

:::task hard "An order state machine"
Describe `OrderStatus` with allowed transitions (`NEW → PAID → SHIPPED → DELIVERED`, cancellation only from `NEW` and `PAID`) via `EnumSet<OrderStatus> allowedNext()`. The `Order` class must throw an exception on an illegal transition. Cover all transitions with a JUnit parameterised test (`@EnumSource`).
:::
