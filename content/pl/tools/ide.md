**IDE** (Integrated Development Environment, zintegrowane środowisko programistyczne) to edytor kodu, kompilator, debugger, system budowania, klient Git i setki podpowiedzi w jednym oknie. W Javie dobre IDE oszczędza godziny każdego dnia: podpowiadanie kodu, refaktoryzacje, wykrywanie błędów jeszcze przed uruchomieniem, generowanie kodu.

## W skrócie: co wybrać

| Sytuacja | Rekomendacja |
|---|---|
| Jesteś początkujący i uczysz się Javy | **IntelliJ IDEA** (darmowa część) — jak w kursie wideo |
| Student / nauczyciel | **IntelliJ IDEA Ultimate** za darmo w ramach licencji edukacyjnej |
| Słaby laptop (4–8 GB RAM) | **VS Code** + Extension Pack for Java albo Eclipse |
| Piszesz w kilku językach (Java + JS/Python) | **VS Code** lub IntelliJ IDEA Ultimate |
| Praca w firmie | Najczęściej **IntelliJ IDEA Ultimate**, licencję opłaca pracodawca |
| Stary enterprise / banki / systemy wbudowane | Spotkasz **Eclipse** (i oparte na nim Spring Tools) |

## IntelliJ IDEA (JetBrains)

Bezdyskusyjny lider dla Javy i Kotlina: według ankiet JetBrains i Snyk korzysta z niego ok. 70–80 % programistów Javy. To właśnie IDE z kursu wideo.

**Mocne strony:** najlepsza analiza kodu i refaktoryzacje, „inteligentne” podpowiadanie, wbudowane Maven/Gradle, Git, terminal, debugger, wsparcie dla Springa, baz danych, Dockera, klient HTTP (w Ultimate).

**Słabe strony:** dużo pamięci (komfortowo od 16 GB RAM), zaawansowane funkcje są płatne.

### Za darmo czy płatnie (od wersji 2025.3)

Od wersji **2025.3** nie ma już osobnych Community i Ultimate — jest **jedno IntelliJ IDEA**:

- **Bez subskrypcji** — pełnoprawne IDE dla Javy i Kotlina, darmowe również do pracy komercyjnej: wszystko, co było w Community Edition, plus kreator Spring Boot, podstawowe podświetlanie Spring/Jakarta EE/Thymeleaf, połączenia z bazami danych i SQL.
- **Subskrypcja Ultimate** — pełne wsparcie Spring/Jakarta EE/Quarkus/Micronaut, profiler, klient HTTP, zaawansowane narzędzia bazodanowe, praca zdalna itd. Jest 30-dniowy okres próbny. Dla osób prywatnych to ok. 17–20 USD miesięcznie, taniej przy płatności rocznej, z rabatami od drugiego roku (aktualne ceny: [jetbrains.com/idea/buy](https://www.jetbrains.com/idea/buy/)).
- **Darmowy Ultimate**: dla studentów i nauczycieli ([licencja edukacyjna](https://www.jetbrains.com/community/education/)), opiekunów projektów open source i uczestników niektórych bootcampów.

:::tip
Jeśli studiujesz — złóż wniosek o licencję edukacyjną z uczelnianym e-mailem lub legitymacją ISIC. To pełny Ultimate na cały czas nauki.
:::

### Skróty klawiszowe, których warto nauczyć się najpierw

| Akcja | Windows / Linux | macOS |
|---|---|---|
| Szukaj wszędzie (plik, klasa, akcja) | <kbd>Shift</kbd> <kbd>Shift</kbd> | <kbd>⇧</kbd> <kbd>⇧</kbd> |
| Znajdź akcję / ustawienie | <kbd>Ctrl+Shift+A</kbd> | <kbd>⌘⇧A</kbd> |
| Szybka poprawka / podpowiedź | <kbd>Alt+Enter</kbd> | <kbd>⌥↩</kbd> |
| Generuj kod (konstruktor, getter, equals…) | <kbd>Alt+Insert</kbd> | <kbd>⌘N</kbd> |
| Sformatuj kod | <kbd>Ctrl+Alt+L</kbd> | <kbd>⌘⌥L</kbd> |
| Zmień nazwę wszędzie | <kbd>Shift+F6</kbd> | <kbd>⇧F6</kbd> |
| Przejdź do deklaracji | <kbd>Ctrl+B</kbd> / <kbd>Ctrl</kbd>+klik | <kbd>⌘B</kbd> |
| Ostatnie pliki | <kbd>Ctrl+E</kbd> | <kbd>⌘E</kbd> |
| Duplikuj / usuń wiersz | <kbd>Ctrl+D</kbd> / <kbd>Ctrl+Y</kbd> | <kbd>⌘D</kbd> / <kbd>⌘⌫</kbd> |
| Zakomentuj wiersz | <kbd>Ctrl+/</kbd> | <kbd>⌘/</kbd> |
| Wydziel metodę / zmienną | <kbd>Ctrl+Alt+M</kbd> / <kbd>Ctrl+Alt+V</kbd> | <kbd>⌘⌥M</kbd> / <kbd>⌘⌥V</kbd> |
| Uruchom / debuguj | <kbd>Shift+F10</kbd> / <kbd>Shift+F9</kbd> | <kbd>⌃R</kbd> / <kbd>⌃D</kbd> |
| Punkt przerwania | <kbd>Ctrl+F8</kbd> | <kbd>⌘F8</kbd> |
| Krok nad / do środka (debugowanie) | <kbd>F8</kbd> / <kbd>F7</kbd> | <kbd>F8</kbd> / <kbd>F7</kbd> |

### Live Templates — skróty kodu

Wpisz skrót i naciśnij <kbd>Tab</kbd>:

| Skrót | Rozwija się do |
|---|---|
| `psvm` lub `main` | `public static void main(String[] args) { }` |
| `sout` | `System.out.println();` |
| `soutv` | `System.out.println("x = " + x);` — wypisanie ostatniej zmiennej |
| `souf` | `System.out.printf("");` |
| `fori` | `for (int i = 0; i < ; i++) { }` |
| `iter` | pętla for-each po ostatniej kolekcji/tablicy |
| `ifn` / `inn` | `if (x == null)` / `if (x != null)` |

Własne szablony dodasz w *Settings → Editor → Live Templates*.

### Przydatne ustawienia

- *Settings → Editor → General → Auto Import* → włącz **Add unambiguous imports on the fly** i **Optimize imports on the fly** — importy będą dodawane i porządkowane automatycznie.
- *Settings → Tools → Actions on Save* → **Reformat code** i **Optimize imports** przy zapisie.
- *Settings → Editor → Code Editing → Quick Documentation* → dokumentacja po najechaniu myszą.
- *Help → Change Memory Settings* — zwiększ pamięć IDE do 2–4 GB, jeśli duży projekt działa wolno.
- Zakładka **Learn** na ekranie startowym to wbudowany interaktywny trener funkcji IDE. Przejdź go w pierwszym tygodniu.

## Visual Studio Code + Extension Pack for Java

Darmowy, lekki edytor Microsoftu. Wsparcie Javy zapewniają rozszerzenia, przede wszystkim **Extension Pack for Java** (jego rdzeń to serwer językowy Red Hat oparty na Eclipse JDT).

- **Zalety:** darmowy, szybko startuje, mało pamięci, jeden edytor do wszystkich języków, świetnie działa z GitHub Codespaces, Dev Containers i zdalnymi serwerami przez SSH.
- **Wady:** słabsze refaktoryzacje i analiza niż w IDEA, duże projekty wielomodułowe indeksują się wolniej, więcej ręcznej konfiguracji.
- **Kto używa:** programiści full-stack, DevOps, osoby piszące w wielu językach; kursy ze środowiskami w chmurze.

Do Springa dodaj **Spring Boot Extension Pack**. Więcej w artykule [Wtyczki do IDE](#/tools/plugins).

:::note "Edytory z AI"
Cursor, Windsurf i podobne „edytory AI” są zbudowane na VS Code, więc Javę konfiguruje się w nich tymi samymi rozszerzeniami. Narzędziom AI poświęcona jest osobna strona: [AI](#/page/ai).
:::

## Eclipse IDE

Najstarsze darmowe IDE open source (Eclipse Foundation, licencja EPL). Nowe wersje wychodzą co kwartał (nazwy w formacie `2026-09`).

- **Zalety:** całkowicie darmowe, potężny kompilator przyrostowy, ogromny ekosystem wtyczek, działa na słabych komputerach.
- **Wady:** przestarzały interfejs, słabsze podpowiedzi i refaktoryzacje niż w IDEA; udział w rynku stopniowo spada.
- **Kto używa:** duże banki i korporacje z długą historią, systemy wbudowane, projekty Eclipse RCP. Na nim zbudowano **Spring Tools** (dawniej Spring Tool Suite).

Pobierz **Eclipse IDE for Enterprise Java and Web Developers** lub **for Java Developers** z [eclipse.org/downloads](https://www.eclipse.org/downloads/packages/).

## Apache NetBeans

Darmowe IDE od Apache Software Foundation (kiedyś oficjalne IDE Sun/Oracle).

- **Zalety:** wszystko działa „od ręki” bez wtyczek, wygodny wizualny edytor interfejsów Swing, dobre do nauki.
- **Wady:** mała społeczność, w komercyjnych projektach spotykane rzadko.

## Inne opcje

- **JShell** — konsola Javy w terminalu (`jshell`), idealna do eksperymentów z jedną-dwiema linijkami.
- **Kompilatory online**: [OneCompiler](https://onecompiler.com/java), [JDoodle](https://www.jdoodle.com/online-java-compiler) — uruchomisz kod z telefonu lub cudzego komputera.
- **GitHub Codespaces** — VS Code w przeglądarce z gotowym środowiskiem Linux; darmowe godziny dla kont prywatnych.
- **BlueJ / Greenfoot** — środowiska edukacyjne dla uczniów z wizualizacją obiektów.

## Porównanie

| | IntelliJ IDEA | VS Code + Java | Eclipse | NetBeans |
|---|---|---|---|---|
| Cena | Za darmo / Ultimate w subskrypcji | Za darmo | Za darmo | Za darmo |
| Pamięć (komfortowo) | 16 GB+ | 8 GB | 8 GB | 8 GB |
| Analiza kodu i refaktoryzacje | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★☆☆ |
| Spring Boot | ★★★★★ (Ultimate) / ★★★☆☆ | ★★★★☆ | ★★★★☆ (Spring Tools) | ★★☆☆☆ |
| Obecność w ofertach pracy | Bardzo wysoka | Średnia | Niska, spada | Bardzo niska |
| Dla początkujących | Świetnie | Dobrze | Przeciętnie | Dobrze |

:::tip "Rada"
Ucz się w IntelliJ IDEA: na rozmowach rekrutacyjnych i w pierwszych zadaniach w pracy prawie na pewno ją spotkasz. Ale umiejętność zbudowania i uruchomienia projektu z terminala (`mvn`/`gradle`, `java`) jest ważniejsza niż jakiekolwiek IDE — nie zależy od narzędzia.
:::

## Zadanie domowe

:::task easy "Przejdź trener"
Otwórz w IntelliJ IDEA zakładkę **Learn** na ekranie startowym i przejdź moduły *Onboarding Tour* oraz *Editor Basics*.
:::

:::task easy "Ściąga skrótów"
Wypisz na karteczce 5 skrótów z tabeli powyżej i przez tydzień używaj tylko ich zamiast myszy. Zainstaluj wtyczkę **Key Promoter X** — podpowie skrót za każdym razem, gdy klikniesz akcję myszą.
:::

:::task medium "Własny Live Template"
Utwórz szablon `todo`, który wstawia komentarz `// TODO(twoje_imię): ` z bieżącą datą. Użyj funkcji szablonu `date()`.
??? Podpowiedź
*Settings → Editor → Live Templates → +* → Live Template. Tekst: `// TODO(anna, $DATE$): $END$`. Kliknij *Edit Variables* i dla `DATE` ustaw wyrażenie `date("yyyy-MM-dd")`. Nie zapomnij na dole wskazać kontekstu *Java*.
:::

:::task hard "Jeden projekt — dwa IDE"
Utwórz prosty projekt Maven w IntelliJ IDEA, wypchnij go do Gita, a potem otwórz ten sam folder w VS Code (z Extension Pack for Java) i uruchom tam `main`. Porównaj szybkość startu, podpowiedzi i debugowanie. Zapisz trzy różnice.
??? Podpowiedź
Projekt Maven (z plikiem `pom.xml`) to przenośny format: każde IDE rozumie jego strukturę. Foldery `.idea/` i `.vscode/` to prywatne ustawienia IDE — zwykle dodaje się je do `.gitignore`.
:::
