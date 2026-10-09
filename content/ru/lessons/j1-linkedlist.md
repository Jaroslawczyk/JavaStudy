У `ArrayList` дорогие вставка и удаление в начале и середине. **`LinkedList`** решает задачу иначе: никакого массива — только цепочка узлов, где каждый знает соседей. Пишем свою реализацию `CarLinkedList` и разбираем знаменитый вопрос «ArrayList или LinkedList?» — с поправками, которые важны на собеседовании в 2026 году.

## Таймкоды видео

- {{t j1 6:50:27}} — проблемы `ArrayList` → связанный список
- {{t j1 6:51:27}} — популярный вопрос: отличие `ArrayList` от `LinkedList`
- {{t j1 6:51:34}} — класс `Node`: `previous`, `value`, `next`; поля `first`, `last`, `size`
- {{t j1 6:52:04}} — добавление первого и следующих элементов
- {{t j1 6:53:02}} — получение элемента: идём по `next`
- {{t j1 6:53:24}} — вставка в середину: переписываем ссылки
- {{t j1 6:53:58}} — удаление: на узел больше никто не ссылается
- {{t j1 6:54:23}} — `CarLinkedList implements CarList`
- {{t j1 6:55:04}} — вложенный `private static class Node`
- {{t j1 6:56:28}} — метод `add`
- {{t j1 6:59:10}} — `add(car, index)` и вспомогательный `getNode(index)`
- {{t j1 7:03:20}} — особый случай: вставка в начало
- {{t j1 7:05:38}} — `removeAt` и крайние случаи (первый/последний)
- {{t j1 7:09:51}} — `remove(car)`, `get`, `clear`
- {{t j1 7:12:28}} — те же тесты проходят для новой реализации
- {{t j1 7:13:19}} — сравнение `ArrayList` и `LinkedList`
- {{t j1 7:15:54}} — вопросы с собеседований

## Как устроен LinkedList

```text
first                                              last
  ↓                                                  ↓
[null | 5 | ●]  ⇄  [● | 7 | ●]  ⇄  [● | 100 | ●]  ⇄  [● | 3 | null]
 prev value next
```

Каждый **узел** (`Node`) хранит значение и две ссылки — на предыдущий и следующий узел (двусвязный список). Коллекция хранит ссылки на первый и последний узлы и размер.

```java
public class CarLinkedList implements CarList {
    private Node first;
    private Node last;
    private int size = 0;

    private static class Node {          // static: узлу не нужен доступ к полям списка
        private Node previous;
        private Car value;
        private Node next;

        Node(Node previous, Car value, Node next) {
            this.previous = previous;
            this.value = value;
            this.next = next;
        }
    }

    @Override
    public void add(Car car) {
        if (size == 0) {
            first = new Node(null, car, null);
            last = first;
        } else {
            Node secondLast = last;
            last = new Node(secondLast, car, null);
            secondLast.next = last;
        }
        size++;
    }

    @Override
    public void add(Car car, int index) {
        if (index < 0 || index > size) throw new IndexOutOfBoundsException();
        if (index == size) {
            add(car);
            return;
        }
        Node nodeNext = getNode(index);
        Node nodePrevious = nodeNext.previous;
        Node newNode = new Node(nodePrevious, car, nodeNext);
        nodeNext.previous = newNode;
        if (nodePrevious != null) {
            nodePrevious.next = newNode;
        } else {
            first = newNode;                 // вставка в начало
        }
        size++;
    }

    @Override
    public boolean removeAt(int index) {
        Node node = getNode(index);
        Node nodeNext = node.next;
        Node nodePrevious = node.previous;
        if (nodeNext != null) nodeNext.previous = nodePrevious; else last = nodePrevious;
        if (nodePrevious != null) nodePrevious.next = nodeNext; else first = nodeNext;
        size--;
        return true;
    }

    @Override
    public Car get(int index) {
        return getNode(index).value;
    }

    private Node getNode(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        Node node = first;
        for (int i = 0; i < index; i++) {
            node = node.next;                // идём по цепочке — это O(n)!
        }
        return node;
    }

    // remove(car), size(), clear() — см. видео
}
```

Удалённый узел становится недостижимым — его соберёт сборщик мусора, память освобождается сразу.

## ArrayList против LinkedList

Вот как сравнение звучит в видео — и как его нужно уточнить:

| Операция | `ArrayList` | `LinkedList` (по видео) | `LinkedList` (точнее) |
|---|---|---|---|
| `get(index)` | O(1) | O(n) | O(n) |
| `add(e)` в конец | O(1)* | O(1) | O(1) |
| `add(index, e)` в начало/середину | O(n) | O(1) | **O(n)** поиск узла + O(1) перевязка; в начало/конец — O(1) |
| `remove(index)` | O(n) | O(1) | **O(n)** поиск узла + O(1) перевязка |
| `remove(e)` / `contains(e)` | O(n) | O(n) | O(n) |
| Память на элемент | ~4–8 байт (ссылка) | — | ~24–40 байт (узел + 3 ссылки) |

\* амортизированно.

:::warning "Главная поправка к видео"
В видео сказано, что вставка в середину и удаление по индексу у `LinkedList` — O(1). Но чтобы вставить на позицию `index`, сначала надо **дойти** до неё — посмотрите на свой же `getNode`: это цикл, O(n). O(1) — только **перевязка ссылок**, когда узел уже найден: при работе с началом/концом списка или при обходе через `ListIterator`. Если на собеседовании ответить «вставка в середину — O(1)» без оговорки, хороший интервьюер сразу спросит: «А как вы найдёте середину?»
:::

### Что выбирать на практике

- **Почти всегда — `ArrayList`.** Массив лежит в памяти подряд и отлично работает с кэшем процессора; `System.arraycopy` сдвигает тысячи элементов очень быстро. На реальных замерах `ArrayList` часто обгоняет `LinkedList` даже на вставках в середину.
- Нужна **очередь или стек** — `ArrayDeque` (быстрее `LinkedList` и устаревшего `Stack`).
- `LinkedList` уместен редко: частые вставки/удаления при обходе итератором, когда ссылка на позицию уже есть. Даже его автор, Джошуа Блох, признавался, что сам им не пользуется.

## Вопросы с собеседований

:::interview "Из видео — с уточнёнными ответами"
1. **Чем отличаются ArrayList и LinkedList?** — В основе `ArrayList` — динамический массив, в основе `LinkedList` — двусвязный список узлов. `LinkedList` также реализует `Deque` (очередь с двух концов).
2. **Сложность получения по индексу?** — `ArrayList` O(1), `LinkedList` O(n).
3. **Сложность удаления по индексу?** — `ArrayList` O(n) из-за сдвига; `LinkedList` O(n) из-за поиска узла (сама перевязка — O(1)). Удаление первого/последнего у `LinkedList` — O(1).
4. **Когда LinkedList лучше ArrayList?** — Когда много вставок/удалений в начале списка или во время обхода итератором. В остальных случаях — `ArrayList`; для очередей — `ArrayDeque`.
5. **Какие проблемы у ArrayList при массовом добавлении и удалении?** — Массив не сжимается сам: ёмкость остаётся большой (`trimToSize()` решает), а вставки/удаления в начале — O(n).
:::

## Домашнее задание

В видео отдельного задания нет — автор советует написать `LinkedList` самостоятельно, даже если это займёт несколько дней.

:::task easy "Написать заново"
Без подсказок реализуйте `CarLinkedList` (все методы `CarList`) и прогоните на нём тесты из прошлого урока, заменив только строку создания коллекции в `setUp`.
:::

:::task medium "getNode с ближайшего конца"
Оптимизируйте `getNode`: если `index < size / 2`, идите от `first` вперёд, иначе — от `last` назад. Так в среднем шагов вдвое меньше (именно так сделано в JDK). Добавьте тест, проверяющий `get` у последних элементов.
:::

:::task medium "addFirst, removeFirst, removeLast"
Добавьте методы, работающие за O(1): `addFirst`, `removeFirst`, `removeLast`. С их помощью реализуйте стек (LIFO) и очередь (FIFO) поверх вашего списка.
:::

:::task hard "Разворот списка и честный бенчмарк"
Напишите метод `reverse()`, который разворачивает двусвязный список **на месте** за O(n) без создания новых узлов. Затем сравните `ArrayList` и `LinkedList` из JDK на 100 000 вставок в середину: (а) через `add(size/2, e)`, (б) через `ListIterator`, стоящий на середине. Объясните результаты.
??? Подсказка
В (а) `LinkedList` каждый раз ищет середину — O(n) на вставку, и может проиграть `ArrayList`. В (б) итератор уже стоит на месте, и вставка действительно O(1).
:::
