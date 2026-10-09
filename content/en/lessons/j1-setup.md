The first lesson: what this course is, what Java is, and how to prepare your computer — install **IntelliJ IDEA** and a **JDK**, without which Java code will not run.

:::note "The video is in Russian"
The video course is recorded in Russian. Every lesson on this site explains the material in full in English, so you can learn from the text alone. To follow the video too, turn on YouTube subtitles → *Auto-translate → English*.
:::

## Video timestamps

- {{t j1 0:00}} — about the course: part 1 for beginners, part 2 (level 2) — preparing for a Junior interview
- {{t j1 2:12}} — downloading and installing IntelliJ IDEA
- {{t j1 4:08}} — what an SDK/JDK is and why you need it
- {{t j1 4:37}} — downloading and installing the JDK
- {{t j1 5:27}} — connecting the JDK to IntelliJ IDEA

## What Java is and where it is used

**Java** is a general-purpose object-oriented language with strong static typing. Its key principle is *"Write Once, Run Anywhere"*: source code is compiled not into machine instructions for a specific processor but into **bytecode**, which the **JVM** virtual machine executes on any operating system.

Where Java is used today:

- **Backend**: banks, fintech, insurance, e-commerce, the public sector (Spring Boot, Quarkus, Micronaut);
- **Big Data and streaming**: Apache Kafka, Spark, Flink, Hadoop are written in Java/Scala and run on the JVM;
- **Android**: historically Java; today the main language is Kotlin, which is fully interoperable with Java;
- **Enterprise systems**, corporate integrations, high-load services;
- **Developer tools**: IntelliJ IDEA, Gradle, Maven, Jenkins are written in Java.

## JDK, JRE and JVM — what's the difference

| Abbreviation | Stands for | What it is |
|---|---|---|
| **JVM** | Java Virtual Machine | Executes bytecode, manages memory (garbage collector), JIT-compiles "hot" code into machine code |
| **JRE** | Java Runtime Environment | JVM + standard libraries — what you need to *run* programs |
| **JDK** | Java Development Kit | JRE + developer tools: the `javac` compiler, `java`, `jshell`, `javadoc`, `jar`, a debugger, etc. |

For development you always need a **JDK**. In the video it is called an SDK (Software Development Kit) — the generic name for a developer kit on any platform.

:::outdated "There is no separate JRE anymore"
Since Java 11, Oracle and other vendors **no longer ship a separate JRE** for end users. Applications are delivered either with a full JDK or with their own trimmed runtime built with the `jlink` tool. So today you simply install a JDK.
:::

### How a program runs

```text
Hello.java  --(javac)-->  Hello.class (bytecode)  --(java / JVM)-->  result
```

1. You write the source file `Hello.java`.
2. The `javac` compiler checks the code and produces `Hello.class` containing bytecode.
3. The `java` command starts the JVM, which loads the class and executes it (first interpreting it, then compiling "hot" parts into machine code with the JIT compiler).

IntelliJ IDEA does all of this for you when you press ▶ Run.

## Installing IntelliJ IDEA (today)

1. Open [jetbrains.com/idea/download](https://www.jetbrains.com/idea/download/) and download **IntelliJ IDEA** for your OS. Alternatively use the [JetBrains Toolbox App](https://www.jetbrains.com/toolbox-app/), which installs and updates all JetBrains IDEs for you.
2. Run the installer. On Windows it is useful to tick:
   - **Add "bin" folder to the PATH** — to open the IDE from a console with the `idea` command;
   - **Create Associations → .java** — so `.java` files open in IDEA;
   - **Add "Open Folder as Project"** — an item in the Explorer context menu.
3. On first launch pick a theme (light/dark) and skip importing settings.

:::outdated "Community and Ultimate are now one product"
In the video the "free version" — **Community Edition** — is chosen. Since version **2025.3** JetBrains has merged Community and Ultimate into a **single IntelliJ IDEA**. Everything that was in Community is free, including for commercial projects; on top of that a Spring Boot wizard, Spring/Jakarta EE highlighting, database connections and SQL support became free. Advanced features (full Spring support, profiler, HTTP client, database tools, etc.) require an **Ultimate** subscription with a 30-day free trial. Students and teachers get Ultimate for free with an [educational license](https://www.jetbrains.com/community/education/). More in [IDEs: where to write Java](#/tools/ide).
:::

:::outdated "New UI"
Since 2023 IDEA uses the **New UI** by default: Run/Debug buttons are at the top right, tools (Project, Git, Terminal) are icons on the side bars. Menu items may look different from the video, but they have the same names. The main menu is hidden behind the "hamburger" ☰ at the top left.
:::

## Installing the JDK (today)

In the video the JDK is downloaded manually from Oracle's website. Today it is easier and better to do it **right from IDEA**:

1. **File → New → Project** (or *New Project* on the welcome screen).
2. Open the **JDK** drop-down → **Download JDK…**
3. Choose **Version: 25** (the current LTS) and **Vendor: Eclipse Temurin** (or Amazon Corretto, Azul Zulu, Oracle OpenJDK — any of them is fine).
4. Click *Download* — IDEA downloads the JDK into your user folder (`~/.jdks`) and attaches it to the project.

:::outdated "Oracle JDK and its license"
In the video you had to accept Oracle's license agreement. From 2019 to 2021 Oracle JDK required a paid license for commercial use, which scared many companies away. Today Oracle JDK is distributed under the free NFTC license, but the industry still mostly uses **OpenJDK builds** — Eclipse Temurin, Amazon Corretto, Azul Zulu, BellSoft Liberica. Technically it is the same Java. See the comparison in [JDK: versions and distributions](#/tools/jdk).
:::

### Which version to choose

As of October 2026:

- **Java 25** — the current **LTS** (Long-Term Support) release, out since September 2025. **Learn on it.**
- **Java 21** and **Java 17** — previous LTS releases; they dominate company production systems.
- **Java 27** — the newest release (15 September 2026), supported for six months. Great for experiments.
- The next LTS is **Java 29** (September 2027).

New Java versions ship **every 6 months** (March and September); an LTS comes every 2 years.

### Checking the installation from a console

If you installed the JDK separately (installer, `winget`, `brew` or SDKMAN!), check:

```bash
java -version
javac -version
```

The output should contain a version number, e.g. `openjdk version "25.0.1"`. If the command is not found, the JDK is not on your `PATH` (on Windows the Temurin/Corretto installers can do it for you — tick *Set JAVA_HOME* and *Add to PATH*).

Quick installation with package managers:

```bash
# Windows
winget install EclipseAdoptium.Temurin.25.JDK
# macOS
brew install --cask temurin@25
# Linux / macOS / WSL — SDKMAN!
sdk install java 25-tem
```

## What the video doesn't cover

- **JAVA_HOME** — an environment variable pointing to the JDK. Maven, Gradle and other tools use it. JDK installers usually offer to set it.
- **Several JDKs on one machine** are perfectly normal. In IDEA the version is chosen per project: *File → Project Structure → Project → SDK*.
- **JShell** — the interactive Java console (since Java 9). Type `jshell` in a terminal and write expressions without classes or `main` — a great way to try things quickly.
- **Running without an IDE**: since Java 11 a single file can be run directly with `java Hello.java` — no separate compilation; since Java 22 this also works for programs made of several files.

:::tip
Don't be afraid of IDEA's English interface: all documentation, compiler errors and Stack Overflow questions are in English. Get used to it from day one.
:::

## Homework

There is no task in the video for this lesson — let's practise the setup ourselves.

:::task easy "Check your environment"
Install IntelliJ IDEA and JDK 25 (via *Download JDK…* in IDEA). Open IDEA's built-in terminal (**Alt+F12** / **⌥F12**) and run `java -version` and `javac -version`. Write down which vendor and version you have.
??? Hint
If IDEA downloaded the JDK into `~/.jdks` but it is not on the system `PATH`, the terminal may not find `java`. Then install the JDK system-wide as well (`winget`/`brew`/SDKMAN!) or run `~/.jdks/<folder>/bin/java -version` using the full path.
:::

:::task easy "Meet JShell"
Start `jshell` and evaluate: `2 + 2 * 2`, `10 / 3`, `10 % 3`, `Math.sqrt(144)`. Exit with `/exit`.
??? Hint
Just type each expression and press Enter — JShell prints the result like `$1 ==> 6`.
:::

:::task medium "Compiling without an IDE"
In any text editor create `Hello.java` with a `Hello` class that prints `Hello, Java!`. Compile it with `javac Hello.java`, look at the file that appears next to it, and run `java Hello`.
??? Hint
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```
After `javac` you get `Hello.class` — that is bytecode. A class is run by name, **without** the extension: `java Hello`.
:::

:::task hard "Two JDKs and bytecode"
Install a second JDK (for example 21) and switch the project to it in *Project Structure*. Then compile `Hello.java` with `javac --release 17 Hello.java` and run `javap -v Hello.class | findstr major` (Windows) or `| grep major` (macOS/Linux). Which number do you see and what does it mean?
??? Hint
`major version` is the class-file format version: 61 = Java 17, 65 = Java 21, 69 = Java 25. The `--release` flag lets you compile code for an older Java version than the installed JDK.
:::
