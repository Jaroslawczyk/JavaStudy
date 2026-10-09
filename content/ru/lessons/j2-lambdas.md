Перед Stream API нужно освоить **лямбда-выражения** — короткую запись «функции», которую передают как параметр. Разбираем, как из анонимного класса получается лямбда, что такое **функциональный интерфейс** и почему без него лямбда невозможна. В домашнем задании пишем свой `Predicate` и универсальный фильтр.

## Таймкоды видео

- {{t j2 4:08:21}} — новый раздел: стримы; сначала — лямбды
- {{t j2 4:09:06}} — поток с анонимным `Runnable`
- {{t j2 4:09:32}} — IDEA предлагает «Replace with lambda»
- {{t j2 4:09:58}} — пошагово превращаем анонимный класс в лямбду
- {{t j2 4:11:21}} — суть: передаём не объект, а функцию
- {{t j2 4:12:17}} — функциональный интерфейс: один абстрактный метод
- {{t j2 4:12:46}} — мини-задание: `Worker` и `Director`
- {{t j2 4:13:31}} — разбор: анонимный класс и лямбда
- {{t j2 4:15:28}} — аннотация `@FunctionalInterface`
- {{t j2 4:16:02}} — лямбда с параметром и возвращаемым значением
- {{t j2 4:18:39}} — лямбда в переменной
- {{t j2 4:19:29}} — тип параметра можно не указывать
- {{t j2 4:19:49}} — фильтр чётных чисел из коллекции
- {{t j2 4:22:42}} — домашнее задание: свой `Predicate`
- {{t j2 4:23:55}} — разбор решения

## От анонимного класса к лямбде

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println(1);
    }
}).start();
```

Что из этого кода на самом деле несёт информацию? Только тело метода. Компилятор и так знает, что конструктор `Thread` принимает `Runnable`, а у `Runnable` единственный метод `run()` без параметров. Убираем всё лишнее:

```java
new Thread(() -> System.out.println(1)).start();
```

Синтаксис: `(параметры) -> { тело }`.

| Вариант | Пример |
|---|---|
| Без параметров | `() -> System.out.println("hi")` |
| Один параметр (скобки можно опустить) | `n -> n * 2` |
| Несколько | `(a, b) -> a + b` |
| С типами | `(int a, int b) -> a + b` |
| Блок | `n -> { int r = n * 2; return r; }` |

Если тело — одно выражение, фигурные скобки, `return` и `;` не пишут.

## Функциональный интерфейс

Лямбду можно подставить только туда, где ожидается **функциональный интерфейс** — интерфейс с **ровно одним абстрактным методом** (SAM, single abstract method). Методы `default`, `static` и методы `Object` не считаются.

```java
@FunctionalInterface
public interface Worker {
    String work(int count);
}

public class Director {
    public String force(Worker worker, int count) {
        return worker.work(count);
    }
}

String result = new Director().force(n -> {
    for (int i = 0; i < n; i++) System.out.println("Работаю");
    return "success";
}, 5);
```

`@FunctionalInterface` необязательна, но полезна: компилятор выдаст ошибку, если кто-то добавит второй абстрактный метод.

## Свой Predicate и универсальный фильтр

```java
@FunctionalInterface
interface Predicate {
    boolean test(int value);
}

static List<Integer> filter(List<Integer> list, Predicate predicate) {
    List<Integer> result = new ArrayList<>();
    for (int n : list) {
        if (predicate.test(n)) result.add(n);
    }
    return result;
}

filter(numbers, n -> n % 2 == 0);     // чётные
filter(numbers, n -> n > 0);          // положительные
filter(numbers, n -> n % 5 == 0);     // кратные 5
```

Один метод `filter` вместо десятка: **поведение передаётся параметром**. Это и есть идея функционального программирования.

## Что не рассказано в видео

### Стандартные функциональные интерфейсы

Свои интерфейсы писать почти не нужно — в `java.util.function` есть готовые (автор предупреждает не перепутать свой `Predicate` с этим):

| Интерфейс | Метод | Смысл |
|---|---|---|
| `Predicate<T>` | `boolean test(T)` | условие |
| `Function<T, R>` | `R apply(T)` | преобразование |
| `Consumer<T>` | `void accept(T)` | действие |
| `Supplier<T>` | `T get()` | поставщик значения |
| `UnaryOperator<T>` | `T apply(T)` | `T → T` |
| `BinaryOperator<T>` | `T apply(T, T)` | свёртка двух значений |
| `BiFunction<T, U, R>` | `R apply(T, U)` | два аргумента |

Плюс версии для примитивов без упаковки: `IntPredicate`, `IntFunction`, `ToIntFunction`, `IntBinaryOperator`…

### Ссылки на методы

Если лямбда просто вызывает существующий метод, её можно заменить **ссылкой на метод** (`::`):

| Лямбда | Ссылка |
|---|---|
| `s -> System.out.println(s)` | `System.out::println` |
| `s -> s.length()` | `String::length` |
| `(a, b) -> Integer.compare(a, b)` | `Integer::compare` |
| `() -> new ArrayList<>()` | `ArrayList::new` |

### Композиция

```java
Predicate<String> notEmpty = s -> !s.isEmpty();
Predicate<String> shortWord = s -> s.length() < 5;
Predicate<String> both = notEmpty.and(shortWord).negate();

Function<Integer, Integer> plus1 = x -> x + 1, twice = x -> x * 2;
plus1.andThen(twice).apply(3);   // 8
plus1.compose(twice).apply(3);   // 7
```

### Захват переменных

Лямбда видит локальные переменные только **effectively final** (те, что не меняются). Поля класса — без ограничений. `this` внутри лямбды — это внешний объект, а не сама лямбда (в отличие от анонимного класса).

Подробнее — в статье [Функциональное программирование](#/extra/functional).

## Домашнее задание

:::task video "Свой Predicate — из видео"
Создайте функциональный интерфейс `Predicate` с методом `boolean test(int)`. Перепишите метод `filter(List<Integer>, Predicate)` так, чтобы условие передавалось параметром. Вызовите его с анонимным классом, затем с лямбдами: чётные, положительные, кратные 5. {{t j2 4:22:42}}
??? Подсказка
Не перепутайте импорт со стандартным `java.util.function.Predicate`. Разбор: {{t j2 4:23:55}}
:::

:::task easy "Калькулятор лямбд"
Создайте `Map<String, IntBinaryOperator>` с операциями `+ - * / %` и выполните выражение `a op b`, введённое пользователем. Никаких `switch` — только поиск операции в map.
:::

:::task medium "Обобщённый фильтр и маппер"
Напишите `static <T> List<T> filter(List<T>, Predicate<T>)` и `static <T, R> List<R> map(List<T>, Function<T, R>)` на стандартных интерфейсах. Отфильтруйте строки длиннее 3 символов и превратите их в верхний регистр, используя ссылки на методы где возможно.
:::

:::task hard "Конструктор валидаторов"
Сделайте `Validator<T>` — функциональный интерфейс `ValidationResult validate(T)` с `default`-методами `and(Validator<T>)`, `or(…)` и статическими фабриками `notNull()`, `minLength(int)`, `matches(String regex)`. Соберите валидатор e-mail из кусочков и выведите все сообщения об ошибках.
:::
