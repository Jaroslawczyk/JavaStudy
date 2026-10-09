In the video, projects are created with a button in IDEA and libraries are added by hand. Real development doesn't work that way: a project is described by a **build tool** — it downloads dependencies, compiles, runs tests, builds the JAR and the Docker image the same way on any machine and in CI. An overview of the tools is in the [Ecosystem](#/tools/ecosystem) article; here — more on working with them.

## Maven

Declarative "convention over configuration": the folder layout is fixed (`src/main/java`, `src/test/java`), and the project is described in `pom.xml`.

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>shop</artifactId>
  <version>1.0.0-SNAPSHOT</version>

  <properties>
    <maven.compiler.release>25</maven.compiler.release>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>6.0.0</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

**The life cycle**: `validate → compile → test → package → verify → install → deploy`. A command runs all phases up to the given one: `mvn package` compiles, tests and builds the JAR.

| Command | What it does |
|---|---|
| `./mvnw clean verify` | a clean build with tests (the CI standard) |
| `./mvnw -DskipTests package` | a build without tests |
| `./mvnw dependency:tree` | the dependency tree — looking for version conflicts |
| `./mvnw versions:display-dependency-updates` | which dependencies are outdated |

**Scope**: `compile` (default), `provided` (the server provides it), `runtime` (a DB driver), `test`.

## Gradle

The build is described as code (the Kotlin DSL is the default in new projects), with incremental builds and caching, so Gradle is faster on large projects. The standard for Android.

```kotlin
// build.gradle.kts
plugins {
    java
    id("org.springframework.boot") version "4.1.1"
}

java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
```

`./gradlew build`, `./gradlew test --tests "*OrderTest"`, `./gradlew dependencies`. Configurations: `implementation`, `api` (in libraries), `compileOnly`, `runtimeOnly`, `testImplementation`.

## Bazel and others

**Bazel** (Google) — for huge multi-language monorepos: hermetic reproducible builds and a remote cache. Found at large companies; overkill for an ordinary service. There's also **sbt** (Scala), **Mill**, **Ant** (legacy, imperative XML scripts).

## Maven or Gradle

| | Maven | Gradle |
|---|---|---|
| Description | XML, declarative | Kotlin/Groovy code |
| Learning curve | lower, everything predictable | higher, more flexible |
| Speed | medium | higher (incrementality, build cache) |
| Where more common | corporate backend, banks | Android, large multi-module projects; Spring supports it too |

Job ads in Europe and Poland mention both roughly equally; you need to know them well enough to "build, add a dependency, find a version conflict".

:::tip "Wrapper and BOM"
- Always commit the **wrapper** (`mvnw`/`gradlew`) — then everyone and CI use the same tool version, nothing to install.
- Versions of related libraries are aligned with a **BOM** (`spring-boot-dependencies`, `junit-bom`, `testcontainers-bom`): declare the BOM — then dependencies need no versions.
- Vulnerabilities in dependencies are checked by OWASP Dependency-Check, Dependabot/Renovate.
:::

:::note "Tool versions"
Maven 3.9 is the workhorse; Maven 4 has long been in development (RC versions) with the new POM 4.1 format — check its status before migrating. Gradle has been on the 9.x line since 2025 and needs Java 17+ to run Gradle itself.
:::

## Homework

:::task easy "A first Maven project"
Create a project with `mvn archetype:generate` (or in IDEA: New Project → Maven), add JUnit and one test, build with `./mvnw verify` and run the JAR with `java -jar` (configure `Main-Class` via `maven-jar-plugin`).
:::

:::task medium "The same project on Gradle"
Move the project to the Gradle Kotlin DSL (`gradle init` can convert a `pom.xml`). Compare the time of a repeated build with no changes in Maven and Gradle. Add a task that prints the project version.
:::

:::task hard "A multi-module project and a version conflict"
Create a multi-module project (`api`, `core`, `app`) on Maven or Gradle. Add two libraries pulling different versions of the same transitive dependency (e.g. Jackson), find the conflict with `dependency:tree`/`dependencies`, resolve it with a BOM and add a check (`maven-enforcer-plugin` with `dependencyConvergence`, or `failOnVersionConflict()` in Gradle).
:::
