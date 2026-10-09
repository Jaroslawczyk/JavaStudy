An **IDE** (Integrated Development Environment) is a code editor, compiler, debugger, build system, Git client and hundreds of hints in one window. For Java a good IDE saves hours every day: completion, refactorings, catching errors before you run anything, code generation.

## In short: what to pick

| Situation | Recommendation |
|---|---|
| You are a beginner learning Java | **IntelliJ IDEA** (free tier) — as in the video course |
| Student / teacher | **IntelliJ IDEA Ultimate** for free with an educational license |
| Weak laptop (4–8 GB RAM) | **VS Code** + Extension Pack for Java, or Eclipse |
| You code in several languages (Java + JS/Python) | **VS Code** or IntelliJ IDEA Ultimate |
| Working at a company | Usually **IntelliJ IDEA Ultimate**, paid for by the employer |
| Legacy enterprise / banks / embedded | You will meet **Eclipse** (and Spring Tools built on it) |

## IntelliJ IDEA (JetBrains)

The undisputed leader for Java and Kotlin: according to JetBrains and Snyk surveys about 70–80 % of Java developers use it. It is the IDE used in the video course.

**Strengths:** the best code analysis and refactorings, smart completion, built-in Maven/Gradle, Git, terminal, debugger, support for Spring, databases, Docker, an HTTP client (Ultimate).

**Weaknesses:** memory-hungry (comfortable from 16 GB RAM); advanced features are paid.

### Free or paid (since version 2025.3)

Since **2025.3** there are no separate Community and Ultimate editions — there is **one IntelliJ IDEA**:

- **Without a subscription** — a full Java and Kotlin IDE, free even for commercial work: everything that was in Community Edition, plus a Spring Boot wizard, basic Spring/Jakarta EE/Thymeleaf highlighting, database connections and SQL.
- **Ultimate subscription** — full Spring/Jakarta EE/Quarkus/Micronaut support, profiler, HTTP client, advanced database tools, remote development, etc. There is a 30-day trial. For individuals it costs roughly $17–20 per month, less with yearly billing, with discounts from the second year (current prices at [jetbrains.com/idea/buy](https://www.jetbrains.com/idea/buy/)).
- **Free Ultimate**: for students and teachers ([educational license](https://www.jetbrains.com/community/education/)), open-source maintainers and participants of some bootcamps.

:::tip
If you are a student, apply for the educational license with your university e-mail or ISIC card. It is full Ultimate for the whole time you study.
:::

### Shortcuts worth learning first

| Action | Windows / Linux | macOS |
|---|---|---|
| Search everywhere (file, class, action) | <kbd>Shift</kbd> <kbd>Shift</kbd> | <kbd>⇧</kbd> <kbd>⇧</kbd> |
| Find action / setting | <kbd>Ctrl+Shift+A</kbd> | <kbd>⌘⇧A</kbd> |
| Quick fix / intention | <kbd>Alt+Enter</kbd> | <kbd>⌥↩</kbd> |
| Generate code (constructor, getter, equals…) | <kbd>Alt+Insert</kbd> | <kbd>⌘N</kbd> |
| Reformat code | <kbd>Ctrl+Alt+L</kbd> | <kbd>⌘⌥L</kbd> |
| Rename everywhere | <kbd>Shift+F6</kbd> | <kbd>⇧F6</kbd> |
| Go to declaration | <kbd>Ctrl+B</kbd> / <kbd>Ctrl</kbd>+click | <kbd>⌘B</kbd> |
| Recent files | <kbd>Ctrl+E</kbd> | <kbd>⌘E</kbd> |
| Duplicate / delete line | <kbd>Ctrl+D</kbd> / <kbd>Ctrl+Y</kbd> | <kbd>⌘D</kbd> / <kbd>⌘⌫</kbd> |
| Comment line | <kbd>Ctrl+/</kbd> | <kbd>⌘/</kbd> |
| Extract method / variable | <kbd>Ctrl+Alt+M</kbd> / <kbd>Ctrl+Alt+V</kbd> | <kbd>⌘⌥M</kbd> / <kbd>⌘⌥V</kbd> |
| Run / debug | <kbd>Shift+F10</kbd> / <kbd>Shift+F9</kbd> | <kbd>⌃R</kbd> / <kbd>⌃D</kbd> |
| Toggle breakpoint | <kbd>Ctrl+F8</kbd> | <kbd>⌘F8</kbd> |
| Step over / step into (debugging) | <kbd>F8</kbd> / <kbd>F7</kbd> | <kbd>F8</kbd> / <kbd>F7</kbd> |

### Live Templates — code abbreviations

Type the abbreviation and press <kbd>Tab</kbd>:

| Abbreviation | Expands to |
|---|---|
| `psvm` or `main` | `public static void main(String[] args) { }` |
| `sout` | `System.out.println();` |
| `soutv` | `System.out.println("x = " + x);` — prints the last variable |
| `souf` | `System.out.printf("");` |
| `fori` | `for (int i = 0; i < ; i++) { }` |
| `iter` | a for-each loop over the last collection/array |
| `ifn` / `inn` | `if (x == null)` / `if (x != null)` |

Add your own templates in *Settings → Editor → Live Templates*.

### Useful settings

- *Settings → Editor → General → Auto Import* → enable **Add unambiguous imports on the fly** and **Optimize imports on the fly** — imports will be added and cleaned automatically.
- *Settings → Tools → Actions on Save* → **Reformat code** and **Optimize imports** on save.
- *Settings → Editor → Code Editing → Quick Documentation* → show docs on mouse hover.
- *Help → Change Memory Settings* — raise the IDE heap to 2–4 GB if a big project feels slow.
- The **Learn** tab on the welcome screen is a built-in interactive trainer for IDE features. Complete it in your first week.

## Visual Studio Code + Extension Pack for Java

A free, lightweight editor from Microsoft. Java support comes from extensions, above all the **Extension Pack for Java** (its core is Red Hat's language server based on Eclipse JDT).

- **Pros:** free, starts fast, low memory, one editor for every language, works great with GitHub Codespaces, Dev Containers and remote servers over SSH.
- **Cons:** weaker refactorings and analysis than IDEA, large multi-module projects index slower, more manual configuration.
- **Who uses it:** full-stack developers, DevOps engineers, polyglot developers; courses with cloud environments.

For Spring add the **Spring Boot Extension Pack**. More in [IDE plugins](#/tools/plugins).

:::note "AI editors"
Cursor, Windsurf and similar "AI editors" are built on VS Code, so Java is configured there with the same extensions. AI tools have their own page: [AI](#/page/ai).
:::

## Eclipse IDE

The oldest free open-source IDE (Eclipse Foundation, EPL license). New versions ship quarterly (named like `2026-09`).

- **Pros:** completely free, a powerful incremental compiler, a huge plugin ecosystem, runs on weak machines.
- **Cons:** dated UI, weaker completion and refactorings than IDEA; its market share keeps shrinking.
- **Who uses it:** large banks and corporations with long history, embedded systems, Eclipse RCP projects. **Spring Tools** (formerly Spring Tool Suite) is built on it.

Download **Eclipse IDE for Enterprise Java and Web Developers** or **for Java Developers** at [eclipse.org/downloads](https://www.eclipse.org/downloads/packages/).

## Apache NetBeans

A free IDE from the Apache Software Foundation (once the official Sun/Oracle IDE).

- **Pros:** everything works out of the box without plugins, a handy visual Swing GUI designer, good for learning.
- **Cons:** a small community; rare in commercial development.

## Other options

- **JShell** — the Java console in a terminal (`jshell`), perfect for one- or two-line experiments.
- **Online compilers**: [OneCompiler](https://onecompiler.com/java), [JDoodle](https://www.jdoodle.com/online-java-compiler) — run code from a phone or someone else's computer.
- **GitHub Codespaces** — VS Code in the browser with a ready Linux environment; free hours for personal accounts.
- **BlueJ / Greenfoot** — teaching environments for school students with object visualisation.

## Comparison

| | IntelliJ IDEA | VS Code + Java | Eclipse | NetBeans |
|---|---|---|---|---|
| Price | Free / Ultimate subscription | Free | Free | Free |
| Memory (comfortable) | 16 GB+ | 8 GB | 8 GB | 8 GB |
| Code analysis & refactorings | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ |
| Spring Boot | ★★★★★ (Ultimate) / ★★★☆☆ | ★★★★☆ | ★★★★☆ (Spring Tools) | ★★☆☆☆ |
| Presence in job ads | Very high | Medium | Low, falling | Very low |
| For beginners | Excellent | Good | OK | Good |

:::tip "Advice"
Learn in IntelliJ IDEA: in interviews and your first tasks at work you will almost certainly meet it. But being able to build and run a project from a terminal (`mvn`/`gradle`, `java`) matters more than any IDE — that skill does not depend on the tool.
:::

## Homework

:::task easy "Complete the trainer"
Open the **Learn** tab on IntelliJ IDEA's welcome screen and complete the *Onboarding Tour* and *Editor Basics* modules.
:::

:::task easy "Shortcut cheat sheet"
Write 5 shortcuts from the table above on a sticky note and for one week use only them instead of the mouse. Install the **Key Promoter X** plugin — it shows the shortcut every time you click an action with the mouse.
:::

:::task medium "Your own Live Template"
Create a `todo` template that inserts a `// TODO(your_name): ` comment with the current date. Use the `date()` template function.
??? Hint
*Settings → Editor → Live Templates → +* → Live Template. Text: `// TODO(anna, $DATE$): $END$`. Click *Edit Variables* and set `DATE` to the expression `date("yyyy-MM-dd")`. Don't forget to set the *Java* context at the bottom.
:::

:::task hard "One project — two IDEs"
Create a simple Maven project in IntelliJ IDEA, push it to Git, then open the same folder in VS Code (with the Extension Pack for Java) and run `main` there. Compare startup speed, hints and debugging. Write down three differences.
??? Hint
A Maven project (with a `pom.xml` file) is a portable format: every IDE understands its structure. The `.idea/` and `.vscode/` folders hold personal IDE settings and are usually added to `.gitignore`.
:::
