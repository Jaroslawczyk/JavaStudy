The **JDK** (Java Development Kit) is the development kit: the `javac` compiler, the virtual machine and the standard library. Java is an open platform: the reference implementation, **OpenJDK**, is developed by the community (Oracle, Red Hat, Amazon, Microsoft, SAP and others), and various companies publish their own **builds (distributions)** of that code.

## Java versions and LTS

Since 2018 Java ships **every 6 months** — in March and September. Every fourth version (every 2 years) is an **LTS** (Long-Term Support) release: it is supported and patched for years, which is why companies run LTS versions in production.

| Version | Date | Status as of October 2026 |
|---|---|---|
| Java 8 | 2014 | LTS, "legacy", still found in old systems |
| Java 11 | 2018 | LTS, gradually fading out |
| Java 17 | 2021 | LTS, very widespread |
| Java 21 | 2023 | LTS, the main choice of companies now |
| **Java 25** | September 2025 | **Current LTS — learn on it** |
| Java 26 | March 2026 | Regular release, support has ended |
| Java 27 | 15 September 2026 | Latest release, supported until March 2027 |
| Java 29 | September 2027 | Next LTS |

:::tip "Which version to learn"
Learn on **Java 25**. Code written for Java 17/21 almost always runs on 25 unchanged, and you will already know the new language features (records, `var`, switch expressions, text blocks, virtual threads) — a plus in interviews.
:::

## What appeared in Java after 8 (cheat sheet)

The video course sometimes shows a "classic" Java style. These are the most important language and library changes — lessons refer to them in **↻ Outdated** boxes.

| Version | Key features |
|---|---|
| 8 | Lambdas, Stream API, `Optional`, `java.time` (new dates), default methods in interfaces |
| 9 | Modules (JPMS), JShell, `List.of()`, `Set.of()`, `Map.of()` |
| 10 | `var` — local variable type inference |
| 11 | `HttpClient`, `String.isBlank()/strip()/lines()/repeat()`, `Files.readString()`, running `java File.java` |
| 14 | Switch expressions with arrows `->`, helpful NullPointerException messages |
| 15 | Text blocks `"""…"""` |
| 16 | `record`, pattern matching for `instanceof`, `Stream.toList()` |
| 17 | Sealed classes (`sealed`/`permits`), strong encapsulation of JDK internals |
| 21 | **Virtual threads**, Sequenced Collections (`getFirst()`, `reversed()`), record patterns, pattern matching in `switch` |
| 22 | Unnamed variables `_`, Foreign Function & Memory API, launching multi-file programs without compiling |
| 23 | Markdown Javadoc comments (`///`) |
| 24 | Stream Gatherers, virtual threads no longer pinned in `synchronized`, Security Manager permanently disabled |
| 25 | **Compact source files and `void main()`** without a class, `IO.println()`, `import module`, flexible constructor bodies (code before `super(...)`), Scoped Values |
| 26 | HTTP/3 in `HttpClient`, Applet API removed |
| 27 | G1 is the default GC everywhere, compact object headers by default, post-quantum hybrid TLS |

Features marked *preview* in a given version must be enabled with `--enable-preview`; final features work right away.

## JDK distributions

All builds listed (apart from GraalVM specifics) are **the same OpenJDK** that passed the compatibility tests (TCK). They differ in license, update period and paid support.

| Distribution | Publisher | Price | Notes |
|---|---|---|---|
| **Eclipse Temurin** | Eclipse Adoptium (community + Microsoft, Red Hat, IBM, etc.) | Free | The most popular "neutral" choice, long LTS updates, official `eclipse-temurin` Docker images |
| **Amazon Corretto** | Amazon | Free | Long-term patches from AWS, the standard on AWS Lambda/EC2 |
| **Azul Zulu** | Azul | Free / paid support | Many platforms and old versions, commercial support via Azul Platform Core |
| **BellSoft Liberica** | BellSoft | Free / paid support | A *Full* variant with JavaFX, small Alpine images; the default in Spring Boot buildpacks (`./mvnw spring-boot:build-image`) |
| **Microsoft Build of OpenJDK** | Microsoft | Free | For Azure and Windows environments |
| **Oracle OpenJDK** (jdk.java.net) | Oracle | Free (GPL) | Updated only for 6 months — for experimenting with the newest versions |
| **Oracle JDK** | Oracle | Free under NFTC for a limited period, then a subscription | For companies with an Oracle contract |
| **GraalVM** | Oracle / community | Free (Oracle GraalVM under GFTC) | **Native Image** — compiles a Java app into a native binary: millisecond startup, low memory (Spring Boot, Quarkus, Micronaut) |
| **IBM Semeru** | IBM | Free | A different JVM — Eclipse OpenJ9, lower memory usage |
| Red Hat build of OpenJDK, SapMachine | Red Hat, SAP | Free | For the RHEL and SAP ecosystems |

:::outdated "Oracle JDK and paid licenses"
In 2019–2021 Oracle JDK updates became paid for commercial use, and in 2023 Oracle switched its subscription to "per company employee" pricing. Many companies then moved en masse to free builds — Temurin, Corretto, Zulu. Today the newest Oracle JDK LTS is free under the NFTC license, but only for a limited time. **For learning and personal projects choose Temurin or Corretto — and forget about licenses.**
:::

## How to install and switch JDKs

| Method | Command / action | For |
|---|---|---|
| From IntelliJ IDEA | *Project Structure → SDKs → + → Download JDK* | The easiest option for beginners |
| Installer | [adoptium.net](https://adoptium.net/), [aws.amazon.com/corretto](https://aws.amazon.com/corretto/) — tick *Set JAVA_HOME* | Windows/macOS |
| winget (Windows) | `winget install EclipseAdoptium.Temurin.25.JDK` | Windows |
| Homebrew (macOS) | `brew install --cask temurin@25` | macOS |
| **SDKMAN!** | `sdk install java 25-tem`, `sdk use java 21.0.8-tem` | Linux, macOS, WSL — easy version switching |
| Linux package manager | `sudo apt install openjdk-25-jdk` | Ubuntu/Debian |
| Docker | `docker run -it eclipse-temurin:25-jdk jshell` | No installation on the system |

### The JAVA_HOME variable

Many tools (Maven, Gradle, IDEs, scripts) locate the JDK through the `JAVA_HOME` environment variable, and the `java`/`javac` commands through `PATH`.

```bash
# macOS / Linux (add to ~/.zshrc or ~/.bashrc)
export JAVA_HOME=$(/usr/libexec/java_home -v 25)   # macOS
export PATH="$JAVA_HOME/bin:$PATH"
```

On Windows: *Settings → System → About → Advanced system settings → Environment Variables* → create `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-25…` and add `%JAVA_HOME%\bin` to `Path`.

Check with `java -version` and `echo %JAVA_HOME%` (Windows) or `echo $JAVA_HOME`.

## Homework

:::task easy "Find your Java from code"
Write a program that prints the version and vendor of the Java it runs on.
??? Hint
```java
public class WhichJava {
    public static void main(String[] args) {
        System.out.println(Runtime.version());
        System.out.println(System.getProperty("java.vendor"));
        System.out.println(System.getProperty("java.home"));
    }
}
```
:::

:::task medium "Two versions side by side"
Install JDK 21 and JDK 25 (any method from the table). Run the program from the previous task on both, switching the project SDK in IDEA, and compare the output.
:::

:::task hard "New feature — old compiler"
Create `Main.java` with a Java 25 "compact" source file:
```java
void main() {
    IO.println("Hello from Java 25!");
}
```
Run it with `java Main.java` on JDK 25. Then try it on JDK 21 and read the error. Explain why the code compiles in one version but not the other, and what the `--enable-preview` flag is.
??? Hint
Compact source files and a class-less `void main()` became final only in Java 25 (JEP 512). In Java 21 this was a preview feature (JEP 445): you could try it with `--enable-preview --source 21`, and the `IO` class appeared later.
:::
