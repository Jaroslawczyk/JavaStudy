**JDK** (Java Development Kit) — набор для разработки: компилятор `javac`, виртуальная машина и стандартная библиотека. Java — открытая платформа: эталонная реализация **OpenJDK** развивается сообществом (Oracle, Red Hat, Amazon, Microsoft, SAP и др.), а разные компании выпускают свои **сборки (дистрибутивы)** этого кода.

## Версии Java и LTS

С 2018 года Java выходит **каждые 6 месяцев** — в марте и сентябре. Каждая четвёртая версия (раз в 2 года) — **LTS** (Long-Term Support): её поддерживают и обновляют годами, поэтому компании используют в продакшене именно LTS.

| Версия | Дата | Статус на октябрь 2026 |
|---|---|---|
| Java 8 | 2014 | LTS, «легаси», ещё встречается в старых системах |
| Java 11 | 2018 | LTS, постепенно уходит |
| Java 17 | 2021 | LTS, очень распространена |
| Java 21 | 2023 | LTS, основной выбор компаний сейчас |
| **Java 25** | сентябрь 2025 | **Текущая LTS — учите на ней** |
| Java 26 | март 2026 | Обычный релиз, поддержка закончилась |
| Java 27 | 15 сентября 2026 | Последний релиз, поддержка до марта 2027 |
| Java 29 | сентябрь 2027 | Следующая LTS |

:::tip "Какую версию учить"
Учите на **Java 25**. Код, написанный для Java 17/21, почти всегда работает на 25 без изменений, а новые возможности языка (records, `var`, switch-выражения, текстовые блоки, virtual threads) вы будете знать заранее — это плюс на собеседовании.
:::

## Что появилось в Java после 8 (шпаргалка)

Видеокурс местами показывает «классический» Java-стиль. Вот важнейшие изменения языка и библиотеки — в уроках мы будем ссылаться на них в блоках **↻ Устарело**.

| Версия | Ключевые возможности |
|---|---|
| 8 | Лямбды, Stream API, `Optional`, `java.time` (новые даты), default-методы в интерфейсах |
| 9 | Модули (JPMS), JShell, `List.of()`, `Set.of()`, `Map.of()` |
| 10 | `var` — вывод типа локальной переменной |
| 11 | `HttpClient`, `String.isBlank()/strip()/lines()/repeat()`, `Files.readString()`, запуск `java File.java` |
| 14 | switch-выражения со стрелками `->`, понятные сообщения NullPointerException |
| 15 | Текстовые блоки `"""…"""` |
| 16 | `record`, pattern matching для `instanceof`, `Stream.toList()` |
| 17 | Sealed-классы (`sealed`/`permits`), закрытие внутренних API JDK |
| 21 | **Virtual threads**, Sequenced Collections (`getFirst()`, `reversed()`), record patterns, pattern matching в `switch` |
| 22 | Безымянные переменные `_`, Foreign Function & Memory API, запуск многофайловых программ без компиляции |
| 23 | Javadoc в формате Markdown (`///`) |
| 24 | Stream Gatherers, virtual threads без «пиннинга» в `synchronized`, Security Manager окончательно отключён |
| 25 | **Компактные исходники и `void main()`** без класса, `IO.println()`, `import module`, гибкие тела конструкторов (код до `super(...)`), Scoped Values |
| 26 | HTTP/3 в `HttpClient`, удалён Applet API |
| 27 | G1 — сборщик мусора по умолчанию везде, компактные заголовки объектов по умолчанию, пост-квантовый гибридный TLS |

Возможности с пометкой *preview* в конкретной версии нужно включать флагом `--enable-preview`; финальные — работают сразу.

## Дистрибутивы JDK

Все перечисленные сборки (кроме GraalVM-специфики) — это **один и тот же OpenJDK**, прошедший тесты совместимости (TCK). Отличаются лицензией, сроками обновлений и платной поддержкой.

| Дистрибутив | Кто выпускает | Цена | Особенности |
|---|---|---|---|
| **Eclipse Temurin** | Eclipse Adoptium (сообщество + Microsoft, Red Hat, IBM и др.) | Бесплатно | Самый популярный «нейтральный» выбор, долгие обновления LTS, официальные Docker-образы `eclipse-temurin` |
| **Amazon Corretto** | Amazon | Бесплатно | Долгосрочные патчи от AWS, стандарт для AWS Lambda/EC2 |
| **Azul Zulu** | Azul | Бесплатно / платная поддержка | Много платформ и старых версий, коммерческая поддержка Azul Platform Core |
| **BellSoft Liberica** | BellSoft | Бесплатно / платная поддержка | Вариант *Full* с JavaFX, лёгкие образы для Alpine; используется по умолчанию в buildpacks Spring Boot (`./mvnw spring-boot:build-image`) |
| **Microsoft Build of OpenJDK** | Microsoft | Бесплатно | Для Azure и Windows-окружений |
| **Oracle OpenJDK** (jdk.java.net) | Oracle | Бесплатно (GPL) | Обновляется только 6 месяцев — для экспериментов с самыми новыми версиями |
| **Oracle JDK** | Oracle | Бесплатно по NFTC на ограниченный срок, далее — подписка | Для компаний с контрактом Oracle |
| **GraalVM** | Oracle / сообщество | Бесплатно (Oracle GraalVM — по GFTC) | **Native Image** — компиляция Java-приложения в нативный бинарник: старт за миллисекунды, мало памяти (Spring Boot, Quarkus, Micronaut) |
| **IBM Semeru** | IBM | Бесплатно | Другая JVM — Eclipse OpenJ9, меньше потребление памяти |
| Red Hat build of OpenJDK, SapMachine | Red Hat, SAP | Бесплатно | Для экосистем RHEL и SAP |

:::outdated "Oracle JDK и платные лицензии"
В 2019–2021 годах обновления Oracle JDK для коммерческого использования стали платными, а в 2023 Oracle перевела подписку на расчёт «по числу сотрудников компании». После этого многие компании массово перешли на бесплатные сборки — Temurin, Corretto, Zulu. Сейчас свежие LTS Oracle JDK бесплатны по лицензии NFTC, но только ограниченное время. **Для учёбы и личных проектов выбирайте Temurin или Corretto — и не думайте о лицензиях.**
:::

## Как установить и переключать JDK

| Способ | Команда / действие | Для кого |
|---|---|---|
| Из IntelliJ IDEA | *Project Structure → SDKs → + → Download JDK* | Самый простой вариант для новичка |
| Установщик | [adoptium.net](https://adoptium.net/), [aws.amazon.com/corretto](https://aws.amazon.com/corretto/) — отметьте *Set JAVA_HOME* | Windows/macOS |
| winget (Windows) | `winget install EclipseAdoptium.Temurin.25.JDK` | Windows |
| Homebrew (macOS) | `brew install --cask temurin@25` | macOS |
| **SDKMAN!** | `sdk install java 25-tem`, `sdk use java 21.0.8-tem` | Linux, macOS, WSL — удобное переключение версий |
| Пакетный менеджер Linux | `sudo apt install openjdk-25-jdk` | Ubuntu/Debian |
| Docker | `docker run -it eclipse-temurin:25-jdk jshell` | Без установки в систему |

### Переменная JAVA_HOME

Многие инструменты (Maven, Gradle, IDE, скрипты) ищут JDK через переменную окружения `JAVA_HOME`, а команды `java`/`javac` — через `PATH`.

```bash
# macOS / Linux (добавьте в ~/.zshrc или ~/.bashrc)
export JAVA_HOME=$(/usr/libexec/java_home -v 25)   # macOS
export PATH="$JAVA_HOME/bin:$PATH"
```

На Windows: *Параметры → Система → О системе → Дополнительные параметры системы → Переменные среды* → создайте `JAVA_HOME` = `C:\Program Files\Eclipse Adoptium\jdk-25…` и добавьте `%JAVA_HOME%\bin` в `Path`.

Проверка: `java -version`, `echo %JAVA_HOME%` (Windows) или `echo $JAVA_HOME`.

## Домашнее задание

:::task easy "Узнайте свою Java из кода"
Напишите программу, которая печатает версию и поставщика Java, на которой она запущена.
??? Подсказка
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

:::task medium "Две версии рядом"
Установите JDK 21 и JDK 25 (любым способом из таблицы). Запустите программу из предыдущей задачи на обеих версиях, переключая SDK проекта в IDEA, и сравните вывод.
:::

:::task hard "Новая возможность — старый компилятор"
Создайте файл `Main.java` с «компактным» исходником Java 25:
```java
void main() {
    IO.println("Привет из Java 25!");
}
```
Запустите его командой `java Main.java` на JDK 25. Затем попробуйте на JDK 21 и прочитайте ошибку. Объясните, почему код компилируется в одной версии и не компилируется в другой, и что такое флаг `--enable-preview`.
??? Подсказка
Компактные исходные файлы и `void main()` без класса стали финальными только в Java 25 (JEP 512). В Java 21 это была preview-возможность (JEP 445): её можно было попробовать с флагами `--enable-preview --source 21`, а класс `IO` появился позже.
:::
