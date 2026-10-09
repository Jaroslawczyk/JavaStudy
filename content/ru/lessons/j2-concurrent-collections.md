Обычные коллекции (`ArrayList`, `HashMap`) **не потокобезопасны**: если два потока одновременно добавляют элементы, часть данных теряется. Разбираем три решения: ручная синхронизация, обёртки `Collections.synchronized…` и специальные коллекции из `java.util.concurrent`.

## Таймкоды видео

- {{t j2 3:23:33}} — коллекции и многопоточность
- {{t j2 3:24:02}} — два потока добавляют по 100 элементов в `ArrayList`
- {{t j2 3:26:16}} — в списке 131 элемент вместо 200
- {{t j2 3:26:24}} — решение 1: `synchronized`-блок вокруг `add`
- {{t j2 3:27:16}} — решение 2: `Collections.synchronizedList(…)`
- {{t j2 3:28:41}} — минус: один монитор на всю коллекцию
- {{t j2 3:29:28}} — решение 3: `CopyOnWriteArrayList`, `CopyOnWriteArraySet`
- {{t j2 3:30:08}} — `ConcurrentHashMap`
- {{t j2 3:30:46}} — итог урока

## Проблема

```java
List<Integer> numbers = new ArrayList<>();
Runnable add100 = () -> { for (int i = 0; i < 100; i++) { sleep(1); numbers.add(i); } };
// два потока → size() = 131, иногда ArrayIndexOutOfBoundsException
```

`add` внутри `ArrayList` — это «записать в `elementData[size]`, увеличить `size`»: два потока пишут в одну ячейку, увеличение теряется, при расширении массива возможно исключение.

## Решение 1: синхронизация вручную

```java
synchronized (monitor) { numbers.add(i); }
```

Работает, но о мониторе нужно помнить при **каждом** обращении — включая чтение и обход.

## Решение 2: синхронизированные обёртки

```java
List<Integer> numbers = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> map = Collections.synchronizedMap(new HashMap<>());
Set<String> set = Collections.synchronizedSet(new HashSet<>());
```

Каждый метод обёртки — `synchronized` по одному монитору. Просто, но медленно: даже два читателя ждут друг друга.

:::warning "Обход синхронизированной коллекции"
Итерация — это много вызовов, и обёртка их не защищает. Обход нужно синхронизировать вручную по самой коллекции, иначе возможен `ConcurrentModificationException`:

```java
synchronized (numbers) {
    for (Integer n : numbers) System.out.println(n);
}
```
:::

## Решение 3: коллекции java.util.concurrent

| Интерфейс | Потокобезопасная реализация | Когда |
|---|---|---|
| `List` | `CopyOnWriteArrayList` | Чтений много, записей мало (списки слушателей, конфиги) |
| `Set` | `CopyOnWriteArraySet`, `ConcurrentHashMap.newKeySet()` | То же / общий случай |
| `Map` | `ConcurrentHashMap` | Главный выбор для общих map |
| `SortedMap` | `ConcurrentSkipListMap` | Нужна сортировка ключей |
| `Queue` | `ConcurrentLinkedQueue`, `BlockingQueue` | Очереди задач |

### Copy-on-write

При каждой записи создаётся **копия** внутреннего массива, новые данные пишутся в копию, затем ссылка подменяется. Читатели никогда не блокируются и обходят «снимок» — `ConcurrentModificationException` не бывает. Цена — запись O(n): на часто изменяемых коллекциях это очень медленно.

### ConcurrentHashMap

Разные потоки могут одновременно работать с разными корзинами таблицы — блокировки не глобальные. Чтение вообще не блокируется.

:::outdated "Как устроен ConcurrentHashMap сейчас"
Часто рассказывают про «сегменты» (16 частей таблицы со своими блокировками) — так было **до Java 8**. С Java 8 `ConcurrentHashMap` использует CAS для пустых корзин и `synchronized` на первом узле корзины при коллизии; длинные цепочки, как в `HashMap`, превращаются в деревья. На собеседовании полезно знать обе версии.
:::

:::tip "Атомарные операции ConcurrentHashMap"
Вместо «проверить-затем-положить» (гонка!) используйте атомарные методы:

```java
map.putIfAbsent("a", 1);
map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
map.merge(word, 1, Integer::sum);          // счётчик слов
```
Ещё одно отличие от `HashMap`: ключи и значения не могут быть `null`.
:::

:::interview "Вопросы с собеседования"
**Что вы знаете о синхронизированных коллекциях?** — Обычные коллекции не потокобезопасны. `Collections.synchronizedList/Set/Map` оборачивают их, синхронизируя каждый метод по одному монитору (медленно, обход надо синхронизировать вручную). Пакет `java.util.concurrent` даёт оптимизированные: `ConcurrentHashMap`, `CopyOnWriteArrayList/Set`, `ConcurrentLinkedQueue`, `BlockingQueue`.

**`Hashtable` vs `ConcurrentHashMap`?** — `Hashtable` — устаревший класс, все методы `synchronized` по одному монитору. `ConcurrentHashMap` блокирует только отдельные корзины, чтения без блокировок.
:::

## Что не рассказано в видео

- **Неизменяемые коллекции** (`List.of`, `Map.copyOf`, `Collections.unmodifiableList`) безопасны для чтения из любых потоков без всякой синхронизации — если их не меняет исходный владелец.
- **`Vector` и `Hashtable`** — наследие Java 1.0, все методы синхронизированы. В новом коде не используются.
- **Слабо согласованные итераторы** concurrent-коллекций не бросают `ConcurrentModificationException`, но могут не увидеть изменения, сделанные во время обхода.

## Домашнее задание

В видео задания нет — вот свои.

:::task easy "Потерянные элементы"
Повторите эксперимент из видео с `ArrayList`, `Collections.synchronizedList` и `CopyOnWriteArrayList`: 4 потока по 10 000 добавлений. Сравните размер и время.
:::

:::task medium "Частотный словарь"
Прочитайте большой текст, разбейте на 4 части и посчитайте частоту слов в 4 потоках в один общий `ConcurrentHashMap<String, Integer>` через `merge`. Сравните результат с однопоточной версией — он должен совпасть. Затем попробуйте `get` + `put` вместо `merge` и найдите расхождения.
:::

:::task medium "CopyOnWrite и итератор"
Обходите `CopyOnWriteArrayList` в одном потоке, одновременно добавляя элементы из другого. Покажите, что исключения нет и итератор видит «снимок». Повторите с `ArrayList` — получите `ConcurrentModificationException`.
:::

:::task hard "Кеш с вычислением один раз"
Напишите `Memoizer<K, V>` с методом `V get(K key)`, который вычисляет значение дорогой функцией **ровно один раз** на ключ, даже если 100 потоков одновременно запросили один и тот же ключ. Используйте `ConcurrentHashMap.computeIfAbsent`. Подумайте, почему внутри функции нельзя обращаться к той же map.
:::
