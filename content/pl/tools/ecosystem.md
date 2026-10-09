IDE i JDK to dopiero początek. W prawdziwej pracy programista Javy codziennie używa systemu budowania, Gita, Dockera, klientów baz danych i HTTP, analizatorów kodu i CI. Oto przegląd z informacją, **co jest darmowe, co popularne i kiedy będzie potrzebne**.

## Systemy budowania: Maven i Gradle

System budowania pobiera biblioteki (zależności), kompiluje kod, uruchamia testy i pakuje JAR. W kursie wideo projekty tworzone są raz „po prostu w IDEA”, a raz w **Gradle** (w drugiej części).

| | **Maven** | **Gradle** |
|---|---|---|
| Plik projektu | `pom.xml` (XML, deklaratywnie) | `build.gradle.kts` (Kotlin DSL) lub `build.gradle` (Groovy) |
| Próg wejścia | Niższy: sztywna struktura, „konwencja ponad konfigurację” | Wyższy: elastyczność, skrypty |
| Szybkość | Normalna | Szybszy dzięki budowaniu przyrostowemu i cache |
| Gdzie popularny | Większość projektów enterprise i backend w Spring Boot | Android (standard), duże projekty wielomodułowe, Kotlin |
| Cena | Za darmo (Apache) | Za darmo; płatny Develocity dla firm |

Oba korzystają z tego samego repozytorium bibliotek — **Maven Central** ([central.sonatype.com](https://central.sonatype.com/)).

```xml
<!-- Maven: zależność w pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>6.0.1</version>
    <scope>test</scope>
</dependency>
```

```kotlin
// Gradle (Kotlin DSL): ta sama zależność w build.gradle.kts
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:6.0.1")
}
```

:::tip
Zawsze commituj **wrapper** — `mvnw`/`gradlew`: sam pobiera właściwą wersję Mavena/Gradle, więc projekt buduje się jednym poleceniem `./mvnw package` lub `./gradlew build` na każdym komputerze. Bazel to trzeci system budowania (Google), spotykany w ogromnych monorepozytoriach; początkującym nie jest potrzebny.
:::

## Git i hostingi kodu

**Git** to system kontroli wersji; żaden zespół się bez niego nie obywa. Minimum na start:

```bash
git init                      # utwórz repozytorium
git status                    # co się zmieniło
git add .                     # przygotuj zmiany
git commit -m "Add arrays homework"
git switch -c feature/login   # nowa gałąź
git push -u origin main       # wyślij na GitHub
git pull                      # pobierz cudze zmiany
```

| Serwis | Do czego | Cena |
|---|---|---|
| **GitHub** | Portfolio, open source, GitHub Actions (CI), Pages (hosting stron), Codespaces | Za darmo dla projektów prywatnych i publicznych |
| **GitLab** | Popularny w europejskich firmach, wbudowane CI/CD, można postawić u siebie | Darmowy plan + płatne |
| **Bitbucket** | W parze z Jirą (Atlassian) w korporacjach | Za darmo do 5 osób |

:::tip "Portfolio"
Wrzucaj zadania domowe z tego kursu do publicznego repozytorium na GitHubie z czytelnym `README`. Przy ofertach Junior w Polsce i Europie link do GitHuba ze schludnymi commitami to realny plus.
:::

## Docker i kontenery

**Docker** pakuje aplikację z całym środowiskiem w kontener. Programiście Javy jest potrzebny, by lokalnie uruchamiać PostgreSQL, Kafkę czy Redis jednym poleceniem oraz uruchamiać testy integracyjne przez **Testcontainers**.

```bash
docker run --name pg -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:18
```

- **Docker Desktop** jest darmowy do użytku prywatnego, nauki i w małych firmach; duże firmy potrzebują płatnej subskrypcji.
- Darmowe alternatywy: **Podman** (+ Podman Desktop), **Rancher Desktop**, na macOS — **OrbStack** (darmowy do użytku prywatnego).

## Bazy danych i klienci

| Narzędzie | Cena | Komentarz |
|---|---|---|
| **DBeaver Community** | Za darmo | Uniwersalny klient do dowolnych baz |
| **IntelliJ IDEA** (Database tool) | Podstawowe połączenie za darmo, pełne funkcje w Ultimate | Wygodnie, bez wychodzenia z IDE |
| **DataGrip** | Płatny (są darmowe opcje do użytku niekomercyjnego — sprawdź stronę JetBrains) | Profesjonalne narzędzie SQL |
| **pgAdmin** | Za darmo | Oficjalny klient PostgreSQL |

Najbardziej poszukiwana baza w ofertach Java w Europie to **PostgreSQL**, dalej Oracle, MySQL/MariaDB i MS SQL; z NoSQL — MongoDB i Redis.

## Klienci HTTP do testowania API

| Narzędzie | Cena | Cechy |
|---|---|---|
| **Postman** | Darmowy plan | Najbardziej znany; wymaga konta, dane w chmurze |
| **Bruno** | Za darmo, open source | Kolekcje zapisywane jako pliki w Gicie, działa offline |
| **IntelliJ HTTP Client** | Ultimate | Pliki `.http` bezpośrednio w projekcie |
| **curl**, **HTTPie** | Za darmo | Wiersz poleceń |

## Jakość kodu

| Narzędzie | Co robi |
|---|---|
| **Checkstyle** | Sprawdza styl (wcięcia, nazewnictwo, długość linii) |
| **PMD** | Szuka podejrzanych konstrukcji i martwego kodu |
| **SpotBugs** | Szuka typowych błędów w kodzie bajtowym |
| **Error Prone** (Google) | Wyłapuje błędy na etapie kompilacji |
| **SonarQube / SonarQube Cloud** | Panel jakości, pokrycia i podatności; za darmo dla open source |
| **Spotless** + google-java-format / palantir-java-format | Automatyczne formatowanie w buildzie |

## Debugowanie i profilowanie

- **Debugger IDE** — punkty przerwania, podgląd zmiennych, wykonywanie krok po kroku. Ucz się go od pierwszych lekcji, nie tylko `System.out.println`.
- **jcmd**, **jstack**, **jmap** — narzędzia JDK: zrzuty wątków i pamięci działającej aplikacji.
- **JDK Flight Recorder (JFR)** + **JDK Mission Control** — darmowa wbudowana „czarna skrzynka” JVM.
- **VisualVM** — graficzny monitoring pamięci, wątków i CPU.
- **async-profiler** — dokładny profiler CPU/pamięci, rysuje flame graph.

## CI/CD

Automatyczne budowanie i testy przy każdym pushu: **GitHub Actions** (za darmo dla publicznych repozytoriów), **GitLab CI**, **Jenkins** (najstarszy i wciąż częsty w enterprise), **TeamCity**.

## Gdzie ćwiczyć

- **Hyperskill** (JetBrains Academy), **Exercism** (ścieżka Java, za darmo, z mentorami), **Codewars**, **LeetCode** (algorytmy na rozmowy), **Stepik** (m.in. kurs autora wideo, po rosyjsku).
- **JShell** i kompilatory online — do szybkich sprawdzeń.

## Ile to wszystko kosztuje początkującego

| Potrzebujesz | Darmowa opcja |
|---|---|
| IDE | IntelliJ IDEA (darmowa część) / VS Code / Eclipse |
| JDK | Eclipse Temurin / Amazon Corretto |
| Budowanie | Maven / Gradle |
| Git + hosting | Git + GitHub |
| Kontenery | Docker Desktop (użytek prywatny) / Podman |
| Baza danych | PostgreSQL w Dockerze + DBeaver |
| Klient API | Bruno / curl |
| Jakość | SonarQube for IDE, Checkstyle |

**Razem: 0 zł.** Płacić warto tylko za IntelliJ IDEA Ultimate (jeśli nie jesteś studentem) i ewentualnie za asystenta AI.

## Zadanie domowe

:::task easy "Pierwsze repozytorium"
Załóż konto na GitHubie (jeśli go nie masz), nowe repozytorium `java-course-homework` i wrzuć do niego projekt z pierwszej lekcji. Dodaj `README.md` z opisem i `.gitignore` dla Javy/IntelliJ.
??? Podpowiedź
Przy tworzeniu repozytorium na GitHubie wybierz szablon `.gitignore` → *Java*, a `.idea/` oraz `out/`/`target/`/`build/` dopisz ręcznie.
:::

:::task medium "Projekt Maven od zera"
Utwórz w IDEA projekt Maven (*New Project → Build system: Maven*). Dodaj zależność JUnit Jupiter i napisz jeden test `assertEquals(4, 2 + 2)`. Uruchom budowanie z terminala: `./mvnw test` (lub `mvn test`).
??? Podpowiedź
Jeśli nie ma pliku `mvnw`, dodaj wrapper poleceniem `mvn wrapper:wrapper` albo wygeneruj projekt na [start.spring.io](https://start.spring.io/) — tam wrapper już jest.
:::

:::task hard "PostgreSQL w Dockerze"
Zainstaluj Docker Desktop lub Podmana, uruchom PostgreSQL poleceniem z sekcji powyżej, połącz się z nim przez DBeaver lub Database tool w IDEA, utwórz tabelę `students(id serial primary key, name text)` i dodaj trzy rekordy. Następnie zatrzymaj i usuń kontener (`docker stop pg`, `docker rm pg`) i zastanów się: gdzie podziały się dane i jak je zachować (podpowiedź — wolumeny)?
??? Podpowiedź
Aby dane przetrwały usunięcie kontenera, podłącz wolumen: `-v pgdata:/var/lib/postgresql`.
:::
