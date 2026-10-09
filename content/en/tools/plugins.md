Plugins (extensions) add new capabilities to an IDE: shortcut hints, code-quality checks, framework support, AI assistants. The main rule is **install only what you actually use**: every plugin slows down startup and indexing.

:::warning "Security"
Install plugins only from official stores (JetBrains Marketplace, VS Code Marketplace / Open VSX, Eclipse Marketplace) and check the author, download count and last update date. An IDE extension has access to all your code and tokens — malicious look-alikes of popular extensions have already been found in these stores.
:::

## IntelliJ IDEA

Install via *Settings → Plugins → Marketplace*.

### Beginner's minimal set

| Plugin | Why | Price |
|---|---|---|
| **Key Promoter X** | Shows the shortcut every time you trigger an action with the mouse. The best way to learn shortcuts | Free |
| **SonarQube for IDE** (formerly SonarLint) | Finds bugs, vulnerabilities and code smells as you type and explains why they are bad | Free |
| **Rainbow Brackets Lite** | Colours matching brackets differently — nested code becomes easier to read | Free |
| **.ignore** | Highlighting and templates for `.gitignore` and other ignore files | Free |
| **String Manipulation** | camelCase ↔ snake_case ↔ UPPER_CASE, sorting lines, escaping | Free |

### When you start working on real projects

| Plugin | Why |
|---|---|
| **CheckStyle-IDEA** | Checks code against the team style (Google/Sun style or your own `checkstyle.xml`) |
| **Maven Helper** | Dependency tree and version-conflict search in Maven |
| **MapStruct Support** | Completion and navigation for the MapStruct mapper |
| **Grep Console** | Colours and filters logs in the console |
| **IdeaVim** | Vim mode for those who love it |
| **Translation** | Translates selected text/comments right in the editor |
| **Atom Material Icons**, **One Dark**, **Catppuccin** themes | Looks |

### Already built in — no need to install

- **Lombok** — support has been bundled since IDEA 2020.3 (you only need to enable *Annotation Processing*; IDEA offers it itself).
- **Docker**, **Git**, **Maven**, **Gradle**, **Terminal**, **Markdown**, the **Grazie** spell checker are bundled.
- **Save Actions** — an outdated plugin; use the built-in *Settings → Tools → Actions on Save* instead.

### AI assistants

| Plugin | What it does | Price |
|---|---|---|
| **JetBrains AI Assistant** and the **Junie** agent | Chat, code and test generation, code explanation, an agent for multi-step tasks | Free quota + paid JetBrains AI plans |
| **GitHub Copilot** | Line and block completion, chat, agent mode | Copilot Free tier available; Pro is free for students and OSS maintainers |
| **Claude Code**, **Codex**, etc. | Agents in the terminal/IDE that work with the whole project | Provider subscription |

:::warning "AI and learning"
While you are learning the basics, **turn off AI completion** when solving homework. Otherwise your hands won't remember the syntax and your head won't learn the logic. More on the [AI](#/page/ai) page.
:::

## VS Code

Install via the *Extensions* panel (<kbd>Ctrl+Shift+X</kbd>).

| Extension | Why |
|---|---|
| **Extension Pack for Java** (Microsoft) | The essential set: Language Support for Java (Red Hat), Debugger for Java, Test Runner for Java, Maven for Java, Project Manager for Java |
| **Gradle for Java** | Gradle tasks and dependencies |
| **Spring Boot Extension Pack** | Spring Boot Tools, Spring Initializr, Spring Boot Dashboard |
| **SonarQube for IDE** | Code-quality analysis, same as in IDEA |
| **Error Lens** | Shows errors and warnings inline in the code |
| **GitLens** | Line history, blame, branch comparison (some features are paid) |
| **Container Tools** (formerly Docker) | Dockerfile, docker-compose, container management |
| **XML**, **YAML** (Red Hat) | Completion for `pom.xml` and `application.yml` |
| **REST Client** | Send HTTP requests from `.http` files |
| **EditorConfig**, **Code Spell Checker** | Consistent indentation and typo checking |

## Eclipse

Install via *Help → Eclipse Marketplace*.

| Plugin | Why |
|---|---|
| **Spring Tools** | Spring Boot support (or download the ready-made Spring Tools distribution) |
| **SonarQube for IDE** | Code-quality analysis |
| **Checkstyle Plug-in**, **SpotBugs** | Code style and common bug detection |
| **EclEmma** | Test coverage (usually already bundled) |
| **MoreUnit** | Jump quickly between a class and its test |
| **Lombok** | Installed by running `java -jar lombok.jar` and pointing it to the Eclipse folder |
| **GitHub Copilot for Eclipse** | The official Copilot plugin |

## Homework

:::task easy "The basic set"
Install **Key Promoter X**, **SonarQube for IDE** and **Rainbow Brackets Lite** in IntelliJ IDEA. Restart the IDE and check that the plugins appear in *Settings → Plugins → Installed*.
:::

:::task medium "Find SonarQube issues"
Write a method with deliberate mistakes: an unused variable, an empty `catch` block, comparing strings with `==`. See what SonarQube for IDE highlights and read the explanation of each rule (the *Rule description* button).
??? Hint
```java
public static boolean check(String a, String b) {
    int unused = 42;
    try {
        Integer.parseInt(a);
    } catch (NumberFormatException e) {
    }
    return a == b;
}
```
:::

:::task hard "Team style"
Install the **CheckStyle-IDEA** plugin, choose the built-in *Google Checks* configuration and check any of your learning projects. Fix 10 findings, then configure IDEA formatting to Google Java Style (*Settings → Editor → Code Style → Java → ⚙ → Import Scheme*) so that <kbd>Ctrl+Alt+L</kbd> formats code by the same rules.
??? Hint
The ready-made formatter scheme `intellij-java-google-style.xml` is in the [google/styleguide](https://github.com/google/styleguide) repository on GitHub.
:::
