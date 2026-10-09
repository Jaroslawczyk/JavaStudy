Praca z datami to źródło niekończących się błędów: strefy czasowe, czas letni, lata przestępne, formaty. Od Javy 8 jest świetne API **`java.time`** (JSR-310). Starych `Date`, `Calendar` i `SimpleDateFormat` w nowym kodzie się nie używa.

:::outdated "Date, Calendar, SimpleDateFormat"
`java.util.Date` jest zmienny, miesiące w `Calendar` liczone są od zera, a `SimpleDateFormat` **nie jest bezpieczny wątkowo** — wspólny egzemplarz w wielowątkowym serwisie daje „losowe” daty. Używaj `java.time`; do współpracy ze starym kodem są `date.toInstant()` i `Date.from(instant)`.
:::

## Podstawowe typy

| Typ | Co przechowuje | Przykład |
|---|---|---|
| `LocalDate` | data bez czasu i strefy | urodziny `1995-04-12` |
| `LocalTime` | czas bez daty | otwarcie sklepu `09:00` |
| `LocalDateTime` | data + czas bez strefy | „spotkanie 12 maja o 15:00” (lokalnie) |
| `ZonedDateTime` | data + czas + strefa (`Europe/Warsaw`) | harmonogram z uwzględnieniem czasu letniego |
| `OffsetDateTime` | data + czas + przesunięcie (`+02:00`) | REST API, bazy danych |
| `Instant` | punkt na osi czasu (UTC) | czas zdarzenia, logi, `created_at` |
| `Duration` | odcinek w sekundach/nanosekundach | limit 30 s |
| `Period` | odcinek w latach/miesiącach/dniach | wiek, okres subskrypcji |

Wszystkie typy są **niezmienne** i bezpieczne wątkowo: metody `plus…`, `with…` zwracają nowy obiekt.

```java
LocalDate today = LocalDate.now();
LocalDate birthday = LocalDate.of(1995, Month.APRIL, 12);
int age = Period.between(birthday, today).getYears();

LocalDate nextFriday = today.with(TemporalAdjusters.next(DayOfWeek.FRIDAY));
LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());

Instant start = Instant.now();
// … praca …
Duration took = Duration.between(start, Instant.now());
```

## Strefy czasowe

```java
ZonedDateTime warsaw = ZonedDateTime.of(
        LocalDateTime.of(2026, 10, 25, 2, 30), ZoneId.of("Europe/Warsaw"));
ZonedDateTime tokyo = warsaw.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
```

:::tip "Zasada dla backendu"
Przechowuj i przesyłaj momenty w czasie w **UTC** (`Instant` / `OffsetDateTime` / `timestamptz` w PostgreSQL), a na czas lokalny zamieniaj dopiero przy wyświetlaniu użytkownikowi. Nie używaj skrótów w rodzaju `CET` czy `EST` — tylko identyfikatorów IANA (`Europe/Warsaw`).
:::

## Formatowanie i parsowanie

```java
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
String text = LocalDateTime.now().format(fmt);           // 09.10.2026 14:05
LocalDateTime parsed = LocalDateTime.parse("09.10.2026 14:05", fmt);

Instant.parse("2026-10-09T12:05:00Z");                    // ISO-8601 — format domyślny
DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(Locale.forLanguageTag("pl"));
```

`DateTimeFormatter` jest niezmienny i bezpieczny wątkowo — można go trzymać w `static final`. Uważaj na wzorce: `yyyy` — rok, `YYYY` — „rok tygodniowy” (pod koniec grudnia daje następny rok!), `MM` — miesiąc, `mm` — minuty.

## Testowalny czas: Clock

```java
public class SubscriptionService {
    private final Clock clock;
    public SubscriptionService(Clock clock) { this.clock = clock; }

    public boolean isExpired(LocalDate until) {
        return LocalDate.now(clock).isAfter(until);
    }
}

// w teście
var service = new SubscriptionService(
        Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC));
```

Zamiast bezargumentowego `now()` wstrzykuj `Clock` — wtedy testy nie zależą od rzeczywistego czasu.

:::interview "Pytania rekrutacyjne"
**Czym `LocalDateTime` różni się od `ZonedDateTime` i `Instant`?** — `LocalDateTime` nie zna strefy i nie oznacza konkretnego momentu; `ZonedDateTime` — data-czas w strefie z regułami czasu letniego; `Instant` — dokładny moment w UTC.

**Dlaczego `SimpleDateFormat` jest niebezpieczny?** — Jest zmienny i nie jest bezpieczny wątkowo; wspólny egzemplarz w kilku wątkach psuje wyniki.
:::

## Zadanie domowe

:::task easy "Ile dni do…"
Program przyjmuje datę w formacie `dd.MM.yyyy` i wypisuje, ile dni zostało do niej (lub minęło) i jaki to będzie dzień tygodnia po polsku (`getDisplayName(TextStyle.FULL, Locale.forLanguageTag("pl"))`).
:::

:::task medium "Spotkanie w różnych krajach"
Spotkanie `2026-03-29 10:00` czasu warszawskiego. Wypisz czas lokalny dla Nowego Jorku, Londynu, Tokio i Mińska. Dlaczego tego dnia różnica z Nowym Jorkiem jest inna niż zwykle? (Podpowiedź: Europa i USA przechodzą na czas letni w różnych terminach.)
:::

:::task hard "Dni robocze"
Napisz `long workingDaysBetween(LocalDate from, LocalDate to, Set<LocalDate> holidays)` — liczbę dni roboczych (bez weekendów i świąt). Dodaj metodę `LocalDate addWorkingDays(LocalDate start, int n, …)`. Pokryj testami przypadki brzegowe: przejście przez rok, święto w weekend, `from > to`.
:::
