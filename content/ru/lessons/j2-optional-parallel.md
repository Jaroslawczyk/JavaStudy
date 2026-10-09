Завершаем Stream API: класс **`Optional`** — контейнер для результата, которого может не быть; операции поиска `findFirst`/`findAny`; способы создать стрим; и **параллельные стримы** — распараллеливание одним вызовом `parallelStream()`.

## Таймкоды видео

- {{t j2 4:58:51}} — методы, возвращающие `Optional`
- {{t j2 4:59:23}} — `max(Comparator)`: самый старший пользователь
- {{t j2 5:00:19}} — почему не `User`, а `Optional<User>`
- {{t j2 5:01:11}} — `get()` и проверка `isPresent()`
- {{t j2 5:01:54}} — функциональный стиль: `ifPresent`
- {{t j2 5:03:09}} — `ifPresentOrElse`
- {{t j2 5:04:05}} — мини-задание: найти пользователя с буквой L в имени
- {{t j2 5:04:29}} — разбор: `findFirst` и `findAny`
- {{t j2 5:06:31}} — способы создать стрим: коллекция, `Arrays.stream`, `Stream.of`
- {{t j2 5:08:07}} — 30 млн чисел: долгий расчёт через `map`
- {{t j2 5:10:52}} — `parallelStream()`: 6,5 с → 4,5 с
- {{t j2 5:11:26}} — разница `findFirst` и `findAny`
- {{t j2 5:12:14}} — итоги урока

## Optional

```java
Optional<User> oldest = users.stream()
        .max(Comparator.comparingInt(User::age));
```

Если в стриме нет элементов (например, все отфильтрованы), максимума не существует. Вместо `null` метод возвращает `Optional` — «коробку», в которой значение может быть, а может не быть. Тип сразу говорит: «проверь, есть ли результат».

```java
oldest.ifPresent(System.out::println);                 // если есть
oldest.ifPresentOrElse(
        System.out::println,
        () -> System.out.println("User not found"));   // Java 9+

User u = oldest.orElse(DEFAULT_USER);                  // значение по умолчанию
User u2 = oldest.orElseGet(() -> loadDefault());       // ленивое значение по умолчанию
User u3 = oldest.orElseThrow();                        // Java 10+: NoSuchElementException
String name = oldest.map(User::name).orElse("—");      // преобразовать, если есть
```

| Метод | Назначение |
|---|---|
| `Optional.of(v)` / `ofNullable(v)` / `empty()` | Создать (`of(null)` бросит NPE) |
| `isPresent()` / `isEmpty()` (11) | Проверить |
| `map`, `flatMap`, `filter` | Преобразовать содержимое |
| `orElse`, `orElseGet`, `orElseThrow` | Достать значение |
| `or(() -> other)` (9) | Альтернативный `Optional` |
| `stream()` (9) | 0 или 1 элемент |

:::outdated "get() + isPresent() — устаревший стиль"
В видео значение достают через `isPresent()` + `get()`. Это работает, но по сути то же, что проверка на `null`. Современный стиль — `orElse…`, `map`, `ifPresent…`. А вместо `get()` используйте **`orElseThrow()`** (Java 10): делает то же самое, но название честно говорит, что будет исключение.
:::

:::warning "Чего не делать с Optional"
- Не используйте `Optional` для полей класса и параметров методов — он задуман как **возвращаемый тип**.
- Не возвращайте `null` вместо `Optional` — смысл теряется.
- `orElse(expensive())` вычисляет аргумент **всегда**; для дорогих значений — `orElseGet`.
- Для коллекций возвращайте пустую коллекцию, а не `Optional<List>`.
:::

## findFirst и findAny

```java
users.stream()
     .filter(u -> u.name().contains("L"))
     .findFirst()
     .ifPresentOrElse(System.out::println, () -> System.out.println("User not found"));
```

- `findFirst()` — первый элемент в порядке стрима.
- `findAny()` — любой. В последовательном стриме обычно тоже первый, в **параллельном** — первый найденный любым потоком, зато быстрее.

## Как создать стрим

```java
list.stream();  list.parallelStream();            // из коллекции
Arrays.stream(new int[]{1, 2, 3});                 // из массива → IntStream
Stream.of("a", "b", "c");                          // из значений
Stream.iterate(1, x -> x * 2).limit(10);           // бесконечный, ограничиваем
Stream.iterate(1, x -> x < 1000, x -> x * 2);      // Java 9: с условием
Stream.generate(Math::random).limit(5);
IntStream.rangeClosed(1, 100);
Files.lines(Path.of("data.txt"));                  // строки файла (закрывать!)
"text".chars();  map.entrySet().stream();
```

## Параллельные стримы

```java
List<Float> result = numbers.parallelStream()      // или .stream().parallel()
        .map(n -> heavyFormula(n))
        .toList();
```

Стрим разбивается на части, они обрабатываются в общем пуле `ForkJoinPool.commonPool()` (потоков ≈ число ядер − 1), затем результаты склеиваются. Порядок `forEach` не гарантирован (для порядка — `forEachOrdered`), но `toList()`/`collect` сохраняют порядок источника.

:::warning "parallelStream — не волшебная кнопка"
Параллельность выигрывает только при **большом** объёме и **дорогих** вычислениях на элемент, с источником, который хорошо делится (`ArrayList`, массивы, `IntStream.range`; `LinkedList` и `Stream.iterate` — плохо). Для небольших данных накладные расходы сделают код **медленнее**. Нельзя использовать с побочными эффектами (`add` в общий `ArrayList`) и для блокирующих I/O-операций — они займут общий пул всего приложения. Всегда замеряйте.
:::

## Домашнее задание

:::task video "Пользователь с буквой L — из видео"
Найдите первого пользователя, в имени которого есть буква `L`. Если найден — выведите его, иначе «User not found». Одной цепочкой. {{t j2 5:04:05}}
??? Подсказка
`filter(...).findFirst().ifPresentOrElse(...)`. Разбор: {{t j2 5:04:29}}
:::

:::task easy "Поиск без null"
Напишите `Optional<User> findByName(List<User> users, String name)` и используйте его тремя способами: `orElseThrow`, `map(User::age).orElse(-1)`, `ifPresentOrElse`.
:::

:::task medium "Цепочка Optional"
Есть `record Address(String city)`, `record User(String name, Address address)` (адрес может быть `null`). Напишите метод, возвращающий город пользователя в верхнем регистре или `"UNKNOWN"`, — без единого `if` и `!= null`, через `Optional.ofNullable(...).map(...)`.
:::

:::task hard "Когда параллельность выигрывает"
Сравните `stream()` и `parallelStream()` (лучше в JMH) на задачах: сумма 1 000 чисел; сумма квадратных корней 50 млн чисел из `IntStream.range`; то же на `LinkedList<Integer>`; проверка простоты 100 000 чисел. Сведите в таблицу и сформулируйте правило выбора.
:::
