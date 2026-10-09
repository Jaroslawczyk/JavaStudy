**Stream API** (Java 8) — способ обрабатывать коллекции «конвейером»: отфильтровать, преобразовать, собрать результат — без промежуточных списков и ручных циклов. Разбираем три базовые операции `filter`, `map`, `collect`, разницу между промежуточными и терминальными операциями и ссылки на методы.

## Таймкоды видео

- {{t j2 4:26:50}} — исходная задача: фильтр и преобразование вручную
- {{t j2 4:27:21}} — метод `map`: числа → строки `number: N`
- {{t j2 4:29:26}} — минусы: три коллекции, привязка к типам
- {{t j2 4:29:42}} — стрим — «труба», по которой летят данные
- {{t j2 4:30:47}} — `stream()` и `filter(Predicate)`
- {{t j2 4:33:04}} — `map(Function)`: меняем тип элементов
- {{t j2 4:34:48}} — мини-задание: строки, оканчивающиеся на 0, + «!»
- {{t j2 4:36:00}} — без терминальной операции ничего не выполняется
- {{t j2 4:36:45}} — терминальная операция `collect(Collectors.toList())`
- {{t j2 4:38:37}} — промежуточные и терминальные операции
- {{t j2 4:39:46}} — домашнее задание: корни чисел
- {{t j2 4:40:37}} — разбор решения
- {{t j2 4:42:36}} — ссылки на методы: `Math::sqrt`

## Было и стало

```java
// Было: три коллекции и два метода
List<Integer> positive = filter(numbers);
List<String> mapped = map(positive);

// Стало: один конвейер
List<String> result = numbers.stream()
        .filter(n -> n % 2 == 0)
        .map(n -> "number: " + n)
        .filter(s -> s.endsWith("0"))
        .map(s -> s + "!")
        .collect(Collectors.toList());
```

Стрим — **не коллекция** и не хранит данных. Это описание вычисления над источником (коллекцией, массивом, файлом, генератором). Исходная коллекция не меняется.

## Промежуточные и терминальные операции

- **Промежуточные** (`filter`, `map`, `sorted`, `limit`, `distinct`, `peek`…) возвращают новый `Stream` и **ленивы**: только запоминают шаг.
- **Терминальные** (`collect`, `forEach`, `count`, `reduce`, `min`/`max`, `anyMatch`, `findFirst`, `toList`…) возвращают не стрим и **запускают** весь конвейер.

```java
numbers.stream()
       .filter(n -> { System.out.println("filter " + n); return n > 0; });
// ничего не напечатано: нет терминальной операции
```

Правило из видео: метод возвращает `Stream` — промежуточный, иначе — терминальный.

Элементы проходят конвейер **по одному**, а не этапами: первый элемент проходит `filter → map → …` целиком, потом второй. Поэтому `limit(3)` после `filter` останавливает обработку, как только найдено три подходящих элемента.

:::warning "Стрим одноразовый"
После терминальной операции стрим использовать нельзя: повторный вызов бросит `IllegalStateException: stream has already been operated upon or closed`. Нужно снова — вызовите `list.stream()` ещё раз.
:::

## map меняет тип

```java
Stream<Integer> ints = Stream.of(4, 9, 16);
Stream<Double> roots = ints.map(Math::sqrt);          // Integer → Double
Stream<String> text = roots.map(d -> "sqrt: " + d);   // Double → String
```

## Ссылки на методы

Если лямбда лишь пробрасывает параметр в другой метод, используйте `::`:

```java
.map(n -> Math.sqrt(n))        →   .map(Math::sqrt)
.map(d -> Main.toText(d))      →   .map(Main::toText)
.forEach(s -> System.out.println(s))  →  .forEach(System.out::println)
```

Какой вариант выбрать — дело вкуса команды; ошибкой не является ни один.

:::outdated "Collectors.toList() → Stream.toList() (Java 16+)"
В видео — `.collect(Collectors.toList())`. С Java 16 короче: **`.toList()`**. Важное отличие: `Stream.toList()` возвращает **неизменяемый** список (попытка `add` бросит `UnsupportedOperationException`), а `Collectors.toList()` — изменяемый `ArrayList` (без гарантии в спецификации). Если список нужно менять — `Collectors.toCollection(ArrayList::new)`.
:::

## Что не рассказано в видео

### Примитивные стримы

`Stream<Integer>` упаковывает каждое число. Для чисел есть `IntStream`, `LongStream`, `DoubleStream` с удобными методами:

```java
int sum = numbers.stream().mapToInt(Integer::intValue).sum();
IntStream.rangeClosed(1, 100).filter(n -> n % 7 == 0).average();   // OptionalDouble
IntStream.range(0, 5).boxed().toList();                            // обратно в объекты
```

### Полезные коллекторы

```java
Collectors.joining(", ", "[", "]")            // строки в одну
Collectors.toSet(), Collectors.toMap(k, v)
Collectors.groupingBy(User::city)             // Map<City, List<User>>
Collectors.groupingBy(User::city, Collectors.counting())
Collectors.partitioningBy(u -> u.age() >= 18) // Map<Boolean, List<User>>
```

### Побочные эффекты

Лямбды в стримах должны быть **чистыми**: не менять внешние коллекции и переменные. `list.stream().forEach(x -> other.add(x))` — плохой стиль (и ошибка в параллельном стриме); используйте `collect`/`toList`.

## Домашнее задание

:::task video "Корни чисел — из видео"
Создайте список из 1000 случайных `int` от 100 до 200. Оставьте только чётные и делящиеся на 5, превратите каждое в квадратный корень (`double`), затем в строку `"sqrt: …"`, соберите в список и выведите. {{t j2 4:39:46}}
??? Подсказка
`filter(n -> n % 2 == 0 && n % 5 == 0).map(Math::sqrt).map(d -> "sqrt: " + d).toList()`. Разбор: {{t j2 4:40:37}}
:::

:::task easy "Длинные слова"
Из списка слов получите список слов длиннее 4 букв в верхнем регистре без повторов (`distinct`), отсортированный по алфавиту. Одним конвейером.
:::

:::task medium "Группировка"
Есть `record Employee(String name, String department, int salary)`. Получите: `Map<String, List<String>>` имён по отделам, среднюю зарплату по отделам и самого высокооплачиваемого сотрудника в каждом отделе (`groupingBy` + `maxBy`).
:::

:::task hard "Ленивость своими глазами"
Сделайте стрим из 1–10 с `peek(x -> log("source " + x))`, `filter` (с логом), `map` (с логом) и `limit(2)`. Предскажите вывод до запуска, затем проверьте. Объясните, почему обработаны не все элементы и почему порядок логов «вертикальный», а не по этапам. Что изменится, если добавить `sorted()` перед `limit`?
:::
