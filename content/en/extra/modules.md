The **Java Platform Module System** (JPMS, Project Jigsaw, Java 9) added another level of encapsulation above packages: a module explicitly declares what it depends on and which packages it exposes to others. The JDK itself is split into ~70 modules. Modules are rarely used in Spring applications, but you need to understand them — for interviews and for `jlink`.

## module-info.java

```java
// src/main/java/module-info.java
module com.example.shop {
    requires java.net.http;                  // a dependency on a module
    requires transitive com.example.money;   // and for those who depend on us
    requires static lombok;                  // needed only at compile time

    exports com.example.shop.api;            // the module's public API
    exports com.example.shop.spi to com.example.plugins;   // only for a specific module

    opens com.example.shop.dto;              // reflective access (Jackson, Hibernate)

    uses com.example.shop.spi.PaymentProvider;           // ServiceLoader
    provides com.example.shop.spi.PaymentProvider with com.example.shop.CardProvider;
}
```

| Directive | Meaning |
|---|---|
| `requires` | the module depends on another |
| `requires transitive` | the dependency is "passed on" to consumers |
| `exports` | the package is available to other modules for compiling and calling |
| `opens` | the package is open to deep reflection (including `private`) |
| `uses` / `provides … with` | services via `ServiceLoader` |

## Strong encapsulation

Without `exports`, even a module's `public` class **isn't visible** outside. This protects library internals: since Java 17 (JEP 403) reflective access to JDK internals (`sun.misc.*`, `com.sun.*.internal`) is closed by default, and libraries that relied on it had to be updated.

## Classpath and module path

- **Classpath** — "the old way": all JARs in one heap, version conflicts surface only at runtime. Code on the classpath goes into the **unnamed module**, which sees everything.
- **Module path** — modules with `module-info`; JARs without it become **automatic modules** (named from `Automatic-Module-Name` in the manifest or from the file name).

Most Spring Boot applications still run on the classpath — and that's fine.

## jlink: your own small runtime

```bash
jlink --module-path target/classes --add-modules com.example.shop \
      --output build/runtime --strip-debug --no-header-files --no-man-pages
build/runtime/bin/java -m com.example.shop/com.example.shop.Main
```

The runtime contains only the needed JDK modules — tens of megabytes instead of hundreds. Handy for Docker images and desktop apps (`jpackage`).

:::outdated "Module imports — Java 25"
Since Java 25 (JEP 511) you can import all exported packages of a module in one line: `import module java.base;` — handy in scripts and learning programs (in compact source files with `void main()` it's imported automatically).
:::

:::interview "Interview questions"
**Why do we need modules if we have packages?** — A package controls class visibility, but `public` is visible to everyone. A module lets you hide public classes, describe dependencies explicitly (checked at startup, not at the moment of failure) and build a minimal runtime with `jlink`.

**How does `exports` differ from `opens`?** — `exports` grants access to public types for compiling and calling; `opens` grants reflective access to all members (needed by ORMs and serialisers).
:::

## Homework

:::task easy "Listing JDK modules"
Run `java --list-modules` and `java --describe-module java.sql`. Find which modules `java.sql` requires and which packages it exports.
:::

:::task medium "Two modules"
Create the modules `com.example.greeter` (exports an `api` package with an interface and hides an `impl` package) and `com.example.app` (uses greeter). Make sure a class from `impl` is inaccessible from `app` even though it's `public`. Wire the implementation via `provides/uses` and `ServiceLoader`.
:::

:::task hard "A minimal image"
Build a console app on `java.base` + `java.net.http`, create a `jlink` runtime and a Docker image based on it (`FROM debian:stable-slim` + the copied runtime). Compare the image size with ones based on the full `eclipse-temurin:25-jdk` and `-jre`.
:::
