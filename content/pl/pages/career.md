# Kariera: dokąd iść po Javie

Kurs daje fundament **Java SE** — język, kolekcje, wielowątkowość, wejście-wyjście. Żeby dostać pierwszą pracę jako programista Javy, trzeba dodać do tego **stos backendowy**: bazy danych, Spring Boot, API, Docker, Git i umiejętność pracy w zespole. Ta strona to szczegółowa mapa kolejnego kroku. Wersja interaktywna jest w zakładce **[Backend Roadmap](#/roadmap/backend)**: kliknij węzeł, a trafisz do odpowiedniej sekcji.

:::tip "Kolejność ważniejsza niż ilość"
Nie próbuj uczyć się wszystkiego naraz. Działające minimum dla Juniora: **Java + SQL/PostgreSQL + Spring Boot + REST + Git + Docker + testy**. Reszta (Kafka, Kubernetes, chmura) — w miarę rozwoju i pod konkretne oferty.
:::

## Jak działa internet {#internet}

Programista backendu musi rozumieć, co dzieje się między przeglądarką a serwerem:

- **HTTP/HTTPS**: metody, kody odpowiedzi (2xx/3xx/4xx/5xx), nagłówki, cookies, cache'owanie, HTTP/2 i HTTP/3. Eksperymentuj z `curl -v` i zakładką Network w DevTools.
- **DNS**: jak domena zamienia się w adres IP, rekordy A, CNAME, MX, TXT.
- **TLS**: certyfikaty, po co HTTPS, co robi Let's Encrypt.
- **Linux i terminal**: serwery prawie zawsze działają na Linuksie. Nawigacja, uprawnienia, procesy (`ps`, `top`), logi (`journalctl`, `tail -f`), sieć (`ss`, `curl`), SSH.

## Git i praca zespołowa {#git}

- **Git**: commit, branch, merge vs rebase, rozwiązywanie konfliktów, `.gitignore`, zrozumiałe opisy commitów.
- **GitHub/GitLab**: pull/merge request, code review, issues. Twoje portfolio to publiczne repozytoria z README.
- **Procesy**: Scrum/Kanban, Jira, daily, estymacja zadań. Pracodawcy cenią umiejętność pracy w procesie nie mniej niż znajomość frameworków.

Przegląd narzędzi — w artykule [Ekosystem](#/tools/ecosystem).

## Relacyjne bazy danych {#databases}

Najbardziej poszukiwana umiejętność po samej Javie.

- **SQL**: `SELECT` z `JOIN`, `GROUP BY`, podzapytania, funkcje okna; `INSERT/UPDATE/DELETE`.
- **Projektowanie**: klucze główne i obce, normalizacja, relacje 1:N i N:M.
- **Indeksy**: B-tree, kiedy indeks pomaga, a kiedy przeszkadza, `EXPLAIN ANALYZE`.
- **Transakcje**: ACID, poziomy izolacji, blokady, deadlock w bazie.
- **PostgreSQL** — wybór numer jeden dla nowych projektów (aktualna wersja — 18). Spotyka się też MySQL/MariaDB, Oracle i MS SQL (banki, korporacje).
- **Z Javy**: JDBC, JPA/Hibernate, Spring Data, migracje Flyway/Liquibase — szczegółowo w artykule [Dostęp do bazy](#/extra/database-access).

## API {#apis}

- **REST**: zasoby i metody HTTP, kody odpowiedzi, idempotentność, paginacja, wersjonowanie, błędy w formacie Problem Details (RFC 9457).
- **JSON** i jego serializacja (Jackson).
- **OpenAPI/Swagger**: dokumentacja i generowanie klientów (springdoc-openapi).
- **gRPC** (Protobuf, HTTP/2) — do komunikacji mikroserwisów; **GraphQL** — do elastycznych zapytań klientów. Warto je znać, ale dla Juniora nie są obowiązkowe.

Jak napisać API w Spring Boot — w artykule [Frameworki webowe](#/extra/web-frameworks).

## Bezpieczeństwo {#security}

- **Uwierzytelnianie i autoryzacja**: sesje i cookies, **JWT**, **OAuth 2.0 / OpenID Connect** (Keycloak, Auth0, Entra ID), role i uprawnienia.
- **Spring Security**: łańcuch filtrów, resource server, method security.
- **OWASP Top 10**: SQL injection, XSS, CSRF, niebezpieczna deserializacja, wycieki sekretów, podatne zależności.
- **Hasła** — tylko bcrypt/Argon2 ([Kryptografia](#/extra/cryptography)); sekrety — nie w Gicie.

## Cache'owanie {#caching}

- Gdzie cache'ować: w pamięci aplikacji (**Caffeine**), w sposób rozproszony (**Redis** lub jego otwarty fork **Valkey**), na poziomie HTTP (`Cache-Control`, ETag, CDN).
- **Spring Cache** (`@Cacheable`) na dowolnym dostawcy.
- Problemy: unieważnianie, „rozgrzewanie”, nieaktualne dane, cache stampede. Cache to kompromis między szybkością a aktualnością.

## Kontenery i infrastruktura {#containers}

- **Docker**: obraz, kontener, `Dockerfile` (budowanie wieloetapowe, `eclipse-temurin` jako obraz bazowy), `docker compose` do lokalnego środowiska (aplikacja + PostgreSQL + Redis).
- **Kubernetes**: Pod, Deployment, Service, ConfigMap/Secret, Ingress, sondy zdrowia (Spring Boot Actuator). Dla Juniora wystarczy rozumieć koncepcje; szczegóły przyjdą w pracy.
- **Serwery WWW i proxy**: Nginx, load balancery, terminacja TLS.

## CI/CD {#cicd}

**Continuous Integration / Delivery** — każdy push jest automatycznie budowany, testowany i (przy sukcesie) wdrażany.

- **GitHub Actions**, **GitLab CI**, Jenkins (spuścizna, ale popularny w korporacjach).
- Typowy pipeline: budowanie → testy → analiza statyczna (SonarQube) → budowanie obrazu Docker → wdrożenie na środowisko testowe → produkcja.
- Sprawdzanie zależności pod kątem podatności (Dependabot, Renovate, OWASP Dependency-Check).

Rada: skonfiguruj GitHub Actions dla swojego projektu edukacyjnego — to wyraźny plus w CV.

## Architektura {#architecture}

- **Monolit, monolit modułowy, mikroserwisy** — zalety i wady. Większość nowych projektów rozsądnie zaczynać od dobrze ustrukturyzowanego monolitu (Spring Modulith).
- **Architektura warstwowa i heksagonalna**, podział na kontrolery, serwisy, repozytoria.
- **Wzorce GoF**: Strategy, Factory, Builder, Observer, Decorator, Adapter, Template Method.
- **Zasady**: SOLID ([lekcja](#/lessons/j2-oop-principles)), DRY, KISS, YAGNI, 12-factor app.
- **Na dalszy rozwój**: DDD, CQRS, Event Sourcing, Saga, Outbox — tematy Middle/Senior.

## Brokery komunikatów {#messaging}

Asynchroniczna komunikacja serwisów przez kolejki i topiki.

- **Apache Kafka** — standard dla systemów zdarzeniowych i przetwarzania strumieniowego (od wersji 4.0 działa bez ZooKeepera, na KRaft). Bardzo często pojawia się w ofertach w Polsce i Europie — zwłaszcza w bankach, e-commerce i fintechu.
- **RabbitMQ** — klasyczny broker kolejek z elastycznym routingiem.
- Pojęcia: producer/consumer, topik i partycja, consumer group, gwarancje dostarczenia (at-least-once, exactly-once), idempotentność handlerów. W Springu — Spring for Apache Kafka, Spring AMQP.

## NoSQL {#nosql}

- **MongoDB** — baza dokumentowa (dokumenty JSON), Spring Data MongoDB.
- **Redis/Valkey** — key-value w pamięci: cache, sesje, kolejki, rate limiting.
- **Elasticsearch/OpenSearch** — wyszukiwanie pełnotekstowe i analityka logów.
- **Cassandra** — ogromne wolumeny zapisów ze skalowaniem poziomym.

Zasada: NoSQL to uzupełnienie relacyjnej bazy pod konkretne zadanie, a nie jej zamiennik „bo modne”.

## Obserwowalność i skalowanie {#observability}

- **Trzy filary**: logi ([Logowanie](#/extra/logging)), **metryki** (Micrometer → Prometheus → Grafana), **tracing** (OpenTelemetry, Jaeger/Tempo).
- **Spring Boot Actuator**: `/health`, `/metrics`, `/prometheus`.
- **Skalowanie**: poziome (więcej instancji) kontra pionowe, serwisy bezstanowe, równoważenie obciążenia, replikacja i sharding bazy.
- **Odporność**: limity czasu, ponowienia, circuit breaker (Resilience4j), graceful degradation.

## Chmura {#cloud}

- **AWS** — lider rynku (EC2, S3, RDS, Lambda, SQS/SNS, EKS).
- **Microsoft Azure** — popularny w korporacjach i bankach Europy.
- **Google Cloud** — spotykany rzadziej, mocny w danych i Kubernetesie (GKE).

Dla Juniora wystarczy rozumieć podstawowe usługi jednej chmury. Darmowe poziomy (free tier) pozwalają poćwiczyć; certyfikaty (AWS Cloud Practitioner, AZ-900) to miły, ale nieobowiązkowy bonus.

## Aktualny stos 2026 {#stack}

| Ważność | Technologie |
|---|---|
| **Must have** | Java 21/25 (LTS), Spring Boot 3.x/4.x, Spring Data JPA/Hibernate, PostgreSQL i SQL, REST, Maven lub Gradle, Git, JUnit + Mockito, Docker |
| **Bardzo często** | Spring Security, Kafka, Testcontainers, Kubernetes, CI/CD (GitHub Actions/GitLab CI), Redis, mikroserwisy, OpenAPI |
| **Plus** | AWS/Azure, Kotlin, Quarkus/Micronaut, MongoDB, Elasticsearch, obserwowalność (Prometheus/Grafana/OpenTelemetry), GraphQL/gRPC, Spring AI |
| **Umiejętności miękkie** | angielski B1–B2+, code review, praca w Scrumie, umiejętność wyjaśniania decyzji |

:::note "Kotlin na backendzie"
Kotlin działa na JVM, jest w pełni zgodny z Javą i Springiem i popularny w części firm produktowych. Warto go uczyć **po** pewnym opanowaniu Javy — przejście zajmie kilka tygodni.
:::

## Europa i praca zdalna {#europe}

- **Duże rynki Javy**: Niemcy (Berlin, Monachium, Frankfurt), Holandia, Irlandia, Polska, Hiszpania i Portugalia (huby firm międzynarodowych), Skandynawia, Szwajcaria (wysokie pensje, wysokie wymagania).
- **Język**: w zespołach międzynarodowych — angielski; znajomość języka lokalnego (niemieckiego, niderlandzkiego, polskiego) wyraźnie poszerza wybór, zwłaszcza dla Juniora.
- **Relokacja**: niebieska karta UE (EU Blue Card) i krajowe programy dla specjalistów IT; wiele firm pomaga w przeprowadzce.
- **Praca zdalna**: ofert „remote” jest mniej niż w latach 2021–2022, a konkurencja o nie jest duża — zwłaszcza na poziomie Junior. Częste warunki: zamieszkanie w UE lub w konkretnym kraju, nakładanie się stref czasowych (CET ± 2–3 godziny), angielski B2+, umiejętność pracy asynchronicznej (komunikacja pisemna, samoorganizacja).
- **Formy współpracy**: umowa o pracę; kontrakt B2B (jako przedsiębiorca); praca przez platformy EoR (Deel, Remote.com).

:::warning "Obywatelstwo i sankcje"
Dla obywateli niektórych krajów (w szczególności Rosji i Białorusi) część pracodawców, banków i usług płatniczych w UE wprowadza dodatkowe weryfikacje lub ograniczenia — np. przy pracy z klientami finansowymi i publicznymi. Ustalaj warunki z wyprzedzeniem i śledź aktualne przepisy; w złożonej sytuacji warto skonsultować się z prawnikiem od prawa migracyjnego.
:::

## Warszawa i Polska {#warsaw}

Polska to jeden z największych rynków IT w Europie, a **Java to najbardziej poszukiwany język backendowy** w polskich ofertach. Główne huby: **Warszawa**, Kraków, Wrocław, Gdańsk/Trójmiasto, Poznań, Łódź, Katowice.

**Kto zatrudnia programistów Javy:**
- **Banki i fintech** — centra technologiczne i usługowe dużych banków i grup finansowych; dużo Java + Spring + Kafka + Oracle/PostgreSQL.
- **Outsourcing i consulting** — software house'y i międzynarodowe firmy usługowe; dobre wejście dla Juniora, dużo różnych projektów.
- **Firmy produktowe** — e-commerce, medtech, SaaS; częściej mikroserwisy, chmura, Kotlin.
- **Centra R&D międzynarodowych korporacji** — duże biura inżynierskie w Warszawie, Krakowie, Wrocławiu i Gdańsku.

**Formy umowy:**
- **UoP** (umowa o pracę) — urlop, L4, składki społeczne; „na rękę” mniej.
- **B2B** — praca jako JDG: wyższa kwota, ale podatki, ZUS i księgowość są po twojej stronie, brak ustawowego płatnego urlopu (często ustalany w kontrakcie).

**Wynagrodzenia (orientacyjnie na lata 2025–2026, Java, Warszawa, miesięcznie):** Junior — około 7–12 tys. PLN brutto na UoP lub 8–13 tys. PLN netto + VAT na B2B; Regular (Middle) — 15–23 tys. PLN na B2B; Senior — 22–32 tys. PLN i więcej na B2B. Liczby mocno zależą od firmy, domeny i angielskiego — **sprawdzaj najnowsze raporty** justjoin.it, No Fluff Jobs i Bulldogjob: w polskich ofertach widełki podaje się prawie zawsze.

:::note "Rynek dla Juniorów"
Od 2023 roku ofert na start w Polsce jest wyraźnie mniej, a aplikacji na każdą — setki. Wyróżnić się pomagają: skończony projekt na GitHubie (Spring Boot + PostgreSQL + Docker + testy + CI), staże i akademie w dużych firmach (nabór zwykle wiosną i jesienią), angielski B2, polski choćby na poziomie A2–B1 i aktywność w społeczności (meetupy, Java User Groups).
:::

## Gdzie szukać pracy {#jobs}

| Platforma | Cecha |
|---|---|
| **justjoin.it** | największy polski portal IT, widełki, filtry po technologiach i remote |
| **No Fluff Jobs** (nofluffjobs.com) | obowiązkowe widełki, Polska i Europa Środkowo-Wschodnia |
| **theprotocol.it** | oferty IT grupy Pracuj |
| **Bulldogjob**, **pracuj.pl** | oferty i coroczne raporty o rynku |
| **LinkedIn** | główny kanał dla Europy i pracy zdalnej; rekruterzy piszą sami — wypełnij profil po angielsku |
| **StepStone, Indeed, Glassdoor** | Niemcy i Europa Zachodnia |
| **Remote OK, We Work Remotely, Wellfound** | praca zdalna i startupy |

**Jak zwiększyć szanse:** CV na 1 stronę po angielsku z projektami i linkami; dopasowanie do oferty; polecenia (referral) od znajomych; przygotowanie do rozmowy technicznej na podstawie [pytań z kursu](#/lessons/j2-final-interview) i live codingu; a czego oczekuje się na każdym poziomie — na stronie [Poziomy](#/page/levels).

## Projekt do portfolio {#portfolio}

Jeden dobry projekt jest lepszy niż pięć szkoleniowych. Przykład: **serwis rezerwacji** (stolików, wydarzeń, sal spotkań).

1. Spring Boot 4 + Java 25, PostgreSQL, Flyway, Spring Data JPA.
2. REST API z walidacją, dokumentacją OpenAPI i obsługą błędów.
3. Spring Security + JWT, role użytkownik/administrator.
4. Testy: JUnit + Mockito + Testcontainers.
5. Docker Compose do uruchomienia jednym poleceniem, GitHub Actions dla CI.
6. Bonus: Kafka do powiadomień, cache Redis, metryki Prometheus/Grafana, wdrożenie w chmurze.
7. README: co robi projekt, jak go uruchomić, schemat architektury, czego się nauczyłeś.
