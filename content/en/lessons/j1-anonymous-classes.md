Sometimes an interface implementation is needed **once, in one place**, and creating a separate class for it takes too long. That's what **anonymous classes** are for — and in modern Java there's something even shorter: **lambda expressions**.

## Video timestamps

- {{t j1 5:02:57}} — finishing interfaces: the "Anonymous" project
- {{t j1 5:03:27}} — the `Cookable` interface with a `cook()` method
- {{t j1 5:04:01}} — renaming a class and its file: <kbd>Shift+F6</kbd>
- {{t j1 5:04:14}} — the `Director` class and its `force(Cookable cookable)` method
- {{t j1 5:05:17}} — the usual way: `Cooker implements Cookable`
- {{t j1 5:06:04}} — the problem: a whole class for one use
- {{t j1 5:06:22}} — an anonymous class: `new Cookable() { … }`
- {{t j1 5:07:59}} — where they're used: event listeners
- {{t j1 5:08:45}} — interface methods can be anything
- {{t j1 5:09:04}} — homework

## The usual way

```java
public interface Cookable {
    void cook();
}

public class Director {
    public void force(Cookable cookable) {
        cookable.cook();
    }
}

public class Cooker implements Cookable {
    @Override
    public void cook() {
        System.out.println("Cooking");
    }
}
```

```java
Director director = new Director();
director.force(new Cooker());
```

## An anonymous class

```java
director.force(new Cookable() {        // a nameless class implementing Cookable
    @Override
    public void cook() {
        System.out.println("Cooking");
    }
});
```

`new Cookable() { … }` both **declares** a nameless class and **creates** its object. Inside the braces goes the implementation of all the interface's abstract methods. An anonymous class can also extend a regular or abstract class: `new Animal() { … }`.

A typical use is **listeners**: a button click handler in Android, Swing or JavaFX is an object whose method gets called when the event happens.

:::outdated "Today lambdas replace anonymous classes"
If an interface has **exactly one abstract method** (a **functional** interface), since Java 8 it is implemented with a **lambda expression**:

```java
director.force(() -> System.out.println("Cooking"));
```

Event handlers, `Runnable`s and `Comparator`s in modern code are written as lambdas. Anonymous classes are still needed when there are several methods, when you need state (fields) or when extending a class. Lambdas and functional interfaces are covered in part 2 of the course and in the [Functional programming](#/extra/functional) article.
:::

## What the video doesn't cover

### Capturing variables

An anonymous class (and a lambda) can use local variables of the enclosing method, but only **effectively final** ones — those that don't change after assignment:

```java
String dish = "borscht";
director.force(new Cookable() {
    @Override
    public void cook() {
        System.out.println("Cooking " + dish);   // OK
    }
});
// dish = "soup";   // uncommenting this causes a compile error above
```

### Its real name

The compiler does give an anonymous class a name: `Main$1`, `Main$2`… — you'll see such `.class` files in the build folder. It's a kind of **nested class** — see the [Nested classes](#/extra/nested-classes) article.

### When an anonymous class is a bad idea

If the implementation is big (dozens of lines) or needed in several places, move it into an ordinary named class: it can then be tested and reused.

## Homework

:::task video "Director and accountant — from the video"
An `Accountant` interface (`counter` in the video) with a method that takes a number of months and returns a report as a string. A `Director` class with a `force(Accountant accountant, int months)` method that gets the report from the accountant and prints it — e.g. "Report for 6 months". Implement the call in two ways: via an object of a named class implementing the interface, and via an anonymous class. {{t j1 5:09:04}}
??? Hint
```java
public interface Accountant {
    String report(int months);
}
// an anonymous class:
director.force(new Accountant() {
    @Override
    public String report(int months) {
        return "Report for " + months + " months";
    }
}, 6);
```
:::

:::task easy "A third way"
Do the previous task a third way — with a lambda: `director.force(months -> "Report for " + months + " months", 6);`.
:::

:::task medium "Sorting with an anonymous comparator"
Sort a `List<String>` of names by length, then alphabetically, passing an anonymous `Comparator<String>` class to `list.sort(...)`. Then rewrite it as a lambda and as `Comparator.comparing(String::length).thenComparing(...)`.
:::

:::task hard "A button with listeners"
Model a button: a `Button` class with `addListener(ClickListener listener)` and `click()`, which calls `onClick(String buttonName)` on all listeners. Add three listeners: an anonymous class with a click counter (a field inside the anonymous class!), a lambda, and a named `Logger` class. Click the button several times and explain why the counter couldn't be done in a lambda with a local variable.
:::
