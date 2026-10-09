Putting generics into practice: we make our own collections from part 1 (`CarList`, `CarSet`, `CarMap`…) **generic**. Along the way we hit the limits of generics — you can't write `new T[]`, you can't use `T` in a static nested class — and learn how to work around them.

## Video timestamps

- {{t j2 16:46}} — making our collections generic
- {{t j2 18:56}} — `CarCollection<T> extends Iterable<T>`, `CarList<T>`
- {{t j2 20:24}} — you can't create an array of `T`: use `Object[]` and a cast
- {{t j2 24:12}} — a static nested `Node` can't see `T` → remove `static`
- {{t j2 25:41}} — `CarHashMap<K, V>`: `Entry` and an `Object[]` array
- {{t j2 29:38}} — summary: three limits of generics

## From "car" collections to universal ones

In part 1 we wrote `CarArrayList`, `CarLinkedList`, `CarHashSet`, `CarHashMap` — they could only store `Car`. Replace `Car` with a parameter and you get collections for any type:

```java
public interface CarCollection<T> extends Iterable<T> {
    boolean add(T item);
    boolean remove(T item);
    boolean contains(T item);
    int size();
    void clear();
}

public interface CarList<T> extends CarCollection<T> {
    T get(int index);
    boolean add(T item, int index);
    boolean removeAt(int index);
}
```

`Iterable<T>` is parameterised too: that's why `for (T item : list)` yields elements of the right type without casts.

## Limit 1: no `new T[]`

```java
public class CarArrayList<T> implements CarList<T> {
    // private T[] array = new T[10];     ❌ generic array creation
    private Object[] array = new Object[10];
    private int size;

    @Override
    @SuppressWarnings("unchecked")
    public T get(int index) {
        checkIndex(index);
        return (T) array[index];          // safe: only T is ever put there
    }
}
```

The real `java.util.ArrayList` works the same way — it has an `Object[] elementData` inside. The `(T)` cast produces an `unchecked` warning; if you're sure it's correct (only `T` gets into the array via `add`), suppress it with `@SuppressWarnings("unchecked")` on the **smallest** scope — the method, not the class.

Alternatives:
- `T[] arr = (T[]) new Object[n];` — works inside the class, but **never hand such an array to the outside** (you'll get a `ClassCastException` there).
- `T[] arr = (T[]) Array.newInstance(clazz, n);` — a real array of the right type, if you pass `Class<T> clazz` to the constructor.

## Limit 2: a static nested class can't see `T`

```java
public class CarLinkedList<T> implements CarList<T> {
    private Node first, last;

    private class Node {              // not static: uses the outer class's T
        private Node previous;
        private T value;
        private Node next;
    }
}
```

The video simply removes `static`. The downside: each `Node` keeps a hidden reference to the outer object (extra bytes per element). The **better option** is to keep the class static and give it its own parameter, as the JDK does:

```java
private static class Node<E> {
    E value;
    Node<E> previous, next;
}
private Node<T> first, last;
```

About the kinds of nested classes — see the article [Nested classes](#/extra/nested-classes).

## Limit 3: `T` is always a reference type

`CarArrayList<int>` won't compile — only `CarArrayList<Integer>`. Primitives are boxed automatically (autoboxing), which costs memory.

## A Map with two parameters

```java
public interface CarMap<K, V> {
    void put(K key, V value);
    V get(K key);
    Set<K> keySet();
    List<V> values();
    boolean remove(K key);
    int size();
    void clear();
}

public class CarHashMap<K, V> implements CarMap<K, V> {
    private Object[] array = new Object[16];   // an array of Entry, but without new Entry[16]

    private class Entry {
        private K key;
        private V value;
        private Entry next;
    }
}
```

:::interview "Interview question"
**Why can't you create an array of a generic type?** — Arrays are covariant and check element types at runtime (`ArrayStoreException`), while generics are erased and carry no such information. If `new List<String>[10]` were allowed, you could put a `List<Integer>` into it via `Object[]` with no error at all — the type system would break.
:::

## What the video doesn't cover

- **An `Iterator<T>` for your collection.** For for-each to work, `iterator()` must return an `Iterator<T>` — an anonymous or nested class with an index field (see the [Iterator](#/lessons/j1-iterator) lesson).
- **Tests must be parameterised too.** `CarList<Car> list = new CarArrayList<>();` — and all the old tests from part 1 keep working.
- **JDK interfaces.** In practice you rarely write your own collections: you can implement `java.util.List<T>` via `AbstractList<T>` — `get` and `size` are enough, the JDK provides the rest.

## Homework

:::task video "Parameterise all the collections — from the video"
Follow the author: make `CarCollection`, `CarList`, `CarSet`, `CarQueue`, `CarMap` and all their implementations generic, and run the tests from part 1. {{t j2 16:46}}
??? Hint
Replace `Car` with `T` top-down: interfaces first, then implementations, then tests. For `Node`/`Entry`, remove `static` or give them their own parameter. Solution: {{t j2 18:56}}
:::

:::task easy "A generic stack"
Write `MyStack<T>` backed by `Object[]` with `push`, `pop`, `peek`, `isEmpty` and automatic array growth. Handle `pop` on an empty stack (throw `NoSuchElementException`).
:::

:::task medium "An array of the right type"
Add a method `T[] toArray(Class<T> type)` to `CarArrayList<T>` that returns a **real** `T[]` array (via `Array.newInstance`). Show that the `(T[]) new Object[size]` version fails with a `ClassCastException` when assigned to a `String[]` outside, while yours doesn't.
:::

:::task hard "Your own List on top of AbstractList"
Implement an immutable `Range extends AbstractList<Integer>` — numbers from `from` to `to` without storing them in memory. Check that `contains`, `indexOf`, `subList`, for-each and `stream()` all work, even though you wrote only `get` and `size`.
:::
