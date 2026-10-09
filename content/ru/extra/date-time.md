Работа с датами — источник бесконечных багов: часовые пояса, летнее время, високосные годы, форматы. С Java 8 есть отличный API **`java.time`** (JSR-310). Старые `Date`, `Calendar` и `SimpleDateFormat` в новом коде не используются.

:::outdated "Date, Calendar, SimpleDateFormat"
`java.util.Date` изменяем, месяцы в `Calendar` считаются с нуля, а `SimpleDateFormat` **не потокобезопасен** — общий экземпляр в многопоточном сервисе даёт «случайные» даты. Используйте `java.time`; для стыковки со старым кодом есть `date.toInstant()` и `Date.from(instant)`.
:::

## Основные типы

| Тип | Что хранит | Пример |
|---|---|---|
| `LocalDate` | дата без времени и зоны | день рождения `1995-04-12` |
| `LocalTime` | время без даты | открытие магазина `09:00` |
| `LocalDateTime` | дата + время без зоны | «встреча 12 мая в 15:00» (по местному) |
| `ZonedDateTime` | дата + время + зона (`Europe/Warsaw`) | расписание с учётом летнего времени |
| `OffsetDateTime` | дата + время + смещение (`+02:00`) | REST API, базы данных |
| `Instant` | точка на шкале времени (UTC) | время события, логи, `created_at` |
| `Duration` | промежуток в секундах/наносекундах | таймаут 30 с |
| `Period` | промежуток в годах/месяцах/днях | возраст, срок подписки |

Все типы **неизменяемы** и потокобезопасны: методы `plus…`, `with…` возвращают новый объект.

```java
LocalDate today = LocalDate.now();
LocalDate birthday = LocalDate.of(1995, Month.APRIL, 12);
int age = Period.between(birthday, today).getYears();

LocalDate nextFriday = today.with(TemporalAdjusters.next(DayOfWeek.FRIDAY));
LocalDate endOfMonth = today.with(TemporalAdjusters.lastDayOfMonth());

Instant start = Instant.now();
// … работа …
Duration took = Duration.between(start, Instant.now());
```

## Часовые пояса

```java
ZonedDateTime warsaw = ZonedDateTime.of(
        LocalDateTime.of(2026, 10, 25, 2, 30), ZoneId.of("Europe/Warsaw"));
ZonedDateTime tokyo = warsaw.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
```

:::tip "Правило для бэкенда"
Храните и передавайте моменты времени в **UTC** (`Instant` / `OffsetDateTime` / `timestamptz` в PostgreSQL), а в местное время переводите только при отображении пользователю. Не используйте сокращения вроде `CET` или `EST` — только идентификаторы IANA (`Europe/Warsaw`).
:::

## Форматирование и разбор

```java
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
String text = LocalDateTime.now().format(fmt);           // 09.10.2026 14:05
LocalDateTime parsed = LocalDateTime.parse("09.10.2026 14:05", fmt);

Instant.parse("2026-10-09T12:05:00Z");                    // ISO-8601 — формат по умолчанию
DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(Locale.forLanguageTag("pl"));
```

`DateTimeFormatter` неизменяем и потокобезопасен — его можно хранить в `static final`. Осторожно с шаблонами: `yyyy` — год, `YYYY` — «год недели» (в конце декабря даёт следующий год!), `MM` — месяц, `mm` — минуты.

## Тестируемое время: Clock

```java
public class SubscriptionService {
    private final Clock clock;
    public SubscriptionService(Clock clock) { this.clock = clock; }

    public boolean isExpired(LocalDate until) {
        return LocalDate.now(clock).isAfter(until);
    }
}

// в тесте
var service = new SubscriptionService(
        Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC));
```

Вместо `now()` без аргументов внедряйте `Clock` — тогда тесты не зависят от реального времени.

:::interview "Вопросы с собеседования"
**Чем `LocalDateTime` отличается от `ZonedDateTime` и `Instant`?** — `LocalDateTime` не знает зоны и не обозначает конкретный момент; `ZonedDateTime` — дата-время в зоне с правилами перехода на летнее время; `Instant` — точный момент в UTC.

**Почему `SimpleDateFormat` опасен?** — Он изменяем и не потокобезопасен; общий экземпляр в нескольких потоках портит результаты.
:::

## Домашнее задание

:::task easy "Сколько дней до…"
Программа принимает дату в формате `dd.MM.yyyy` и выводит, сколько дней осталось до неё (или прошло), и какой это будет день недели на польском (`getDisplayName(TextStyle.FULL, Locale.forLanguageTag("pl"))`).
:::

:::task medium "Созвон в разных странах"
Встреча в `2026-03-29 10:00` по Варшаве. Выведите местное время для Нью-Йорка, Лондона, Токио и Минска. Почему в этот день разница с Нью-Йорком отличается от обычной? (Подсказка: переходы на летнее время в Европе и США в разные даты.)
:::

:::task hard "Рабочие дни"
Напишите `long workingDaysBetween(LocalDate from, LocalDate to, Set<LocalDate> holidays)` — количество рабочих дней (без выходных и праздников). Добавьте метод `LocalDate addWorkingDays(LocalDate start, int n, …)`. Покройте тестами граничные случаи: переход через год, праздник в выходной, `from > to`.
:::
