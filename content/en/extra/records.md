**Records** (`record`, Java 16) are a compact way to declare an immutable data-carrier class. One line replaces the constructor, getters, `equals`, `hashCode` and `toString`. The videos don't have them (the course predates Java 16), but today records are the standard for DTOs, API responses, map keys and values in streams.

## Before and after

```java
// Before Java 16: ~40 lines
public final class Point {
    private final int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public int getY() { return y; }
    @Override public boolean equals(Object o) { … }
    @Override public int hashCode() { … }
    @Override public String toString() { … }
}

// Java 16+
public record Point(int x, int y) {}

Point p = new Point(1, 2);
p.x();                         // an accessor without the get prefix
System.out.println(p);         // Point[x=1, y=2]
new Point(1, 2).equals(p);     // true — compared by components
```

## What the compiler generates

- a `private final` field for each component;
- a **canonical constructor** with all components;
- accessors `x()`, `y()`;
- `equals`, `hashCode`, `toString` over all components.

A record class is implicitly `final` and extends `java.lang.Record` — it can't extend other classes, but **it can implement interfaces**.

## The compact constructor: validation

```java
public record Money(BigDecimal amount, String currency) {
    public Money {                                   // compact: no parameters, no assignments
        Objects.requireNonNull(currency);
        if (amount.signum() < 0) throw new IllegalArgumentException("amount < 0");
        amount = amount.setScale(2, RoundingMode.HALF_UP);  // you can normalise
    }

    public Money plus(Money other) {                 // your own methods — sure
        return new Money(amount.add(other.amount), currency);
    }

    public static Money zero(String currency) {      // static factories too
        return new Money(BigDecimal.ZERO, currency);
    }
}
```

:::warning "Immutability is shallow"
`record Team(List<String> members)` — the field is final, but the list itself can be modified from outside. Make a defensive copy in the compact constructor: `members = List.copyOf(members);`.
:::

## Records and pattern matching (Java 21)

```java
sealed interface Shape permits Circle, Rect {}
record Circle(double r) implements Shape {}
record Rect(double w, double h) implements Shape {}

double area(Shape s) {
    return switch (s) {
        case Circle(double r) -> Math.PI * r * r;           // a record pattern — deconstruction
        case Rect(double w, double h) -> w * h;
    };
}

if (obj instanceof Point(int x, int y) && x == y) { … }
```

## Where to use them and where not

| ✅ Good | ❌ Not a fit |
|---|---|
| DTOs and REST API responses (Jackson supports them) | JPA entities (`@Entity` requires mutability and a no-arg constructor) |
| `Map` keys, `Set` elements | Classes with mutable state |
| Returning several values from a method | Inheritance hierarchies |
| Intermediate data in streams | Classes with lazy/computed cache fields |
| Configuration (`@ConfigurationProperties` in Spring Boot) | |

:::note "Records and Lombok"
The same used to be done with Lombok's `@Value`/`@Data` annotations. For immutable data, records are replacing them: they're part of the language, no plugin needed. Lombok is still used for `@Builder` and mutable classes.
:::

:::interview "Interview questions"
**How does a record differ from a regular class?** — Immutable components; a generated constructor/accessors/`equals`/`hashCode`/`toString`; the class is `final`; you can't extend it or declare instance fields other than the components.

**Can a record be a JPA entity?** — No (mutability and a no-arg constructor are needed), but it can be used as a DTO, a Spring Data projection or an `@Embeddable` in Hibernate 6.2+.
:::

## Homework

:::task easy "Rewrite as a record"
Take the `Car` class from part 1 of the course (fields, constructor, getters, `equals`/`hashCode`) and rewrite it as a record. Make sure a `HashSet<Car>` works the same.
:::

:::task medium "A validating record"
Create `record Email(String value)` with a compact constructor that trims whitespace, lower-cases and checks the format with a regular expression. Write tests for valid and invalid addresses.
:::

:::task hard "An expression calculator on records"
Describe an expression tree `sealed interface Expr permits Num, Add, Mul, Neg` with record implementations and a method `static int eval(Expr e)` via a `switch` with record patterns (nested, e.g. `case Mul(Num(var a), Num(var b))`). Add an infix-notation `toString` and the simplification `x * 1 → x`.
:::
