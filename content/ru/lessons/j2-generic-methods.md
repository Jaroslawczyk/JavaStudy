Параметр типа можно объявить не только у класса, но и у отдельного **метода**. Вместе с `? extends` и `? super` это даёт гибкие API вроде `Collections.copy(dest, src)`. В конце — большое домашнее задание с корзинами фруктов и вопросы с собеседований по дженерикам.

## Таймкоды видео

- {{t j2 44:22}} — обобщённые методы: `<U> U getFirstElement(List<U> list)`
- {{t j2 47:10}} — задача: метод `transfer` перекладывает элементы из одной коллекции в другую
- {{t j2 47:30}} — разбор: статический обобщённый метод
- {{t j2 49:43}} — `List<Number>` может хранить `Integer` и `Double`
- {{t j2 52:44}} — `List<? extends U> src, List<? super U> dst`
- {{t j2 53:31}} — домашнее задание: фрукты и корзины
- {{t j2 55:38}} — разбор: `Fruit`, `Apple`, `Orange`, `Basket<T extends Fruit>`
- {{t j2 58:22}} — преимущество ограничения: у `T` есть `getWeight()`
- {{t j2 59:07}} — сравнение корзин через `Basket<?>`
- {{t j2 1:00:05}} — статический `transfer` с `? extends U` и `? super U`
- {{t j2 1:01:43}} — вопросы с собеседований по дженерикам

## Обобщённый метод

```java
public static <U> U getFirstElement(List<U> list) {
    return list.get(0);
}

String s  = getFirstElement(List.of("a", "b"));   // U = String (выведен)
Integer i = getFirstElement(List.of(1, 2));      // U = Integer
```

- Объявление `<U>` ставится **перед возвращаемым типом**.
- Тип выводится компилятором из аргументов (type inference). Явно: `Main.<String>getFirstElement(list)`.
- Параметр метода не зависит от параметра класса и работает даже в `static`-методах.

## Перекладываем из одной коллекции в другую

Первая попытка — оба списка одного типа:

```java
static <U> void transfer(List<U> src, List<U> dst) {
    dst.addAll(src);
    src.clear();
}
List<Integer> ints = new ArrayList<>(List.of(1, 2));
List<Number> nums = new ArrayList<>();
transfer(ints, nums);        // ❌ U не может быть и Integer, и Number
```

Хотя положить `Integer` в `List<Number>` логически можно. Правильная сигнатура:

```java
static <U> void transfer(List<? extends U> src, List<? super U> dst) {
    dst.addAll(src);
    src.clear();
}
transfer(ints, nums);        // ✅ U = Integer: src — Integer, dst — «Integer или выше»
```

## PECS: Producer Extends, Consumer Super

Правило Джошуа Блоха (Effective Java):

- коллекция **отдаёт** вам элементы (producer, вы из неё читаете) → `? extends T`;
- коллекция **принимает** элементы (consumer, вы в неё пишете) → `? super T`;
- и читаете, и пишете → просто `T`.

Так объявлены методы JDK: `Collections.copy(List<? super T> dest, List<? extends T> src)`, `Collection.addAll(Collection<? extends E> c)`, `List.sort(Comparator<? super E> c)`.

## Разбор задачи с фруктами

```java
public abstract class Fruit {
    public abstract float getWeight();
}
public class Apple extends Fruit {
    @Override public float getWeight() { return 1.0f; }
}
public class Orange extends Fruit {
    @Override public float getWeight() { return 1.5f; }
}

public class Basket<T extends Fruit> {
    private final List<T> fruits = new ArrayList<>();

    public void add(T fruit) { fruits.add(fruit); }

    public float getWeight() {
        float result = 0;
        for (T fruit : fruits) {
            result += fruit.getWeight();      // доступно благодаря T extends Fruit
        }
        return result;
    }

    public int compare(Basket<?> another) {   // любая корзина
        return Float.compare(getWeight(), another.getWeight());
    }

    public static <U extends Fruit> void transfer(Basket<? extends U> src, Basket<? super U> dst) {
        dst.fruits.addAll(src.fruits);
        src.fruits.clear();
    }
}
```

Теперь яблоки можно переложить в `Basket<Apple>` или `Basket<Fruit>`, но не в `Basket<Orange>` — это проверит компилятор.

:::tip "Float.compare вместо if-цепочки"
В видео `compare` сначала пишется через `if/else` с возвратом `1/0/-1`, а затем IDEA предлагает `Float.compare(a, b)` ({{t j2 59:54}}). Используйте готовые `Integer.compare`, `Double.compare`, `Comparator.comparing…` — не вычитайте числа (`a - b` переполняется для `int` и неточен для `float`).
:::

## Вопросы с собеседований

:::interview "Что такое дженерики?"
Параметризованные типы: с их помощью объявляют классы, интерфейсы и методы, в которых тип данных задан параметром. Дают проверку типов на этапе компиляции и избавляют от ручных приведений. {{t j2 1:01:51}}
:::

:::interview "Для чего extends и super в дженериках?"
Чтобы ограничить допустимые типы. `extends` — сам класс или его наследник (верхняя граница), `super` — сам класс или его предок (нижняя граница, только у wildcard). На практике — правило PECS. {{t j2 1:02:01}}
:::

:::interview "Что такое wildcard?"
Маска `?` в угловых скобках: «какой-то неизвестный тип». Может быть ограничена `? extends T` или `? super T`. {{t j2 1:02:28}}
:::

:::interview "Метод принимает List<Number>. Можно ли передать List<Integer>?"
Нет — дженерики инвариантны. Чтобы принимать любые числа, метод должен принимать `List<? extends Number>`. {{t j2 1:02:46}}
:::

## Что не рассказано в видео

- **Обобщённые конструкторы** тоже бывают: `<S> Box(S source, Function<S, T> mapper)`.
- **Захват wildcard (wildcard capture).** В `List<?>` нельзя положить элемент, даже взятый из него же. Обходят приватным вспомогательным методом `<T> void swapHelper(List<T> list, int i, int j)` — так реализован `Collections.swap`.
- **Ограничение в дженерик-методе с несколькими границами:** `static <T extends Comparable<T> & Serializable> T pick(T a, T b)`.

## Домашнее задание

:::task video "Фрукты и корзины — из видео"
Абстрактный `Fruit` с `getWeight()`, `Apple` (1.0) и `Orange` (1.5). Класс `Basket<T extends Fruit>`: добавление фрукта, вес корзины, сравнение с **любой** корзиной (`Basket<?>`), перекладывание всех фруктов в корзину того же типа или типа-родителя (после этого исходная пустеет). Напишите тесты. {{t j2 53:31}}
??? Подсказка
`static <U extends Fruit> void transfer(Basket<? extends U> src, Basket<? super U> dst)`. Разбор: {{t j2 55:38}}
:::

:::task easy "Обобщённый swap"
Напишите `static <T> void swap(T[] array, int i, int j)` и `static <T> void swap(List<T> list, int i, int j)`. Проверьте на массиве строк и списке чисел.
:::

:::task medium "Копирование по PECS"
Без `Collections.copy` напишите `static <T> void copy(List<? super T> dst, List<? extends T> src)`. Покажите, что можно скопировать `List<Integer>` в `List<Number>` и в `List<Object>`, но не наоборот.
:::

:::task hard "Обобщённый фильтр и маппер"
Не используя Stream API, напишите `static <T> List<T> filter(Collection<? extends T> c, Predicate<? super T> p)` и `static <T, R> List<R> map(Collection<? extends T> c, Function<? super T, ? extends R> f)`. Объясните каждый wildcard. Проверьте: отфильтровать `List<Integer>` предикатом `Predicate<Number>` (`n -> n.doubleValue() > 0`).
??? Подсказка
Предикат «потребляет» элементы (`? super T`), функция «потребляет» `T` и «производит» `R` (`? extends R`). Это ровно сигнатуры из `java.util.stream.Stream`.
:::
