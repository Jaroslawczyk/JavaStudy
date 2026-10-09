**Access modifiers** decide who may use fields, methods and classes. **Encapsulation**, one of the four OOP principles, is built on them. This lesson also covers getters, setters, packages and `import`.

## Video timestamps

- {{t j1 2:55:18}} — the four access modifiers
- {{t j1 2:55:41}} — a `Man` class with public fields
- {{t j1 2:57:43}} — the problem: age −40
- {{t j1 2:58:22}} — public fields break encapsulation
- {{t j1 2:58:32}} — the `private` modifier
- {{t j1 2:59:47}} — setters
- {{t j1 3:00:44}} — validating a value in a setter
- {{t j1 3:01:52}} — getters
- {{t j1 3:02:55}} — a read-only field
- {{t j1 3:03:35}} — generating getters and setters: <kbd>Alt+Insert</kbd>
- {{t j1 3:04:10}} — what encapsulation is: a car and an ATM
- {{t j1 3:06:04}} — the rule: everything that can be `private` should be
- {{t j1 3:06:30}} — packages
- {{t j1 3:08:31}} — `import` and <kbd>Alt+Enter</kbd>
- {{t j1 3:09:40}} — the default modifier
- {{t j1 3:10:59}} — homework

## Four access levels

| Modifier | Inside the class | Same package | Subclass (other package) | Everywhere |
|---|:---:|:---:|:---:|:---:|
| `private` | ✓ | — | — | — |
| *(none)* — default / package-private | ✓ | ✓ | — | — |
| `protected` | ✓ | ✓ | ✓ | — |
| `public` | ✓ | ✓ | ✓ | ✓ |

`protected` is covered in the inheritance lesson.

## The problem with public fields

```java
Man man = new Man("Ivan", 27);
man.age = -40;      // nothing stops you from writing nonsense
```

If a field is `public`, any code can put anything into it — and the object ends up in an invalid state. The fix: **hide the fields** and expose access through methods.

## Getters and setters

```java
public class Man {
    private String name;
    private int age;

    public Man(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {          // getter — read-only
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {      // setter — writes with validation
        if (age > 0) {
            this.age = age;
        } else {
            System.out.println("Age must be greater than zero");
        }
    }
}
```

- A **getter** is a public parameterless method returning a field value: `getName()`, `getAge()`. For `boolean` the convention is `isActive()`.
- A **setter** is a public method that sets a value: `setAge(int age)`. Its main benefit is **validation** before writing.
- No setter — the field is **read-only** (`name` above).

<kbd>Alt+Insert</kbd> → *Getter*, *Setter* or *Getter and Setter* — IDEA generates them in a second.

## Encapsulation

You drive a car with pedals and a steering wheel, not by pulling the throttle cable and fiddling with the carburettor. An ATM hands out money through buttons, not from an open cabinet full of banknotes. **Encapsulation is hiding the implementation**: a class hides its internals and exposes only a clear, safe set of methods.

:::tip "The rule"
All fields are `private`. In general, make everything that can be `private` private. Make `public` only what the class's users really need.
:::

## Packages and import

A **package** is a folder for classes with a similar purpose. The first line of a file declares the package:

```java
package com.example.shop.model;

import com.example.shop.util.PriceFormatter;   // a class from another package
import java.util.List;

public class Product { … }
```

- Classes from your own package and from `java.lang` (`String`, `Math`, `System`…) need no `import`.
- <kbd>Alt+Enter</kbd> on a red class name → *Import class*. IDEA greys out unused imports — remove them (<kbd>Ctrl+Alt+O</kbd> — Optimize Imports).
- With no modifier (**default**), an element is visible only inside its package. That's why moving `Box` to another package gave the author the error `Box is not public`.

## What the video doesn't cover

### Naming packages

Packages use the **reversed domain name**: `com.google.gson`, `org.springframework.web`, `pl.mycompany.bank`. Lowercase only. The structure inside is by feature (`order`, `payment`, `user`) or by layer (`controller`, `service`, `repository`).

### Class modifiers

A top-level class can only be `public` or default. `private` and `protected` apply only to nested classes (see the [Nested classes](#/extra/nested-classes) article).

### A setter should throw rather than print

In the video the setter prints a message and silently keeps the old value. In real code the caller then never learns about the error. Better:

```java
public void setAge(int age) {
    if (age <= 0) {
        throw new IllegalArgumentException("Age must be greater than zero: " + age);
    }
    this.age = age;
}
```

### Not every field needs a setter

Generating getter + setter "for everything" is a common mistake: encapsulation then exists only on paper. Prefer **meaningful** methods: not `setBalance(...)` but `deposit(...)` and `withdraw(...)`. Fields that must not change should be `final` with no setters at all.

### Lombok and records

- **Lombok**: `@Getter`, `@Setter`, `@Data` generate methods at compile time — very common in Spring projects.
- **record**: fields are automatically `private final`, and accessors are named after the fields: `person.name()`, without `get`.

### Modules (Java 9+)

Above packages there's one more level — modules (`module-info.java`), which decide which packages other modules can see at all. Details in the [Modules](#/extra/modules) article.

## Homework

:::task video "Proper modifiers in Box — from the video"
Change the `Box` class so that proper access modifiers are used everywhere. No field may be `public`; where access is needed, create getters and/or setters. Check that `Box` can be used from `Main` in another package. {{t j1 3:10:59}}
??? Hint
Fields are `private`; constructors and methods needed outside are `public`. Size setters must reject negative values.
:::

:::task easy "Package structure"
Create the packages `com.<your_name>.app`, `com.<your_name>.model`, `com.<your_name>.util`. Put `Main`, `Box`/`Man` and a helper class with `static` methods into them. Make it compile by adding `public` and `import` where needed.
:::

:::task medium "A bank account without setters"
A `BankAccount` class: `private final String number`, `private double balance`. No `setBalance` — only `deposit(double)`, `withdraw(double)` (with validation and exceptions) and `getBalance()`. Write a scenario in `main` where an attempt to withdraw more than the balance is handled correctly.
:::

:::task hard "Checking access in practice"
In package `a` create a class `A` with four fields — `private`, default, `protected`, `public`. In package `a` add a class `SamePackage`; in package `b` add `OtherPackage` and `Child extends A`. In each, try to access all four fields and fill in a table: where it compiles and where it doesn't. Compare with the table at the top of the lesson.
??? Hint
In `Child` a `protected` field can be accessed directly or via `this`, but **not** through another `A` object (`new A().protectedField` from another package won't compile) — a subtlety interviewers love.
:::
