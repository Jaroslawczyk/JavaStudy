Working with dates is a source of endless bugs: time zones, daylight saving time, leap years, formats. Since Java 8 there's an excellent API, **`java.time`** (JSR-310). The old `Date`, `Calendar` and `SimpleDateFormat` aren't used in new code.

:::outdated "Date, Calendar, SimpleDateFormat"
`java.util.Date` is mutable, months in `Calendar` start from zero, and `SimpleDateFormat` **isn't thread-safe** — a shared instance in a multithreaded service produces "random" dates. Use `java.time`; to interoperate with old code there are `date.toInstant()` and `Date.from(instant)`.
:::

## The main types

| Type | What it holds | Example |
|---|---|---|
| `LocalDate` | a date without time or zone | a birthday `1995-04-12` |
| `LocalTime` | a time without a date | a shop opening at `09:00` |
| `LocalDateTime` | date + time without a zone | "a meeting on 12 May at 15:00" (local) |
| `ZonedDateTime` | date + time + zone (`Europe/Warsaw`) | a schedule that respects DST |
| `OffsetDateTime` | date + time + offset (`+02:00`) | REST APIs, databases |
| `Instant` | a point on the timeline (UTC) | event time, logs, `created_at` |
| `Duration` | a span in seconds/nanoseconds | a 30 s timeout |
| `Period` | a span in years/months/days | age, subscription length |

All types are **immutable** and thread-safe: `plus…`, `with…` methods return a new object.

```java
LocalDate today = LocalDate.now();
LocalDate birthday = LocalDate.of(1995, Month.APRIL, 12);
int age = Period.between(birthday, today).getYears();

LocalDate nextFriday = today.with(TemporalAdjusters.next(DayOfWeek.FRIDAY));
LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());

Instant start = Instant.now();
// … work …
Duration took = Duration.between(start, Instant.now());
```

## Time zones

```java
ZonedDateTime warsaw = ZonedDateTime.of(
        LocalDateTime.of(2026, 10, 25, 2, 30), ZoneId.of("Europe/Warsaw"));
ZonedDateTime tokyo = warsaw.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
```

:::tip "A rule for the backend"
Store and transmit points in time in **UTC** (`Instant` / `OffsetDateTime` / `timestamptz` in PostgreSQL), and convert to local time only when displaying to the user. Don't use abbreviations like `CET` or `EST` — only IANA identifiers (`Europe/Warsaw`).
:::

## Formatting and parsing

```java
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
String text = LocalDateTime.now().format(fmt);           // 09.10.2026 14:05
LocalDateTime parsed = LocalDateTime.parse("09.10.2026 14:05", fmt);

Instant.parse("2026-10-09T12:05:00Z");                    // ISO-8601 is the default format
DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(Locale.forLanguageTag("pl"));
```

`DateTimeFormatter` is immutable and thread-safe — keep it in a `static final`. Be careful with patterns: `yyyy` is the year, `YYYY` is the "week-based year" (at the end of December it gives the next year!), `MM` is the month, `mm` is minutes.

## Testable time: Clock

```java
public class SubscriptionService {
    private final Clock clock;
    public SubscriptionService(Clock clock) { this.clock = clock; }

    public boolean isExpired(LocalDate until) {
        return LocalDate.now(clock).isAfter(until);
    }
}

// in a test
var service = new SubscriptionService(
        Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC));
```

Instead of argument-less `now()`, inject a `Clock` — then tests don't depend on real time.

:::interview "Interview questions"
**How does `LocalDateTime` differ from `ZonedDateTime` and `Instant`?** — `LocalDateTime` knows no zone and doesn't denote a specific moment; `ZonedDateTime` is a date-time in a zone with DST rules; `Instant` is an exact moment in UTC.

**Why is `SimpleDateFormat` dangerous?** — It's mutable and not thread-safe; a shared instance across threads corrupts results.
:::

## Homework

:::task easy "How many days until…"
A program takes a date in `dd.MM.yyyy` format and prints how many days are left until it (or have passed), and which day of the week it is in Polish (`getDisplayName(TextStyle.FULL, Locale.forLanguageTag("pl"))`).
:::

:::task medium "A call across countries"
A meeting at `2026-03-29 10:00` Warsaw time. Print the local time in New York, London, Tokyo and Minsk. Why is the difference with New York on that day not the usual one? (Hint: Europe and the US switch to summer time on different dates.)
:::

:::task hard "Working days"
Write `long workingDaysBetween(LocalDate from, LocalDate to, Set<LocalDate> holidays)` — the number of working days (excluding weekends and holidays). Add a method `LocalDate addWorkingDays(LocalDate start, int n, …)`. Cover edge cases with tests: crossing a year, a holiday on a weekend, `from > to`.
:::
