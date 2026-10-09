**Annotations** are metadata attached to classes, methods, fields and parameters: `@Override`, `@Test`, `@Entity`, `@GetMapping`. By themselves they do nothing — they're read by the compiler, build tools or frameworks (via reflection). The modern Java backend runs on annotations, so it's important to understand how they work.

## Built-in annotations

| Annotation | Purpose |
|---|---|
| `@Override` | The compiler checks that the method really overrides a parent's |
| `@Deprecated(since = "9", forRemoval = true)` | Marks an obsolete API, the IDE strikes it through |
| `@SuppressWarnings("unchecked")` | Suppresses a specific compiler warning |
| `@FunctionalInterface` | Checks that the interface has exactly one abstract method |
| `@SafeVarargs` | A method with generic varargs doesn't pollute the heap |
| `@Serial` (Java 14) | Checks declarations of `serialVersionUID`, `readObject` etc. |

## Your own annotation

```java
@Retention(RetentionPolicy.RUNTIME)          // available via reflection at runtime
@Target(ElementType.METHOD)                  // can be placed only on methods
public @interface Timed {
    String value() default "";               // parameters are argument-less "methods"
    int warnAboveMs() default 1000;
}

public class ReportService {
    @Timed(value = "monthly-report", warnAboveMs = 500)
    public void buildReport() { … }
}
```

### Meta-annotations

| Meta-annotation | What it sets |
|---|---|
| `@Retention` | Where it "lives": `SOURCE` (source only, like `@Override`), `CLASS` (in bytecode, the default), `RUNTIME` (visible via reflection) |
| `@Target` | Where it can go: `TYPE`, `METHOD`, `FIELD`, `PARAMETER`, `TYPE_USE`… |
| `@Inherited` | A class annotation is inherited by subclasses |
| `@Repeatable` | Can be applied several times |
| `@Documented` | Included in Javadoc |

Parameter types: primitives, `String`, `Class`, enums, other annotations and arrays of these. If a parameter is named `value`, the name can be omitted: `@Timed("report")`.

## Reading via reflection

```java
for (Method m : ReportService.class.getDeclaredMethods()) {
    Timed timed = m.getAnnotation(Timed.class);
    if (timed != null) {
        long start = System.nanoTime();
        m.invoke(service);
        long ms = (System.nanoTime() - start) / 1_000_000;
        if (ms > timed.warnAboveMs()) System.out.println("Slow: " + timed.value());
    }
}
```

In a simplified form, that's how JUnit (looks for `@Test`), Spring (`@Component`, `@Transactional`) and Hibernate (`@Entity`, `@Column`) work. Frameworks usually also wrap objects in proxies to add behaviour before and after a call.

## Annotation processors (compile time)

Annotations with `SOURCE`/`CLASS` retention are handled by **annotation processors** at compile time — they generate new code:
- **Lombok** — `@Getter`, `@Builder`, `@Slf4j`;
- **MapStruct** — DTO ↔ entity mappers;
- **Dagger**, **Micronaut** — dependency injection without runtime reflection (fast startup).

:::note "Annotations in modern frameworks"
Spring Boot, Jakarta EE, Quarkus, Micronaut — all describe configuration with annotations. When reading code like `@RestController` + `@GetMapping("/users/{id}")`, keep in mind: the annotation is only a label, and the work is done by the framework that found it.
:::

:::interview "Interview questions"
**What are annotations and how are they processed?** — Code metadata. They're processed by the compiler (`@Override`), by annotation processors at build time (Lombok, MapStruct) or by frameworks via reflection at runtime (`@Retention(RUNTIME)`).

**How do `RetentionPolicy.SOURCE`, `CLASS`, `RUNTIME` differ?** — In how long the annotation is kept: only in source, in the `.class` file without runtime access, or available via reflection.
:::

## Homework

:::task easy "@Deprecated done right"
Mark a method `oldSum(int, int)` as `@Deprecated(since = "2.0", forRemoval = true)` with a Javadoc `@deprecated` tag pointing to the replacement. See how the IDE shows it and what warning `javac -Xlint:deprecation` gives.
:::

:::task medium "A mini JUnit"
Create a `@MyTest` annotation and a class with several test methods (some throw exceptions). Write a runner that finds methods with `@MyTest` via reflection, calls them and prints "PASSED/FAILED" and summary statistics.
:::

:::task hard "Field validation"
Create `@NotBlank`, `@Min(int)`, `@Max(int)` annotations for fields and a `Validator` class with a method `List<String> validate(Object o)` that checks fields via reflection and collects error messages. Compare the result with Jakarta Bean Validation (`hibernate-validator`) on the same class.
:::
