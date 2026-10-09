Before the Stream API you need to master **lambda expressions** — a short way to write a "function" passed as a parameter. We see how an anonymous class turns into a lambda, what a **functional interface** is and why a lambda is impossible without one. In the homework we write our own `Predicate` and a universal filter.

## Video timestamps

- {{t j2 4:08:21}} — a new section: streams; lambdas first
- {{t j2 4:09:06}} — a thread with an anonymous `Runnable`
- {{t j2 4:09:32}} — IDEA suggests "Replace with lambda"
- {{t j2 4:09:58}} — turning an anonymous class into a lambda step by step
- {{t j2 4:11:21}} — the essence: we pass a function, not an object
- {{t j2 4:12:17}} — a functional interface: one abstract method
- {{t j2 4:12:46}} — mini-task: `Worker` and `Director`
- {{t j2 4:13:31}} — solution: an anonymous class and a lambda
- {{t j2 4:15:28}} — the `@FunctionalInterface` annotation
- {{t j2 4:16:02}} — a lambda with a parameter and a return value
- {{t j2 4:18:39}} — a lambda in a variable
- {{t j2 4:19:29}} — the parameter type can be omitted
- {{t j2 4:19:49}} — filtering even numbers from a collection
- {{t j2 4:22:42}} — homework: your own `Predicate`
- {{t j2 4:23:55}} — the solution

## From an anonymous class to a lambda

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println(1);
    }
}).start();
```

What in this code actually carries information? Only the method body. The compiler already knows the `Thread` constructor takes a `Runnable`, and `Runnable` has a single `run()` method with no parameters. Remove everything else:

```java
new Thread(() -> System.out.println(1)).start();
```

Syntax: `(parameters) -> { body }`.

| Variant | Example |
|---|---|
| No parameters | `() -> System.out.println("hi")` |
| One parameter (parentheses optional) | `n -> n * 2` |
| Several | `(a, b) -> a + b` |
| With types | `(int a, int b) -> a + b` |
| A block | `n -> { int r = n * 2; return r; }` |

If the body is a single expression, you omit the braces, `return` and `;`.

## Functional interfaces

A lambda can only be used where a **functional interface** is expected — an interface with **exactly one abstract method** (SAM, single abstract method). `default`, `static` and `Object` methods don't count.

```java
@FunctionalInterface
public interface Worker {
    String work(int count);
}

public class Director {
    public String force(Worker worker, int count) {
        return worker.work(count);
    }
}

String result = new Director().force(n -> {
    for (int i = 0; i < n; i++) System.out.println("Working");
    return "success";
}, 5);
```

`@FunctionalInterface` is optional but useful: the compiler reports an error if someone adds a second abstract method.

## Your own Predicate and a universal filter

```java
@FunctionalInterface
interface Predicate {
    boolean test(int value);
}

static List<Integer> filter(List<Integer> list, Predicate predicate) {
    List<Integer> result = new ArrayList<>();
    for (int n : list) {
        if (predicate.test(n)) result.add(n);
    }
    return result;
}

filter(numbers, n -> n % 2 == 0);     // even
filter(numbers, n -> n > 0);          // positive
filter(numbers, n -> n % 5 == 0);     // multiples of 5
```

One `filter` method instead of a dozen: **behaviour is passed as a parameter**. That's the idea of functional programming.

## What the video doesn't cover

### Standard functional interfaces

You rarely need to write your own — `java.util.function` has ready-made ones (the author warns not to confuse your `Predicate` with this one):

| Interface | Method | Meaning |
|---|---|---|
| `Predicate<T>` | `boolean test(T)` | a condition |
| `Function<T, R>` | `R apply(T)` | a transformation |
| `Consumer<T>` | `void accept(T)` | an action |
| `Supplier<T>` | `T get()` | a value supplier |
| `UnaryOperator<T>` | `T apply(T)` | `T → T` |
| `BinaryOperator<T>` | `T apply(T, T)` | folding two values |
| `BiFunction<T, U, R>` | `R apply(T, U)` | two arguments |

Plus primitive versions without boxing: `IntPredicate`, `IntFunction`, `ToIntFunction`, `IntBinaryOperator`…

### Method references

If a lambda just calls an existing method, replace it with a **method reference** (`::`):

| Lambda | Reference |
|---|---|
| `s -> System.out.println(s)` | `System.out::println` |
| `s -> s.length()` | `String::length` |
| `(a, b) -> Integer.compare(a, b)` | `Integer::compare` |
| `() -> new ArrayList<>()` | `ArrayList::new` |

### Composition

```java
Predicate<String> notEmpty = s -> !s.isEmpty();
Predicate<String> shortWord = s -> s.length() < 5;
Predicate<String> both = notEmpty.and(shortWord).negate();

Function<Integer, Integer> plus1 = x -> x + 1, twice = x -> x * 2;
plus1.andThen(twice).apply(3);   // 8
plus1.compose(twice).apply(3);   // 7
```

### Variable capture

A lambda sees local variables only if they're **effectively final** (never change). Class fields — without restrictions. `this` inside a lambda is the enclosing object, not the lambda itself (unlike an anonymous class).

More in the article [Functional programming](#/extra/functional).

## Homework

:::task video "Your own Predicate — from the video"
Create a functional interface `Predicate` with a method `boolean test(int)`. Rewrite `filter(List<Integer>, Predicate)` so the condition is passed as a parameter. Call it with an anonymous class, then with lambdas: even, positive, multiples of 5. {{t j2 4:22:42}}
??? Hint
Don't mix up the import with the standard `java.util.function.Predicate`. Solution: {{t j2 4:23:55}}
:::

:::task easy "A lambda calculator"
Create a `Map<String, IntBinaryOperator>` with the operations `+ - * / %` and evaluate an expression `a op b` entered by the user. No `switch` — just look up the operation in the map.
:::

:::task medium "A generic filter and mapper"
Write `static <T> List<T> filter(List<T>, Predicate<T>)` and `static <T, R> List<R> map(List<T>, Function<T, R>)` on the standard interfaces. Filter strings longer than 3 characters and convert them to upper case, using method references where possible.
:::

:::task hard "A validator builder"
Create `Validator<T>` — a functional interface `ValidationResult validate(T)` with `default` methods `and(Validator<T>)`, `or(…)` and static factories `notNull()`, `minLength(int)`, `matches(String regex)`. Assemble an e-mail validator from the pieces and print all the error messages.
:::
