We begin **Java level 2**. Instead of checking results "by eye" in the console, we learn to write **automated tests** with JUnit: the program itself compares the expected result with the actual one. From now on the course uses tests constantly — tests first, implementation second.

## Video timestamps

- {{t j1 5:48:56}} — the start of level 2: why console output is a poor check
- {{t j1 5:49:35}} — a `Calculator` class with an `add` method
- {{t j1 5:51:23}} — an "optimisation" `return 15;` — the console won't notice the bug
- {{t j1 5:53:04}} — JUnit and build systems (Gradle, Maven)
- {{t j1 5:53:33}} — a Gradle project, the `build.gradle` file, the `main` and `test` folders
- {{t j1 5:55:04}} — creating a test: <kbd>Alt+Enter</kbd> → Create Test
- {{t j1 5:55:44}} — the `@Test` annotation, `expected` and `result`
- {{t j1 5:56:46}} — `assertEquals(expected, result)`
- {{t j1 5:57:15}} — a second test catches the bug
- {{t j1 5:58:22}} — homework
- {{t j1 5:58:46}} — comparing `double`s: a tolerance (delta)
- {{t j1 6:01:30}} — continued: `@Before` and `@After`
- {{t j1 6:02:50}} — select all identical lines: <kbd>Alt+J</kbd>
- {{t j1 6:03:43}} — one test — one check, `when…then…` names
- {{t j1 6:05:05}} — an `add(String, String)` method and invalid input
- {{t j1 6:07:09}} — testing exceptions: `try-catch`, `assertTrue`, `@Test(expected = …)`
- {{t j1 6:09:42}} — summary and practice

## Why automated tests

"Print to the console and look" is unreliable: in the video `add` was "optimised" to `return 15;`, and the output `10 + 5 = 15` still looks right. With hundreds of methods, or strings that must match character by character, a human will miss the bug. An **automated test** calls the method itself and compares the result with the expected one; tests run in seconds on every code change.

## The first test

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
}
```

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    private Calculator calculator;

    @BeforeEach                       // before EACH test
    void setUp() {
        calculator = new Calculator();
    }

    @Test
    void whenAdd10And5ThenResult15() {
        assertEquals(15, calculator.add(10, 5));      // (expected, actual)
    }

    @Test
    void whenAdd100And50ThenResult150() {
        assertEquals(150, calculator.add(100, 50));
    }
}
```

A good test follows **Arrange / Act / Assert** (prepare → act → check). The test name describes the scenario: `whenAdd10And5ThenResult15` — you instantly see what broke.

:::outdated "JUnit 4 → JUnit 5/6"
The video uses **JUnit 4** (`org.junit.Test`, `Assert.assertEquals`, `@Before`, `@After`, `@Test(expected = …)`). Today's standard is **JUnit Jupiter** (JUnit 5, and since September 2025 **JUnit 6**, which requires Java 17+). The mapping:

| JUnit 4 | JUnit 5/6 |
|---|---|
| `@Before` / `@After` | `@BeforeEach` / `@AfterEach` |
| `@BeforeClass` / `@AfterClass` | `@BeforeAll` / `@AfterAll` |
| `@Test(expected = X.class)` | `assertThrows(X.class, () -> …)` |
| `@Ignore` | `@Disabled` |
| `Assert.assertEquals` | `Assertions.assertEquals` |
| — | `@DisplayName`, `@ParameterizedTest`, `@Nested` |

In JUnit 5+ test classes and methods needn't be `public`. In IDEA's *Create Test* wizard choose **JUnit 5** (or 6).
:::

:::warning "@Before runs before each test"
In the video the `@Before` method is first called "run before all tests". More precisely: `@Before` (JUnit 4) and `@BeforeEach` (JUnit 5) run **before each** test method — every test gets a "fresh" object. `@BeforeClass` / `@BeforeAll` run once before all tests.
:::

## Adding JUnit to Gradle and Maven

```kotlin
// build.gradle.kts
dependencies {
    testImplementation(platform("org.junit:junit-bom:6.0.1"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
tasks.test {
    useJUnitPlatform()
}
```

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>6.0.1</version>
    <scope>test</scope>
</dependency>
```

Run all tests with `./gradlew test` or `./mvnw test`. In IDEA — the ▶ next to the test class or method.

## Comparing doubles — with a tolerance

```java
double b = 0;
for (int i = 0; i < 100; i++) b += 0.01;
System.out.println(b == 1.0);   // false: 1.0000000000000007
```

Decimals are imprecise (see the `double` lesson), so they're compared with a **delta**:

```java
assertEquals(1.0, calculator.divide(10, 10), 0.0001);
```

## Testing exceptions

If a method **must** throw an exception on invalid input, that's behaviour worth testing too:

```java
public int add(String a, String b) {
    return Integer.parseInt(a) + Integer.parseInt(b);
}
```

```java
@Test
void whenInputIncorrectThenThrowException() {
    assertThrows(NumberFormatException.class, () -> calculator.add("abc", "5"));
}
```

The video shows three ways (a flag in `catch`, `assertTrue`, `@Test(expected = …)`). The modern and most precise one is `assertThrows`: it checks the exception on exactly that line and returns it so you can check the message.

## What the video doesn't cover

### Parameterised tests

```java
@ParameterizedTest
@CsvSource({"10, 5, 15", "100, 50, 150", "-1, 1, 0"})
void addWorks(int a, int b, int expected) {
    assertEquals(expected, calculator.add(a, b));
}
```

One method — many data sets (needs `junit-jupiter-params`, included in `junit-jupiter`).

### Tools used alongside JUnit

| Library | Used for |
|---|---|
| **AssertJ** | Readable assertions: `assertThat(list).hasSize(3).contains("Anna")` |
| **Mockito** | Mocks for dependencies: a database, an HTTP client |
| **Testcontainers** | Real PostgreSQL/Kafka in Docker for integration tests |
| **JaCoCo** | Code coverage reports |

More in the [Testing](#/extra/testing) article.

### TDD

From here on the author writes **tests for an interface first, then the implementation** — that's Test-Driven Development: a red test → minimal code to turn it green → refactoring.

## Homework

:::task video "A calculator with tests — from the video"
Add multiplication, division and squaring methods to `Calculator` (multiplication and division take and return `double`) and cover **every** method with tests. Use a tolerance when comparing `double`s. {{t j1 5:58:22}}
:::

:::task video "Separate tests and exceptions — from the video"
Rework the tests so that each check is in its own method with a descriptive name. Write a division method that takes strings and converts them to `double`, plus a test for the exception on invalid input. {{t j1 6:09:42}}
:::

:::task easy "Division by zero"
Decide how `divide(10, 0)` should behave: return `Infinity`, throw `ArithmeticException` or `IllegalArgumentException`? Implement your choice and lock it in with a test.
:::

:::task medium "Tests for MyArrayList"
Write a test suite for your `MyArrayList` from level 1: adding 25 elements (with growth), removing the first/last/middle element, `get` with a wrong index throwing an exception. Find at least one bug in your implementation using the tests.
:::

:::task hard "Parameterised FizzBuzz"
Move FizzBuzz (the loops lesson) into a `String fizzBuzz(int n)` method and test it with one `@ParameterizedTest` + `@CsvSource` over 10+ cases, including boundaries (1, 3, 5, 15, 30). Then add AssertJ and rewrite one of the checks with `assertThat`.
:::
