Wtyczki (rozszerzenia) dodają do IDE nowe możliwości: podpowiedzi skrótów klawiszowych, kontrolę jakości kodu, wsparcie frameworków, asystentów AI. Główna zasada — **instaluj tylko to, czego używasz**: każda wtyczka spowalnia start i indeksowanie.

:::warning "Bezpieczeństwo"
Instaluj wtyczki wyłącznie z oficjalnych sklepów (JetBrains Marketplace, VS Code Marketplace / Open VSX, Eclipse Marketplace) i sprawdzaj autora, liczbę pobrań oraz datę aktualizacji. Rozszerzenie IDE ma dostęp do całego twojego kodu i tokenów — w sklepach znajdowano już złośliwe podróbki popularnych wtyczek.
:::

## IntelliJ IDEA

Instalacja: *Settings → Plugins → Marketplace*.

### Minimalny zestaw początkującego

| Wtyczka | Po co | Cena |
|---|---|---|
| **Key Promoter X** | Pokazuje skrót klawiszowy za każdym razem, gdy wywołasz akcję myszą. Najlepszy sposób na naukę skrótów | Za darmo |
| **SonarQube for IDE** (dawniej SonarLint) | Znajduje błędy, podatności i „zapachy” kodu w trakcie pisania i wyjaśnia, dlaczego to źle | Za darmo |
| **Rainbow Brackets Lite** | Koloruje pary nawiasów różnymi kolorami — zagnieżdżony kod łatwiej czytać | Za darmo |
| **.ignore** | Podświetlanie i szablony dla `.gitignore` i innych plików ignore | Za darmo |
| **String Manipulation** | camelCase ↔ snake_case ↔ UPPER_CASE, sortowanie wierszy, escapowanie | Za darmo |

### Gdy zaczniesz pracować z prawdziwymi projektami

| Wtyczka | Po co |
|---|---|
| **CheckStyle-IDEA** | Sprawdza kod według stylu zespołu (Google/Sun lub własny `checkstyle.xml`) |
| **Maven Helper** | Drzewo zależności i wyszukiwanie konfliktów wersji w Mavenie |
| **MapStruct Support** | Podpowiedzi i nawigacja dla mappera MapStruct |
| **Grep Console** | Koloruje i filtruje logi w konsoli |
| **IdeaVim** | Tryb Vim dla miłośników |
| **Translation** | Tłumaczenie zaznaczonego tekstu/komentarzy w edytorze |
| **Atom Material Icons**, motywy **One Dark**, **Catppuccin** | Wygląd |

### Już wbudowane — nie trzeba instalować

- **Lombok** — wsparcie jest wbudowane w IDEA od 2020.3 (trzeba tylko włączyć *Annotation Processing*, IDEA sama to zaproponuje).
- **Docker**, **Git**, **Maven**, **Gradle**, **Terminal**, **Markdown**, sprawdzanie pisowni **Grazie** — są w zestawie.
- **Save Actions** — przestarzała wtyczka, zamiast niej używaj wbudowanych *Settings → Tools → Actions on Save*.

### Asystenci AI

| Wtyczka | Co robi | Cena |
|---|---|---|
| **JetBrains AI Assistant** i agent **Junie** | Czat, generowanie kodu i testów, wyjaśnianie kodu, agent do zadań wieloetapowych | Darmowy limit + płatne plany JetBrains AI |
| **GitHub Copilot** | Podpowiadanie linii i bloków, czat, tryb agenta | Jest darmowy plan Copilot Free; studenci i opiekunowie OSS dostają Pro za darmo |
| **Claude Code**, **Codex** i inne | Agenci w terminalu/IDE pracujący z całym projektem | Subskrypcja dostawcy |

:::warning "AI a nauka"
Dopóki uczysz się podstaw, **wyłączaj podpowiedzi AI** przy rozwiązywaniu zadań domowych. Inaczej ręce nie zapamiętają składni, a głowa logiki. Szczegóły na stronie [AI](#/page/ai).
:::

## VS Code

Instalacja przez panel *Extensions* (<kbd>Ctrl+Shift+X</kbd>).

| Rozszerzenie | Po co |
|---|---|
| **Extension Pack for Java** (Microsoft) | Obowiązkowy zestaw: Language Support for Java (Red Hat), Debugger for Java, Test Runner for Java, Maven for Java, Project Manager for Java |
| **Gradle for Java** | Zadania i zależności Gradle |
| **Spring Boot Extension Pack** | Spring Boot Tools, Spring Initializr, Spring Boot Dashboard |
| **SonarQube for IDE** | Analiza jakości kodu, jak w IDEA |
| **Error Lens** | Pokazuje błędy i ostrzeżenia bezpośrednio w linii kodu |
| **GitLens** | Historia linii, autorstwo, porównanie gałęzi (część funkcji płatna) |
| **Container Tools** (dawniej Docker) | Dockerfile, docker-compose, zarządzanie kontenerami |
| **XML**, **YAML** (Red Hat) | Podpowiedzi dla `pom.xml` i `application.yml` |
| **REST Client** | Wysyłanie żądań HTTP z plików `.http` |
| **EditorConfig**, **Code Spell Checker** | Jednolite wcięcia i sprawdzanie literówek |

## Eclipse

Instalacja: *Help → Eclipse Marketplace*.

| Wtyczka | Po co |
|---|---|
| **Spring Tools** | Wsparcie Spring Boot (albo pobierz gotową dystrybucję Spring Tools) |
| **SonarQube for IDE** | Analiza jakości kodu |
| **Checkstyle Plug-in**, **SpotBugs** | Styl kodu i wykrywanie typowych błędów |
| **EclEmma** | Pokrycie kodu testami (zwykle już wbudowane) |
| **MoreUnit** | Szybkie przejście między klasą a jej testem |
| **Lombok** | Instalacja przez `java -jar lombok.jar` i wskazanie folderu Eclipse |
| **GitHub Copilot for Eclipse** | Oficjalna wtyczka Copilot |

## Zadanie domowe

:::task easy "Podstawowy zestaw"
Zainstaluj w IntelliJ IDEA **Key Promoter X**, **SonarQube for IDE** i **Rainbow Brackets Lite**. Zrestartuj IDE i sprawdź, że wtyczki pojawiły się w *Settings → Plugins → Installed*.
:::

:::task medium "Znajdź problemy SonarQube"
Napisz metodę z celowymi błędami: nieużywana zmienna, pusty blok `catch`, porównanie napisów przez `==`. Zobacz, co podświetli SonarQube for IDE, i przeczytaj wyjaśnienie każdej reguły (przycisk *Rule description*).
??? Podpowiedź
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

:::task hard "Styl zespołu"
Zainstaluj wtyczkę **CheckStyle-IDEA**, wybierz wbudowaną konfigurację *Google Checks* i sprawdź dowolny swój projekt. Popraw 10 uwag, a następnie ustaw formatowanie IDEA zgodnie z Google Java Style (*Settings → Editor → Code Style → Java → ⚙ → Import Scheme*), aby <kbd>Ctrl+Alt+L</kbd> formatował kod według tych samych reguł.
??? Podpowiedź
Gotowy schemat formatowania `intellij-java-google-style.xml` znajdziesz w repozytorium [google/styleguide](https://github.com/google/styleguide) na GitHubie.
:::
