W wideo projekty tworzy się przyciskiem w IDEA, a biblioteki podłącza ręcznie. W prawdziwej pracy tak się nie robi: projekt opisuje **narzędzie budowania** — pobiera zależności, kompiluje, uruchamia testy, buduje JAR i obraz Docker tak samo na każdej maszynie i w CI. Przegląd narzędzi jest w artykule [Ekosystem](#/tools/ecosystem); tu — więcej o pracy z nimi.

## Maven

Deklaratywne „convention over configuration”: struktura folderów jest stała (`src/main/java`, `src/test/java`), projekt opisuje się w `pom.xml`.

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>shop</artifactId>
  <version>1.0.0-SNAPSHOT</version>

  <properties>
    <maven.compiler.release>25</maven.compiler.release>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>6.0.0</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

**Cykl życia**: `validate → compile → test → package → verify → install → deploy`. Polecenie uruchamia wszystkie fazy do wskazanej: `mvn package` skompiluje, przetestuje i zbuduje JAR.

| Polecenie | Co robi |
|---|---|
| `./mvnw clean verify` | czyste budowanie z testami (standard w CI) |
| `./mvnw -DskipTests package` | budowanie bez testów |
| `./mvnw dependency:tree` | drzewo zależności — szukamy konfliktów wersji |
| `./mvnw versions:display-dependency-updates` | które zależności są nieaktualne |

**Scope**: `compile` (domyślny), `provided` (da serwer), `runtime` (sterownik bazy), `test`.

## Gradle

Budowanie opisuje się kodem (Kotlin DSL — domyślnie w nowych projektach), jest budowanie przyrostowe i cache, dlatego Gradle jest szybszy w dużych projektach. Standard dla Androida.

```kotlin
// build.gradle.kts
plugins {
    java
    id("org.springframework.boot") version "4.1.1"
}

java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}
```

`./gradlew build`, `./gradlew test --tests "*OrderTest"`, `./gradlew dependencies`. Konfiguracje: `implementation`, `api` (w bibliotekach), `compileOnly`, `runtimeOnly`, `testImplementation`.

## Bazel i inne

**Bazel** (Google) — do ogromnych monorepozytoriów w wielu językach: hermetyczne, powtarzalne budowanie i zdalny cache. Spotykany w dużych firmach, dla zwykłego serwisu to przesada. Istnieją też **sbt** (Scala), **Mill**, **Ant** (spuścizna, imperatywne skrypty XML).

## Maven czy Gradle

| | Maven | Gradle |
|---|---|---|
| Opis | XML, deklaratywnie | kod Kotlin/Groovy |
| Próg wejścia | niższy, wszystko przewidywalne | wyższy, bardziej elastyczny |
| Szybkość | średnia | wyższa (przyrostowość, build cache) |
| Gdzie częściej | korporacyjny backend, banki | Android, duże wielomodułowe projekty, Spring też go obsługuje |

W ofertach pracy w Europie i Polsce oba występują mniej więcej po równo; trzeba je znać na poziomie „zbudować, dodać zależność, znaleźć konflikt wersji”.

:::tip "Wrapper i BOM"
- Zawsze commituj **wrapper** (`mvnw`/`gradlew`) — wtedy wszyscy i CI mają jedną wersję narzędzia, niczego nie trzeba instalować.
- Wersje powiązanych bibliotek wyrównuje się **BOM**-em (`spring-boot-dependencies`, `junit-bom`, `testcontainers-bom`): zadeklarowałeś BOM — dalej zależności bez wersji.
- Podatności w zależnościach sprawdzają OWASP Dependency-Check, Dependabot/Renovate.
:::

:::note "Wersje narzędzi"
Maven 3.9 to koń roboczy; Maven 4 od dawna jest w rozwoju (wersje RC) z nowym formatem POM 4.1 — sprawdź status przed przejściem. Gradle od 2025 roku jest w gałęzi 9.x i wymaga Javy 17+ do uruchomienia samego Gradle.
:::

## Zadanie domowe

:::task easy "Pierwszy projekt na Mavenie"
Utwórz projekt `mvn archetype:generate` (albo w IDEA: New Project → Maven), dodaj JUnit i jeden test, zbuduj `./mvnw verify` i uruchom JAR przez `java -jar` (skonfiguruj `Main-Class` przez `maven-jar-plugin`).
:::

:::task medium "Ten sam projekt na Gradle"
Przenieś projekt na Gradle Kotlin DSL (`gradle init` potrafi skonwertować `pom.xml`). Porównaj czas ponownego budowania bez zmian w Mavenie i Gradle. Dodaj zadanie wypisujące wersję projektu.
:::

:::task hard "Projekt wielomodułowy i konflikt wersji"
Utwórz projekt wielomodułowy (`api`, `core`, `app`) na Mavenie lub Gradle. Podłącz dwie biblioteki ciągnące różne wersje jednej zależności przechodniej (np. Jacksona), znajdź konflikt przez `dependency:tree`/`dependencies`, rozwiąż go BOM-em i dodaj sprawdzenie (`maven-enforcer-plugin` z `dependencyConvergence` albo `failOnVersionConflict()` w Gradle).
:::
