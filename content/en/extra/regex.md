**Regular expressions** are a pattern language for searching, validating and replacing text: e-mail validation, log parsing, extracting numbers from a string. In Java they live in the `java.util.regex` package and are also used by `String.matches`, `split`, `replaceAll`.

## Syntax basics

| Pattern | Meaning |
|---|---|
| `.` | any character (except a line break) |
| `\d`, `\w`, `\s` | a digit, a "letter/digit/_", a whitespace character |
| `\D`, `\W`, `\S` | anything except the above |
| `[abc]`, `[a-z]`, `[^0-9]` | a character set, a range, negation |
| `^`, `$` | start and end of the string |
| `*`, `+`, `?` | 0+, 1+, 0 or 1 times |
| `{3}`, `{2,5}` | exactly 3, from 2 to 5 times |
| `(…)`, `(?<name>…)` | a group, a named group |
| `a\|b` | or |
| `\b` | a word boundary |

:::warning "Double backslashes"
In a Java string literal the backslash is escaped: the pattern `\d+` is written as `"\\d+"`, a dot as `"\\."`. The same applies in text blocks (`"""`).
:::

## Pattern and Matcher

```java
private static final Pattern PHONE = Pattern.compile("\\+48\\s?(\\d{3})[\\s-]?(\\d{3})[\\s-]?(\\d{3})");

Matcher m = PHONE.matcher("Call: +48 501-234 567 or +48501234568");
while (m.find()) {
    System.out.println(m.group() + " → " + m.group(1) + m.group(2) + m.group(3));
}

boolean ok = PHONE.matcher(input).matches();       // does the whole string match?
```

- `Pattern.compile` is expensive — compile a pattern **once** into a `static final`, not in a loop. `String.matches(regex)` recompiles every time.
- `matches()` — the whole string, `find()` — the next occurrence, `lookingAt()` — the start of the string.

## Named groups and replacement

```java
Pattern DATE = Pattern.compile("(?<day>\\d{2})\\.(?<month>\\d{2})\\.(?<year>\\d{4})");
Matcher m = DATE.matcher("09.10.2026");
if (m.matches()) {
    int year = Integer.parseInt(m.group("year"));
}

"09.10.2026".replaceAll("(\\d{2})\\.(\\d{2})\\.(\\d{4})", "$3-$2-$1");   // 2026-10-09
"a1b22c333".replaceAll("\\d+", "#");                                      // a#b#c#
DATE.matcher(text).replaceAll(r -> r.group("year"));                      // Java 9: a replacer function
DATE.matcher(text).results().map(MatchResult::group).toList();            // Java 9: a stream of matches
```

## Flags

```java
Pattern.compile("hello", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
Pattern.compile("(?i)cześć");                   // a flag inside the pattern
Pattern.compile("^\\s*#.*$", Pattern.MULTILINE); // ^ and $ for every line
```

:::warning "ReDoS: catastrophic backtracking"
Patterns with nested quantifiers like `(a+)+$` or `(\\w+\\s?)*$` take exponentially long on a crafted string — the server "hangs" on a single request. Don't apply complex regexes to user input without a length limit; use possessive quantifiers (`a++`) and atomic groups (`(?>…)`), and for e-mail/URLs — ready-made validators.
:::

:::tip "When you don't need regex"
For simple tasks `String` is enough: `startsWith`, `contains`, `strip`, `isBlank`, `chars()`. For parsing JSON, HTML, CSV use parsers (Jackson, jsoup, Commons CSV), not regular expressions.
:::

## Homework

:::task easy "Extract numbers"
From the string `"Order 15: 3 pcs at 12.50 zł, 10% discount"` extract all numbers (including decimals) into a `List<Double>` using `Matcher.results()`.
:::

:::task medium "Parsing a log"
Log lines look like `2026-10-09 14:05:33 ERROR [OrderService] Payment failed: id=42`. Use named groups to extract the date, time, level, component and message. Count the entries per level (`groupingBy`) for a 1000-line file.
:::

:::task hard "A password validator and ReDoS"
Write a password check (8–64 characters, at least one upper-case letter, one lower-case letter, a digit and a special character) as a single regular expression with lookaheads (`(?=…)`) and an alternative implementation without regex. Then find an example of a ReDoS-vulnerable pattern online, measure the time on strings of length 20, 25, 30 and fix it.
:::
