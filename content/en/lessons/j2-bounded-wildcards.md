Sometimes "any type" is too much. To compute an average you need a type that **can behave like a number**. For that, type parameters get an upper bound (`T extends Number`), and method parameters use the **wildcard** `?`. We'll also break down the main trap of generics: why `List<Integer>` is **not** a `List<Number>`.

## Video timestamps

- {{t j2 30:08}} — `Box<T>` with an array and an `avg()` method
- {{t j2 33:13}} — we need `doubleValue()`, but `T` doesn't have it
- {{t j2 34:44}} — an upper bound: `T extends Number`
- {{t j2 35:37}} — several bounds: `T extends Number & Comparable<T>`
- {{t j2 37:00}} — comparing two boxes by their average
- {{t j2 39:01}} — `Box<Integer>` won't accept `Box<Double>`: the wildcard `Box<?>`
- {{t j2 39:26}} — `Box<? extends Number>`
- {{t j2 40:08}} — `List<Number>` vs `List<? extends Number>`: invariance
- {{t j2 43:20}} — lesson summary

## Upper bound: `T extends Number`

```java
public class Box<T extends Number> {
    private final T[] array;

    @SafeVarargs
    public Box(T... array) { this.array = array; }

    public double avg() {
        double sum = 0;
        for (T item : array) {
            sum += item.doubleValue();     // available: T is definitely a Number
        }
        return sum / array.length;
    }
}

Box<Integer> ints = new Box<>(1, 2, 3);
Box<Double> doubles = new Box<>(1.5, 2.5);
Box<String> strings = new Box<>("a");      // ❌ String is not a Number
```

- Here `extends` means "this class **or a subclass**", and for interfaces — "**implements**" (the word `implements` isn't used in generics).
- After erasure `T` is replaced not by `Object` but by the **bound** — `Number`. That's why `Number`'s methods are available.

### Several bounds

```java
class Box<T extends Number & Comparable<T>> { … }
```

At most **one class** can come first, then any number of interfaces joined with `&`. Inside, the methods of both `Number` and `Comparable` are available.

## The wildcard `?` — "some type"

We want to compare an `Integer` box with a `Double` box:

```java
public boolean compare(Box<T> another) { … }     // Box<Integer> accepts only Box<Integer>

public boolean compare(Box<?> another) {          // any box
    return Math.abs(avg() - another.avg()) < 0.0001;
}
```

`Box<?>` is "a box of an unknown type". Since we know `T extends Number`, `another.avg()` is available.

## Invariance: the main trap

`Integer` is a subclass of `Number`. But **`List<Integer>` is not a subtype of `List<Number>`**:

```java
static double sum(List<Number> list) { … }

List<Integer> ints = List.of(1, 2, 3);
sum(ints);                     // ❌ doesn't compile
```

Why is that correct? If it were allowed, the method could put a `Double` into "your" list:

```java
static void broken(List<Number> list) { list.add(3.14); }   // into a List<Integer>?!
```

The solution is a bounded wildcard:

```java
static double sum(List<? extends Number> list) {
    double s = 0;
    for (Number n : list) s += n.doubleValue();   // you can read as Number
    // list.add(1);                               ❌ you can't write (except null)
    return s;
}
sum(List.of(1, 2, 3));        // ✅
sum(List.of(1.5, 2.5));       // ✅
```

| Declaration | What you can pass | Read | Write |
|---|---|---|---|
| `List<Number>` | only `List<Number>` | `Number` | `Number` and subtypes |
| `List<? extends Number>` | `List<Integer>`, `List<Double>`, … | `Number` | ❌ |
| `List<? super Integer>` | `List<Integer>`, `List<Number>`, `List<Object>` | only `Object` | `Integer` |
| `List<?>` | any list | `Object` | ❌ |

`? super` is covered in detail in the [next lesson](#/lessons/j2-generic-methods) (the PECS rule).

:::interview "Interview question"
**Can you pass a `List<Integer>` to a method that takes `List<Number>`?** — No. Generics are **invariant**: `Integer` extends `Number`, but `List<Integer>` doesn't extend `List<Number>`. To accept a list of any numbers, declare the parameter as `List<? extends Number>`.
:::

:::note "Arrays behave differently"
Arrays are **covariant**: `Number[] arr = new Integer[3];` compiles. But `arr[0] = 1.5;` fails at runtime with an `ArrayStoreException`. Generics chose invariance to catch such errors at compile time.
:::

## What the video doesn't cover

- **`@SafeVarargs`.** A constructor/method with a `T...` parameter creates an array of a generic type, and the compiler warns about "heap pollution". If the method only reads its arguments, mark it `@SafeVarargs` (allowed on `final`, `static`, `private` methods and constructors).
- **A recursive bound** `T extends Comparable<? super T>` — that's how `Collections.max` is declared. It lets you compare, for example, `java.sql.Date`, which implements `Comparable<java.util.Date>`.
- **Type parameters have no lower bound.** `class Box<T super Integer>` is illegal; `super` exists only on wildcards.

## Homework

The video has no task in this lesson — let's practise with our own.

:::task easy "Box statistics"
Add methods `max()` and `min()` returning `double` to `Box<T extends Number>`. Test them on `Box<Integer>` and `Box<Float>`.
:::

:::task medium "Sum of any numbers"
Write `static double sum(Collection<? extends Number> c)` and call it with a `List<Integer>`, a `Set<Double>` and a `List<BigDecimal>`. Explain why you can't call `c.add(0)` inside the method.
:::

:::task medium "Max by Comparable"
Write `static <T extends Comparable<? super T>> T max(List<? extends T> list)` without using `Collections.max`. Test it on strings, numbers and your own `Car implements Comparable<Car>`.
:::

:::task hard "Break arrays, not generics"
1) Write code where `Object[] objs = new String[1]; objs[0] = 1;` fails with an `ArrayStoreException`. 2) Try the same with `List<Object> l = new ArrayList<String>();` — explain the compile error. 3) Using a raw type, "pollute" a `List<String>` with a number anyway and find where it fails.
:::
