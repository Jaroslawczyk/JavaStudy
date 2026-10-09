**Binding** is the moment when it's decided which method or field a call will actually use. **Static (early)** binding happens at compile time, **dynamic (late)** binding at runtime. Dynamic binding is what makes polymorphism possible.

## Dynamic binding: overridden methods

```java
class Animal {
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    @Override void speak() { System.out.println("Woof"); }
}

Animal a = new Dog();     // the variable's type is Animal, the object is a Dog
a.speak();                // Woof — chosen by the object's REAL type
```

The compiler checks that `speak()` exists in `Animal`, but which implementation to call is decided by the JVM at runtime from the object's class (via a virtual method table). All non-static, non-private, non-final methods in Java are virtual.

## Static binding

Decided by the compiler from the variable's **declared type**:

| What | Why statically |
|---|---|
| `static` methods | belong to the class, aren't overridden but **hidden** |
| `private` methods | not visible to subclasses |
| `final` methods | can't be overridden |
| **Overloading** (choosing between `m(Object)` and `m(String)`) | chosen by argument types at compile time |
| **Fields** | not polymorphic, also hidden |

```java
class Parent {
    String name = "parent";
    static String who() { return "Parent"; }
}
class Child extends Parent {
    String name = "child";                      // hides the field, doesn't override it
    static String who() { return "Child"; }     // hides the static method
}

Parent p = new Child();
System.out.println(p.name);     // parent — the field by declared type
System.out.println(p.who());    // Parent — static by declared type (don't write code like this)
```

## Overloading is resolved at compile time

```java
static void print(Object o) { System.out.println("Object"); }
static void print(String s) { System.out.println("String"); }

Object x = "hello";
print(x);                       // Object! — chosen by x's declared type, not its value
```

Compare: **overriding** — choosing the implementation at runtime by the object; **overloading** — choosing the signature at compile time by the argument types.

:::tip "@Override — always"
The `@Override` annotation makes the compiler check that the method really overrides a parent's. A typo in the name or parameters (`equals(Car other)` instead of `equals(Object o)`) silently becomes an **overload** without it — and `HashSet` stops working.
:::

:::interview "Interview questions"
**What are static and dynamic binding?** — Static: the compiler chooses a method/field by the declared type (static, private, final methods, overloading, fields). Dynamic: the implementation of an overridden method is chosen at runtime by the object's actual class.

**Can you override a static method?** — No, only hide it (method hiding): the call is determined by the declared type, there's no polymorphism.
:::

## Homework

:::task easy "Override or hide"
Create `Parent` and `Child` with a same-named field, static method and regular method. Print the results for `Parent p = new Child()`, `Child c = new Child()` and `((Parent) c)`. Fill in a "what was called" table and explain.
:::

:::task medium "The overloading trap"
There are `void log(Object o)`, `void log(Integer i)`, `void log(long l)`. What gets called for `log(5)`, `log(5L)`, `log((Object) 5)`, `log(null)`? Predict first (the rules: exact match → primitive widening → autoboxing → varargs), then check.
:::

:::task hard "A broken equals"
Write a `Point` class with a method `public boolean equals(Point other)` (without `@Override`). Show that `point1.equals(point2)` works but `list.contains(point2)` and `HashSet` don't. Explain via static binding of overloads, fix it and add `hashCode`.
:::
