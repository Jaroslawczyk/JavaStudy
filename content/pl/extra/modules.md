**System modułów Javy** (JPMS, Project Jigsaw, Java 9) dodał nad pakietami jeszcze jeden poziom hermetyzacji: moduł jawnie deklaruje, od czego zależy i jakie pakiety udostępnia innym. Samo JDK jest podzielone na ~70 modułów. W aplikacjach na Springu moduły stosuje się rzadko, ale trzeba je rozumieć — i na rozmowy, i dla `jlink`.

## module-info.java

```java
// src/main/java/module-info.java
module com.example.shop {
    requires java.net.http;                  // zależność od modułu
    requires transitive com.example.money;   // i dla tych, którzy zależą od nas
    requires static lombok;                  // potrzebny tylko przy kompilacji

    exports com.example.shop.api;            // publiczne API modułu
    exports com.example.shop.spi to com.example.plugins;   // tylko dla konkretnego modułu

    opens com.example.shop.dto;              // dostęp przez refleksję (Jackson, Hibernate)

    uses com.example.shop.spi.PaymentProvider;           // ServiceLoader
    provides com.example.shop.spi.PaymentProvider with com.example.shop.CardProvider;
}
```

| Dyrektywa | Znaczenie |
|---|---|
| `requires` | moduł zależy od innego |
| `requires transitive` | zależność jest „przekazywana” konsumentom |
| `exports` | pakiet dostępny dla innych modułów do kompilacji i wywołań |
| `opens` | pakiet otwarty na głęboką refleksję (łącznie z `private`) |
| `uses` / `provides … with` | serwisy przez `ServiceLoader` |

## Silna hermetyzacja

Bez `exports` nawet klasa `public` modułu **nie jest widoczna** na zewnątrz. Chroni to wnętrzności bibliotek: od Javy 17 (JEP 403) dostęp do wewnętrznych klas JDK (`sun.misc.*`, `com.sun.*.internal`) przez refleksję jest domyślnie zamknięty, a biblioteki, które na tym polegały, trzeba było aktualizować.

## Classpath i module path

- **Classpath** — „po staremu”: wszystkie JAR-y w jednym worku, konflikty wersji wychodzą dopiero w czasie działania. Kod na classpath trafia do **modułu bez nazwy** (unnamed module), który widzi wszystko.
- **Module path** — moduły z `module-info`; JAR-y bez niego stają się **modułami automatycznymi** (nazwa z `Automatic-Module-Name` w manifeście lub z nazwy pliku).

Większość aplikacji Spring Boot nadal uruchamia się z classpath — i to jest w porządku.

## jlink: własne małe środowisko

```bash
jlink --module-path target/classes --add-modules com.example.shop \
      --output build/runtime --strip-debug --no-header-files --no-man-pages
build/runtime/bin/java -m com.example.shop/com.example.shop.Main
```

Środowisko zawiera tylko potrzebne moduły JDK — dziesiątki megabajtów zamiast setek. Wygodne dla obrazów Docker i aplikacji desktopowych (`jpackage`).

:::outdated "Import modułu — Java 25"
Od Javy 25 (JEP 511) można jedną linią zaimportować wszystkie eksportowane pakiety modułu: `import module java.base;` — wygodne w skryptach i programach edukacyjnych (w kompaktowych plikach źródłowych z `void main()` jest dołączany automatycznie).
:::

:::interview "Pytania rekrutacyjne"
**Po co moduły, skoro są pakiety?** — Pakiet zarządza widocznością klas, ale `public` widzą wszyscy. Moduł pozwala ukryć klasy publiczne, jawnie opisać zależności (sprawdzane przy starcie, a nie w momencie wywrotki) i zbudować minimalne środowisko przez `jlink`.

**Czym `exports` różni się od `opens`?** — `exports` daje dostęp do typów publicznych do kompilacji i wywołań, `opens` — dostęp przez refleksję do wszystkich składowych (potrzebny ORM-om i serializatorom).
:::

## Zadanie domowe

:::task easy "Lista modułów JDK"
Wykonaj `java --list-modules` i `java --describe-module java.sql`. Znajdź, jakich modułów wymaga `java.sql` i jakie pakiety eksportuje.
:::

:::task medium "Dwa moduły"
Utwórz moduły `com.example.greeter` (eksportuje pakiet `api` z interfejsem i ukrywa pakiet `impl`) i `com.example.app` (używa greetera). Upewnij się, że klasa z `impl` jest niedostępna z `app`, mimo że jest `public`. Podłącz implementację przez `provides/uses` i `ServiceLoader`.
:::

:::task hard "Minimalny obraz"
Zbuduj aplikację konsolową na `java.base` + `java.net.http`, utwórz środowisko `jlink` i obraz Docker na jego bazie (`FROM debian:stable-slim` + skopiowane środowisko). Porównaj rozmiar obrazu z obrazami na pełnym `eclipse-temurin:25-jdk` i `-jre`.
:::
