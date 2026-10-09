IDE и JDK — это только начало. В реальной работе Java-разработчик каждый день использует систему сборки, Git, Docker, клиенты баз данных и HTTP, анализаторы кода и CI. Здесь — обзор с указанием, **что бесплатно, что популярно и когда это понадобится**.

## Системы сборки: Maven и Gradle

Система сборки скачивает библиотеки (зависимости), компилирует код, запускает тесты и собирает JAR. В видеокурсе проекты создаются то «просто в IDEA», то на **Gradle** (во второй части).

| | **Maven** | **Gradle** |
|---|---|---|
| Файл проекта | `pom.xml` (XML, декларативно) | `build.gradle.kts` (Kotlin DSL) или `build.gradle` (Groovy) |
| Порог входа | Ниже: строгая структура, «соглашения важнее настроек» | Выше: гибкость, скрипты |
| Скорость | Нормальная | Быстрее за счёт инкрементальной сборки и кэша |
| Где популярен | Большинство enterprise и Spring Boot backend-проектов | Android (стандарт), крупные многомодульные проекты, Kotlin |
| Цена | Бесплатно (Apache) | Бесплатно; платный Develocity для компаний |

Оба используют один и тот же репозиторий библиотек — **Maven Central** ([central.sonatype.com](https://central.sonatype.com/)).

```xml
<!-- Maven: зависимость в pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>6.0.1</version>
    <scope>test</scope>
</dependency>
```

```kotlin
// Gradle (Kotlin DSL): та же зависимость в build.gradle.kts
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:6.0.1")
}
```

:::tip
Всегда коммитьте **wrapper** — `mvnw`/`gradlew`: он скачивает нужную версию Maven/Gradle автоматически, и проект собирается одной командой `./mvnw package` или `./gradlew build` на любом компьютере. Bazel — третья система сборки (Google), встречается в огромных монорепозиториях; новичку она не нужна.
:::

## Git и хостинги кода

**Git** — система контроля версий; без неё не обходится ни одна команда. Минимум для старта:

```bash
git init                      # создать репозиторий
git status                    # что изменилось
git add .                     # подготовить изменения
git commit -m "Add arrays homework"
git switch -c feature/login   # новая ветка
git push -u origin main       # отправить на GitHub
git pull                      # забрать чужие изменения
```

| Сервис | Для чего | Цена |
|---|---|---|
| **GitHub** | Портфолио, open source, GitHub Actions (CI), Pages (хостинг сайтов), Codespaces | Бесплатно для личных и публичных проектов |
| **GitLab** | Популярен в компаниях Европы, встроенный CI/CD, можно развернуть у себя | Бесплатный тариф + платные |
| **Bitbucket** | В связке с Jira (Atlassian) в корпорациях | Бесплатно до 5 человек |

:::tip "Портфолио"
Выкладывайте домашние задания этого курса в публичный репозиторий на GitHub с понятным `README`. Для Junior-вакансий в Польше и Европе ссылка на GitHub с аккуратными коммитами — реальный плюс.
:::

## Docker и контейнеры

**Docker** упаковывает приложение со всем окружением в контейнер. Java-разработчику он нужен, чтобы локально поднимать PostgreSQL, Kafka, Redis одной командой и запускать интеграционные тесты через **Testcontainers**.

```bash
docker run --name pg -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:18
```

- **Docker Desktop** бесплатен для личного использования, обучения и небольших компаний; для крупных компаний — платная подписка.
- Бесплатные альтернативы: **Podman** (+ Podman Desktop), **Rancher Desktop**, на macOS — **OrbStack** (бесплатен для личного использования).

## Базы данных и клиенты к ним

| Инструмент | Цена | Комментарий |
|---|---|---|
| **DBeaver Community** | Бесплатно | Универсальный клиент к любым СУБД |
| **IntelliJ IDEA** (Database tool) | Базовое подключение бесплатно, полный функционал — Ultimate | Удобно, не выходя из IDE |
| **DataGrip** | Платно (есть бесплатные варианты для некоммерческого использования — смотрите сайт JetBrains) | Профессиональный SQL-инструмент |
| **pgAdmin** | Бесплатно | Официальный клиент PostgreSQL |

Самая востребованная СУБД в Java-вакансиях Европы — **PostgreSQL**, далее Oracle, MySQL/MariaDB, MS SQL; из NoSQL — MongoDB и Redis.

## HTTP-клиенты для тестирования API

| Инструмент | Цена | Особенности |
|---|---|---|
| **Postman** | Бесплатный тариф | Самый известный; требует аккаунт, данные в облаке |
| **Bruno** | Бесплатно, open source | Коллекции хранятся файлами в Git, работает офлайн |
| **IntelliJ HTTP Client** | Ultimate | `.http`-файлы прямо в проекте |
| **curl**, **HTTPie** | Бесплатно | Командная строка |

## Качество кода

| Инструмент | Что делает |
|---|---|
| **Checkstyle** | Проверяет стиль (отступы, именование, длина строк) |
| **PMD** | Ищет подозрительные конструкции и мёртвый код |
| **SpotBugs** | Ищет типичные баги в байт-коде |
| **Error Prone** (Google) | Ловит ошибки на этапе компиляции |
| **SonarQube / SonarQube Cloud** | Сводная панель качества, покрытия и уязвимостей; бесплатно для open source |
| **Spotless** + google-java-format / palantir-java-format | Автоформатирование в сборке |

## Отладка и профилирование

- **Отладчик IDE** — точки останова, просмотр переменных, пошаговое выполнение. Учитесь пользоваться им с первых уроков, а не только `System.out.println`.
- **jcmd**, **jstack**, **jmap** — утилиты JDK: дамп потоков и памяти работающего приложения.
- **JDK Flight Recorder (JFR)** + **JDK Mission Control** — бесплатный встроенный «бортовой самописец» JVM.
- **VisualVM** — графический мониторинг памяти, потоков, CPU.
- **async-profiler** — точный профайлер CPU/памяти, строит flame graph.

## CI/CD

Автоматическая сборка и тесты при каждом push: **GitHub Actions** (бесплатно для публичных репозиториев), **GitLab CI**, **Jenkins** (самый «старый» и до сих пор частый в enterprise), **TeamCity**.

## Где практиковаться

- **Hyperskill** (JetBrains Academy), **Exercism** (Java track, бесплатно, с менторами), **Codewars**, **LeetCode** (алгоритмы для собеседований), **Stepik** (русскоязычные курсы, включая курс автора видео).
- **JShell** и онлайн-компиляторы — для быстрых проверок.

## Сколько всё это стоит новичку

| Нужно | Бесплатный вариант |
|---|---|
| IDE | IntelliJ IDEA (бесплатная часть) / VS Code / Eclipse |
| JDK | Eclipse Temurin / Amazon Corretto |
| Сборка | Maven / Gradle |
| Git + хостинг | Git + GitHub |
| Контейнеры | Docker Desktop (личное использование) / Podman |
| БД | PostgreSQL в Docker + DBeaver |
| API-клиент | Bruno / curl |
| Качество | SonarQube for IDE, Checkstyle |

**Итого: 0 €.** Платить имеет смысл только за IntelliJ IDEA Ultimate (если вы не студент) и, по желанию, за ИИ-ассистента.

## Домашнее задание

:::task easy "Первый репозиторий"
Создайте аккаунт на GitHub (если его нет), новый репозиторий `java-course-homework` и загрузите в него проект из первого урока. Добавьте `README.md` с описанием и `.gitignore` для Java/IntelliJ.
??? Подсказка
При создании репозитория на GitHub выберите шаблон `.gitignore` → *Java*, а папку `.idea/` и `out/`/`target/`/`build/` допишите вручную.
:::

:::task medium "Maven-проект с нуля"
Создайте в IDEA Maven-проект (*New Project → Build system: Maven*). Добавьте зависимость JUnit Jupiter и напишите один тест `assertEquals(4, 2 + 2)`. Запустите сборку из терминала: `./mvnw test` (или `mvn test`).
??? Подсказка
Если файла `mvnw` нет, добавьте wrapper командой `mvn wrapper:wrapper` или создайте проект через [start.spring.io](https://start.spring.io/) — там wrapper уже есть.
:::

:::task hard "PostgreSQL в Docker"
Установите Docker Desktop или Podman, поднимите PostgreSQL командой из раздела выше, подключитесь к нему через DBeaver или Database tool в IDEA, создайте таблицу `students(id serial primary key, name text)` и добавьте три записи. Затем остановите и удалите контейнер (`docker stop pg`, `docker rm pg`) и подумайте: куда делись данные и как их сохранить (подсказка — volumes)?
??? Подсказка
Чтобы данные переживали удаление контейнера, подключите том: `-v pgdata:/var/lib/postgresql`.
:::
