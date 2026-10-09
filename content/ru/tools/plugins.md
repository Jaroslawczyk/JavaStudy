Плагины (расширения) добавляют IDE новые возможности: подсказки по горячим клавишам, проверку качества кода, поддержку фреймворков, ИИ-ассистентов. Главное правило — **ставьте только то, чем пользуетесь**: каждый плагин замедляет запуск и индексацию.

:::warning "Безопасность"
Устанавливайте плагины только из официальных магазинов (JetBrains Marketplace, VS Code Marketplace / Open VSX, Eclipse Marketplace), смотрите на автора, число загрузок и дату обновления. Расширение IDE имеет доступ ко всему вашему коду и токенам — в магазинах уже находили вредоносные расширения-подделки популярных плагинов.
:::

## IntelliJ IDEA

Устанавливаются через *Settings → Plugins → Marketplace*.

### Минимальный набор новичка

| Плагин | Зачем | Цена |
|---|---|---|
| **Key Promoter X** | Показывает горячую клавишу каждый раз, когда вы нажимаете действие мышью. Лучший способ выучить хоткеи | Бесплатно |
| **SonarQube for IDE** (бывший SonarLint) | Находит баги, уязвимости и «запахи» кода прямо при наборе, объясняет, почему это плохо | Бесплатно |
| **Rainbow Brackets Lite** | Раскрашивает парные скобки разными цветами — проще читать вложенный код | Бесплатно |
| **.ignore** | Подсветка и шаблоны для `.gitignore` и других ignore-файлов | Бесплатно |
| **String Manipulation** | camelCase ↔ snake_case ↔ UPPER_CASE, сортировка строк, экранирование | Бесплатно |

### Когда начнёте работать с реальными проектами

| Плагин | Зачем |
|---|---|
| **CheckStyle-IDEA** | Проверка кода по стилю команды (Google/Sun style или свой `checkstyle.xml`) |
| **Maven Helper** | Дерево зависимостей и поиск конфликтов версий в Maven |
| **MapStruct Support** | Подсказки и навигация для маппера MapStruct |
| **Grep Console** | Раскрашивает и фильтрует логи в консоли |
| **IdeaVim** | Режим Vim для тех, кто его любит |
| **Translation** | Перевод выделенного текста/комментариев прямо в редакторе |
| **Atom Material Icons**, темы **One Dark**, **Catppuccin** | Внешний вид |

### Уже встроено — ставить не нужно

- **Lombok** — поддержка встроена в IDEA с 2020.3 (нужно только включить *Annotation Processing*, IDEA предложит сама).
- **Docker**, **Git**, **Maven**, **Gradle**, **Terminal**, **Markdown**, проверка орфографии **Grazie** — входят в поставку.
- **Save Actions** — устаревший плагин, вместо него используйте встроенные *Settings → Tools → Actions on Save*.

### ИИ-ассистенты

| Плагин | Что делает | Цена |
|---|---|---|
| **JetBrains AI Assistant** и агент **Junie** | Чат, генерация кода и тестов, объяснение кода, агент для многошаговых задач | Бесплатная квота + платные тарифы JetBrains AI |
| **GitHub Copilot** | Автодополнение строк и блоков, чат, агентный режим | Есть бесплатный тариф Copilot Free; студентам и мейнтейнерам OSS — Pro бесплатно |
| **Claude Code**, **Codex** и др. | Агенты в терминале/IDE, работают с проектом целиком | По подписке провайдера |

:::warning "ИИ и обучение"
Пока учите основы — **отключайте автодополнение ИИ** при решении домашних заданий. Иначе руки не запомнят синтаксис, а голова — логику. Подробно — на странице [ИИ](#/page/ai).
:::

## VS Code

Устанавливаются через панель *Extensions* (<kbd>Ctrl+Shift+X</kbd>).

| Расширение | Зачем |
|---|---|
| **Extension Pack for Java** (Microsoft) | Обязательный набор: Language Support for Java (Red Hat), Debugger for Java, Test Runner for Java, Maven for Java, Project Manager for Java |
| **Gradle for Java** | Задачи и зависимости Gradle |
| **Spring Boot Extension Pack** | Spring Boot Tools, Spring Initializr, Spring Boot Dashboard |
| **SonarQube for IDE** | Анализ качества кода, как в IDEA |
| **Error Lens** | Показывает ошибки и предупреждения прямо в строке кода |
| **GitLens** | История строк, авторство, сравнение веток (часть функций платная) |
| **Container Tools** (бывш. Docker) | Dockerfile, docker-compose, управление контейнерами |
| **XML**, **YAML** (Red Hat) | Подсказки для `pom.xml` и `application.yml` |
| **REST Client** | Отправка HTTP-запросов из `.http`-файлов |
| **EditorConfig**, **Code Spell Checker** | Единый стиль отступов и проверка опечаток |

## Eclipse

Устанавливаются через *Help → Eclipse Marketplace*.

| Плагин | Зачем |
|---|---|
| **Spring Tools** | Поддержка Spring Boot (либо скачайте готовую сборку Spring Tools) |
| **SonarQube for IDE** | Анализ качества кода |
| **Checkstyle Plug-in**, **SpotBugs** | Стиль кода и поиск типичных багов |
| **EclEmma** | Покрытие кода тестами (обычно уже встроен) |
| **MoreUnit** | Быстрый переход между классом и его тестом |
| **Lombok** | Ставится запуском `java -jar lombok.jar` и указанием папки Eclipse |
| **GitHub Copilot for Eclipse** | Официальный плагин Copilot |

## Домашнее задание

:::task easy "Базовый набор"
Установите в IntelliJ IDEA **Key Promoter X**, **SonarQube for IDE** и **Rainbow Brackets Lite**. Перезапустите IDE и убедитесь, что плагины появились в *Settings → Plugins → Installed*.
:::

:::task medium "Найдите проблемы SonarQube"
Напишите метод с намеренными ошибками: неиспользуемая переменная, пустой блок `catch`, сравнение строк через `==`. Посмотрите, что подсветит SonarQube for IDE, и прочитайте объяснение каждого правила (кнопка *Rule description*).
??? Подсказка
```java
public static boolean check(String a, String b) {
    int unused = 42;
    try {
        Integer.parseInt(a);
    } catch (NumberFormatException e) {
    }
    return a == b;
}
```
:::

:::task hard "Стиль команды"
Подключите плагин **CheckStyle-IDEA**, выберите встроенную конфигурацию *Google Checks* и проверьте любой свой учебный проект. Исправьте 10 замечаний, затем настройте форматирование IDEA по Google Java Style (*Settings → Editor → Code Style → Java → ⚙ → Import Scheme*), чтобы <kbd>Ctrl+Alt+L</kbd> форматировал код по тем же правилам.
??? Подсказка
Готовую схему форматирования `intellij-java-google-style.xml` можно взять в репозитории [google/styleguide](https://github.com/google/styleguide) на GitHub.
:::
