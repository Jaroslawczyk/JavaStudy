Pierwsza lekcja: czym jest ten kurs, czym jest Java i jak przygotować komputer — zainstalować **IntelliJ IDEA** i **JDK**, bez których kod w Javie się nie uruchomi.

:::note "Wideo jest po rosyjsku"
Kurs wideo został nagrany po rosyjsku. Każda lekcja na tej stronie w pełni objaśnia materiał po polsku, więc możesz uczyć się z samego tekstu. Aby oglądać także wideo, włącz w YouTube napisy → *Tłumacz automatycznie → polski*.
:::

## Znaczniki czasu wideo

- {{t j1 0:00}} — o kursie: część 1 dla początkujących, część 2 (poziom 2) — przygotowanie do rozmowy na stanowisko Junior
- {{t j1 2:12}} — pobieranie i instalacja IntelliJ IDEA
- {{t j1 4:08}} — czym jest SDK/JDK i do czego służy
- {{t j1 4:37}} — pobieranie i instalacja JDK
- {{t j1 5:27}} — podłączenie JDK do IntelliJ IDEA

## Czym jest Java i gdzie się jej używa

**Java** to obiektowy język ogólnego przeznaczenia z silnym statycznym typowaniem. Jej główna zasada to *„napisz raz, uruchamiaj wszędzie”* (Write Once, Run Anywhere): kod źródłowy kompiluje się nie do instrukcji maszynowych konkretnego procesora, lecz do **kodu bajtowego** (bytecode), który wykonuje maszyna wirtualna **JVM** na dowolnym systemie.

Gdzie dziś używa się Javy:

- **Backend**: banki, fintech, ubezpieczenia, e-commerce, sektor publiczny (Spring Boot, Quarkus, Micronaut);
- **Big Data i streaming**: Apache Kafka, Spark, Flink, Hadoop są napisane w Javie/Scali i działają na JVM;
- **Android**: historycznie Java, dziś głównym językiem jest Kotlin, w pełni współpracujący z Javą;
- **Systemy enterprise**, integracje korporacyjne, usługi o dużym obciążeniu;
- **Narzędzia programisty**: IntelliJ IDEA, Gradle, Maven, Jenkins są napisane w Javie.

## JDK, JRE i JVM — czym się różnią

| Skrót | Rozwinięcie | Co to jest |
|---|---|---|
| **JVM** | Java Virtual Machine | Wykonuje kod bajtowy, zarządza pamięcią (garbage collector), kompiluje JIT „gorący” kod do kodu maszynowego |
| **JRE** | Java Runtime Environment | JVM + biblioteki standardowe — to, czego potrzeba do *uruchamiania* programów |
| **JDK** | Java Development Kit | JRE + narzędzia programisty: kompilator `javac`, `java`, `jshell`, `javadoc`, `jar`, debugger itd. |

Do programowania zawsze potrzebujesz **JDK**. W wideo nazywa się go SDK (Software Development Kit) — to ogólna nazwa zestawu programisty dla dowolnej platformy.

:::outdated "Osobnego JRE już nie ma"
Od Javy 11 Oracle i inni dostawcy **nie wydają osobnego JRE** dla użytkowników. Aplikacje dostarcza się z pełnym JDK albo z własnym okrojonym środowiskiem zbudowanym narzędziem `jlink`. Dlatego dziś instaluje się po prostu JDK.
:::

### Jak uruchamia się program

```text
Hello.java  --(javac)-->  Hello.class (kod bajtowy)  --(java / JVM)-->  wynik
```

1. Piszesz plik źródłowy `Hello.java`.
2. Kompilator `javac` sprawdza kod i tworzy plik `Hello.class` z kodem bajtowym.
3. Polecenie `java` uruchamia JVM, która ładuje klasę i ją wykonuje (najpierw interpretując, a „gorące” fragmenty kompilując kompilatorem JIT do kodu maszynowego).

IntelliJ IDEA robi to wszystko za ciebie po kliknięciu ▶ Run.

## Instalacja IntelliJ IDEA (obecnie)

1. Otwórz [jetbrains.com/idea/download](https://www.jetbrains.com/idea/download/) i pobierz **IntelliJ IDEA** dla swojego systemu. Alternatywa — [JetBrains Toolbox App](https://www.jetbrains.com/toolbox-app/): sam instaluje i aktualizuje wszystkie IDE JetBrains.
2. Uruchom instalator. W Windows warto zaznaczyć:
   - **Add "bin" folder to the PATH** — aby otwierać IDE z konsoli poleceniem `idea`;
   - **Create Associations → .java** — aby pliki `.java` otwierały się w IDEA;
   - **Add "Open Folder as Project"** — pozycja w menu kontekstowym Eksploratora.
3. Przy pierwszym uruchomieniu wybierz motyw (jasny/ciemny) i pomiń import ustawień.

:::outdated "Community i Ultimate to teraz jeden produkt"
W wideo wybierana jest „darmowa wersja” — **Community Edition**. Od wersji **2025.3** JetBrains połączył Community i Ultimate w **jedno IntelliJ IDEA**. Wszystko, co było w Community, jest darmowe, także w projektach komercyjnych; dodatkowo za darmo udostępniono kreator Spring Boot, podświetlanie Spring/Jakarta EE, połączenia z bazami danych i SQL. Zaawansowane funkcje (pełne wsparcie Springa, profiler, klient HTTP, narzędzia bazodanowe itd.) wymagają subskrypcji **Ultimate** z 30-dniowym okresem próbnym. Studenci i nauczyciele dostają Ultimate za darmo w ramach [licencji edukacyjnej](https://www.jetbrains.com/community/education/). Więcej w artykule [IDE: gdzie pisać kod](#/tools/ide).
:::

:::outdated "Nowy interfejs"
Od 2023 roku IDEA domyślnie używa **New UI**: przyciski Run/Debug są w prawym górnym rogu, narzędzia (Project, Git, Terminal) to ikony na bocznych paskach. Pozycje menu mogą wyglądać inaczej niż w wideo, ale nazywają się tak samo. Główne menu jest ukryte pod „hamburgerem” ☰ w lewym górnym rogu.
:::

## Instalacja JDK (obecnie)

W wideo JDK pobiera się ręcznie ze strony Oracle. Dziś prościej i lepiej zrobić to **bezpośrednio z IDEA**:

1. **File → New → Project** (lub *New Project* na ekranie startowym).
2. Rozwiń listę **JDK** → **Download JDK…**
3. Wybierz **Version: 25** (aktualne LTS) i **Vendor: Eclipse Temurin** (albo Amazon Corretto, Azul Zulu, Oracle OpenJDK — każdy się nada).
4. Kliknij *Download* — IDEA pobierze JDK do folderu użytkownika (`~/.jdks`) i od razu podłączy go do projektu.

:::outdated "Oracle JDK i licencja"
W wideo trzeba było zaakceptować umowę licencyjną Oracle. W latach 2019–2021 Oracle JDK był płatny przy zastosowaniach komercyjnych, co odstraszyło wiele firm. Dziś Oracle JDK jest dystrybuowany na darmowej licencji NFTC, ale branża i tak częściej używa **kompilacji OpenJDK** — Eclipse Temurin, Amazon Corretto, Azul Zulu, BellSoft Liberica. Technicznie to ta sama Java. Porównanie w artykule [JDK: wersje i dystrybucje](#/tools/jdk).
:::

### Którą wersję wybrać

Stan na październik 2026:

- **Java 25** — aktualna wersja **LTS** (Long-Term Support, długoterminowe wsparcie), wydana we wrześniu 2025. **Ucz się na niej.**
- **Java 21** i **Java 17** — poprzednie LTS, najczęściej spotykane na produkcji w firmach.
- **Java 27** — najnowsze wydanie (15 września 2026), wspierane przez pół roku. Dobre do eksperymentów.
- Następne LTS to **Java 29** (wrzesień 2027).

Nowe wersje Javy wychodzą **co 6 miesięcy** (marzec i wrzesień), LTS — co 2 lata.

### Sprawdzenie instalacji w konsoli

Jeśli instalowałeś JDK osobno (instalatorem, `winget`, `brew` lub SDKMAN!), sprawdź:

```bash
java -version
javac -version
```

Odpowiedź powinna zawierać numer wersji, np. `openjdk version "25.0.1"`. Jeśli polecenie nie zostało znalezione — JDK nie jest w zmiennej `PATH` (w Windows instalatory Temurin/Corretto potrafią to zrobić same — zaznacz *Set JAVA_HOME* i *Add to PATH*).

Szybka instalacja menedżerami pakietów:

```bash
# Windows
winget install EclipseAdoptium.Temurin.25.JDK
# macOS
brew install --cask temurin@25
# Linux / macOS / WSL — SDKMAN!
sdk install java 25-tem
```

## Czego nie ma w wideo

- **JAVA_HOME** — zmienna środowiskowa ze ścieżką do JDK. Korzystają z niej Maven, Gradle i inne narzędzia. Instalatory JDK zwykle proponują jej ustawienie.
- **Kilka JDK na jednym komputerze** to norma. W IDEA wersję wybiera się dla każdego projektu: *File → Project Structure → Project → SDK*.
- **JShell** — interaktywna konsola Javy (od Javy 9). Wpisz `jshell` w terminalu i pisz wyrażenia bez klas i `main` — świetny sposób, by szybko coś sprawdzić.
- **Uruchamianie bez IDE**: od Javy 11 pojedynczy plik można uruchomić od razu poleceniem `java Hello.java` — bez osobnej kompilacji; od Javy 22 działa to także dla programów z kilku plików.

:::tip
Nie bój się angielskiego interfejsu IDEA: cała dokumentacja, błędy kompilatora i pytania na Stack Overflow są po angielsku. Przyzwyczajaj się od pierwszego dnia. W razie potrzeby istnieje oficjalna wtyczka z językiem polskim (*Settings → Plugins → Language Pack*), ale lepiej się bez niej obejść.
:::

## Zadanie domowe

W wideo do tej lekcji nie ma zadania — utrwalmy instalację sami.

:::task easy "Sprawdzenie środowiska"
Zainstaluj IntelliJ IDEA i JDK 25 (przez *Download JDK…* w IDEA). Otwórz wbudowany terminal IDEA (**Alt+F12** / **⌥F12**) i wykonaj `java -version` oraz `javac -version`. Zapisz, jakiego dostawcę i jaką wersję masz zainstalowaną.
??? Podpowiedź
Jeśli IDEA pobrała JDK do `~/.jdks`, a nie ma go w systemowym `PATH`, terminal może nie znaleźć `java`. Wtedy zainstaluj JDK także w systemie (`winget`/`brew`/SDKMAN!) lub uruchom `~/.jdks/<folder>/bin/java -version` pełną ścieżką.
:::

:::task easy "Poznaj JShell"
Uruchom `jshell` i oblicz: `2 + 2 * 2`, `10 / 3`, `10 % 3`, `Math.sqrt(144)`. Wyjdź poleceniem `/exit`.
??? Podpowiedź
Każde wyrażenie po prostu wpisz i zatwierdź Enterem — JShell sam wypisze wynik w postaci `$1 ==> 6`.
:::

:::task medium "Kompilacja bez IDE"
W dowolnym edytorze tekstu utwórz plik `Hello.java` z klasą `Hello`, która wypisuje `Cześć, Java!`. Skompiluj go poleceniem `javac Hello.java`, zobacz, jaki plik pojawił się obok, i uruchom `java Hello`.
??? Podpowiedź
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Cześć, Java!");
    }
}
```
Po `javac` pojawi się `Hello.class` — to kod bajtowy. Klasę uruchamia się po nazwie, **bez** rozszerzenia: `java Hello`.
:::

:::task hard "Dwa JDK i kod bajtowy"
Zainstaluj drugie JDK (np. 21) i przełącz na nie projekt w *Project Structure*. Następnie skompiluj `Hello.java` poleceniem `javac --release 17 Hello.java` i wykonaj `javap -v Hello.class | findstr major` (Windows) lub `| grep major` (macOS/Linux). Jaką liczbę widzisz i co ona oznacza?
??? Podpowiedź
`major version` to wersja formatu pliku class: 61 = Java 17, 65 = Java 21, 69 = Java 25. Flaga `--release` pozwala kompilować kod dla starszej wersji Javy niż zainstalowane JDK.
:::
