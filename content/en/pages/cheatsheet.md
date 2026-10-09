# Java Cheatsheet: Short and Factual

A quick-review cheatsheet. Details are in the course lessons.

## Basics

- Java compiles to **bytecode** that runs on the **JVM** (`.java` → `javac` → `.class` → `java`).
- **JDK** = JRE + tools (`javac`, `jar`); **JRE** = JVM + libraries.
- Entry point: `public static void main(String[] args)`.
- Naming: classes `PascalCase`, methods and variables `camelCase`, constants `UPPER_SNAKE`, packages `lowercase`.
- Case-sensitive. A file with `public class Foo` must be named `Foo.java`.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

## Data types

| Type | Size | Range / note |
|---|---|---|
| `byte` | 8 bits | −128…127 |
| `short` | 16 bits | −32,768…32,767 |
| `int` | 32 bits | ≈ ±2.1 billion (default for integers) |
| `long` | 64 bits | suffix `L` |
| `float` | 32 bits | suffix `f` |
| `double` | 64 bits | default for decimals |
| `char` | 16 bits | UTF-16, `'a'` |
| `boolean` | — | `true` / `false` |

- Everything else is a **reference type** (objects, arrays, `String`). Default value: `null`; primitive fields default to `0` / `false`.
- **Wrappers:** `Integer`, `Long`, `Double`, `Boolean`… Autoboxing/unboxing. `Integer` is cached for −128…127: `==` on larger values compares references → use `equals`.
- Widening (`int → long`) is automatic; narrowing needs an explicit cast: `(int) 3.9` → `3`.
- `int` overflow silently wraps around. For money use `BigDecimal`, not `double`.
- `var x = 10;` — type inference (local variables only).
- `int / int` is integer division: `7 / 2 == 3`, `7 % 2 == 1`.

## Operators and control flow

- Comparison: `==` (primitives / references), `equals()` (object value).
- Logic: `&&`, `||` are **short-circuit**; `&`, `|` evaluate both sides.
- `i++` (value first, then +1), `++i` (+1 first).
- Ternary: `a > b ? a : b`.

```java
for (int i = 0; i < n; i++) { }
for (String s : list) { }          // for-each
while (cond) { }
do { } while (cond);
break; continue;                    // exit / next iteration

// switch expression (Java 14+)
String name = switch (day) {
    case 1, 7 -> "weekend";
    case 2, 3, 4, 5, 6 -> "work";
    default -> "?";
};
```

## Strings

- `String` is **immutable**; literals live in the String Pool.
- Compare with `s1.equals(s2)`, `equalsIgnoreCase`. Not `==`!
- Common methods: `length()`, `charAt(i)`, `substring(a, b)`, `indexOf`, `contains`, `split`, `trim`/`strip`, `isBlank`, `toUpperCase`, `replace`, `join`, `repeat`.
- Lots of concatenation in a loop → `StringBuilder` (not thread-safe; `StringBuffer` is thread-safe but slower).
- Text block: `""" ... """` (Java 15+). Formatting: `"%s = %d".formatted(a, b)`.

## Arrays

```java
int[] a = new int[5];          // zeros
int[] b = {1, 2, 3};
int[][] m = new int[3][4];
a.length;                      // a field, not a method
Arrays.sort(b); Arrays.toString(b); Arrays.fill(a, 0);
Arrays.copyOf(b, 10); Arrays.equals(a, b); Arrays.asList(1, 2, 3);
```

- Fixed size. Out of bounds → `ArrayIndexOutOfBoundsException`.

## OOP

**4 principles:** encapsulation (hide data: `private` + getters/setters), inheritance (`extends`), polymorphism (one interface, different behavior), abstraction.

```java
class Animal {
    protected String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override void speak() { System.out.println("Woof"); }
}
Animal a = new Dog("Rex");   // upcasting
a.speak();                   // Woof — dynamic dispatch
```

- **Access modifiers:** `private` (class) < package-private (package) < `protected` (package + subclasses) < `public` (everyone).
- **Constructor:** named after the class, no return type. If none is written, a default no-arg one exists. `this(...)` / `super(...)` must be the first line.
- **Overloading:** same name, different parameters (resolved at compile time). **Overriding:** same method in a subclass (resolved at runtime).
- `static` belongs to the class, not the object. `final`: a variable can't be reassigned, a method can't be overridden, a class can't be extended.
- A class extends only one class but can implement many interfaces.
- `Object`: `equals`, `hashCode`, `toString`, `getClass`. **Contract:** equal objects → equal `hashCode`. Override one — override both.
- `instanceof` + pattern matching: `if (o instanceof String s) { s.length(); }`.

### Abstract class vs interface

| | `abstract class` | `interface` |
|---|---|---|
| State (fields) | yes | only `static final` constants |
| Constructor | yes | no |
| Inheritance | one | many (`implements`) |
| Methods | abstract and concrete | `abstract`, `default`, `static`, `private` |
| When | shared base ("is a") | contract ("can do") |

### Nested classes, enum, record

- Nested: `static nested`, inner (holds a reference to the outer object), local, anonymous (`new Interface() { ... }`).
- `enum` — a set of constants, may have fields and methods; `values()`, `valueOf()`, `ordinal()`.
- `record Point(int x, int y) {}` — an immutable data carrier (constructor, `x()` accessors, `equals`, `hashCode`, `toString` are generated).
- `sealed interface Shape permits Circle, Square {}` — restricts subclasses.

## Exceptions

```text
Throwable
├── Error                 (OutOfMemoryError, StackOverflowError — don't catch)
└── Exception
    ├── checked           (IOException, SQLException — must be handled)
    └── RuntimeException  (unchecked: NPE, IllegalArgument, IndexOutOfBounds, ClassCast, Arithmetic)
```

```java
try (var in = new FileInputStream("f.txt")) {   // try-with-resources: automatic close()
    // ...
} catch (IOException | IllegalStateException e) {
    log(e);
} finally {
    // runs almost always
}
throw new IllegalArgumentException("bad");
void read() throws IOException { }               // declare a checked exception
```

- Catch **specific** exceptions, never swallow them silently. Narrow `catch` blocks first, broad ones last.
- Custom exception: `class MyEx extends RuntimeException`.
- `finally` won't run on `System.exit()` or a JVM crash.

## Collections

```text
Iterable → Collection ─┬─ List  (ArrayList, LinkedList)
                       ├─ Set   (HashSet, LinkedHashSet, TreeSet)
                       └─ Queue (ArrayDeque, PriorityQueue)
Map (HashMap, LinkedHashMap, TreeMap)   — does not extend Collection
```

| Structure | Order | Duplicates | Complexity | Notes |
|---|---|---|---|---|
| `ArrayList` | insertion | yes | get O(1), add at end O(1)*, insert/remove in the middle O(n) | backed by an array, default List |
| `LinkedList` | insertion | yes | get O(n), add/remove by reference O(1) | rarely needed |
| `HashSet` | none | no | O(1) | backed by `HashMap` |
| `LinkedHashSet` | insertion | no | O(1) | |
| `TreeSet` | sorted | no | O(log n) | red-black tree |
| `HashMap` | none | unique keys | O(1) | one `null` key allowed |
| `TreeMap` | by key | — | O(log n) | |
| `ArrayDeque` | — | yes | O(1) at both ends | stack and queue |
| `PriorityQueue` | by priority | yes | O(log n) | heap |

\* amortized.

**HashMap internals:** `hashCode()` → bucket index → a chain inside (a list; turns into a tree at ≥ 8 entries when the table has ≥ 64 buckets). Load factor `0.75`; when exceeded, the table resizes ×2. So keys need correct `equals` + `hashCode` and should be immutable.

```java
List<String> list = new ArrayList<>(List.of("a", "b"));   // List.of is immutable
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.getOrDefault("x", 0);
map.merge("a", 1, Integer::sum);
map.computeIfAbsent("k", k -> 0);
for (Map.Entry<String, Integer> e : map.entrySet()) { }

list.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));
Collections.sort(list);
Collections.unmodifiableList(list);
```

- Removing inside `for-each` → `ConcurrentModificationException`. Use `Iterator.remove()` or `removeIf`.
- `Comparable` (natural order, `compareTo`) vs `Comparator` (external, `compare`).
- Thread-safe: `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`.

## Generics

```java
class Box<T extends Number> { T value; }
<T> T first(List<T> list) { return list.get(0); }
List<? extends Number> read;     // producer: read (extends)
List<? super Integer> write;     // consumer: write (super)  — PECS
```

- Erased at compile time (**type erasure**): at runtime `List<String>` = `List`. No `new T()`, `new T[]`, or primitive type arguments (`List<int>`).
- `List<Object>` is not a supertype of `List<String>` (invariance).

## Lambdas and Stream API

- **Functional interface** — exactly one abstract method (`@FunctionalInterface`): `Runnable`, `Supplier<T>`, `Consumer<T>`, `Function<T,R>`, `Predicate<T>`, `BiFunction`, `UnaryOperator`.
- Method references: `String::length`, `System.out::println`, `ArrayList::new`.

```java
List<String> result = people.stream()
    .filter(p -> p.age() >= 18)         // intermediate operations (lazy)
    .map(Person::name)
    .sorted()
    .distinct()
    .limit(10)
    .toList();                           // terminal operation runs the pipeline

int sum = nums.stream().mapToInt(Integer::intValue).sum();
Map<String, List<Person>> byCity = people.stream().collect(Collectors.groupingBy(Person::city));
String s = names.stream().collect(Collectors.joining(", "));
boolean any = list.stream().anyMatch(x -> x > 5);   // allMatch, noneMatch
```

- A stream can be used once. Don't modify the source inside it. `parallelStream()` only for heavy, independent work.
- `Optional<T>`: `of`, `ofNullable`, `empty`, `map`, `orElse`, `orElseGet`, `orElseThrow`, `ifPresent`. Don't use it for fields or parameters.

## Concurrency

```java
Thread t = new Thread(() -> work());
t.start();                          // start(), not run()!
t.join();

ExecutorService pool = Executors.newFixedThreadPool(4);
Future<Integer> f = pool.submit(() -> compute());
f.get();
pool.shutdown();

CompletableFuture.supplyAsync(() -> load()).thenApply(this::parse).thenAccept(System.out::println);
```

- Thread states: NEW → RUNNABLE → BLOCKED / WAITING / TIMED_WAITING → TERMINATED.
- **`synchronized`** — mutual exclusion on an object's monitor (method or block); also guarantees visibility.
- **`volatile`** — visibility across threads and no reordering; **not** atomicity (`count++` is unsafe).
- Atomicity: `AtomicInteger`, `LongAdder`; locks: `ReentrantLock`, `ReadWriteLock`; synchronizers: `CountDownLatch`, `Semaphore`, `CyclicBarrier`.
- **Problems:** race condition, deadlock, livelock, starvation.
- `wait()` / `notify()` only inside `synchronized`. `sleep()` does not release the monitor.
- Java 21: **virtual threads** — `Thread.ofVirtual().start(...)`, `Executors.newVirtualThreadPerTaskExecutor()` — cheap threads for I/O-bound tasks.

## Memory and the JVM

- **Stack** (per thread): call frames, local primitives and references. **Heap** (shared): objects. **Metaspace**: class metadata.
- Java is **always pass-by-value**: for objects the *reference* is copied — you can change the object's state, but not replace the caller's object.
- The **Garbage Collector** removes unreachable objects. Generations: Young (Eden + Survivor) → Old. Collectors: G1 (default), ZGC, Shenandoah, Parallel.
- Memory leaks: static collections, unclosed resources, forgotten listeners, `ThreadLocal`.
- References: strong, `SoftReference`, `WeakReference`, `PhantomReference`.
- Errors: `StackOverflowError` (deep recursion), `OutOfMemoryError`.
- Class loaders: Bootstrap → Platform → Application (parent delegation).
- Serialization: `Serializable`, `transient` excludes a field. Reflection: `Class<?> c = obj.getClass();`.

## I/O and time

```java
Path p = Path.of("data.txt");
List<String> lines = Files.readAllLines(p);
String text = Files.readString(p);
Files.writeString(p, "hi");
try (BufferedReader r = Files.newBufferedReader(p)) { r.readLine(); }
```

- Bytes: `InputStream` / `OutputStream`; characters: `Reader` / `Writer`. Wrap them in `Buffered*`. Always close them (try-with-resources).
- Time (`java.time`, immutable): `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime`, `Instant`, `Duration`, `Period`, `DateTimeFormatter`. Don't use the old `Date` and `Calendar`.

## Java versions

| Version | Highlights |
|---|---|
| 8 (LTS) | lambdas, Stream API, `Optional`, `java.time`, default methods |
| 9 | modules, `List.of` / `Map.of` |
| 10 / 11 (LTS) | `var`; `String.isBlank`, `HttpClient` |
| 14–17 (LTS) | switch expressions, text blocks, `record`, `sealed`, `instanceof` patterns |
| 21 (LTS) | virtual threads, pattern matching in `switch`, record patterns, sequenced collections |

## Practical rules

- Declare by interface: `List<String> l = new ArrayList<>();`.
- Make classes immutable where possible (`final` fields, no setters).
- Return an empty collection, not `null`; use `Optional` for an optional value.
- Compare with `equals` and put the constant first: `"a".equals(s)` (NPE-safe).
- Close resources with try-with-resources.
- Prefer composition over inheritance. Principles: DRY, KISS, SOLID.

### SOLID in one line each

- **S** — a class has one reason to change.
- **O** — open for extension, closed for modification.
- **L** — a subclass can replace its parent without breaking anything.
- **I** — several narrow interfaces beat one wide one.
- **D** — depend on abstractions, not implementations.
