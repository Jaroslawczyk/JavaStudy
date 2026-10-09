# Career: where to go after Java

The course gives you a foundation in **Java SE** — the language, collections, concurrency, I/O. To land your first job as a Java developer, you need to add a **backend stack** on top: databases, Spring Boot, APIs, Docker, Git and the ability to work in a team. This page is a detailed map of that next step. The interactive version is in the **[Backend Roadmap](#/roadmap/backend)** tab: click a node and you'll jump to the relevant section.

:::tip "Order matters more than quantity"
Don't try to learn everything at once. A working minimum for a Junior: **Java + SQL/PostgreSQL + Spring Boot + REST + Git + Docker + tests**. The rest (Kafka, Kubernetes, cloud) comes as you grow and as specific job ads require.
:::

## How the internet works {#internet}

A backend developer must understand what happens between the browser and the server:

- **HTTP/HTTPS**: methods, status codes (2xx/3xx/4xx/5xx), headers, cookies, caching, HTTP/2 and HTTP/3. Experiment with `curl -v` and the Network tab in DevTools.
- **DNS**: how a domain becomes an IP address; A, CNAME, MX, TXT records.
- **TLS**: certificates, why HTTPS is needed, what Let's Encrypt does.
- **Linux and the terminal**: servers almost always run Linux. Navigation, permissions, processes (`ps`, `top`), logs (`journalctl`, `tail -f`), networking (`ss`, `curl`), SSH.

## Git and teamwork {#git}

- **Git**: commit, branch, merge vs rebase, resolving conflicts, `.gitignore`, clear commit messages.
- **GitHub/GitLab**: pull/merge requests, code review, issues. Your portfolio is public repositories with a README.
- **Processes**: Scrum/Kanban, Jira, stand-ups, estimating tasks. Employers value the ability to work within a process as much as framework knowledge.

An overview of the tools is in the [Ecosystem](#/tools/ecosystem) article.

## Relational databases {#databases}

The most in-demand skill after Java itself.

- **SQL**: `SELECT` with `JOIN`, `GROUP BY`, subqueries, window functions; `INSERT/UPDATE/DELETE`.
- **Design**: primary and foreign keys, normalisation, 1:N and N:M relationships.
- **Indexes**: B-trees, when an index helps and when it hurts, `EXPLAIN ANALYZE`.
- **Transactions**: ACID, isolation levels, locks, deadlocks in the DB.
- **PostgreSQL** is the number-one choice for new projects (the current version is 18). You'll also meet MySQL/MariaDB, Oracle and MS SQL (banks, corporations).
- **From Java**: JDBC, JPA/Hibernate, Spring Data, Flyway/Liquibase migrations — in detail in the [Database access](#/extra/database-access) article.

## APIs {#apis}

- **REST**: resources and HTTP methods, status codes, idempotency, pagination, versioning, errors as Problem Details (RFC 9457).
- **JSON** and its serialisation (Jackson).
- **OpenAPI/Swagger**: documentation and client generation (springdoc-openapi).
- **gRPC** (Protobuf, HTTP/2) — for service-to-service communication; **GraphQL** — for flexible client queries. Useful to know about, but not required for a Junior.

How to write an API with Spring Boot — in the [Web frameworks](#/extra/web-frameworks) article.

## Security {#security}

- **Authentication and authorisation**: sessions and cookies, **JWT**, **OAuth 2.0 / OpenID Connect** (Keycloak, Auth0, Entra ID), roles and permissions.
- **Spring Security**: the filter chain, resource server, method security.
- **OWASP Top 10**: SQL injection, XSS, CSRF, insecure deserialisation, leaked secrets, vulnerable dependencies.
- **Passwords** — only bcrypt/Argon2 ([Cryptography](#/extra/cryptography)); secrets — never in Git.

## Caching {#caching}

- Where to cache: in application memory (**Caffeine**), distributed (**Redis** or its open fork **Valkey**), at the HTTP level (`Cache-Control`, ETag, CDN).
- **Spring Cache** (`@Cacheable`) on top of any provider.
- Problems: invalidation, warm-up, stale data, cache stampede. A cache is a trade-off between speed and freshness.

## Containers and infrastructure {#containers}

- **Docker**: image, container, `Dockerfile` (multi-stage builds, `eclipse-temurin` as the base image), `docker compose` for a local environment (app + PostgreSQL + Redis).
- **Kubernetes**: Pod, Deployment, Service, ConfigMap/Secret, Ingress, health probes (Spring Boot Actuator). For a Junior, understanding the concepts is enough; the details come on the job.
- **Web servers and proxies**: Nginx, load balancers, TLS termination.

## CI/CD {#cicd}

**Continuous Integration / Delivery** — every push is automatically built, tested and (on success) deployed.

- **GitHub Actions**, **GitLab CI**, Jenkins (legacy, but common in corporations).
- A typical pipeline: build → tests → static analysis (SonarQube) → Docker image build → deploy to a test environment → production.
- Dependency vulnerability checks (Dependabot, Renovate, OWASP Dependency-Check).

Tip: set up GitHub Actions for your learning project — it stands out on a CV.

## Architecture {#architecture}

- **Monolith, modular monolith, microservices** — pros and cons. Most new projects are sensibly started as a well-structured monolith (Spring Modulith).
- **Layered and hexagonal architecture**, splitting into controllers, services, repositories.
- **GoF patterns**: Strategy, Factory, Builder, Observer, Decorator, Adapter, Template Method.
- **Principles**: SOLID ([lesson](#/lessons/j2-oop-principles)), DRY, KISS, YAGNI, the 12-factor app.
- **For growth**: DDD, CQRS, Event Sourcing, Saga, Outbox — Middle/Senior topics.

## Message brokers {#messaging}

Asynchronous communication between services via queues and topics.

- **Apache Kafka** — the standard for event-driven systems and stream processing (since 4.0 it runs without ZooKeeper, on KRaft). Very common in job ads in Poland and Europe — especially in banking, e-commerce and fintech.
- **RabbitMQ** — a classic queue broker with flexible routing.
- Concepts: producer/consumer, topic and partition, consumer group, delivery guarantees (at-least-once, exactly-once), idempotent handlers. In Spring — Spring for Apache Kafka, Spring AMQP.

## NoSQL {#nosql}

- **MongoDB** — a document database (JSON documents), Spring Data MongoDB.
- **Redis/Valkey** — in-memory key-value: cache, sessions, queues, rate limiting.
- **Elasticsearch/OpenSearch** — full-text search and log analytics.
- **Cassandra** — huge write volumes with horizontal scaling.

Rule: NoSQL complements a relational database for a specific task; it doesn't replace it "because it's trendy".

## Observability and scaling {#observability}

- **The three pillars**: logs ([Logging](#/extra/logging)), **metrics** (Micrometer → Prometheus → Grafana), **tracing** (OpenTelemetry, Jaeger/Tempo).
- **Spring Boot Actuator**: `/health`, `/metrics`, `/prometheus`.
- **Scaling**: horizontal (more instances) vs vertical, stateless services, load balancing, DB replication and sharding.
- **Resilience**: timeouts, retries, circuit breakers (Resilience4j), graceful degradation.

## Cloud {#cloud}

- **AWS** — the market leader (EC2, S3, RDS, Lambda, SQS/SNS, EKS).
- **Microsoft Azure** — popular with European corporations and banks.
- **Google Cloud** — less common; strong in data and Kubernetes (GKE).

For a Junior, understanding the basic services of one cloud is enough. Free tiers let you practise; certifications (AWS Cloud Practitioner, AZ-900) are a nice but optional bonus.

## The 2026 stack {#stack}

| Importance | Technologies |
|---|---|
| **Must have** | Java 21/25 (LTS), Spring Boot 3.x/4.x, Spring Data JPA/Hibernate, PostgreSQL and SQL, REST, Maven or Gradle, Git, JUnit + Mockito, Docker |
| **Very common** | Spring Security, Kafka, Testcontainers, Kubernetes, CI/CD (GitHub Actions/GitLab CI), Redis, microservices, OpenAPI |
| **A plus** | AWS/Azure, Kotlin, Quarkus/Micronaut, MongoDB, Elasticsearch, observability (Prometheus/Grafana/OpenTelemetry), GraphQL/gRPC, Spring AI |
| **Soft skills** | English B1–B2+, code review, working in Scrum, explaining your decisions |

:::note "Kotlin on the backend"
Kotlin runs on the JVM, is fully interoperable with Java and Spring, and is popular at some product companies. Learn it **after** you're confident in Java — the switch takes a couple of weeks.
:::

## Europe and remote work {#europe}

- **Major Java markets**: Germany (Berlin, Munich, Frankfurt), the Netherlands, Ireland, Poland, Spain and Portugal (hubs of international companies), Scandinavia, Switzerland (high salaries, high requirements).
- **Language**: English in international teams; knowing the local language (German, Dutch, Polish) noticeably widens your options, especially as a Junior.
- **Relocation**: the EU Blue Card and national programmes for IT specialists; many companies help with relocation.
- **Remote**: there are fewer "remote" jobs than in 2021–2022, and competition for them is fierce — especially at Junior level. Common conditions: residence in the EU or a specific country, time-zone overlap (CET ± 2–3 hours), English B2+, the ability to work asynchronously (written communication, self-organisation).
- **Forms of engagement**: an employment contract; a B2B contract (as a sole trader); working via EoR platforms (Deel, Remote.com).

:::warning "Citizenship and sanctions"
For citizens of some countries (in particular, Russia and Belarus) some EU employers, banks and payment services apply additional checks or restrictions — for example, when working with financial and public-sector clients. Clarify the conditions in advance and follow the current rules; in a complicated situation consider consulting an immigration lawyer.
:::

## Warsaw and Poland {#warsaw}

Poland is one of Europe's largest IT markets, and **Java is the most in-demand backend language** in Polish job ads. The main hubs: **Warsaw**, Kraków, Wrocław, Gdańsk/Tricity, Poznań, Łódź, Katowice.

**Who hires Java developers:**
- **Banks and fintech** — technology and service centres of large banks and financial groups; lots of Java + Spring + Kafka + Oracle/PostgreSQL.
- **Outsourcing and consulting** — software houses and international service companies; a good entry point for Juniors with many different projects.
- **Product companies** — e-commerce, medtech, SaaS; more often microservices, cloud, Kotlin.
- **R&D centres of international corporations** — large engineering offices in Warsaw, Kraków, Wrocław and Gdańsk.

**Contract types:**
- **UoP** (umowa o pracę) — an employment contract: paid leave, sick leave, social contributions; lower take-home pay.
- **B2B** — working as a sole trader (JDG): a higher amount, but taxes, ZUS and accounting are on you, and there's no statutory paid leave (often negotiated in the contract).

**Salaries (a 2025–2026 guide, Java, Warsaw, per month):** Junior — roughly 7–12k PLN gross on UoP or 8–13k PLN net + VAT on B2B; Regular (Middle) — 15–23k PLN on B2B; Senior — 22–32k PLN and more on B2B. The figures depend heavily on the company, domain and English — **check the latest reports** from justjoin.it, No Fluff Jobs and Bulldogjob: Polish job ads almost always state the salary range.

:::note "The market for Juniors"
Since 2023 there have been noticeably fewer entry-level jobs in Poland, with hundreds of applications for each. What helps you stand out: a finished project on GitHub (Spring Boot + PostgreSQL + Docker + tests + CI), internships and academies at large companies (intakes usually in spring and autumn), English B2, Polish at least A2–B1, and community involvement (meetups, Java User Groups).
:::

## Where to look for jobs {#jobs}

| Platform | Notes |
|---|---|
| **justjoin.it** | the largest Polish IT job board; salary ranges, filters by technology and remote |
| **No Fluff Jobs** (nofluffjobs.com) | mandatory salary ranges; Poland and CEE |
| **theprotocol.it** | IT jobs from the Pracuj group |
| **Bulldogjob**, **pracuj.pl** | jobs and annual market reports |
| **LinkedIn** | the main channel for Europe and remote work; recruiters reach out themselves — fill in your profile in English |
| **StepStone, Indeed, Glassdoor** | Germany and Western Europe |
| **Remote OK, We Work Remotely, Wellfound** | remote work and start-ups |

**How to improve your chances:** a one-page CV in English with projects and links; tailoring it to each job ad; referrals from people you know; preparing for the technical interview with [the course's questions](#/lessons/j2-final-interview) and live coding; and what's expected at each level — on the [Levels](#/page/levels) page.

## A portfolio project {#portfolio}

One good project beats five learning exercises. Example: **a booking service** (tables, events, meeting rooms).

1. Spring Boot 4 + Java 25, PostgreSQL, Flyway, Spring Data JPA.
2. A REST API with validation, OpenAPI documentation and error handling.
3. Spring Security + JWT, user/admin roles.
4. Tests: JUnit + Mockito + Testcontainers.
5. Docker Compose to run it with one command, GitHub Actions for CI.
6. Bonus: Kafka for notifications, a Redis cache, Prometheus/Grafana metrics, deployment to the cloud.
7. A README: what the project does, how to run it, an architecture diagram, what you learned.
