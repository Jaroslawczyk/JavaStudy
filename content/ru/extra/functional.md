В [уроке о лямбдах](#/lessons/j2-lambdas) мы научились передавать поведение параметром. Эта статья собирает воедино идеи **функционального программирования** в Java: функциональные интерфейсы, композицию функций, функции высшего порядка, неизменяемость и чистые функции.

## Функция — тоже значение

```java
Function<Integer, Integer> square = x -> x * x;
BiFunction<Integer, Integer, Integer> add = Integer::sum;
Supplier<UUID> idGen = UUID::randomUUID;

square.apply(5);          // 25
add.apply(2, 3);          // 5
```

Функцию можно положить в переменную, коллекцию, передать в метод и вернуть из метода.

## Функциональные интерфейсы

Пакет `java.util.function` (43 интерфейса) строится из четырёх базовых форм:

| Форма | Интерфейс | Сигнатура |
|---|---|---|
| Поставщик | `Supplier<T>` | `() → T` |
| Потребитель | `Consumer<T>` | `T → void` |
| Функция | `Function<T, R>` | `T → R` |
| Предикат | `Predicate<T>` | `T → boolean` |

Плюс `Bi…`-версии с двумя аргументами, `…Operator` для одинаковых типов (`UnaryOperator<T>`, `BinaryOperator<T>`) и версии для примитивов (`IntFunction`, `ToLongFunction`, `IntPredicate`…), избегающие упаковки.

## Композиция функций

```java
Function<String, String> trim = String::trim;
Function<String, String> lower = String::toLowerCase;
Function<String, Integer> length = String::length;

Function<String, Integer> normalizedLength = trim.andThen(lower).andThen(length);
normalizedLength.apply("  Hello ");                 // 5

Predicate<String> isEmpty = String::isEmpty;
Predicate<String> valid = isEmpty.negate().and(s -> s.length() < 20);
Predicate<String> notBlank = Predicate.not(String::isBlank);       // Java 11

Comparator<User> byCityThenAge = Comparator.comparing(User::city)
        .thenComparingInt(User::age)
        .reversed();
```

`andThen(g)` — «сначала эта, потом `g`»; `compose(g)` — «сначала `g`, потом эта».

## Функции высшего порядка

Функция высшего порядка **принимает** функцию или **возвращает** функцию:

```java
// принимает функцию
static <T> List<T> retry(int times, Supplier<List<T>> action) { … }

// возвращает функцию
static Function<Double, Double> multiplier(double k) {
    return x -> x * k;
}
Function<Double, Double> withVat = multiplier(1.23);
withVat.apply(100.0);                                 // 123.0

// каррирование: функция двух аргументов → цепочка функций одного аргумента
Function<Integer, Function<Integer, Integer>> adder = a -> b -> a + b;
adder.apply(2).apply(3);                              // 5
```

`Stream.map`, `filter`, `Collectors.groupingBy`, `CompletableFuture.thenApply`, `Optional.map` — всё это функции высшего порядка.

## Чистые функции и неизменяемость

- **Чистая функция** — результат зависит только от аргументов и нет побочных эффектов (не меняет поля, не пишет в БД, не печатает). Её легко тестировать, кешировать и распараллеливать.
- **Неизменяемые данные** — `record`, `List.of`, `final`-поля. Вместо изменения создаётся новое значение.

```java
// не функционально: побочный эффект внутри стрима
List<String> result = new ArrayList<>();
names.stream().filter(n -> n.length() > 3).forEach(result::add);

// функционально
List<String> result2 = names.stream().filter(n -> n.length() > 3).toList();
```

:::note "Java — не Haskell"
Java остаётся объектно-ориентированным языком с функциональными возможностями. На практике их смешивают: объекты и классы для структуры программы, функциональный стиль — для обработки данных (стримы, `Optional`, `CompletableFuture`). Библиотека **Vavr** добавляет неизменяемые коллекции и `Try`/`Either`, если команда хочет пойти дальше.
:::

## Домашнее задание

:::task easy "Конвейер преобразований"
Соберите `List<Function<String, String>>` из шагов «обрезать пробелы», «в нижний регистр», «заменить пробелы на дефисы» и примените их по очереди через `reduce(Function.identity(), Function::andThen)`. Получите slug из заголовка статьи.
:::

:::task medium "Мемоизация"
Напишите функцию высшего порядка `static <T, R> Function<T, R> memoize(Function<T, R> f)`, возвращающую версию `f`, которая кеширует результаты в `ConcurrentHashMap`. Проверьте на медленной функции (с `Thread.sleep`) и на рекурсивном Фибоначчи.
:::

:::task hard "Мини-библиотека валидации"
Создайте `@FunctionalInterface Rule<T> { Optional<String> check(T value); }` с `default`-методами `and`, `or` и статическими фабриками. Соберите правила для регистрации пользователя (имя, возраст, e-mail, пароль) только композицией, без `if` в прикладном коде, и выведите все нарушения сразу.
:::
