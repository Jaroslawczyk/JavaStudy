Three topics you can't understand `HashSet` and `HashMap` without, and which come up in nearly every interview: **how memory works in Java** (stack and heap), the **garbage collector**, and the **`equals()`** and **`hashCode()`** methods.

## Video timestamps

- {{t j1 7:18:07}} — three important topics: memory, `equals`, `hashCode`
- {{t j1 7:18:40}} — two identical cars, yet `==` gives `false`
- {{t j1 7:19:40}} — the stack and the heap
- {{t j1 7:20:07}} — primitives and references live on the stack
- {{t j1 7:20:29}} — objects are created on the heap; the stack holds only an address
- {{t j1 7:21:01}} — what `==` compares
- {{t j1 7:21:25}} — two variables — one object
- {{t j1 7:23:05}} — an object without references and the garbage collector
- {{t j1 7:24:13}} — question: will the GC remove two objects referencing each other?
- {{t j1 7:24:37}} — why strings mustn't be compared with `==`
- {{t j1 7:25:32}} — the `equals` method
- {{t j1 7:26:21}} — `Object`'s `equals` compares references
- {{t j1 7:27:04}} — overriding `equals` in `Car`
- {{t j1 7:30:04}} — the `hashCode` method
- {{t j1 7:30:50}} — the rule: equal by `equals` → equal hash codes
- {{t j1 7:32:28}} — collisions
- {{t j1 7:33:12}} — generating `equals` and `hashCode` in IDEA
- {{t j1 7:35:00}} — interview questions

## Stack and heap

```java
int number = 5;                     // stack: number = 5
Car car1 = new Car("BMW", 1);       // stack: car1 = address → heap: a Car object
Car car2 = car1;                    // stack: car2 = the same address
```

| | Stack | Heap |
|---|---|---|
| What's stored | Local variables: primitives and **references** | All **objects** created with `new` (and arrays) |
| Whose | Each thread has its own | One per JVM, shared by all threads |
| Size | Small (usually ~1 MB per thread, the `-Xss` flag) | Large, limited by `-Xmx` (≈ ¼ of RAM by default) |
| Cleanup | Automatic when a method returns | The garbage collector (GC) |
| Overflow error | `StackOverflowError` (e.g. infinite recursion) | `OutOfMemoryError: Java heap space` |

So `car1 == car2` compares **the values on the stack** — the addresses. For primitives those are the values themselves; for objects it answers "is it the same object?".

## The garbage collector

```java
Car car1 = new Car("BMW", 1);
Car car2 = new Car("BMW", 1);
car2 = car1;     // nobody references the second object anymore — it becomes garbage
```

The GC removes objects that **can't be reached** from the "roots": local variables on thread stacks, static fields, active threads. Therefore:

- two objects referencing **only each other** will be removed — they can't be reached from the roots. Java uses a **tracing** GC, not reference counting, so cycles don't bother it;
- you don't need to call the GC manually (`System.gc()`) — it's only a "request"; the JVM decides itself.

:::note "A refinement to the video"
The video says "an object is removed when there are no references to it from the stack". That's a simplification: GC roots also include static class fields, JNI references and threads. An object referenced by a `static` field is never removed — a classic source of memory leaks. The default collector today is **G1** (and since Java 27 — in every environment); for minimal pauses there's **ZGC**.
:::

## equals — comparing by contents

`equals` is inherited from `Object`, and by default it does what `==` does — compares references. To compare by fields, it's **overridden**:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;                       // the same object
    if (o == null || getClass() != o.getClass()) return false;
    Car car = (Car) o;
    return number == car.number && Objects.equals(brand, car.brand);
}
```

### The equals contract

1. **Reflexive**: `x.equals(x)` is `true`.
2. **Symmetric**: if `x.equals(y)`, then `y.equals(x)`.
3. **Transitive**: `x.equals(y)` and `y.equals(z)` → `x.equals(z)`.
4. **Consistent**: repeated calls give the same result while the objects don't change.
5. `x.equals(null)` is always `false`.

## hashCode — an object's numeric representation

`hashCode()` returns an `int` that hash collections (`HashSet`, `HashMap`) use to quickly find the object's "bucket".

```java
@Override
public int hashCode() {
    return Objects.hash(brand, number);
}
```

### The rules for equals and hashCode

1. **Override `equals` — override `hashCode`.** Otherwise equal objects get different hash codes, a `HashSet` keeps "duplicates" and a `HashMap` can't find a key.
2. If objects are **equal** by `equals` → their hash codes **must** match.
3. If hash codes **differ** → the objects are definitely different.
4. If hash codes **match** → the objects may still differ — that's a **collision** (there are ~4.3 billion hash codes, but any number of objects).

<kbd>Alt+Insert</kbd> → **equals() and hashCode()** — IDEA generates both methods from the chosen fields.

## What the video doesn't cover

### getClass() or instanceof?

IDEA's generated code checks `getClass() != o.getClass()` — a subclass object is never equal to a parent object. The `instanceof` variant allows subclasses but easily breaks **symmetry**. Without a good reason, use `getClass()` or make the class `final`.

### Records do it for you

```java
public record Car(String brand, int number) { }
// equals, hashCode and toString are generated automatically from all fields
```

### Strings and the string pool

The JVM keeps string **literals** with the same text in the **string pool** as a single instance, so `"BMW" == "BMW"` happens to give `true`. But a string from input, a file or concatenation is a new object. So strings — only with `equals`. A `String`'s hash code is computed once and cached.

### Don't put mutable fields into a key's hashCode

If a field used in `hashCode` changes on an object already stored in a `HashSet`/`HashMap`, the object gets "lost" in the collection. Details in the `HashMap` lesson.

## Interview questions

:::interview "From the video"
1. **How is memory organised in Java?** — Primitives and object references are on the stack (each thread has its own), the objects themselves are on the heap.
2. **When does the garbage collector remove an object?** — When it's unreachable from the GC roots (stacks, static fields, threads).
3. **Will the GC remove two objects referencing only each other?** — Yes, if they can't be reached from the roots.
4. **Why can't strings and objects be compared with `==`?** — `==` compares references (addresses), not contents.
5. **How do you compare objects by fields?** — Override `equals` (and `hashCode` along with it).
6. **What are the rules for equals and hashCode?** — Override `equals` → override `hashCode`; equal objects — equal hash codes; different hash codes — different objects; equal hash codes don't guarantee equality (a collision).
:::

## Homework

The video has no separate task — let's practise.

:::task easy "Checking the contract"
Generate `equals`/`hashCode` for `Car`. Write tests checking reflexivity, symmetry, transitivity, `equals(null) == false` and that equal cars have equal hash codes.
:::

:::task medium "A broken hashCode"
Override only `equals` in `Car` (no `hashCode`), put 1000 pairs of identical cars into a `HashSet<Car>` and print `size()`. Then make `hashCode` always return `1` and time the insertion of 100,000 cars. Explain both results.
:::

:::task medium "StackOverflowError and OutOfMemoryError"
Trigger both errors on purpose: infinite recursion, and endlessly adding big arrays to a list. Run the second with `-Xmx64m` and see how quickly memory runs out. How do these errors differ from exceptions (`Exception`)?
:::

:::task hard "equals with inheritance"
You have `Point(x, y)` and `ColorPoint extends Point` with a `color` field. Implement `equals` with `instanceof` and show an example that breaks symmetry (`point.equals(colorPoint) != colorPoint.equals(point)`). Then fix it with `getClass()` and with composition (`ColorPoint` contains a `Point` instead of extending it). Which option does *Effective Java* recommend?
:::
