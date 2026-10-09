An IDE and a JDK are just the beginning. At work a Java developer uses a build system, Git, Docker, database and HTTP clients, code analysers and CI every day. Here is an overview stating **what is free, what is popular and when you will need it**.

## Build systems: Maven and Gradle

A build system downloads libraries (dependencies), compiles code, runs tests and packages a JAR. In the video course projects are created either "just in IDEA" or with **Gradle** (in the second part).

| | **Maven** | **Gradle** |
|---|---|---|
| Project file | `pom.xml` (XML, declarative) | `build.gradle.kts` (Kotlin DSL) or `build.gradle` (Groovy) |
| Learning curve | Lower: strict structure, "convention over configuration" | Higher: flexibility, scripting |
| Speed | Normal | Faster thanks to incremental builds and caching |
| Where it's popular | Most enterprise and Spring Boot backend projects | Android (the standard), large multi-module projects, Kotlin |
| Price | Free (Apache) | Free; paid Develocity for companies |

Both use the same library repository — **Maven Central** ([central.sonatype.com](https://central.sonatype.com/)).

```xml
<!-- Maven: a dependency in pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>6.0.1</version>
    <scope>test</scope>
</dependency>
```

```kotlin
// Gradle (Kotlin DSL): the same dependency in build.gradle.kts
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:6.0.1")
}
```

:::tip
Always commit the **wrapper** — `mvnw`/`gradlew`: it downloads the right Maven/Gradle version automatically, so the project builds with one command, `./mvnw package` or `./gradlew build`, on any computer. Bazel is a third build system (Google) found in huge monorepos; beginners don't need it.
:::

## Git and code hosting

**Git** is a version control system; no team works without it. The minimum to start:

```bash
git init                      # create a repository
git status                    # what changed
git add .                     # stage changes
git commit -m "Add arrays homework"
git switch -c feature/login   # new branch
git push -u origin main       # push to GitHub
git pull                      # get others' changes
```

| Service | Used for | Price |
|---|---|---|
| **GitHub** | Portfolio, open source, GitHub Actions (CI), Pages (site hosting), Codespaces | Free for personal and public projects |
| **GitLab** | Popular with European companies, built-in CI/CD, can be self-hosted | Free tier + paid plans |
| **Bitbucket** | With Jira (Atlassian) in corporations | Free up to 5 users |

:::tip "Portfolio"
Put this course's homework into a public GitHub repository with a clear `README`. For Junior positions in Poland and Europe, a GitHub link with tidy commits is a real advantage.
:::

## Docker and containers

**Docker** packages an application with its whole environment into a container. A Java developer needs it to start PostgreSQL, Kafka or Redis locally with one command and to run integration tests with **Testcontainers**.

```bash
docker run --name pg -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:18
```

- **Docker Desktop** is free for personal use, education and small companies; large companies need a paid subscription.
- Free alternatives: **Podman** (+ Podman Desktop), **Rancher Desktop**, and on macOS **OrbStack** (free for personal use).

## Databases and their clients

| Tool | Price | Comment |
|---|---|---|
| **DBeaver Community** | Free | A universal client for any DBMS |
| **IntelliJ IDEA** (Database tool) | Basic connection free, full features in Ultimate | Handy without leaving the IDE |
| **DataGrip** | Paid (there are free options for non-commercial use — check the JetBrains site) | A professional SQL tool |
| **pgAdmin** | Free | The official PostgreSQL client |

The most requested database in European Java job ads is **PostgreSQL**, followed by Oracle, MySQL/MariaDB and MS SQL; among NoSQL — MongoDB and Redis.

## HTTP clients for testing APIs

| Tool | Price | Notes |
|---|---|---|
| **Postman** | Free tier | The best known; requires an account, data stored in the cloud |
| **Bruno** | Free, open source | Collections stored as files in Git, works offline |
| **IntelliJ HTTP Client** | Ultimate | `.http` files right in the project |
| **curl**, **HTTPie** | Free | Command line |

## Code quality

| Tool | What it does |
|---|---|
| **Checkstyle** | Checks style (indentation, naming, line length) |
| **PMD** | Finds suspicious constructs and dead code |
| **SpotBugs** | Finds common bugs in bytecode |
| **Error Prone** (Google) | Catches mistakes at compile time |
| **SonarQube / SonarQube Cloud** | A dashboard for quality, coverage and vulnerabilities; free for open source |
| **Spotless** + google-java-format / palantir-java-format | Auto-formatting in the build |

## Debugging and profiling

- **The IDE debugger** — breakpoints, variable inspection, stepping. Learn to use it from the first lessons, not just `System.out.println`.
- **jcmd**, **jstack**, **jmap** — JDK utilities: thread and heap dumps of a running application.
- **JDK Flight Recorder (JFR)** + **JDK Mission Control** — the JVM's free built-in "flight recorder".
- **VisualVM** — graphical monitoring of memory, threads and CPU.
- **async-profiler** — an accurate CPU/memory profiler that builds flame graphs.

## CI/CD

Automatic builds and tests on every push: **GitHub Actions** (free for public repositories), **GitLab CI**, **Jenkins** (the "oldest" and still common in enterprise), **TeamCity**.

## Where to practise

- **Hyperskill** (JetBrains Academy), **Exercism** (Java track, free, with mentors), **Codewars**, **LeetCode** (algorithms for interviews), **Stepik** (including the video author's course, in Russian).
- **JShell** and online compilers for quick checks.

## What it all costs a beginner

| You need | Free option |
|---|---|
| IDE | IntelliJ IDEA (free tier) / VS Code / Eclipse |
| JDK | Eclipse Temurin / Amazon Corretto |
| Build | Maven / Gradle |
| Git + hosting | Git + GitHub |
| Containers | Docker Desktop (personal use) / Podman |
| Database | PostgreSQL in Docker + DBeaver |
| API client | Bruno / curl |
| Quality | SonarQube for IDE, Checkstyle |

**Total: €0.** It only makes sense to pay for IntelliJ IDEA Ultimate (if you are not a student) and, optionally, an AI assistant.

## Homework

:::task easy "Your first repository"
Create a GitHub account (if you don't have one), a new repository `java-course-homework`, and upload the project from the first lesson. Add a `README.md` with a description and a `.gitignore` for Java/IntelliJ.
??? Hint
When creating the repository on GitHub, choose the `.gitignore` template → *Java*, and add `.idea/` and `out/`/`target/`/`build/` manually.
:::

:::task medium "A Maven project from scratch"
Create a Maven project in IDEA (*New Project → Build system: Maven*). Add the JUnit Jupiter dependency and write one test `assertEquals(4, 2 + 2)`. Run the build from a terminal: `./mvnw test` (or `mvn test`).
??? Hint
If there is no `mvnw` file, add the wrapper with `mvn wrapper:wrapper` or generate the project at [start.spring.io](https://start.spring.io/) — it already includes the wrapper.
:::

:::task hard "PostgreSQL in Docker"
Install Docker Desktop or Podman, start PostgreSQL with the command above, connect to it with DBeaver or IDEA's Database tool, create a table `students(id serial primary key, name text)` and insert three rows. Then stop and remove the container (`docker stop pg`, `docker rm pg`) and think: where did the data go and how can you keep it (hint — volumes)?
??? Hint
To make data survive container removal, mount a volume: `-v pgdata:/var/lib/postgresql`.
:::
