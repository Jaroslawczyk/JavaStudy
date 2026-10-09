**Method chaining** (a fluent interface) is a style in which methods return an object so you can call the next methods "with a dot". You've already used it: `new StringBuilder().append("a").append("b")`, `list.stream().filter(…).map(…).toList()`. Let's see how to write such APIs yourself, plus the **Builder** pattern.

## Returning this

```java
public class HttpRequestSpec {
    private String url;
    private String method = "GET";
    private final Map<String, String> headers = new LinkedHashMap<>();

    public HttpRequestSpec url(String url) { this.url = url; return this; }
    public HttpRequestSpec method(String m) { this.method = m; return this; }
    public HttpRequestSpec header(String k, String v) { headers.put(k, v); return this; }
}

var spec = new HttpRequestSpec()
        .url("https://api.example.com/users")
        .method("POST")
        .header("Content-Type", "application/json");
```

## The Builder pattern

When an object has many parameters (some required, some optional), an 8-argument constructor is unreadable: `new User("Ann", null, 25, true, false, null, "PL", 3)`. A Builder solves this and lets the object itself be **immutable**:

```java
public final class User {
    private final String name;
    private final int age;
    private final String country;

    private User(Builder b) {
        this.name = b.name;
        this.age = b.age;
        this.country = b.country;
    }

    public static Builder builder(String name) { return new Builder(name); }

    public static final class Builder {
        private final String name;          // required — in the builder's constructor
        private int age;
        private String country = "PL";      // a default value

        private Builder(String name) { this.name = Objects.requireNonNull(name); }
        public Builder age(int age) { this.age = age; return this; }
        public Builder country(String c) { this.country = c; return this; }

        public User build() {
            if (age < 0) throw new IllegalStateException("age < 0");   // consistency check
            return new User(this);
        }
    }
}

User u = User.builder("Ann").age(25).build();
```

:::tip "Without hand-written code"
Lombok generates a builder with the `@Builder` annotation. For small immutable data a `record` with a few static factories or "wither" methods is often enough: `money.withAmount(…)` returns a new object instead of changing the current one.
:::

## Where to be careful

- **Debugging and stack traces:** in a long chain it's hard to tell which call failed (a `NullPointerException` on a line with 10 calls). Since Java 14 "helpful NPEs" point to the expression that was `null`; put each call on its own line.
- **The Law of Demeter:** a chain like `order.getCustomer().getAddress().getCity().getName()` isn't a fluent API but a code smell: the caller knows too much about the internals of objects.
- **Inheritance:** if a parent's method returns `Parent`, the chain "loses" the subclass's methods. Solutions — overriding with a covariant return type or a generic `self` type (`<T extends Builder<T>>`).

## Homework

:::task easy "A StringBuilder lite"
Write a `TextBuilder` with methods `add(String)`, `space()`, `newLine()`, `repeat(String, int)`, each returning `this`, and `build()`. Assemble a short poem in one chain.
:::

:::task medium "A Builder with checks"
Create an immutable `Pizza` class (size required, "thin" dough by default, up to 5 toppings) with a nested `Builder`. `build()` throws an exception when the rules are broken. Write tests for edge cases.
:::

:::task hard "A type-safe step builder"
Implement a step builder for `Email`: first `from(…)` is required, then `to(…)`, then `subject(…)`, and only then are the optional `cc(…)`, `body(…)` and `build()` available. Use a chain of interfaces (`FromStep → ToStep → SubjectStep → OptionalStep`) so that a wrong call order doesn't compile.
:::
