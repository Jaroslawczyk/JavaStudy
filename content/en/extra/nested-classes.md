A class can be declared inside another class. The course had nested `Node` and `Entry` classes in our own collections and anonymous classes for `Runnable`. Let's go through all four kinds of nested classes, how they differ, and a typical memory leak.

## The four kinds

| Kind | Declaration | Access to the outer object's fields | Example |
|---|---|---|---|
| Static nested | `static class Node` inside a class | ❌ only via a reference | `Map.Entry`, `Node` in `LinkedList` |
| Inner | `class Node` without `static` | ✅ directly | a collection's iterator |
| Local | a class inside a method | ✅ + effectively final local variables | rare |
| Anonymous | `new Interface() { … }` | ✅ + effectively final local variables | handlers, `Comparator` before Java 8 |

## Static nested class

```java
public class LinkedList<T> {
    private Node<T> first;

    private static class Node<E> {       // not tied to a particular LinkedList
        E value;
        Node<E> next;
    }
}

Outer.Nested n = new Outer.Nested();     // created without an Outer instance
```

It's logically grouped with the outer class and sees its `private` members, but it doesn't need an outer object. **The default choice.**

## Inner class

```java
public class MyList<T> implements Iterable<T> {
    private Object[] items;
    private int size;

    @Override
    public Iterator<T> iterator() {
        return new Itr();
    }

    private class Itr implements Iterator<T> {      // sees the outer object's items and size
        private int cursor;
        public boolean hasNext() { return cursor < size; }
        @SuppressWarnings("unchecked")
        public T next() { return (T) items[cursor++]; }
    }
}

MyList<String>.Itr it = list.new Itr();             // from outside — via an instance (rare)
```

Every inner-class object keeps a **hidden reference** `Outer.this`.

:::warning "A memory leak via an inner class"
If an inner (or anonymous) class object lives longer than its outer object — for example, it was registered as a listener in a long-lived service or put into a static cache — it prevents the garbage collector from removing the outer object with all its data. The Android classic: an anonymous `Handler` holding on to an `Activity`. Rule: if you don't need access to the outer object, make the class `static`.
:::

## Local and anonymous classes

```java
void sortByLength(List<String> words) {
    words.sort(new Comparator<String>() {               // an anonymous class
        @Override
        public int compare(String a, String b) {
            return Integer.compare(a.length(), b.length());
        }
    });
    words.sort(Comparator.comparingInt(String::length)); // today — a lambda/reference
}
```

An anonymous class is useful when you need to implement an interface with **several** methods or extend an abstract class "on the spot". For functional interfaces use lambdas.

:::note "Nested types are implicitly static"
Nested `enum`s, `record`s and `interface`s are always implicitly static. Since Java 16, static members (including records) can also be declared in inner classes.
:::

:::interview "Interview questions"
**How does a static nested class differ from an inner class?** — An inner class keeps a reference to an outer-class instance and can access its fields directly; it can only be created via an outer instance. A static one isn't tied to an instance.

**Why does an anonymous class see only effectively final variables?** — Values are copied into the class object at creation; if the variable could change, the copy and the original would diverge.
:::

## Homework

:::task easy "A Builder as a static nested class"
Create a `Pizza` class with a private constructor and a static nested `Pizza.Builder` (size, dough, list of toppings). Usage: `new Pizza.Builder().size(30).topping("cheese").build()`.
:::

:::task medium "Your own iterator"
Implement `Range implements Iterable<Integer>` (from `from` to `to` with a `step`) with the iterator as an inner class. Then rewrite the iterator as an anonymous class and as a static nested class (passing the needed data via the constructor). Compare which is shorter and which is safer.
:::

:::task hard "Find the leak"
Write an `EventBus` with a static list of listeners and a `Screen` class with a field `byte[] data = new byte[10_000_000]` that registers an anonymous listener. Create and "forget" 100 screens in a loop — get an `OutOfMemoryError` with `-Xmx256m`. Find the cause in a heap dump (VisualVM/IntelliJ) and fix it: a static class + `WeakReference`, or explicit unsubscribing.
:::
