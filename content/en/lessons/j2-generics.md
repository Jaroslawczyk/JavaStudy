We start the second part of the course with **generics** (parameterised types). This is the mechanism that lets `List<String>` hold only strings and lets the compiler catch type errors before the program even runs. You can't read modern Java code without generics: collections, the Stream API, Optional, Spring — everything is built on them.

## Video timestamps

- {{t j2 0:00}} — intro to part two, a new project
- {{t j2 0:10}} — a `Box` class that stores an `Object`
- {{t j2 3:18}} — `ClassCastException`: a string instead of a number
- {{t j2 5:40}} — the parameterised class `Box<T>`
- {{t j2 8:31}} — type erasure
- {{t j2 9:31}} — the collections we wrote can be parameterised too
- {{t j2 10:34}} — several parameters: `Map<K, V>`
- {{t j2 11:22}} — `Box<K, V>` with two types
- {{t j2 13:27}} — a parameter must be a reference type (`Integer`, not `int`)
- {{t j2 14:01}} — homework: a `Box` with three types
- {{t j2 14:46}} — the solution

## The problem: a container for Object

Say we need a "box" that can hold anything. Before Java 5 you'd write:

```java
public class Box {
    private Object item;

    public Box(Object item) { this.item = item; }
    public Object getItem() { return item; }
}

Box box1 = new Box(5);
Box box2 = new Box("10");           // a mistake, but the compiler is silent
int sum = (Integer) box1.getItem() + (Integer) box2.getItem();
// ClassCastException: String cannot be cast to Integer — at runtime!
```

Two problems: **manual casts** everywhere and **errors that only show up at runtime**.

## The solution: a type parameter

```java
public class Box<T> {          // T is a type parameter
    private T item;

    public Box(T item) { this.item = item; }
    public T getItem() { return item; }
}

Box<Integer> box1 = new Box<>(5);
Box<Integer> box2 = new Box<>("10");   // ❌ compile error — exactly what we want
int sum = box1.getItem() + box2.getItem();  // no casts
```

- `T` is just a placeholder name. By convention: `T` (type), `E` (element), `K`/`V` (key/value), `R` (result), `U`, `S` — extra types.
- `<>` on the right is the **diamond operator** (Java 7+): the type is inferred from the left side.
- There can be several parameters: `class Box<K, V>`, like `Map<K, V>`.

```java
public class Pair<K, V> {
    private final K key;
    private final V value;
    public Pair(K key, V value) { this.key = key; this.value = value; }
    public K getKey() { return key; }
    public V getValue() { return value; }
}

Pair<String, Integer> age = new Pair<>("Anna", 30);
```

## Type erasure

Generics exist **only for the compiler**. After compilation `Box<Integer>` and `Box<String>` are the same class `Box`, and `T` is replaced by `Object` (or by the bound, if there is one — see the lesson [Bounds and wildcards](#/lessons/j2-bounded-wildcards)). The compiler inserts casts where needed.

Consequences interviewers ask about:

| Not allowed | Why |
|---|---|
| `new T()` | At runtime nobody knows what `T` is |
| `new T[10]` | Same; arrays "know" their element type at runtime |
| `obj instanceof Box<String>` | There's no information about `String` (`instanceof Box<?>` is fine) |
| `Box<int>` | Parameters are reference types only; use `Integer` (autoboxing) |
| Overloading `m(List<String>)` and `m(List<Integer>)` | After erasure the signatures are identical |
| A static field of type `T` | Statics are shared by all `Box<…>`, while each has its own `T` |

:::interview "Interview question"
**What is type erasure?** — The compiler checks types using generics and then erases the type parameters: the bytecode contains raw types (`Object` or the upper bound), and casts are inserted automatically. That's why `List<String>` and `List<Integer>` are indistinguishable at runtime. It was done for backward compatibility with pre-Java 5 code.
:::

## What the video doesn't cover

### Raw types

`Box box = new Box(5);` without angle brackets is a **raw type**. It exists for compatibility; the compiler emits an `unchecked` warning. Don't use raw types in new code — you lose all type checking.

### `var` and generics (Java 10+)

```java
var map = new HashMap<String, List<Integer>>();   // the type is inferred from the right
```

With `var` you can't use an empty diamond on the right — the compiler has nothing to infer from (you'd get `HashMap<Object, Object>`).

### Records can be generic too

```java
record Pair<K, V>(K key, V value) {}          // Java 16+
var p = new Pair<>("Java", 25);
```

More about records in the article [Records](#/extra/records).

:::outdated "How small collections are created today"
The video creates collections with `new ArrayList<>()` and `add`. For small immutable sets of values Java 9 added factories: `List.of(1, 2, 3)`, `Set.of("a", "b")`, `Map.of("k", 1)`. They're shorter and safer (any attempt to modify them throws `UnsupportedOperationException`).
:::

:::note "The future: generics over primitives"
Right now `List<int>` is impossible, and `List<Integer>` stores boxed objects — extra memory and extra work for the garbage collector. Project **Valhalla** (value classes) has long been preparing a fix; as of 2026 it's not yet part of stable Java. For large sets of numbers use `int[]` or `IntStream`.
:::

## Homework

:::task video "A box with three types — from the video"
Extend the `Box` class so it stores three values of **different** types (e.g. `String`, `Integer`, `Float`), and compute the sum of the numbers in the box: `"a"`, `5`, `12.0f` → `17`. {{t j2 14:01}}
??? Hint
Three parameters: `class Box<T, V, S>`. Solution: {{t j2 14:46}}
:::

:::task easy "Pair and swap"
Write a generic class `Pair<A, B>` and a method `Pair<B, A> swap()` that returns a new pair with the elements swapped. Test it on `Pair<String, Integer>`.
:::

:::task medium "A type-safe cache"
Write a class `TypedCache<K, V>` on top of `HashMap<K, V>` with methods `put`, `get` and `getOrDefault(K key, V def)`. Try putting a string into a `TypedCache<String, Integer>` — make sure the code doesn't compile. Then rewrite it with a raw `HashMap` and show how the same mistake turns into a `ClassCastException`.
:::

:::task hard "Erasure with your own eyes"
1) Create a `List<String>` and a `List<Integer>`, compare `a.getClass() == b.getClass()` and explain the result. 2) Using a raw type, put an `Integer` into a `List<String>` and find the line where the program actually fails (not at `add`!). 3) Compile `Box<T>` and look at the bytecode with `javap -c Box` — find `Object` and `checkcast`.
??? Hint
The `ClassCastException` happens on read, where the compiler inserted a hidden `checkcast`, e.g. `String s = list.get(0);`.
:::
