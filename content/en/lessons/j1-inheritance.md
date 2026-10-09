**Inheritance** lets you create a new class based on an existing one: the subclass gets the superclass's fields and methods and adds its own specifics. We cover `extends`, `super`, method overriding and the `@Override` annotation.

## Video timestamps

- {{t j1 4:06:49}} — what inheritance is: the cat family
- {{t j1 4:07:53}} — the Inheritance project, the `CatFamily` class
- {{t j1 4:09:26}} — `class Cat extends CatFamily`
- {{t j1 4:11:05}} — a subclass gets the superclass's fields
- {{t j1 4:12:08}} — a shared `showInfo` method in the superclass
- {{t j1 4:13:25}} — `private` fields are inaccessible even to a subclass
- {{t j1 4:14:51}} — calling the superclass constructor: `super(...)`
- {{t j1 4:15:39}} — the implicit `super()` call and why `Leon` failed to compile
- {{t j1 4:17:47}} — an `eat` method in the superclass
- {{t j1 4:18:45}} — method overriding
- {{t j1 4:19:38}} — the `@Override` annotation
- {{t j1 4:20:28}} — quick overriding: <kbd>Ctrl+O</kbd>
- {{t j1 4:21:34}} — `super.eat()` — calling the parent's version
- {{t j1 4:22:18}} — homework: `BoxWeight`
- {{t j1 4:23:38}} — the solution

## Syntax

```java
public class CatFamily {
    private int ears;
    private int paws;
    private boolean bigClaws;

    public CatFamily(int ears, int paws, boolean bigClaws) {
        this.ears = ears;
        this.paws = paws;
        this.bigClaws = bigClaws;
    }

    public void eat() {
        System.out.print("Eating ");
    }

    public void showInfo() {
        System.out.println("Ears: " + ears + ", paws: " + paws + ", big claws: " + bigClaws);
    }
}
```

```java
public class Cat extends CatFamily {           // Cat is the subclass, CatFamily the superclass
    public Cat() {
        super(2, 4, false);                     // the "parent part" is created first
    }

    @Override
    public void eat() {
        super.eat();                            // call the superclass version
        System.out.println("cat food");
    }
}

public class Leon extends CatFamily {
    public Leon() {
        super(2, 4, true);
    }

    @Override
    public void eat() {
        super.eat();
        System.out.println("an antelope");
    }
}
```

```java
new Cat().eat();        // Eating cat food
new Leon().eat();       // Eating an antelope
new Leon().showInfo();  // the method is inherited, the data is the lion's
```

## The key rules

- **A subclass inherits** all fields and methods, but `private` members are **not directly accessible** to it — work through `public`/`protected` methods or the superclass constructor.
- **A subclass constructor always calls a superclass constructor first.** If you don't write `super(...)`, the compiler inserts `super()` — a call to the **no-arg** constructor. If the parent has none, it's a compile error (exactly what happened to `Leon` in the video).
- In Java a class can extend **only one** class.

## Overriding and @Override

**Overriding** means a subclass provides its own implementation of a method with **the same signature** as the parent's.

`@Override` changes nothing at run time, but:

1. it tells the reader that the method overrides a parent method;
2. it makes the compiler check that: a typo (`eatt()`) becomes an error instead of silently creating a new method.

:::tip
Always put `@Override`. <kbd>Ctrl+O</kbd> (Override Methods) in IDEA does it automatically.
:::

## What the video doesn't cover

### Object — the ancestor of all classes

Without `extends`, a class implicitly extends `java.lang.Object`. That's why every object has `toString()`, `equals()`, `hashCode()`, `getClass()`. They're often overridden:

```java
@Override
public String toString() {
    return "Cat{ears=2, paws=4}";
}
// System.out.println(cat) now prints readable text instead of Cat@1b6d3586
```

### The protected modifier

`protected` members are accessible in subclasses (even in other packages) and within their own package. A compromise between `private` and `public` when a subclass really needs direct access.

### Overriding rules

- You can't **narrow** access: a `public` method can't be overridden as `protected`.
- The return type is the same or a **subtype** (covariant return).
- You can't throw new **checked** exceptions the parent doesn't declare.
- `static` and `private` methods aren't overridden (static ones are "hidden").
- A `final` method can't be overridden (next lesson).

### The order of creating a subclass object

`new Cat()` → the `Cat` constructor → `super(...)` first → the `CatFamily` constructor → (above that, `Object`) → then the rest of the `Cat` constructor body. The parent is always "assembled" first.

### Inheritance vs composition

Inheritance expresses an **"is-a"** relationship: a cat *is a* feline. For a **"has-a"** relationship — a car *has an* engine — use **composition** (a field of type `Engine`), not inheritance. "Favour composition over inheritance" comes from *Effective Java* and often comes up in interviews.

:::outdated "Restricted inheritance: sealed (Java 17+)"
Since Java 17 you can explicitly list who may extend a class:

```java
public sealed class Shape permits Circle, Square { }
public final class Circle extends Shape { }
public final class Square extends Shape { }
```

This helps model closed hierarchies and pairs perfectly with pattern matching in `switch`.
:::

## Homework

:::task video "Weighted box — from the video"
Create a `BoxWeight` class that extends `Box` and adds a private `weight` field. Write constructors mirroring `Box`'s but with an extra weight, plus a getter and setter for the weight. Add a `showInfo()` method to `Box` (length, width, height, volume), and override it in `BoxWeight` so it also prints the weight. In `main` create a regular box and a weighted box with different constructors and print their info. {{t j1 4:22:18}}
??? Hint
In every `BoxWeight` constructor call `super(...)` with the sizes first, then assign `this.weight = weight;`. In `showInfo()` call `super.showInfo();` first, then print the weight. Solution: {{t j1 4:23:38}}
:::

:::task easy "toString for animals"
Override `toString()` in `CatFamily` so that `System.out.println(cat)` prints the class and parameters: `Cat{ears=2, paws=4, bigClaws=false}`. Hint: `getClass().getSimpleName()`.
:::

:::task medium "Employees and pay"
An `Employee` class (name, base rate, a `double salary()` method) with subclasses `Manager` (+ bonus) and `Developer` (+ an extra per project). Override `salary()` using `super.salary()`. Put various employees into a `List<Employee>` and compute the total payroll.
:::

:::task hard "Constructor chain"
Create a hierarchy `A → B → C` (C extends B, B extends A). Print a message in every constructor and in an initializer block `{ … }`. Predict the output order of `new C()`, then check. Add a method to `A` that is called from `A`'s constructor and overridden in `C` — and explain why `C`'s fields aren't initialised yet inside it (a real trap!).
??? Hint
The order: `A`'s blocks and constructor, then `B`, then `C`. The overridden method is called **virtually** already from `A`'s constructor, while `C`'s fields still hold default values (`0`/`null`). Takeaway: don't call overridable methods from constructors.
:::
