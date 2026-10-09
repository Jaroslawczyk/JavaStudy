**Система модулей Java** (JPMS, Project Jigsaw, Java 9) добавила над пакетами ещё один уровень инкапсуляции: модуль явно объявляет, от чего зависит и какие пакеты открывает другим. Сам JDK разбит на ~70 модулей. В прикладных Spring-проектах модули используют редко, но понимать их нужно — и для собеседований, и для `jlink`.

## module-info.java

```java
// src/main/java/module-info.java
module com.example.shop {
    requires java.net.http;                  // зависимость от модуля
    requires transitive com.example.money;   // и для тех, кто зависит от нас
    requires static lombok;                  // нужна только при компиляции

    exports com.example.shop.api;            // публичный API модуля
    exports com.example.shop.spi to com.example.plugins;   // только для конкретного модуля

    opens com.example.shop.dto;              // доступ через рефлексию (Jackson, Hibernate)

    uses com.example.shop.spi.PaymentProvider;           // ServiceLoader
    provides com.example.shop.spi.PaymentProvider with com.example.shop.CardProvider;
}
```

| Директива | Смысл |
|---|---|
| `requires` | модуль зависит от другого |
| `requires transitive` | зависимость «пробрасывается» потребителям |
| `exports` | пакет доступен другим модулям для компиляции и вызова |
| `opens` | пакет открыт для глубокой рефлексии (включая `private`) |
| `uses` / `provides … with` | сервисы через `ServiceLoader` |

## Строгая инкапсуляция

Без `exports` даже `public`-класс модуля **не виден** снаружи. Это защищает внутренности библиотек: с Java 17 (JEP 403) доступ к внутренним классам JDK (`sun.misc.*`, `com.sun.*.internal`) через рефлексию закрыт по умолчанию, и библиотеки, которые на это полагались, приходилось обновлять.

## Classpath и module path

- **Classpath** — «по-старому»: все JAR в одной куче, конфликты версий обнаруживаются только в рантайме. Код на classpath попадает в **безымянный модуль** (unnamed module), который видит всё.
- **Module path** — модули с `module-info`; JAR без него становятся **автоматическими модулями** (имя из `Automatic-Module-Name` в манифесте или из имени файла).

Большинство Spring Boot-приложений по-прежнему запускаются с classpath — и это нормально.

## jlink: свой маленький рантайм

```bash
jlink --module-path target/classes --add-modules com.example.shop \
      --output build/runtime --strip-debug --no-header-files --no-man-pages
build/runtime/bin/java -m com.example.shop/com.example.shop.Main
```

Рантайм содержит только нужные модули JDK — десятки мегабайт вместо сотен. Удобно для Docker-образов и десктоп-приложений (`jpackage`).

:::outdated "Импорт модуля — Java 25"
С Java 25 (JEP 511) можно одной строкой импортировать все экспортируемые пакеты модуля: `import module java.base;` — удобно в скриптах и учебных программах (в компактных исходниках с `void main()` он подключается автоматически).
:::

:::interview "Вопросы с собеседования"
**Зачем нужны модули, если есть пакеты?** — Пакет управляет видимостью классов, но `public` виден всем. Модуль позволяет скрыть публичные классы, явно описать зависимости (их проверяют при старте, а не в момент падения) и собрать минимальный рантайм через `jlink`.

**Чем `exports` отличается от `opens`?** — `exports` даёт доступ к публичным типам для компиляции и вызова, `opens` — доступ рефлексией ко всем членам (нужно ORM и сериализаторам).
:::

## Домашнее задание

:::task easy "Список модулей JDK"
Выполните `java --list-modules` и `java --describe-module java.sql`. Найдите, какие модули требует `java.sql` и какие пакеты он экспортирует.
:::

:::task medium "Два модуля"
Создайте модули `com.example.greeter` (экспортирует пакет `api` с интерфейсом и скрывает пакет `impl`) и `com.example.app` (использует greeter). Убедитесь, что класс из `impl` недоступен из `app` даже будучи `public`. Подключите реализацию через `provides/uses` и `ServiceLoader`.
:::

:::task hard "Минимальный образ"
Соберите консольное приложение на `java.base` + `java.net.http`, создайте рантайм `jlink` и Docker-образ на его основе (`FROM debian:stable-slim` + скопированный рантайм). Сравните размер образа с образом на полном `eclipse-temurin:25-jdk` и `-jre`.
:::
