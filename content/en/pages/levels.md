# Java developer levels: what to know and what to learn next

Trainee, Junior, Middle (Regular), Senior, Lead — the grades differ not so much in the number of technologies learned as in **independence and responsibility**. Below is what's usually expected at each level at European and Polish companies in 2026, and what to learn after this course.

:::note "A guide, not a standard"
Requirements vary a lot between companies: a Junior at a bank and a Junior at a start-up are different roles. Look at real job ads on [justjoin.it and other platforms](#/page/career/jobs) and compare them with this list.
:::

## Where you are after the course

Having finished both parts of the course and the tasks, you know **Java SE at Junior interview level**: OOP, collections and how they work, generics, concurrency, the Stream API, I/O, exceptions, JUnit. That's enough for a "Java core" interview but **not enough for the job**: you need SQL, Spring Boot, Git, Docker and a practical project.

## Trainee / intern {#trainee}

**Who:** learns on the job; tasks are done under a mentor's supervision.

- Java SE at the level of this course, basic OOP and collections.
- Git: commit, branch, pull request.
- SQL basics (`SELECT`, `JOIN`).
- The ability to dig into a task, ask questions, search and read documentation.
- English — reading documentation (A2–B1).

**Where:** internships, academies and summer programmes at large companies, banks and software houses.

## Junior {#junior}

**Who:** solves small and medium tasks in an existing project; needs reviews and occasional help.

| Area | Expectations |
|---|---|
| Java | Confident: OOP, collections, `equals/hashCode`, exceptions, the Stream API, concurrency basics, Java 17–25 (records, `var`, switch expressions) |
| Spring | Spring Boot, DI, REST controllers, Spring Data JPA, validation, configuration, profiles |
| DB | SQL, relationships, indexes at a basic level, transactions, PostgreSQL |
| Tests | JUnit, Mockito, understanding integration tests |
| Tools | Git, Maven/Gradle, IntelliJ IDEA, Docker (run the app and a DB), Postman/an HTTP client |
| Processes | Scrum, Jira, code review |
| English | B1–B2: read and write technical correspondence |

**Portfolio:** 1–2 finished projects on GitHub — see [a portfolio project](#/page/career/portfolio).

## Middle / Regular {#middle}

**Who:** independently delivers features from task to production, reviews Juniors' code, understands *why* the system is built the way it is.

- Deeper Java: the JMM and [`volatile`](#/extra/jmm-volatile), `java.util.concurrent`, [virtual threads](#/extra/virtual-threads), JVM and GC basics, profiling.
- Deeper Spring: transactions and propagation, proxies, Spring Security, caching, error handling, testing the layers.
- DB: query optimisation (`EXPLAIN`), N+1, locks, zero-downtime migrations.
- Integrations: Kafka/RabbitMQ, REST clients, resilience (timeouts, retries, circuit breakers).
- Infrastructure: Docker, Kubernetes as a user, CI/CD, logs and metrics, the cloud (AWS/Azure).
- Architecture: patterns, SOLID, clean/hexagonal architecture, microservices and their trade-offs.
- English B2: take part in discussions and demos.

## Senior {#senior}

**Who:** owns the technical decisions in their area, sees the system as a whole, helps the team grow.

- System design: scaling, data consistency, distributed transactions (Saga, Outbox), choosing storage.
- Performance and reliability: JVM tuning, incident analysis, observability, SLOs.
- Security and quality: threat modelling, code standards, architecture tests.
- Working with people: mentoring, architecture reviews, estimates, communicating with the business.
- The ability to choose the **simple** solution and say "no" with good arguments.

## Lead / Architect / Staff {#lead}

From here the paths diverge: **Tech Lead** (technical decisions + team coordination), **Engineering Manager** (people and processes), **Architect / Staff / Principal Engineer** (architecture across several teams or the company). There aren't more technologies here — there's more responsibility, influence and communication.

## What to learn after this course {#after-course}

A 4–6-month plan at 10–15 hours a week:

1. **Revisit Java SE** via the [Roadmap](#/roadmap) and the extra articles: [records](#/extra/records), [enums](#/extra/enums), [java.time](#/extra/date-time), [functional style](#/extra/functional).
2. **SQL and PostgreSQL** — queries, relationships, indexes, transactions (SQL trainers, pgexercises).
3. **Git** — daily, on your own projects; pull requests.
4. **Maven/Gradle** — [the article](#/extra/build-tools).
5. **Spring Boot** — DI, REST, Data JPA, Security, tests ([web frameworks](#/extra/web-frameworks), [DI](#/extra/dependency-injection), [databases](#/extra/database-access)).
6. **Docker** and docker compose.
7. **Testing** — JUnit 6, Mockito, Testcontainers ([the article](#/extra/testing)).
8. **A portfolio project** with CI on GitHub Actions.
9. **English** — technical reading and speaking practice.
10. **Interview prep** — revisit the questions from the interview lessons and the [final interview](#/lessons/j2-final-interview), solve algorithm problems (LeetCode/HackerRank — easy/medium).

After that — according to the requirements of specific jobs: Kafka, Kubernetes, the cloud, [AI frameworks](#/page/ai/stack).

## How to prepare for an interview {#interview}

- **Technical questions**: Java Core (OOP, collections, `equals/hashCode`, exceptions, concurrency, the Stream API), Spring (DI, beans, transactions), SQL, Git, HTTP/REST.
- **Live coding**: small tasks on collections and strings, sometimes algorithms; think out loud about what you're doing and why.
- **Project walkthrough**: be ready to explain every decision in your portfolio.
- **Behavioural questions**: how you solved a hard problem, how you react to criticism in review, how you learn new things.
- **Questions for the employer**: the stack, processes, a mentor for Juniors, how onboarding works.

:::tip "A failed interview is still a result"
Write down every question you couldn't answer and close the gaps. After 5–10 interviews you'll notice the questions repeat and your confidence grows.
:::
