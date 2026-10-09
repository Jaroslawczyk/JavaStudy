Как перебрать `Set`, если у него нет `get(index)`? Через **for-each** — а он работает с любым объектом, реализующим **`Iterable`**. Реализуем итераторы для всех трёх наших коллекций и проходим первое мини-собеседование по коллекциям.

## Таймкоды видео

- {{t j1 8:17:46}} — как вывести все элементы `Set` без `get`
- {{t j1 8:18:12}} — for-each по стандартным коллекциям работает
- {{t j1 8:19:16}} — по нашему `CarList` — ошибка компиляции
- {{t j1 8:19:38}} — for-each использует интерфейс `Iterable`
- {{t j1 8:20:25}} — `Collection` наследуется от `Iterable` — вершина иерархии
- {{t j1 8:20:43}} — `CarCollection extends Iterable<Car>`
- {{t j1 8:21:33}} — тест на for-each
- {{t j1 8:22:41}} — метод `iterator()` и объект `Iterator`
- {{t j1 8:23:02}} — методы `hasNext()` и `next()`
- {{t j1 8:23:18}} — во что разворачивается for-each
- {{t j1 8:24:16}} — итератор для `CarArrayList`
- {{t j1 8:25:11}} — `index++` и `++index`
- {{t j1 8:26:29}} — итератор для `CarLinkedList`
- {{t j1 8:28:07}} — итератор для `CarHashSet` — посложнее
- {{t j1 8:32:04}} — `NullPointerException` и исправление — тесты спасают
- {{t j1 8:34:24}} — мини-собеседование по пройденному

## for-each под капотом

```java
for (Car car : cars) {
    System.out.println(car);
}
```

компилятор превращает в:

```java
Iterator<Car> iterator = cars.iterator();
while (iterator.hasNext()) {
    Car car = iterator.next();
    System.out.println(car);
}
```

Поэтому for-each работает с массивами и с любым классом, реализующим `Iterable<T>` — интерфейс с одним методом `Iterator<T> iterator()`.

```text
Iterable
 └─ Collection
     ├─ List  → ArrayList, LinkedList
     └─ Set   → HashSet, TreeSet, LinkedHashSet
```

## Итераторы наших коллекций

```java
// CarArrayList
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private int index = 0;

        @Override
        public boolean hasNext() {
            return index < size;
        }

        @Override
        public Car next() {
            return array[index++];     // сначала вернуть array[index], потом увеличить
        }
    };
}
```

```java
// CarLinkedList
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private Node node = first;

        @Override
        public boolean hasNext() {
            return node != null;
        }

        @Override
        public Car next() {
            Car car = node.value;
            node = node.next;
            return car;
        }
    };
}
```

```java
// CarHashSet: ищем непустую корзину, затем идём по её цепочке
@Override
public Iterator<Car> iterator() {
    return new Iterator<>() {
        private int index = 0;         // сколько элементов уже вернули
        private int arrayIndex = 0;    // текущая корзина
        private Entry entry;           // текущий элемент цепочки

        @Override
        public boolean hasNext() {
            return index < size;
        }

        @Override
        public Car next() {
            while (array[arrayIndex] == null) {
                arrayIndex++;
            }
            if (entry == null) {
                entry = array[arrayIndex];
            }
            Car result = entry.value;
            entry = entry.next;
            if (entry == null) {
                arrayIndex++;
            }
            index++;
            return result;
        }
    };
}
```

:::tip "Тесты ловят ошибки"
В видео автор по ошибке написал условие `!= null` вместо `== null` в цикле поиска корзины — тест сразу упал с `NullPointerException`. Именно для этого пишутся тесты до реализации.
:::

## Что не рассказано в видео

### Контракт Iterator

- `next()` при отсутствии элементов должен бросать `NoSuchElementException` — наши учебные версии этого не делают; добавьте `if (!hasNext()) throw new NoSuchElementException();`.
- Есть необязательный метод `remove()` — удалить последний возвращённый элемент **во время** обхода. Это единственный безопасный способ удаления при переборе:

```java
Iterator<Car> it = cars.iterator();
while (it.hasNext()) {
    if (it.next().getNumber() < 10) {
        it.remove();          // безопасно
    }
}
```

### Fail-fast и ConcurrentModificationException

Итераторы JDK-коллекций **fail-fast**: если коллекцию изменили не через итератор во время обхода, следующий `next()` бросит `ConcurrentModificationException`. Внутри коллекция хранит счётчик изменений `modCount`, а итератор сверяет его со своим.

### ListIterator

У списков есть `listIterator()` — ходит в обе стороны (`previous()`), умеет `set` и `add` в текущей позиции. Именно с ним вставка в `LinkedList` действительно O(1) (урок о `LinkedList`).

## Мини-собеседование

:::interview "Вопросы из видео — с уточнёнными ответами"
1. **Иерархия Collection Framework?** — `Iterable` → `Collection` → `List` (`ArrayList`, `LinkedList`), `Set` (`HashSet`, `LinkedHashSet`, `TreeSet`), `Queue`. Отдельно — `Map`.
2. **Чем отличаются Set и List?** — Set не хранит дубликатов и не имеет индексных методов.
3. **ArrayList vs LinkedList?** — Массив против двусвязного списка узлов; детали и поправки — в уроке о `LinkedList`.
4. **Сложность вставки без индекса?** — `ArrayList`, `LinkedList`, `HashSet` — O(1) (у `ArrayList` амортизированно).
5. **Вставка с индексом?** — `ArrayList` O(n); `LinkedList` O(n) с учётом поиска узла (O(1) в начало/конец); в `Set` невозможна.
6. **`contains`?** — `ArrayList` и `LinkedList` O(n); `HashSet` O(1) в среднем.
7. **Когда что использовать?** — `ArrayList` по умолчанию; `HashSet` — когда нужны уникальные элементы и порядок неважен; `LinkedList` — редко (см. урок о нём).
8. **Как устроена память? Удалит ли GC объекты, ссылающиеся друг на друга?** — Стек/куча; да, если они недостижимы от корней.
9. **Правила equals/hashCode? Зачем hashCode?** — См. урок о `equals`/`hashCode`; хеш-код определяет корзину в хеш-таблице.
10. **Что будет с HashSet, если переопределить только equals?** — Дубликаты, `contains`/`remove` не находят существующие элементы.
:::

## Домашнее задание

:::task video "Итераторы для своих коллекций — из видео"
Реализуйте `Iterable<Car>` во всех трёх коллекциях (`CarArrayList`, `CarLinkedList`, `CarHashSet`) и проверьте тестом, что for-each проходит ровно по 100 элементам. Для `CarLinkedList` и `CarHashSet` автор предлагает сначала попробовать самостоятельно. {{t j1 8:26:29}}
:::

:::task easy "NoSuchElementException"
Добавьте во все три итератора проверку `hasNext()` в `next()` с выбросом `NoSuchElementException` и тест на это поведение.
:::

:::task medium "Iterator.remove()"
Реализуйте метод `remove()` в итераторе `CarArrayList`: он удаляет последний элемент, возвращённый `next()`, и корректно сдвигает внутренний индекс. Повторный `remove()` без `next()` должен бросать `IllegalStateException`.
:::

:::task hard "Fail-fast"
Добавьте в `CarArrayList` счётчик `modCount`, увеличивающийся при каждом структурном изменении (`add`, `remove`, `clear`). Итератор запоминает его при создании и в `next()` бросает `ConcurrentModificationException`, если значения разошлись. Напишите тест: удаление из списка внутри for-each должно падать, а через `iterator.remove()` — работать.
:::
