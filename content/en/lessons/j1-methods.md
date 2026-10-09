**Methods** are the actions an object can perform. We learn to declare methods, return values with `return`, pass parameters, and understand the `this` keyword.

## Video timestamps

- {{t j1 2:00:49}} — classes = data + the code that manages it
- {{t j1 2:01:09}} — the general form of a method declaration
- {{t j1 2:01:30}} — `void` — the method returns nothing
- {{t j1 2:01:50}} — `return` — returning a value
- {{t j1 2:02:06}} — the `showVolume` method in `Box`
- {{t j1 2:04:29}} — calling a method with a dot
- {{t j1 2:05:24}} — inside a class, fields are accessed directly
- {{t j1 2:05:56}} — a method that returns the volume
- {{t j1 2:08:36}} — summary
- {{t j1 2:09:25}} — homework 1: the `Dog` class
- {{t j1 2:10:35}} — methods with parameters
- {{t j1 2:13:02}} — `Math.sqrt` is also a method with a parameter
- {{t j1 2:13:31}} — a `setDimens` method with three parameters
- {{t j1 2:14:34}} — name clashes between fields and parameters
- {{t j1 2:15:13}} — the `this` keyword
- {{t j1 2:16:42}} — parameter info <kbd>Ctrl+P</kbd>
- {{t j1 2:17:33}} — homework 2: the `Rect` class

## Declaring a method

```text
returnType methodName(type1 param1, type2 param2) {
    method body
}
```

- **Return type** — anything: a primitive, `String`, your class. If the method returns nothing — `void`.
- If the type isn't `void`, the method **must** end with `return value;` of a matching type.
- No parameters — empty parentheses `()`.

```java
public class Box {
    double width;
    double height;
    double length;

    void showVolume() {                       // returns nothing — prints
        System.out.println("Volume: " + volume());
    }

    double volume() {                         // returns a value
        return width * height * length;
    }

    void setDimens(double width, double height, double length) {
        this.width = width;                   // this.width is the field, width is the parameter
        this.height = height;
        this.length = length;
    }
}
```

```java
Box box = new Box();
box.setDimens(15, 15, 15);
System.out.println(box.volume());   // 3375.0
box.showVolume();                   // Volume: 3375.0
```

## How a method "knows" whose volume it is

Inside a class, fields are used without a dot: `width * height * length`. It means the fields of **the object the method was called on**: `box1.volume()` computes `box1`'s volume, `box2.volume()` — `box2`'s.

## The this keyword

`this` is a reference to the current object. You need it when a parameter has the same name as a field:

```java
void setDimens(double width, double height, double length) {
    width = width;          // LOGIC ERROR: the parameter is assigned to itself
    this.width = width;     // correct: the object's field gets the parameter value
}
```

Giving parameters the same names as fields is normal practice: names stay clear, and <kbd>Ctrl+P</kbd> in IDEA shows the argument order.

## Parameters and arguments

- A **parameter** is a variable in the method declaration: `int i` in `square(int i)`.
- An **argument** is the concrete value in a call: `80` in `square(80)`.

```java
int square(int i) {
    return i * i;
}
// test.square(80) → 6400, test.square(15) → 225
```

Parameters make code reusable: instead of `square10()`, `square11()`… — one `square(int i)`.

## What the video doesn't cover

### Java passes arguments by value

A method always receives a **copy** of the value. For primitives — a copy of the number, for objects — a copy of the **reference**:

```java
void reset(int x) { x = 0; }                 // nothing changes outside
void resetBox(Box b) { b.width = 0; }        // the object changes — the reference points to it
void replaceBox(Box b) { b = new Box(); }    // nothing changes outside — we replaced the copy of the reference
```

A frequent interview question: "Is Java pass-by-reference or pass-by-value?" Answer: **always by value** (details in the [Pass by Value](#/extra/pass-by-value) article).

### Naming methods

- A verb or verb phrase: `calculateTotal()`, `printReport()`, `isEmpty()`, `hasNext()`.
- Methods returning `boolean` start with `is`/`has`/`can`.
- One method — one job. If you want to write "And" in the name, split the method.

### A method without output beats one with output

The author changed `showVolume()` into `volume()`, which returns a number. That's an important principle: a method that **computes and returns** can be used anywhere (in another calculation, a test, a web response), while a method that **prints** works only in the console.

### Early return

```java
String grade(int score) {
    if (score < 0 || score > 100) {
        return "error";        // exit immediately — less nesting
    }
    if (score >= 90) {
        return "excellent";
    }
    return "good";
}
```

`return` is also allowed in a `void` method (without a value) — for an early exit.

### Variable number of arguments (varargs)

```java
int sum(int... numbers) {          // inside, numbers is an int[]
    int total = 0;
    for (int n : numbers) total += n;
    return total;
}
// sum(1, 2), sum(1, 2, 3, 4), sum()
```

That's how `String.format(...)` and `printf(...)` work.

## Homework

:::task video "Dog — from the video"
Create a `Dog` class with name (`String`), breed (`String`) and speed (`int`) fields. Methods: `run()` — returns nothing and prints the word "Running" on one line as many times as the speed field says; `info()` — returns a string with the name, breed and speed (prints nothing). In `main` create a dog, store the result of `info()` in a variable, print it and call `run()`. {{t j1 2:09:25}}
??? Hint
In `run()` use `System.out.print("Running ")` inside a `for` loop, then `System.out.println()` after the loop. In `info()` — `return "Name: " + name + ", breed: " + breed + ", speed: " + speed;`.
:::

:::task video "Rectangle — from the video"
Create a `Rect` class with length and width fields and three methods: a method with parameters that sets the length and width; a parameterless method returning the perimeter; a parameterless method returning the area. Demonstrate all methods in `main`. {{t j1 2:17:33}}
:::

:::task easy "Discount calculator"
Create a `Product` class with `name` and `price` fields and a method `double priceWithDiscount(int percent)` returning the discounted price. Test with discounts of 0, 15 and 100 %.
:::

:::task medium "Bank account"
An `Account` class with a `balance` field and methods `deposit(double amount)`, `boolean withdraw(double amount)` (returns `false` and leaves the balance untouched if there isn't enough money) and `double getBalance()`. Reject negative amounts.
??? Hint
In `withdraw` first check `amount <= 0 || amount > balance` and do an early `return false`.
:::

:::task hard "Pass-by-value in practice"
Write the three methods from "Java passes arguments by value" (`reset`, `resetBox`, `replaceBox`), call them and print the values before and after. Then write `swap(Box a, Box b)` that tries to swap two boxes, and explain why nothing changes outside. How can you swap their **sizes** after all?
??? Hint
A method can't swap the caller's reference variables, but it can swap the objects' **contents**: temporarily save `a`'s fields, copy `b`'s fields into `a`, then put the saved values into `b`.
:::
