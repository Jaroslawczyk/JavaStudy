A lesson made of several small topics before OOP: quick array initialisation, `String`, special characters, the `switch` statement and comparing strings properly with `equals`.

## Video timestamps

- {{t j1 1:34:17}} — what the lesson covers: several small topics
- {{t j1 1:35:06}} — initialising an array with values `{…}`
- {{t j1 1:36:23}} — the `String` type (a reference type, not a primitive)
- {{t j1 1:37:20}} — joining strings: "Hi, Ivan, you are 33"
- {{t j1 1:38:35}} — the line-break special character `\n`
- {{t j1 1:39:12}} — escaping quotes `\"`
- {{t j1 1:39:53}} — task: months separated by commas, a dot at the end
- {{t j1 1:40:26}} — the solution
- {{t j1 1:43:17}} — task: month number → name with `if-else`
- {{t j1 1:44:56}} — the `switch-case` statement
- {{t j1 1:46:45}} — what happens if you forget `break`
- {{t j1 1:47:37}} — homework
- {{t j1 1:48:00}} — comparing strings: `==` vs `equals`

## Initialising an array with values

```java
int[] daysOfMonths = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
String[] namesOfMonths = {
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
};
```

The size is calculated automatically; no `new` needed.

## Strings

`String` is a **reference** type (a class), not a primitive, but it's very easy to use:

```java
String name = "Ivan";
int age = 33;
String result = "Hi, \"" + name + "\"!\nYou are " + age + " years old.";
System.out.println(result);
```

Output:

```text
Hi, "Ivan"!
You are 33 years old.
```

| Special character | Meaning |
|---|---|
| `\n` | line break |
| `\t` | tab |
| `\"` | a double quote inside a string |
| `\'` | a single quote (in a `char`) |
| `\\` | a backslash |

## The task: months separated by commas

```java
String result = "";
for (int i = 0; i < namesOfMonths.length; i++) {
    result += namesOfMonths[i];
    if (i == namesOfMonths.length - 1) {
        result += ".";
    } else {
        result += ", ";
    }
}
System.out.println(result);   // January, February, …, December.
```

:::tip "Shorter"
```java
String result = String.join(", ", namesOfMonths) + ".";
```
`String.join` glues elements with a separator. When joining many strings in a loop, use `StringBuilder` — `+=` creates a new string every time (see below).
:::

## The switch statement

When one variable is compared against many values, an `if-else` chain becomes bulky. The classic `switch`:

```java
int numberOfMonth = 5;
switch (numberOfMonth) {
    case 1:
        System.out.println("January");
        break;
    case 2:
        System.out.println("February");
        break;
    // …
    case 5:
        System.out.println("May");
        break;
    default:
        System.out.println("The month doesn't exist");
        break;
}
```

:::warning "Fall-through"
If you forget `break`, execution "falls through" into the following `case`s without checking them: with `numberOfMonth = 1` and no `break` you get January, February, March… up to the first `break`. Sometimes it's used on purpose — to group several values (as in the homework).
:::

```java
switch (month) {
    case "December":
    case "January":
    case "February":
        System.out.println("Winter");
        break;
    // …
}
```

`switch` works with `int`, `char`, `byte`, `short`, their wrappers, `String` (since Java 7) and `enum`.

:::outdated "The new switch (Java 14+)"
Modern Java code uses **arrow switch** — no `break`, no fall-through, several values separated by commas. A **switch expression** returns a value directly:

```java
String season = switch (month) {
    case "December", "January", "February" -> "Winter";
    case "March", "April", "May"           -> "Spring";
    case "June", "July", "August"          -> "Summer";
    case "September", "October", "November" -> "Autumn";
    default -> "No such season";
};
```

If a branch needs several lines of code, use a block `{ … yield value; }`. Since Java 21 `switch` can also match **types** (pattern matching): `case Integer i when i > 0 -> …`. The old syntax still works and appears in legacy code — you need to know both.
:::

## Comparing strings: == and equals

```java
String first = "Java";
String second = new String("Java");

System.out.println(first == second);         // false — different objects!
System.out.println(first.equals(second));    // true — same contents
```

- For reference types `==` compares **references** (is it the same object in memory).
- `equals` compares **contents**.
- **Always compare strings with `equals`** (or `equalsIgnoreCase` to ignore case).

Why `==` "sometimes works": Java keeps identical string literals in the **string pool** and reuses one object. But strings from input, files or concatenation are new objects, and `==` gives `false`. More in part 2 of the course, in the interview questions.

:::tip "Null safety"
`"Winter".equals(season)` won't crash even if `season == null`, while `season.equals("Winter")` throws a `NullPointerException`. Another option is `Objects.equals(a, b)`.
:::

## What the video doesn't cover

### Strings are immutable

Every "modifying" method returns a **new** string; the original doesn't change:

```java
String s = "java";
s.toUpperCase();          // the result is lost!
s = s.toUpperCase();      // "JAVA" — you must assign it
```

That's why joining with `+=` in a loop creates thousands of extra objects. `StringBuilder` exists for this:

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i).append(", ");
}
String result = sb.toString();
```

### The most useful String methods

| Method | Example | Result |
|---|---|---|
| `length()` | `"Java".length()` | `4` |
| `charAt(i)` | `"Java".charAt(0)` | `'J'` |
| `toUpperCase()` / `toLowerCase()` | `"Java".toUpperCase()` | `"JAVA"` |
| `contains(s)` | `"Java".contains("av")` | `true` |
| `indexOf(s)` | `"Java".indexOf("a")` | `1` |
| `substring(from, to)` | `"Java".substring(1, 3)` | `"av"` |
| `replace(a, b)` | `"Java".replace("a", "o")` | `"Jovo"` |
| `strip()` / `trim()` | `"  hi ".strip()` | `"hi"` |
| `isEmpty()` / `isBlank()` | `"  ".isBlank()` | `true` |
| `split(regex)` | `"a,b,c".split(",")` | `["a", "b", "c"]` |
| `startsWith` / `endsWith` | `"Java".endsWith("va")` | `true` |
| `repeat(n)` (Java 11) | `"ab".repeat(3)` | `"ababab"` |
| `formatted(...)` (Java 15) | `"%s=%d".formatted("x", 5)` | `"x=5"` |

### Text blocks (Java 15+)

```java
String json = """
        {
          "name": "Ivan",
          "age": 33
        }
        """;
```

Multi-line text without `\n` or escaped quotes.

## Homework

:::task video "Seasons — from the video"
The user enters a month name. For "December", "January", "February" print "Winter", for "March", "April", "May" — "Spring", and so on. For invalid input print "No such season". Do it first with `if-else`, then with `switch-case`. Compare strings with `equals`. {{t j1 1:47:37}}
??? Hint
In `if`, combine options with `||`: `if (month.equals("December") || month.equals("January") || month.equals("February"))`. In `switch`, use fall-through (several `case`s in a row without `break`) — or the new syntax `case "December", "January", "February" ->`.
:::

:::task easy "Count the vowels"
Count the vowels in a string entered by the user.
??? Hint
Go through the characters with `charAt(i)` and check `"aeiou".indexOf(Character.toLowerCase(c)) >= 0`.
:::

:::task easy "Reverse a string"
Print a string backwards in two ways: with a loop from the last character to the first, and with `new StringBuilder(s).reverse()`.
:::

:::task medium "Palindrome"
Check whether a phrase is a palindrome, ignoring case, spaces and punctuation: "A man, a plan, a canal: Panama" → yes.
??? Hint
Normalise the string first: `s.toLowerCase().replaceAll("[^\\p{L}]", "")` keeps letters only. Then compare it with its reverse, or walk two indexes from both ends towards the middle.
:::

:::task medium "Day of the week with a switch expression"
Given a day number (1–7), return its name with a **switch expression** (`String day = switch (n) { … };`), adding "(weekend)" for Saturday and Sunday.
:::

:::task hard "Caesar cipher"
Encrypt a string by shifting every Latin letter `k` positions along the alphabet (wrapping `z` → `a`), keeping the case; leave other characters unchanged. Write decryption too. Check: `"Hello, World!"` with `k = 3` → `"Khoor, Zruog!"`.
??? Hint
For a lowercase letter: `(char) ('a' + (c - 'a' + k) % 26)`. For decryption shift by `26 - k`. Build the result in a `StringBuilder`.
:::
