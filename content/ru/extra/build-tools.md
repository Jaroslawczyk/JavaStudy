В видео проекты создаются кнопкой в IDEA, а библиотеки подключаются вручную. В реальной разработке так не делают: проект описывается **инструментом сборки** — он скачивает зависимости, компилирует, запускает тесты, собирает JAR и Docker-образ одинаково на любой машине и в CI. Обзор инструментов есть в статье [Экосистема](#/tools/ecosystem); здесь — подробнее о работе с ними.

## Maven

Декларативный «convention over configuration»: структура папок фиксирована (`src/main/java`, `src/test/java`), проект описывается в `pom.xml`.

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

**Жизненный цикл**: `validate → compile → test → package → verify → install → deploy`. Команда запускает все фазы до указанной: `mvn package` скомпилирует, протестирует и соберёт JAR.

| Команда | Что делает |
|---|---|
| `./mvnw clean verify` | чистая сборка с тестами (стандарт для CI) |
| `./mvnw -DskipTests package` | сборка без тестов |
| `./mvnw dependency:tree` | дерево зависимостей — ищем конфликты версий |
| `./mvnw versions:display-dependency-updates` | какие зависимости устарели |

**Scope**: `compile` (по умолчанию), `provided` (даст сервер), `runtime` (драйвер БД), `test`.

## Gradle

Сборка описывается кодом (Kotlin DSL — по умолчанию в новых проектах), есть инкрементальная сборка и кеш, поэтому Gradle быстрее на больших проектах. Стандарт для Android.

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

`./gradlew build`, `./gradlew test --tests "*OrderTest"`, `./gradlew dependencies`. Конфигурации: `implementation`, `api` (в библиотеках), `compileOnly`, `runtimeOnly`, `testImplementation`.

## Bazel и другие

**Bazel** (Google) — для огромных монорепозиториев на нескольких языках: герметичные воспроизводимые сборки и удалённый кеш. Встречается в крупных компаниях, для обычного сервиса избыточен. Также существуют **sbt** (Scala), **Mill**, **Ant** (наследие, императивные XML-скрипты).

## Maven или Gradle

| | Maven | Gradle |
|---|---|---|
| Описание | XML, декларативно | Kotlin/Groovy-код |
| Порог входа | ниже, всё предсказуемо | выше, гибче |
| Скорость | средняя | выше (инкрементальность, build cache) |
| Где чаще | корпоративный бэкенд, банки | Android, крупные мультимодульные проекты, Spring тоже поддерживает |

В вакансиях Европы и Польши встречаются оба примерно поровну; знать нужно на уровне «собрать, добавить зависимость, найти конфликт версий».

:::tip "Wrapper и BOM"
- Всегда коммитьте **wrapper** (`mvnw`/`gradlew`) — тогда у всех и в CI одна версия инструмента, ничего не нужно ставить.
- Версии связанных библиотек выравнивают **BOM**-ом (`spring-boot-dependencies`, `junit-bom`, `testcontainers-bom`): объявили BOM — дальше зависимости без версий.
- Уязвимости в зависимостях проверяют OWASP Dependency-Check, Dependabot/Renovate.
:::

:::note "Версии инструментов"
Maven 3.9 — рабочая лошадка; Maven 4 давно в разработке (RC-версии) с новым форматом POM 4.1 — проверьте статус перед переходом. Gradle с 2025 года в ветке 9.x и требует Java 17+ для запуска самого Gradle.
:::

## Домашнее задание

:::task easy "Первый проект на Maven"
Создайте проект `mvn archetype:generate` (или в IDEA: New Project → Maven), добавьте JUnit и один тест, соберите `./mvnw verify` и запустите JAR через `java -jar` (настройте `Main-Class` через `maven-jar-plugin`).
:::

:::task medium "Тот же проект на Gradle"
Перенесите проект на Gradle Kotlin DSL (`gradle init` умеет конвертировать `pom.xml`). Сравните время повторной сборки без изменений в Maven и Gradle. Добавьте задачу, печатающую версию проекта.
:::

:::task hard "Многомодульный проект и конфликт версий"
Создайте многомодульный проект (`api`, `core`, `app`) на Maven или Gradle. Подключите две библиотеки, тянущие разные версии одной транзитивной зависимости (например, Jackson), найдите конфликт через `dependency:tree`/`dependencies`, разрешите его BOM-ом и добавьте проверку (`maven-enforcer-plugin` с `dependencyConvergence` или `failOnVersionConflict()` в Gradle).
:::
