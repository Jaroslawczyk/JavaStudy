We write our first program: create a project, see what it consists of, learn what a class and the `main` method are, and print text to the console.

## Video timestamps

- {{t j1 6:05}} — creating the first Hello World project
- {{t j1 6:57}} — project structure, the `src` folder
- {{t j1 7:24}} — classes and `.java` files, creating a class
- {{t j1 7:47}} — naming conventions (CamelCase)
- {{t j1 8:36}} — declaring a class: `public class`
- {{t j1 9:09}} — the `main` method — the entry point
- {{t j1 10:14}} — the `psvm` + Tab shortcut
- {{t j1 10:51}} — printing to the console with `System.out.println`
- {{t j1 11:36}} — running the program
- {{t j1 11:56}} — lesson summary
- {{t j1 12:28}} — homework

## Project structure

After creating a project in IntelliJ IDEA you see the **Project** panel on the left. The key part is the **`src`** (source) folder: all Java code lives there. In Maven/Gradle projects the path is longer: `src/main/java` for code and `src/test/java` for tests.

All Java code is written **inside classes**, and every public class is stored in its own file with the **`.java`** extension. The file name must match the public class name: class `HelloWorld` → file `HelloWorld.java`.

## The first program

```java
public class HelloWorld {

    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

Piece by piece:

| Fragment | Meaning |
|---|---|
| `public` | Access modifier: the class is visible from any other class (details in the access modifiers lesson) |
| `class HelloWorld` | Declares a class named `HelloWorld` |
| `{ ... }` | The class body — everything belonging to the class goes between the curly braces |
| `public static void main(String[] args)` | The `main` method — the **entry point**: the JVM starts executing the program here |
| `System.out.println("...")` | A method call that prints a line to the console and moves to a new line |
| `;` | Every statement ends with a semicolon |

For now treat `public static void main(String[] args)` as a "magic spell" — each word will be explained later: `static` in the lesson on static members, `void` in the methods lesson, `String[] args` is the array of command-line arguments (arrays lesson).

:::tip "Typing faster"
In IntelliJ IDEA type `psvm` (or `main`) and press <kbd>Tab</kbd> — the `main` method appears. Type `sout` + <kbd>Tab</kbd> — you get `System.out.println();`. The ▶ icon next to a class appears only when the class has a `main` method.
:::

## Naming conventions

The compiler doesn't care what you call a class, but all Java developers follow the same rules — that makes other people's code easier to read:

| What | Style | Example |
|---|---|---|
| Classes, interfaces, records, enums | **UpperCamelCase** (PascalCase) | `HelloWorld`, `BankAccount` |
| Methods and variables | **lowerCamelCase** | `main`, `printReport`, `userName` |
| Constants | **UPPER_SNAKE_CASE** | `MAX_SIZE`, `DEFAULT_TIMEOUT` |
| Packages | lowercase, dot-separated | `com.example.shop` |

Java is **case-sensitive**: `System` and `system` are different words, and the second one won't compile.

## What the video doesn't cover

### print, println and printf

```java
System.out.print("No line break. ");
System.out.println("With a line break.");
System.out.printf("Name: %s, age: %d%n", "Anna", 25);   // formatted output
System.out.println("Line 1\nLine 2\twith a tab and \"quotes\"");
```

- `print` prints without a line break, `println` with one.
- `printf` formats: `%s` — string, `%d` — integer, `%.2f` — decimal with 2 digits, `%n` — line break.
- Escape sequences: `\n` — new line, `\t` — tab, `\"` — quote, `\\` — backslash.

### Comments

```java
// single-line comment

/* multi-line
   comment */

/**
 * Javadoc comment: documentation is generated from it.
 */
```

### Typical beginner mistakes

- Missing `;` → `';' expected`.
- File name doesn't match the public class name → `class X is public, should be declared in a file named X.java`.
- `system.out.println` in lowercase → `package system does not exist`.
- A string in single quotes `'Hello'` — single quotes are only for characters (`char`); strings use double quotes.

:::outdated "The New Project wizard"
In newer IDEA versions the *New Project* wizard immediately asks for the **Build system** (IntelliJ / Maven / Gradle) and JDK, and the **Add sample code** checkbox creates a `Main` class with `main` for you. *IntelliJ* is fine for learning; real projects use Maven or Gradle. The "Tip of the Day" window is no longer shown by default.
:::

:::outdated "Since Java 25 a class and public static are optional"
Starting with **Java 25** (JEP 512 "Compact Source Files and Instance Main Methods") a simple program can be written without declaring a class and without `public static`:

```java
void main() {
    IO.println("Hello World");
}
```

The `java.lang.IO` class (Java 25) has simple `IO.println(...)`, `IO.print(...)` and `IO.readln(...)` methods for console I/O. This is meant for learning and scripts. Real projects still use classes and `public static void main(String[] args)` — so you must know the classic form.
:::

## Homework

:::task video "Family members — from the video"
Create a new Java class that prints the names of your family members, each on a new line. {{t j1 12:28}}
??? Hint
Call `System.out.println("...")` several times — once per name.
:::

:::task easy "Business card"
Print a "business card" framed with `*` characters: name, city, favourite programming language. The frame must be even.
??? Hint
```text
***********************
*  Anna               *
*  Warsaw             *
*  Java               *
***********************
```
:::

:::task easy "In one statement"
Print the same family names with **one** `System.out.println` call using `\n`. Then do it with `print` instead of `println`.
:::

:::task medium "A table with printf"
Using `printf`, print a table of three products with aligned columns: name (width 10), quantity (width 5), price with two decimal places.
??? Hint
Width is a number inside the specifier: `%-10s` — a string of width 10, left-aligned; `%5d` — an integer of width 5; `%8.2f` — a decimal of width 8 with two digits.
```java
System.out.printf("%-10s %5d %8.2f%n", "Coffee", 2, 15.5);
```
:::

:::task hard "Command-line arguments"
Write a program that prints `Hello, <name>!`, where the name is passed at launch: `java Greeter.java Anna`. If no argument is given, print `Hello, world!`. Also configure the argument in IDEA (*Run → Edit Configurations → Program arguments*).
??? Hint
Arguments arrive in the `args` array: the first is `args[0]`, the count is `args.length`. The `if` statement comes in a couple of lessons, but here you need only its simplest form:
```java
if (args.length > 0) {
    System.out.println("Hello, " + args[0] + "!");
} else {
    System.out.println("Hello, world!");
}
```
:::
