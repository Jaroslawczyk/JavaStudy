**JDK** (Java Development Kit) to zestaw programisty: kompilator `javac`, maszyna wirtualna i biblioteka standardowa. Java jest otwartą platformą: wzorcową implementację **OpenJDK** rozwija społeczność (Oracle, Red Hat, Amazon, Microsoft, SAP i inni), a różne firmy wydają własne **kompilacje (dystrybucje)** tego kodu.

## Wersje Javy i LTS

Od 2018 roku Java wychodzi **co 6 miesięcy** — w marcu i we wrześniu. Co czwarta wersja (co 2 lata) to **LTS** (Long-Term Support): jest wspierana i łatana latami, dlatego firmy używają na produkcji właśnie LTS.

| Wersja | Data | Status na październik 2026 |
|---|---|---|
| Java 8 | 2014 | LTS, „legacy”, wciąż spotykana w starych systemach |
| Java 11 | 2018 | LTS, stopniowo odchodzi |
| Java 17 | 2021 | LTS, bardzo rozpowszechniona |
| Java 21 | 2023 | LTS, główny wybór firm obecnie |
| **Java 25** | wrzesień 2025 | **Aktualne LTS — ucz się na niej** |
| Java 26 | marzec 2026 | Zwykłe wydanie, wsparcie zakończone |
| Java 27 | 15 września 2026 | Najnowsze wydanie, wsparcie do marca 2027 |
| Java 29 | wrzesień 2027 | Następne LTS |

:::tip "Której wersji się uczyć"
Ucz się na **Javie 25**. Kod napisany dla Javy 17/21 prawie zawsze działa na 25 bez zmian, a nowe możliwości języka (rekordy, `var`, wyrażenia switch, bloki tekstowe, wątki wirtualne) poznasz z wyprzedzeniem — to plus na rozmowie rekrutacyjnej.
:::

## Co pojawiło się w Javie po wersji 8 (ściąga)

Kurs wideo miejscami pokazuje „klasyczny” styl Javy. Oto najważniejsze zmiany języka i biblioteki — lekcje odwołują się do nich w ramkach **↻ Nieaktualne**.

| Wersja | Kluczowe możliwości |
|---|---|
| 8 | Lambdy, Stream API, `Optional`, `java.time` (nowe daty), metody default w interfejsach |
| 9 | Moduły (JPMS), JShell, `List.of()`, `Set.of()`, `Map.of()` |
| 10 | `var` — wnioskowanie typu zmiennej lokalnej |
| 11 | `HttpClient`, `String.isBlank()/strip()/lines()/repeat()`, `Files.readString()`, uruchamianie `java File.java` |
| 14 | Wyrażenia switch ze strzałkami `->`, czytelne komunikaty NullPointerException |
| 15 | Bloki tekstowe `"""…"""` |
| 16 | `record`, pattern matching dla `instanceof`, `Stream.toList()` |
| 17 | Klasy sealed (`sealed`/`permits`), silna enkapsulacja wewnętrznych API JDK |
| 21 | **Wątki wirtualne**, Sequenced Collections (`getFirst()`, `reversed()`), wzorce rekordów, pattern matching w `switch` |
| 22 | Zmienne nienazwane `_`, Foreign Function & Memory API, uruchamianie programów wieloplikowych bez kompilacji |
| 23 | Komentarze Javadoc w Markdown (`///`) |
| 24 | Stream Gatherers, wątki wirtualne bez „przypinania” w `synchronized`, Security Manager wyłączony na stałe |
| 25 | **Kompaktowe pliki źródłowe i `void main()`** bez klasy, `IO.println()`, `import module`, elastyczne ciała konstruktorów (kod przed `super(...)`), Scoped Values |
| 26 | HTTP/3 w `HttpClient`, usunięte Applet API |
| 27 | G1 domyślnym GC wszędzie, kompaktowe nagłówki obiektów domyślnie, postkwantowy hybrydowy TLS |

Możliwości oznaczone w danej wersji jako *preview* trzeba włączać flagą `--enable-preview`; finalne działają od razu.

## Dystrybucje JDK

Wszystkie wymienione kompilacje (poza specyfiką GraalVM) to **ten sam OpenJDK**, który przeszedł testy zgodności (TCK). Różnią się licencją, okresem aktualizacji i płatnym wsparciem.

| Dystrybucja | Wydawca | Cena | Cechy |
|---|---|---|---|
| **Eclipse Temurin** | Eclipse Adoptium (społeczność + Microsoft, Red Hat, IBM i inni) | Za darmo | Najpopularniejszy „neutralny” wybór, długie aktualizacje LTS, oficjalne obrazy Docker `eclipse-temurin` |
| **Amazon Corretto** | Amazon | Za darmo | Długoterminowe poprawki od AWS, standard w AWS Lambda/EC2 |
| **Azul Zulu** | Azul | Za darmo / płatne wsparcie | Wiele platform i starych wersji, komercyjne wsparcie Azul Platform Core |
| **BellSoft Liberica** | BellSoft | Za darmo / płatne wsparcie | Wariant *Full* z JavaFX, lekkie obrazy Alpine; domyślny w buildpackach Spring Boot (`./mvnw spring-boot:build-image`) |
| **Microsoft Build of OpenJDK** | Microsoft | Za darmo | Dla Azure i środowisk Windows |
| **Oracle OpenJDK** (jdk.java.net) | Oracle | Za darmo (GPL) | Aktualizowany tylko 6 miesięcy — do eksperymentów z najnowszymi wersjami |
| **Oracle JDK** | Oracle | Za darmo na licencji NFTC przez ograniczony czas, potem subskrypcja | Dla firm z umową z Oracle |
| **GraalVM** | Oracle / społeczność | Za darmo (Oracle GraalVM na licencji GFTC) | **Native Image** — kompilacja aplikacji Java do natywnego pliku binarnego: start w milisekundy, mało pamięci (Spring Boot, Quarkus, Micronaut) |
| **IBM Semeru** | IBM | Za darmo | Inna JVM — Eclipse OpenJ9, mniejsze zużycie pamięci |
| Red Hat build of OpenJDK, SapMachine | Red Hat, SAP | Za darmo | Dla ekosystemów RHEL i SAP |

:::outdated "Oracle JDK i płatne licencje"
W latach 2019–2021 aktualizacje Oracle JDK do zastosowań komercyjnych stały się płatne, a w 2023 roku Oracle zmienił subskrypcję na rozliczanie „od liczby pracowników firmy”. Wiele firm przeszło wtedy masowo na darmowe kompilacje — Temurin, Corretto, Zulu. Dziś najnowsze LTS Oracle JDK są darmowe na licencji NFTC, ale tylko przez ograniczony czas. **Do nauki i własnych projektów wybierz Temurin lub Corretto — i nie myśl o licencjach.**
:::

## Jak instalować i przełączać JDK

| Sposób | Polecenie / akcja | Dla kogo |
|---|---|---|
| Z IntelliJ IDEA | *Project Structure → SDKs → + → Download JDK* | Najprostsza opcja dla początkujących |
| Instalator | [adoptium.net](https://adoptium.net/), [aws.amazon.com/corretto](https://aws.amazon.com/corretto/) — zaznacz *Set JAVA_HOME* | Windows/macOS |
| winget (Windows) | `winget install EclipseAdoptium.Temurin.25.JDK` | Windows |
| Homebrew (macOS) | `brew install --cask temurin@25` | macOS |
| **SDKMAN!** | `sdk install java 25-tem`, `sdk use java 21.0.8-tem` | Linux, macOS, WSL — wygodne przełączanie wersji |
| Menedżer pakietów Linux | `sudo apt install openjdk-25-jdk` | Ubuntu/Debian |
| Docker | `docker run -it eclipse-temurin:25-jdk jshell` | Bez instalacji w systemie |

### Zmienna JAVA_HOME

Wiele narzędzi (Maven, Gradle, IDE, skrypty) szuka JDK przez zmienną środowiskową `JAVA_HOME`, a polecenia `java`/`javac` — przez `PATH`.

```bash
# macOS / Linux (dodaj do ~/.zshrc lub ~/.bashrc)
export JAVA_HOME=$(/usr/libexec/java_home -v 25)   # macOS
export PATH="$JAVA_HOME/bin:$PATH"
```

W Windows: *Ustawienia → System → Informacje → Zaawansowane ustawienia systemu → Zmienne środowiskowe* → utwórz `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-25…` i dodaj `%JAVA_HOME%\bin` do `Path`.

Sprawdzenie: `java -version`, `echo %JAVA_HOME%` (Windows) lub `echo $JAVA_HOME`.

## Zadanie domowe

:::task easy "Poznaj swoją Javę z kodu"
Napisz program, który wypisuje wersję i dostawcę Javy, na której działa.
??? Podpowiedź
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

:::task medium "Dwie wersje obok siebie"
Zainstaluj JDK 21 i JDK 25 (dowolnym sposobem z tabeli). Uruchom program z poprzedniego zadania na obu wersjach, przełączając SDK projektu w IDEA, i porównaj wynik.
:::

:::task hard "Nowa możliwość — stary kompilator"
Utwórz plik `Main.java` z „kompaktowym” źródłem Javy 25:
```java
void main() {
    IO.println("Cześć z Javy 25!");
}
```
Uruchom go poleceniem `java Main.java` na JDK 25. Potem spróbuj na JDK 21 i przeczytaj błąd. Wyjaśnij, dlaczego kod kompiluje się w jednej wersji, a w drugiej nie, i czym jest flaga `--enable-preview`.
??? Podpowiedź
Kompaktowe pliki źródłowe i `void main()` bez klasy stały się finalne dopiero w Javie 25 (JEP 512). W Javie 21 była to możliwość preview (JEP 445): można ją było wypróbować z flagami `--enable-preview --source 21`, a klasa `IO` pojawiła się później.
:::
