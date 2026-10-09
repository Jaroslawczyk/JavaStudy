# Poziomy programisty Javy: co wiedzieć i czego się douczyć

Trainee, Junior, Middle (Regular), Senior, Lead — poziomy różnią się nie tyle liczbą poznanych technologii, ile **samodzielnością i odpowiedzialnością**. Poniżej — czego zwykle oczekuje się na każdym poziomie w firmach europejskich i polskich w 2026 roku i czego douczyć się po tym kursie.

:::note "Orientacja, nie standard"
Wymagania bardzo zależą od firmy: Junior w banku i Junior w startupie to różne role. Patrz na prawdziwe oferty na [justjoin.it i innych platformach](#/page/career/jobs) i porównuj z tą listą.
:::

## Gdzie jesteś po kursie

Po przejściu obu części kursu i zadań znasz **Java SE na poziomie rozmowy na Juniora**: OOP, kolekcje i ich budowę, generyki, wielowątkowość, Stream API, wejście-wyjście, wyjątki, JUnit. To wystarczy na rozmowę z „rdzenia Javy”, ale **nie wystarczy do pracy**: potrzebne są SQL, Spring Boot, Git, Docker i praktyczny projekt.

## Trainee / stażysta {#trainee}

**Kto to:** uczy się w trakcie pracy, zadania — pod okiem mentora.

- Java SE na poziomie tego kursu, podstawy OOP i kolekcji.
- Git: commit, branch, pull request.
- Podstawy SQL (`SELECT`, `JOIN`).
- Umiejętność zgłębienia zadania, zadawania pytań, szukania i czytania dokumentacji.
- Angielski — czytanie dokumentacji (A2–B1).

**Gdzie:** staże, akademie i programy letnie dużych firm, banków i software house'ów.

## Junior {#junior}

**Kto to:** rozwiązuje małe i średnie zadania w istniejącym projekcie; potrzebuje review i okresowej pomocy.

| Obszar | Oczekiwania |
|---|---|
| Java | Pewnie: OOP, kolekcje, `equals/hashCode`, wyjątki, Stream API, podstawy wielowątkowości, Java 17–25 (rekordy, `var`, wyrażenia switch) |
| Spring | Spring Boot, DI, kontrolery REST, Spring Data JPA, walidacja, konfiguracja, profile |
| Bazy | SQL, relacje, indeksy na podstawowym poziomie, transakcje, PostgreSQL |
| Testy | JUnit, Mockito, rozumienie testów integracyjnych |
| Narzędzia | Git, Maven/Gradle, IntelliJ IDEA, Docker (uruchomić aplikację i bazę), Postman/klient HTTP |
| Procesy | Scrum, Jira, code review |
| Angielski | B1–B2: czytać i pisać korespondencję techniczną |

**Portfolio:** 1–2 skończone projekty na GitHubie — zob. [projekt do portfolio](#/page/career/portfolio).

## Middle / Regular {#middle}

**Kto to:** samodzielnie realizuje funkcje od zadania do produkcji, robi review kodu Juniorów, rozumie, *dlaczego* system jest zbudowany właśnie tak.

- Java głębiej: JMM i [`volatile`](#/extra/jmm-volatile), `java.util.concurrent`, [wątki wirtualne](#/extra/virtual-threads), podstawy JVM i GC, profilowanie.
- Spring głębiej: transakcje i propagation, proxy, Spring Security, cache'owanie, obsługa błędów, testowanie warstw.
- Bazy: optymalizacja zapytań (`EXPLAIN`), N+1, blokady, migracje bez przestojów.
- Integracje: Kafka/RabbitMQ, klienci REST, odporność (limity czasu, ponowienia, circuit breaker).
- Infrastruktura: Docker, Kubernetes na poziomie użytkownika, CI/CD, logi i metryki, chmura (AWS/Azure).
- Architektura: wzorce, SOLID, czysta/heksagonalna architektura, mikroserwisy i ich kompromisy.
- Angielski B2: udział w dyskusjach i demach.

## Senior {#senior}

**Kto to:** odpowiada za decyzje techniczne w swoim obszarze, widzi system w całości, pomaga zespołowi się rozwijać.

- Projektowanie systemów: skalowanie, spójność danych, transakcje rozproszone (Saga, Outbox), wybór magazynów danych.
- Wydajność i niezawodność: strojenie JVM, analiza incydentów, obserwowalność, SLO.
- Bezpieczeństwo i jakość: threat modeling, standardy kodu, testy architektury.
- Praca z ludźmi: mentoring, review architektury, estymacje, komunikacja z biznesem.
- Umiejętność wyboru **prostego** rozwiązania i argumentowanego mówienia „nie”.

## Lead / Architect / Staff {#lead}

Dalej ścieżki się rozchodzą: **Tech Lead** (decyzje techniczne + koordynacja zespołu), **Engineering Manager** (ludzie i procesy), **Architect / Staff / Principal Engineer** (architektura na poziomie kilku zespołów lub firmy). Technologii nie ma tu więcej — jest więcej odpowiedzialności, wpływu i komunikacji.

## Czego douczyć się po tym kursie {#after-course}

Plan na 4–6 miesięcy przy 10–15 godzinach nauki tygodniowo:

1. **Powtórz Java SE** według [Roadmapy](#/roadmap) i artykułów dodatkowych: [rekordy](#/extra/records), [enum](#/extra/enums), [java.time](#/extra/date-time), [styl funkcyjny](#/extra/functional).
2. **SQL i PostgreSQL** — zapytania, relacje, indeksy, transakcje (trenażery SQL, pgexercises).
3. **Git** — codziennie, na własnych projektach; pull requesty.
4. **Maven/Gradle** — [artykuł](#/extra/build-tools).
5. **Spring Boot** — DI, REST, Data JPA, Security, testy ([frameworki webowe](#/extra/web-frameworks), [DI](#/extra/dependency-injection), [bazy danych](#/extra/database-access)).
6. **Docker** i docker compose.
7. **Testowanie** — JUnit 6, Mockito, Testcontainers ([artykuł](#/extra/testing)).
8. **Projekt do portfolio** z CI na GitHub Actions.
9. **Angielski** — czytanie techniczne i praktyka mówienia.
10. **Przygotowanie do rozmowy** — powtórz pytania z lekcji-rozmów i [rozmowy końcowej](#/lessons/j2-final-interview), rozwiązuj zadania algorytmiczne (LeetCode/HackerRank — poziom easy/medium).

Dalej — według wymagań konkretnych ofert: Kafka, Kubernetes, chmura, [frameworki AI](#/page/ai/stack).

## Jak przygotować się do rozmowy {#interview}

- **Pytania techniczne**: Java Core (OOP, kolekcje, `equals/hashCode`, wyjątki, wielowątkowość, Stream API), Spring (DI, beany, transakcje), SQL, Git, HTTP/REST.
- **Live coding**: małe zadania na kolekcjach i napisach, czasem algorytmy; mów na głos, co robisz i dlaczego.
- **Omówienie projektu**: bądź gotów wyjaśnić każdą decyzję w swoim portfolio.
- **Pytania behawioralne**: jak rozwiązałeś trudny problem, jak reagujesz na krytykę na review, jak uczysz się nowych rzeczy.
- **Pytania do pracodawcy**: stos, procesy, mentor dla Juniora, jak wygląda onboarding.

:::tip "Nieudana rozmowa to też wynik"
Zapisuj wszystkie pytania, na które nie odpowiedziałeś, i uzupełniaj braki. Po 5–10 rozmowach zauważysz, że pytania się powtarzają, a pewność siebie rośnie.
:::
