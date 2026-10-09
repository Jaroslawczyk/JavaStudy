A type parameter can be declared not only on a class but on a single **method**. Together with `? extends` and `? super` this gives flexible APIs like `Collections.copy(dest, src)`. At the end — a big homework with fruit baskets and interview questions on generics.

## Video timestamps

- {{t j2 44:22}} — generic methods: `<U> U getFirstElement(List<U> list)`
- {{t j2 47:10}} — task: a `transfer` method moves elements from one collection to another
- {{t j2 47:30}} — solution: a static generic method
- {{t j2 49:43}} — a `List<Number>` can hold both `Integer` and `Double`
- {{t j2 52:44}} — `List<? extends U> src, List<? super U> dst`
- {{t j2 53:31}} — homework: fruits and baskets
- {{t j2 55:38}} — solution: `Fruit`, `Apple`, `Orange`, `Basket<T extends Fruit>`
- {{t j2 58:22}} — the benefit of the bound: `T` has `getWeight()`
- {{t j2 59:07}} — comparing baskets via `Basket<?>`
- {{t j2 1:00:05}} — a static `transfer` with `? extends U` and `? super U`
- {{t j2 1:01:43}} — interview questions on generics

## A generic method

```java
public static <U> U getFirstElement(List<U> list) {
    return list.get(0);
}

String s  = getFirstElement(List.of("a", "b"));   // U = String (inferred)
Integer i = getFirstElement(List.of(1, 2));      // U = Integer
```

- The `<U>` declaration goes **before the return type**.
- The compiler infers the type from the arguments (type inference). Explicitly: `Main.<String>getFirstElement(list)`.
- A method's type parameter is independent of the class's and works even in `static` methods.

## Moving elements between collections

First attempt — both lists of the same type:

```java
static <U> void transfer(List<U> src, List<U> dst) {
    dst.addAll(src);
    src.clear();
}
List<Integer> ints = new ArrayList<>(List.of(1, 2));
List<Number> nums = new ArrayList<>();
transfer(ints, nums);        // ❌ U can't be both Integer and Number
```

Even though putting an `Integer` into a `List<Number>` is logically fine. The right signature:

```java
static <U> void transfer(List<? extends U> src, List<? super U> dst) {
    dst.addAll(src);
    src.clear();
}
transfer(ints, nums);        // ✅ U = Integer: src is Integer, dst is "Integer or above"
```

## PECS: Producer Extends, Consumer Super

Joshua Bloch's rule (Effective Java):

- a collection **gives** you elements (a producer, you read from it) → `? extends T`;
- a collection **takes** elements (a consumer, you write into it) → `? super T`;
- you both read and write → plain `T`.

That's how JDK methods are declared: `Collections.copy(List<? super T> dest, List<? extends T> src)`, `Collection.addAll(Collection<? extends E> c)`, `List.sort(Comparator<? super E> c)`.

## The fruit task solution

```java
public abstract class Fruit {
    public abstract float getWeight();
}
public class Apple extends Fruit {
    @Override public float getWeight() { return 1.0f; }
}
public class Orange extends Fruit {
    @Override public float getWeight() { return 1.5f; }
}

public class Basket<T extends Fruit> {
    private final List<T> fruits = new ArrayList<>();

    public void add(T fruit) { fruits.add(fruit); }

    public float getWeight() {
        float result = 0;
        for (T fruit : fruits) {
            result += fruit.getWeight();      // available thanks to T extends Fruit
        }
        return result;
    }

    public int compare(Basket<?> another) {   // any basket
        return Float.compare(getWeight(), another.getWeight());
    }

    public static <U extends Fruit> void transfer(Basket<? extends U> src, Basket<? super U> dst) {
        dst.fruits.addAll(src.fruits);
        src.fruits.clear();
    }
}
```

Now apples can be moved into a `Basket<Apple>` or a `Basket<Fruit>`, but not into a `Basket<Orange>` — the compiler checks it.

:::tip "Float.compare instead of an if-chain"
In the video `compare` is first written with `if/else` returning `1/0/-1`, then IDEA suggests `Float.compare(a, b)` ({{t j2 59:54}}). Use the ready-made `Integer.compare`, `Double.compare`, `Comparator.comparing…` — don't subtract numbers (`a - b` overflows for `int` and is imprecise for `float`).
:::

## Interview questions

:::interview "What are generics?"
Parameterised types: they let you declare classes, interfaces and methods where the data type is a parameter. They give compile-time type checking and remove manual casts. {{t j2 1:01:51}}
:::

:::interview "What are extends and super for in generics?"
To restrict allowed types. `extends` — the class itself or a subclass (upper bound), `super` — the class itself or a superclass (lower bound, wildcards only). In practice — the PECS rule. {{t j2 1:02:01}}
:::

:::interview "What is a wildcard?"
The `?` mask in angle brackets: "some unknown type". It can be bounded with `? extends T` or `? super T`. {{t j2 1:02:28}}
:::

:::interview "A method takes List<Number>. Can you pass a List<Integer>?"
No — generics are invariant. To accept any numbers the method must take `List<? extends Number>`. {{t j2 1:02:46}}
:::

## What the video doesn't cover

- **Generic constructors** exist too: `<S> Box(S source, Function<S, T> mapper)`.
- **Wildcard capture.** You can't put an element into a `List<?>`, even one taken from that same list. The workaround is a private helper `<T> void swapHelper(List<T> list, int i, int j)` — that's how `Collections.swap` is implemented.
- **A generic method with several bounds:** `static <T extends Comparable<T> & Serializable> T pick(T a, T b)`.

## Homework

:::task video "Fruits and baskets — from the video"
An abstract `Fruit` with `getWeight()`, `Apple` (1.0) and `Orange` (1.5). A class `Basket<T extends Fruit>`: add a fruit, get the basket's weight, compare with **any** basket (`Basket<?>`), move all the fruit into a basket of the same type or a parent type (the source becomes empty). Write tests. {{t j2 53:31}}
??? Hint
`static <U extends Fruit> void transfer(Basket<? extends U> src, Basket<? super U> dst)`. Solution: {{t j2 55:38}}
:::

:::task easy "A generic swap"
Write `static <T> void swap(T[] array, int i, int j)` and `static <T> void swap(List<T> list, int i, int j)`. Test them on an array of strings and a list of numbers.
:::

:::task medium "Copying by PECS"
Without `Collections.copy`, write `static <T> void copy(List<? super T> dst, List<? extends T> src)`. Show that a `List<Integer>` can be copied into a `List<Number>` and a `List<Object>`, but not the other way round.
:::

:::task hard "A generic filter and mapper"
Without the Stream API, write `static <T> List<T> filter(Collection<? extends T> c, Predicate<? super T> p)` and `static <T, R> List<R> map(Collection<? extends T> c, Function<? super T, ? extends R> f)`. Explain each wildcard. Test: filter a `List<Integer>` with a `Predicate<Number>` (`n -> n.doubleValue() > 0`).
??? Hint
A predicate "consumes" elements (`? super T`), a function "consumes" `T` and "produces" `R` (`? extends R`). These are exactly the signatures from `java.util.stream.Stream`.
:::
