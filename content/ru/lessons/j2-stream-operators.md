Продолжаем Stream API: ещё несколько терминальных операций (`count`, `allMatch`, `anyMatch`, `noneMatch`, `forEach`) и промежуточных (`sorted`, `limit`). Учимся сортировать объекты компаратором и выводить результат ссылкой на метод.

## Таймкоды видео

- {{t j2 4:44:40}} — класс `User` с именем и возрастом
- {{t j2 4:45:37}} — сколько пользователей старше 30: `count()`
- {{t j2 4:46:48}} — всё, что возвращает не `Stream`, — терминальная операция
- {{t j2 4:47:36}} — `allMatch`, `anyMatch`, `noneMatch`
- {{t j2 4:47:52}} — пример с кинотеатром: идут все или никто
- {{t j2 4:49:12}} — `anyMatch`: хотя бы один взрослый
- {{t j2 4:49:59}} — `noneMatch`
- {{t j2 4:50:16}} — мини-задание: перепишите через `noneMatch`
- {{t j2 4:51:02}} — `sorted` и `limit`
- {{t j2 4:51:20}} — мини-задание: три самых старших пользователя
- {{t j2 4:51:38}} — разбор: компаратор, `Integer.compare`, лямбда
- {{t j2 4:53:49}} — переопределяем `toString()`
- {{t j2 4:54:24}} — `forEach` вместо `collect` + цикл
- {{t j2 4:55:37}} — `System.out::println`
- {{t j2 4:56:01}} — домашнее задание: имена трёх пользователей
- {{t j2 4:56:45}} — разбор решения
- {{t j2 4:58:25}} — `Comparator.comparing`

## count()

```java
record User(String name, int age) {}

long count = users.stream()
        .filter(u -> u.age() > 30)
        .count();                 // long, коллекцию собирать не нужно
```

## allMatch, anyMatch, noneMatch

Проверяют элементы предикатом и возвращают `boolean`:

| Метод | `true`, если… | На пустом стриме |
|---|---|---|
| `allMatch(p)` | **все** элементы подходят | `true` |
| `anyMatch(p)` | **хотя бы один** подходит | `false` |
| `noneMatch(p)` | **ни один** не подходит | `true` |

```java
boolean allAdults = users.stream().allMatch(u -> u.age() >= 18);
boolean hasAdult  = users.stream().anyMatch(u -> u.age() >= 18);
boolean noKids    = users.stream().noneMatch(u -> u.age() < 18);   // = allAdults
```

Все три **короткозамкнутые** (short-circuit): `anyMatch` останавливается на первом подходящем элементе, `allMatch` — на первом неподходящем.

:::tip "Ловушка пустого стрима"
`allMatch` на пустой коллекции возвращает `true` («все ноль пользователей — взрослые»). Если пустой список означает «нельзя», проверяйте `!users.isEmpty()` отдельно.
:::

## sorted и limit

```java
users.stream()
     .sorted((o1, o2) -> Integer.compare(o2.age(), o1.age()))   // по убыванию возраста
     .limit(3)
     .forEach(System.out::println);
```

То же современнее — через фабрики `Comparator`:

```java
.sorted(Comparator.comparingInt(User::age).reversed())
.sorted(Comparator.comparing(User::name).thenComparingInt(User::age))
```

- `sorted()` без аргументов — естественный порядок (`Comparable`), иначе `ClassCastException`.
- `limit(n)` — первые `n` элементов, `skip(n)` — пропустить `n` (вместе дают пагинацию).

:::note "sorted — не ленивая операция"
Большинство промежуточных операций обрабатывают элементы по одному, но `sorted` должен увидеть **все** элементы, прежде чем отдать первый. На бесконечном стриме `sorted` зависнет.
:::

## forEach

```java
users.stream().filter(u -> u.age() < 40).forEach(System.out::println);
```

`forEach` — терминальная операция с `Consumer`. Если нужен только обход всей коллекции без преобразований, проще `users.forEach(...)` — без стрима.

## Что не рассказано в видео

- **`distinct()`** — убирает дубликаты (по `equals`), **`takeWhile`/`dropWhile`** (Java 9) — брать/пропускать, пока условие истинно (полезно для отсортированных данных).
- **`reduce`** — свёртка: `numbers.stream().reduce(0, Integer::sum)`.
- **`peek`** — для отладки (посмотреть элементы между шагами), не для бизнес-логики.
- **`mapMulti`** (Java 16) и **Stream Gatherers** (Java 24, `Stream.gather`) — свои промежуточные операции, например скользящие окна: `.gather(Gatherers.windowSliding(3))`.
- **`flatMap`** — «расплющить» вложенные коллекции: `orders.stream().flatMap(o -> o.items().stream())`.

## Домашнее задание

:::task video "Имена трёх пользователей — из видео"
Отсортируйте пользователей по имени, оставьте младше 40 лет, возьмите первых трёх, превратите в стрим имён и выведите через `forEach`. {{t j2 4:56:01}}
??? Подсказка
`sorted(Comparator.comparing(User::name)).filter(u -> u.age() < 40).limit(3).map(User::name).forEach(System.out::println)`. Разбор: {{t j2 4:56:45}}
:::

:::task easy "Проверки"
Для списка чисел проверьте одним `anyMatch`/`allMatch`/`noneMatch`: есть ли отрицательные, все ли чётные, нет ли нулей. Проверьте поведение на пустом списке.
:::

:::task medium "Страницы"
Напишите `static <T> List<T> page(List<T> items, int page, int size)` через `skip` и `limit`. Отсортируйте пользователей по возрасту, затем по имени, и выведите вторую страницу по 5 человек.
:::

:::task hard "Топ слов"
Прочитайте текст, разбейте на слова (`split("\\W+")`), приведите к нижнему регистру, посчитайте частоты (`groupingBy` + `counting`) и выведите 10 самых частых слов по убыванию частоты, а при равенстве — по алфавиту. Только Stream API, без циклов.
:::
