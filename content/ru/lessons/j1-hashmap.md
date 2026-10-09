Теперь в системе хранятся пары «владелец → автомобиль». Для таких данных есть интерфейс **`Map`** и его самая популярная реализация — **`HashMap`**. Пишем собственную `CarHashMap`, разбираем коллизии, деревья в корзинах, сложность и узнаём, что `HashSet` на самом деле построен на `HashMap`. Это, пожалуй, самый частый вопрос на собеседованиях Java Junior.

## Таймкоды видео

- {{t j1 8:54:14}} — новые требования: пары «владелец — автомобиль»
- {{t j1 8:55:20}} — интерфейс `Map`
- {{t j1 8:55:27}} — класс `CarOwner`
- {{t j1 8:56:03}} — интерфейс `CarMap`: `put`, `get`, `keySet`, `values`, `remove`, `size`, `clear`
- {{t j1 8:57:56}} — тесты для `CarMap`
- {{t j1 9:00:55}} — как устроен `HashMap`: массив из 16 корзин
- {{t j1 9:01:32}} — `Entry` с ключом, значением и `next`
- {{t j1 9:02:13}} — одинаковый ключ — значение перезаписывается
- {{t j1 9:03:17}} — расширение при заполнении на 75 %
- {{t j1 9:03:50}} — реализация `CarHashMap`
- {{t j1 9:05:20}} — метод `put`
- {{t j1 9:09:29}} — метод `get`
- {{t j1 9:10:45}} — метод `remove`
- {{t j1 9:14:40}} — `keySet` и `values`
- {{t j1 9:16:14}} — расширение массива и коэффициент загрузки
- {{t j1 9:20:14}} — тесты упали: забыли `equals`/`hashCode` у ключа
- {{t j1 9:21:51}} — анализ и вопросы с собеседований
- {{t j1 9:25:26}} — сложность: лучший и худший случаи
- {{t j1 9:26:33}} — `TREEIFY_THRESHOLD = 8`: дерево вместо списка
- {{t j1 9:28:43}} — `put` с существующим ключом
- {{t j1 9:29:11}} — `HashSet` внутри использует `HashMap`
- {{t j1 9:30:06}} — переписываем `CarHashSet` через `HashMap`

## Интерфейс Map

```java
Map<CarOwner, Car> map = new HashMap<>();
CarOwner owner = new CarOwner(1, "Иван", "Иванов");

map.put(owner, new Car("BMW", 1));         // добавить пару
Car car = map.get(owner);                   // получить значение по ключу
map.put(owner, new Car("Audi", 2));        // тот же ключ — значение ПЕРЕЗАПИСАНО
map.remove(owner);                          // удалить пару по ключу
Set<CarOwner> owners = map.keySet();        // все ключи (уникальны → Set)
Collection<Car> cars = map.values();        // все значения (могут повторяться)
```

- **Ключи уникальны**, значения — нет.
- `Map` **не наследуется** от `Collection` и не является `Iterable`: методы `put(key, value)` и `remove(key)` не вписываются в контракт `Collection`.

## Как устроен HashMap

```text
table[16]:
 0 [null]
 …
 6 [Entry key=owner1, value=BMW] → [Entry key=owner2, value=Audi]   ← коллизия
 …
15 [null]
```

1. Внутри — массив корзин из объектов `Entry { key, value, next }`, изначально на 16 ячеек.
2. Позиция пары определяется по **хеш-коду ключа**.
3. Корзина пуста — кладём `Entry`. Занята — сравниваем ключи по `equals`: равны — **перезаписываем value**; не равны — **коллизия**, добавляем в цепочку.
4. `get` и `remove` действуют так же: хеш → корзина → поиск по цепочке через `equals`.
5. При заполнении на 75 % (**load factor 0,75**) массив удваивается и все пары перераспределяются.

Если вы поняли `HashSet` из прошлых уроков — `HashMap` устроен почти так же, только `Entry` хранит ещё и ключ.

## Реализация put (сокращённо)

```java
private boolean put(CarOwner key, Car value, Entry[] dst) {
    int position = getElementPosition(key, dst.length);
    Entry existed = dst[position];
    if (existed == null) {
        dst[position] = new Entry(key, value, null);
        return true;                                    // новая пара
    }
    while (true) {
        if (existed.key.equals(key)) {
            existed.value = value;                      // ключ уже есть — перезаписать
            return false;
        }
        if (existed.next == null) {
            existed.next = new Entry(key, value, null); // коллизия — в конец цепочки
            return true;
        }
        existed = existed.next;
    }
}
```

:::warning "Ключи обязаны иметь equals и hashCode"
В видео тесты сначала падают: у класса `CarOwner` не переопределены `equals` и `hashCode`, и одинаковые владельцы считались разными ключами. Правило из урока о `equals`/`hashCode` в действии.
:::

## Сложность HashMap

| Операция | Лучший / средний случай | Худший случай |
|---|---|---|
| `put`, `get`, `remove`, `containsKey` | **O(1)** | **O(log n)** (Java 8+), раньше O(n) |

Откуда O(log n): если в одной корзине накопилось **8** и больше элементов (`TREEIFY_THRESHOLD`), цепочка превращается в **красно-чёрное дерево**, как в `TreeSet`. Об этом знают не все интервьюеры — хороший плюс на собеседовании.

:::note "Уточнение к видео"
Превращение корзины в дерево происходит, только если ёмкость таблицы не меньше **64** (`MIN_TREEIFY_CAPACITY`); иначе `HashMap` просто увеличит таблицу. Когда элементов в корзине снова становится ≤ 6, дерево превращается обратно в список. Деревья эффективнее всего, если ключи реализуют `Comparable`.
:::

## HashSet построен на HashMap

```java
public class CarHashSet implements CarSet {
    private static final Object PRESENT = new Object();
    private final Map<Car, Object> map = new HashMap<>();

    public boolean add(Car car)      { return map.put(car, PRESENT) == null; }
    public boolean remove(Car car)   { return map.remove(car) != null; }
    public boolean contains(Car car) { return map.containsKey(car); }
    public int size()                { return map.size(); }
    public void clear()              { map.clear(); }
    public Iterator<Car> iterator()  { return map.keySet().iterator(); }
}
```

Элементы множества — это **ключи** `HashMap`, а значение у всех одно и то же — заглушка. Именно так написан `java.util.HashSet`.

## Вопросы с собеседований

:::interview "Из видео — с уточнениями"
1. **Что такое Map?** — Коллекция пар «ключ — значение» с уникальными ключами.
2. **Основные методы?** — `put`, `get`, `remove`, `containsKey`, `keySet`, `values`, `entrySet`, `size`, `clear`.
3. **Входит ли Map в иерархию Collection?** — Нет: не наследуется ни от `Collection`, ни от `Iterable`. Перебирают её представления: `keySet()`, `values()`, `entrySet()`.
4. **Почему Map вынесли отдельно?** — Её методы (`put(k, v)`, `remove(key)`) не соответствуют контракту `Collection`.
5. **Как устроен HashMap?** — Массив корзин `Entry`(ключ, значение, next); позиция по хеш-коду ключа; при совпадении корзины сравнение ключей по `equals`: равны — перезапись, нет — коллизия.
6. **Как разрешаются коллизии?** — Цепочкой (связным списком) в корзине; при 8+ элементах (и ёмкости ≥ 64) — красно-чёрным деревом.
7. **Сложность?** — O(1) в среднем, O(log n) в худшем случае.
8. **Порядок элементов гарантирован?** — Нет.
9. **`put` с существующим ключом?** — Значение перезаписывается, метод возвращает старое значение.
10. **Как устроен HashSet?** — Внутри `HashMap`: элементы — ключи, значение — общая заглушка.
:::

## Что не рассказано в видео

### Полезные методы Map (Java 8+)

```java
Map<String, Integer> counts = new HashMap<>();
counts.merge("java", 1, Integer::sum);              // счётчик в одну строку
counts.getOrDefault("kotlin", 0);                    // 0, если ключа нет
counts.putIfAbsent("go", 0);
counts.computeIfAbsent("python", k -> 42);
for (Map.Entry<String, Integer> e : counts.entrySet()) {   // правильный способ обойти Map
    System.out.println(e.getKey() + " = " + e.getValue());
}
counts.forEach((k, v) -> System.out.println(k + " = " + v));
```

### Другие детали

- `HashMap` допускает **один ключ `null`** и любые значения `null`.
- `Hashtable` — устаревший синхронизированный аналог; для многопоточности — `ConcurrentHashMap` (часть 2 курса).
- `Map.of("a", 1, "b", 2)` — неизменяемая `Map` (Java 9+).

## Домашнее задание

В видео отдельного задания нет — автор предлагает написать `CarHashMap` самостоятельно по аналогии с `CarHashSet`.

:::task easy "Своя CarHashMap"
Реализуйте `CarHashMap` по схеме из урока и проверьте её тестами из видео: 100 разных ключей → размер 100; 100 вставок с 10 разными ключами → размер 10; удаление; `keySet`/`values`; `get`.
:::

:::task medium "Счётчик слов"
С помощью `HashMap<String, Integer>` и `merge` посчитайте частоту слов в тексте. Выведите 10 самых частых, отсортировав `entrySet()` по значению по убыванию (`Map.Entry.comparingByValue(Comparator.reverseOrder())`).
:::

:::task medium "HashSet через HashMap"
Перепишите свой `CarHashSet` через `HashMap`, как в видео ({{t j1 9:30:06}}), и убедитесь, что все прежние тесты проходят.
:::

:::task hard "Плохие хеш-коды и деревья"
Создайте класс-ключ `BadKey(int id)` с `hashCode()`, всегда возвращающим 42. Добавьте 100 000 ключей в `HashMap` и измерьте время `get` — сначала когда `BadKey` **не** реализует `Comparable`, потом когда реализует. Объясните разницу, опираясь на устройство корзин-деревьев.
:::
