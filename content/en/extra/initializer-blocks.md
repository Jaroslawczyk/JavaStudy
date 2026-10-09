Besides constructors, Java has **initializer blocks** — static and instance ones. They're rarely needed in application code, but the class initialisation order is a favourite interview puzzle ("what does this program print?").

## The static block

```java
public class Config {
    static final Map<String, String> DEFAULTS;

    static {                                  // runs ONCE — when the class is initialised
        DEFAULTS = new HashMap<>();
        DEFAULTS.put("timeout", "30");
        DEFAULTS.put("retries", "3");
    }
}
```

A class is initialised lazily — on its first "active" use: creating an object, calling a static method, accessing a static field (except compile-time constants). A static block is handy for complex initialisation of static fields and loading native libraries.

## The instance initializer block

```java
public class Order {
    private final List<String> items;

    {                                         // runs BEFORE the body of every constructor
        items = new ArrayList<>();
        System.out.println("instance block");
    }

    public Order() { System.out.println("constructor"); }
    public Order(String first) { this(); items.add(first); }
}
```

Used to avoid duplicating shared code across several constructors (though `this(...)` is more common for that) and in anonymous classes, which have no constructor.

## Initialisation order

```java
class Parent {
    static { System.out.println("1. static Parent"); }
    { System.out.println("3. instance Parent"); }
    Parent() { System.out.println("4. constructor Parent"); }
}
class Child extends Parent {
    static { System.out.println("2. static Child"); }
    { System.out.println("5. instance Child"); }
    Child() { System.out.println("6. constructor Child"); }
}

new Child();
new Child();   // the second time — only steps 3–6
```

The rule:
1. **Static** — once per class: the parent first, then the child; within a class — static fields and `static {}` **in source order**.
2. **Instance** — on every `new`: the `super(...)` call → the parent's instance fields and blocks (in order) → the parent's constructor body → the child's fields and blocks → the child's constructor body.

:::warning "A trap: a virtual call from the parent's constructor"
If the parent's constructor calls an overridden method, the child's version runs — while the child's fields are **not yet initialised** (they're `null`/`0`). Don't call overridable methods from constructors.
:::

:::outdated "Code before super() — Java 25"
`super(...)` or `this(...)` used to have to be the first line of a constructor. Since **Java 25** (JEP 513, flexible constructor bodies) you can write code before them: validate arguments and **assign** the current class's fields (but not read `this`). This also solves the problem from the warning above: a field can be initialised before the parent constructor is called.

```java
public Child(int value) {
    if (value < 0) throw new IllegalArgumentException();   // before super — Java 25
    this.value = value;
    super();
}
```
:::

:::interview "Interview question"
**In what order do static blocks, instance blocks and constructors run with inheritance?** — The parent's static blocks, then the child's (once). When creating an object: the parent's blocks and field initialisers, the parent's constructor, then the child's blocks/fields and the child's constructor.
:::

## Homework

:::task easy "What does the program print"
Without running it, write down the output of the `Parent/Child` example above for two `new Child()` calls. Then run it and compare. Add a static field `static int counter = init("counter")` between the blocks — where does its output appear?
:::

:::task medium "A constructor trap"
Write a `Parent` whose constructor calls `describe()`, and a `Child` that overrides `describe()` and prints its field `private final String name = "child"`. Explain why `null` is printed. Fix it two ways: without the virtual call, and (on Java 25) by assigning the field before `super()`.
:::

:::task hard "Lazy class initialisation"
Prove experimentally that a static block runs not when the program loads but on the class's first active use. Check the cases: accessing `static final int CONST = 5` (a compile-time constant — the block **won't** run), `static final Integer BOXED = 5`, calling `Class.forName("…")`, creating an array `new Config[10]`. Explain each result.
:::
