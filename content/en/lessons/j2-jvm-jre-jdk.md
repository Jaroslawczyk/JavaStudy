The last section of the course — theory asked in almost every interview. We start with the basics: **how Java works** — from source to machine code — and how **JDK, JRE and JVM** differ. The video describes the classic picture; below is how things look in 2026 (JIT, no separate JRE, jlink, GraalVM).

## Video timestamps

- {{t j2 6:55:43}} — the last section: theory only
- {{t j2 6:56:16}} — how Java works: instructions for a machine
- {{t j2 6:56:50}} — the CPU understands only machine code
- {{t j2 6:57:11}} — the compiler: Java → bytecode
- {{t j2 6:57:27}} — `.java` → `.class`
- {{t j2 6:57:38}} — why bytecode and not machine code right away
- {{t j2 6:57:52}} — "write once, run anywhere": the JVM
- {{t j2 6:58:38}} — the class library, the JRE
- {{t j2 6:59:07}} — question: how do JRE and JVM differ
- {{t j2 6:59:19}} — the JDK
- {{t j2 6:59:36}} — summary

## From source to execution

```
Main.java ──javac──▶ Main.class (bytecode) ──JVM──▶ the CPU's machine code
```

1. **`javac`** (the compiler) checks the code and translates it into **bytecode** — instructions for a virtual machine, the same for every OS and CPU.
2. The **JVM** loads classes (`ClassLoader`), verifies the bytecode (the verifier) and executes it.
3. The same `.class`/`.jar` runs on Windows, Linux, macOS, x86 and ARM — all you need is a JVM for the platform. That's **WORA** — write once, run anywhere.

### Interpreter and JIT

The video says the JVM "turns bytecode into machine code". Here's how exactly:

- At first the bytecode is **interpreted** — slow, but startup is instant.
- The JVM counts which methods are called often ("hot") and the **JIT compiler** (C1, then the optimising C2) turns them into optimised machine code right at runtime — taking the program's real behaviour into account (inlining, removing redundant checks).
- That's why a Java program "speeds up" after starting (warm-up), and long-running Java servers are very fast.

The JVM also contains the **garbage collector** (GC) that manages the heap, threads and the memory model.

## JDK, JRE, JVM

| | What it is | For whom |
|---|---|---|
| **JVM** | The virtual machine: runs bytecode, JIT, GC | — |
| **JRE** | JVM + the standard class library | running a program |
| **JDK** | JRE + tools: `javac`, `java`, `jar`, `jshell`, `javadoc`, `jlink`, `jcmd`, `jfr`… | developers |

:::interview "Interview question"
**How do JDK, JRE and JVM differ?** — The JVM executes bytecode. JRE = JVM + class library — enough to run programs. JDK = JRE + development tools (compiler, debugging, profiling). Worth adding: since Java 11 a separate JRE is no longer distributed — you install a JDK or build your own runtime with `jlink`.
:::

:::outdated "Outdated: “almost every device has a JVM”"
In the applet era Java was installed separately on every computer, and the author says the JVM is "installed by default practically everywhere". That's not the case today:
- **There's no separate JRE since Java 11.** Oracle and other vendors ship JDKs; public "Java for the browser" disappeared with applets (the Applet API was removed in Java 26).
- Applications are shipped **together with a runtime**: a Docker image with a JDK, `jlink` (a trimmed runtime with only the needed modules, tens of MB), `jpackage` (an `.msi`/`.dmg`/`.deb` installer).
- **GraalVM Native Image** compiles a program ahead of time (AOT) into a native executable without a JVM: millisecond startup, little memory — popular for microservices and CLIs. The cost is longer builds and limits on reflection.
- The JVM speeds up startup even without AOT binaries: CDS archives and **Project Leyden** (an AOT cache since Java 24–25).

Which JDK to choose — see the [JDK](#/tools/jdk) article.
:::

## What the video doesn't cover

- **You can look at bytecode:** `javap -c Main.class`. You'll see stack-machine instructions: `iload`, `iadd`, `invokevirtual`…
- **Other JVM languages:** Kotlin, Scala, Groovy and Clojure compile to the same bytecode and use the same library — that's why the JVM is called a platform, not just "a machine for Java".
- **Running without compiling:** since Java 11 you can run `java Main.java` (compiled in memory), since Java 22 — multi-file programs.
- **JVM memory:** the heap (objects, GC), thread stacks (local variables, calls), Metaspace (class metadata). Flags `-Xmx`, `-Xms`.

## Homework

The video has no tasks — practise on your own.

:::task easy "Compiling by hand"
Without an IDE: write `Hello.java`, compile with `javac Hello.java`, run `java Hello`. Then run `java Hello.java` directly. Find the `.class` file and look at its bytecode with `javap -c Hello`.
:::

:::task medium "JIT warm-up"
Write a method computing the sum of squares 1–10,000,000 and call it 20 times in a row, measuring `System.nanoTime()`. Plot the time per iteration. Repeat with the `-Xint` flag (interpreter only) and `-XX:+PrintCompilation`. Explain the result.
:::

:::task hard "Your own small runtime"
Build a modular application (`module-info.java`, depending only on `java.base`), create a runtime with `jlink --add-modules … --output myjre`, compare the size of `myjre` with the full JDK and run the program via `myjre/bin/java`. Bonus: build an installer with `jpackage`. More on modules — [JPMS](#/extra/modules).
:::
