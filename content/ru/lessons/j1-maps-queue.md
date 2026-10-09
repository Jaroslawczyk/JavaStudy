Завершаем коллекции: три вида `Set` и `Map` с разным порядком элементов, коварный вопрос «как потерять элемент в `HashMap`» и интерфейс **`Queue`** — очереди по принципам FIFO и LIFO.

## Таймкоды видео

- {{t j1 9:33:24}} — ещё несколько коллекций, которые нужно знать
- {{t j1 9:34:06}} — `HashSet`/`TreeSet`/`LinkedHashSet` и `HashMap`/`TreeMap`/`LinkedHashMap`
- {{t j1 9:35:04}} — `Linked…`: порядок добавления через связи между элементами
- {{t j1 9:35:42}} — вопрос с собеседования: связь `HashMap`, `equals` и `hashCode`
- {{t j1 9:36:03}} — эксперимент: меняем `id` у ключа после `put`
- {{t j1 9:38:06}} — `NullPointerException`: `get` вернул `null`
- {{t j1 9:39:07}} — почему: изменился хеш-код ключа
- {{t j1 9:39:51}} — как потерять элемент в `Map`
- {{t j1 9:40:34}} — итоги: какую коллекцию выбрать
- {{t j1 9:41:12}} — иерархия коллекций и интерфейс `Queue`
- {{t j1 9:41:45}} — LIFO: стопка тарелок, стек
- {{t j1 9:42:46}} — класс `Stack` устарел
- {{t j1 9:42:53}} — FIFO: очередь в магазине
- {{t j1 9:43:24}} — методы очереди: `add`, `peek`, `poll`
- {{t j1 9:44:13}} — `LinkedList` реализует и `List`, и `Queue`
- {{t j1 9:44:29}} — интерфейс `CarQueue`, тесты и реализация

## Порядок элементов: Hash, Linked, Tree

| Коллекция | Порядок | Сложность основных операций |
|---|---|---|
| `HashSet` / `HashMap` | **Никакого** (может меняться при росте) | O(1) |
| `LinkedHashSet` / `LinkedHashMap` | **Порядок добавления** | O(1) |
| `TreeSet` / `TreeMap` | **Отсортированы** (элементы / ключи) | O(log n) |

`Linked…`-версии устроены как `Hash…`, но каждый элемент дополнительно связан с предыдущим и следующим добавленным — как в `LinkedList`. Поэтому при обходе порядок сохраняется. Для `Tree…` элементы (ключи) должны реализовывать `Comparable` либо нужен `Comparator`.

## Как потерять элемент в HashMap

```java
Map<CarOwner, Car> map = new HashMap<>();
CarOwner key = new CarOwner(1, "Иван", "Иванов");
map.put(key, new Car("Brand1", 1));

key.setId(8);                     // меняем поле, от которого зависит hashCode!

Car car = map.get(key);           // null — HashMap ищет в другой корзине
System.out.println(car.getBrand()); // NullPointerException
```

Объект-ключ в `Map` есть (`keySet()` его покажет, уже с `id = 8`), но найти его невозможно: при `put` корзина была выбрана по старому хеш-коду, а `get` вычисляет новый.

:::interview "Вопрос с собеседования"
**При какой ситуации в HashMap может потеряться элемент?** — Если ключ — изменяемый объект, и после `put` у него изменили поле, участвующее в `hashCode`. Вывод: ключи должны быть **неизменяемыми** — `String`, `Integer`, `record`, классы с `final`-полями.
:::

## Очереди: FIFO и LIFO

- **LIFO** (Last In, First Out) — «последним пришёл — первым вышел»: стопка тарелок. Структура — **стек**.
- **FIFO** (First In, First Out) — «первым пришёл — первым обслужен»: очередь в кассу. Структура — **очередь**.

```java
Queue<String> queue = new ArrayDeque<>();
queue.offer("Анна");          // в конец
queue.offer("Борис");
queue.peek();                 // "Анна" — посмотреть первого, не удаляя
queue.poll();                 // "Анна" — забрать первого

Deque<String> stack = new ArrayDeque<>();
stack.push("тарелка 1");
stack.push("тарелка 2");
stack.pop();                  // "тарелка 2" — последняя пришедшая
```

### Методы Queue: две версии

| Действие | Бросает исключение | Возвращает специальное значение |
|---|---|---|
| Добавить в конец | `add(e)` | `offer(e)` → `false` |
| Взять и удалить первый | `remove()` | `poll()` → `null` |
| Посмотреть первый | `element()` | `peek()` → `null` |

В видео реализуется `CarQueue` с методами `add`, `peek`, `poll` поверх `CarLinkedList`: удаление из начала связного списка — O(1), а из начала `ArrayList` — O(n). Поэтому в JDK `LinkedList` реализует и `List`, и `Queue` (точнее, `Deque`).

:::outdated "Stack устарел — используйте ArrayDeque"
Автор упоминает, что класс `Stack` устарел. Он наследуется от синхронизированного `Vector` и медленный. Для стека и очереди сегодня используют **`ArrayDeque`** — он быстрее и `Stack`, и `LinkedList` (кольцевой буфер на массиве, без узлов). `LinkedList` как очередь нужен, только если требуются `null`-элементы или методы `List`.
:::

## Что не рассказано в видео

- **`PriorityQueue`** — очередь с приоритетом (двоичная куча): `poll()` всегда отдаёт наименьший элемент по `Comparator`. `offer`/`poll` — O(log n).
- **`BlockingQueue`** (`ArrayBlockingQueue`, `LinkedBlockingQueue`) — потокобезопасные очереди для схемы «производитель — потребитель» (часть 2 курса).
- **`LinkedHashMap` как LRU-кэш**: конструктор с `accessOrder = true` и переопределённый `removeEldestEntry` — классическая задача с собеседований.
- **Java 21 — Sequenced Collections**: у `LinkedHashSet`, `LinkedHashMap`, `List`, `Deque`, `TreeSet` появились общие методы `getFirst()`, `getLast()`, `reversed()`, `putFirst()`…

## Домашнее задание

В видео заданий нет — проверим понимание на практике.

:::task easy "Три Set — три порядка"
Добавьте одни и те же 10 слов в `HashSet`, `LinkedHashSet` и `TreeSet` и выведите все три. Объясните разницу в порядке.
:::

:::task medium "Потерянный ключ"
Воспроизведите эксперимент из видео: изменяемый ключ, `put`, изменение поля, `get`. Затем сделайте `CarOwner` неизменяемым (`final`-поля, без сеттеров, или `record`) и покажите, что проблема исчезла.
:::

:::task medium "Проверка скобок"
С помощью `ArrayDeque` как стека напишите метод `boolean isBalanced(String s)`, проверяющий, что скобки `()[]{}` в строке расставлены правильно: `"{[()]}"` → `true`, `"([)]"` → `false`. Классическая задача с собеседований.
:::

:::task hard "LRU-кэш"
Реализуйте класс `LruCache<K, V>` вместимостью `n` на основе `LinkedHashMap` с `accessOrder = true`: при добавлении сверх вместимости удаляется элемент, к которому дольше всего не обращались. Покройте тестами. Затем реализуйте то же самое без `LinkedHashMap` — на `HashMap` + собственном двусвязном списке (как в уроке о `LinkedList`).
??? Подсказка
```java
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    LruCache(int capacity) {
        super(16, 0.75f, true);    // accessOrder = true
        this.capacity = capacity;
    }
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```
:::
