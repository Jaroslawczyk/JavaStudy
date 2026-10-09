"In Java objects are passed by reference and primitives by value" is a popular but **inaccurate** statement. The correct one: **Java passes everything by value**. For objects, the value is simply a reference. Let's see why a method can change an object but can't "replace" it.

## Primitives

```java
static void increment(int x) {
    x++;                          // we change a COPY
}

int a = 5;
increment(a);
System.out.println(a);            // 5
```

## Object references

A reference-type variable holds not an object but a **reference** (an address) to an object on the heap. Calling a method copies that reference.

```java
static void rename(Car car) {
    car.setName("BMW");           // via the copied reference we change THE SAME object
}

static void replace(Car car) {
    car = new Car("Audi");        // we change only the copy of the reference
}

Car myCar = new Car("Lada");
rename(myCar);
System.out.println(myCar.getName());   // BMW — the object changed
replace(myCar);
System.out.println(myCar.getName());   // BMW — the replacement isn't visible outside
```

```
before the call:  myCar ──┐
                          ▼
                     [Car "Lada"]
in rename:        car ────┘   (two references to one object)

in replace:       car ──▶ [Car "Audi"]    myCar still ──▶ [Car "BMW"]
```

## The classic test: swap

```java
static void swap(Integer a, Integer b) {
    Integer tmp = a; a = b; b = tmp;      // swapped copies of references
}

Integer x = 1, y = 2;
swap(x, y);
System.out.println(x + " " + y);          // 1 2 — nothing changed
```

In a language with true pass-by-reference (C++ `int&`, C# `ref`) `swap` would work. In Java such a `swap` is impossible to write — and that's the proof of pass-by-value.

## Immutable objects

```java
static void append(String s) { s = s + "!"; }

String text = "Hi";
append(text);
System.out.println(text);                  // Hi
```

`String`, `Integer` and the other wrappers are immutable: a "change" creates a new object, and the new reference stays in the local copy.

## How to return several values or "change" an argument

- Return the result: `x = increment(x);`
- Return several values — a `record Result(int min, int max)`.
- Pass a mutable container (an array, `AtomicInteger`, your own object) — the method changes its contents.

:::interview "Interview question"
**Does Java pass by reference or by value?** — Always by value. For reference types the value of the reference is copied, so a method can change the state of the passed object but can't make the caller's variable point to another object.
:::

## Homework

:::task easy "Predict the output"
Write three methods: one that changes an `int`, one that changes an element of an `int[]` array, and one that assigns a new array to an array parameter. Predict the output after each call and check.
:::

:::task medium "A defensive copy"
A `Team` class with a field `List<String> members` and a constructor `Team(List<String> members)`. Show that external code can change the team's members through the original list and through the getter. Fix it with `List.copyOf` in the constructor and an unmodifiable view in the getter.
:::

:::task hard "A working swap"
Implement three "working" ways to swap two variables' values from a method: via an `int[2]` wrapper array, via a mutable `Holder<T>` class and by returning a `record Pair`. Explain why none of them contradicts the fact that Java passes arguments by value.
:::
