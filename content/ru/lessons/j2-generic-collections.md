Применяем дженерики на практике: делаем **обобщёнными** собственные коллекции из части 1 (`CarList`, `CarSet`, `CarMap`…). По дороге упираемся в ограничения дженериков — нельзя создать `new T[]`, нельзя использовать `T` в статическом вложенном классе — и учимся их обходить.

## Таймкоды видео

- {{t j2 16:46}} — делаем свои коллекции обобщёнными
- {{t j2 18:56}} — `CarCollection<T> extends Iterable<T>`, `CarList<T>`
- {{t j2 20:24}} — нельзя создать массив типа `T`: используем `Object[]` и приведение
- {{t j2 24:12}} — статический вложенный `Node` не видит `T` → убираем `static`
- {{t j2 25:41}} — `CarHashMap<K, V>`: `Entry` и массив `Object[]`
- {{t j2 29:38}} — итог: три ограничения дженериков

## Из «машинных» коллекций — в универсальные

В части 1 мы писали `CarArrayList`, `CarLinkedList`, `CarHashSet`, `CarHashMap` — они умели хранить только `Car`. Заменяем `Car` на параметр — и получаем коллекции для любых типов:

```java
public interface CarCollection<T> extends Iterable<T> {
    boolean add(T item);
    boolean remove(T item);
    boolean contains(T item);
    int size();
    void clear();
}

public interface CarList<T> extends CarCollection<T> {
    T get(int index);
    boolean add(T item, int index);
    boolean removeAt(int index);
}
```

`Iterable<T>` тоже параметризован: благодаря этому `for (T item : list)` возвращает элементы нужного типа без приведений.

## Ограничение 1: нельзя `new T[]`

```java
public class CarArrayList<T> implements CarList<T> {
    // private T[] array = new T[10];     ❌ generic array creation
    private Object[] array = new Object[10];
    private int size;

    @Override
    @SuppressWarnings("unchecked")
    public T get(int index) {
        checkIndex(index);
        return (T) array[index];          // безопасно: кладём туда только T
    }
}
```

Так устроен и настоящий `java.util.ArrayList` — внутри `Object[] elementData`. Приведение `(T)` вызывает предупреждение `unchecked`; если вы уверены, что оно корректно (в массив попадает только `T` через `add`), подавите его аннотацией `@SuppressWarnings("unchecked")` на **минимальной** области — на методе, а не на классе.

Альтернативы:
- `T[] arr = (T[]) new Object[n];` — работает внутри класса, но **нельзя отдавать такой массив наружу** (снаружи будет `ClassCastException`).
- `T[] arr = (T[]) Array.newInstance(clazz, n);` — настоящий массив нужного типа, если передать `Class<T> clazz` в конструктор.

## Ограничение 2: статический вложенный класс не видит `T`

```java
public class CarLinkedList<T> implements CarList<T> {
    private Node first, last;

    private class Node {              // без static: использует T внешнего класса
        private Node previous;
        private T value;
        private Node next;
    }
}
```

В видео `static` просто убирают. Минус: каждый `Node` хранит скрытую ссылку на внешний объект (лишние байты на каждый элемент). **Лучший вариант** — оставить класс статическим и дать ему собственный параметр, как в JDK:

```java
private static class Node<E> {
    E value;
    Node<E> previous, next;
}
private Node<T> first, last;
```

Про виды вложенных классов — в статье [Вложенные классы](#/extra/nested-classes).

## Ограничение 3: `T` — всегда ссылочный тип

`CarArrayList<int>` не скомпилируется — только `CarArrayList<Integer>`. Примитивы автоматически упаковываются (autoboxing), и это стоит памяти.

## Map с двумя параметрами

```java
public interface CarMap<K, V> {
    void put(K key, V value);
    V get(K key);
    Set<K> keySet();
    List<V> values();
    boolean remove(K key);
    int size();
    void clear();
}

public class CarHashMap<K, V> implements CarMap<K, V> {
    private Object[] array = new Object[16];   // массив Entry, но без new Entry[16]

    private class Entry {
        private K key;
        private V value;
        private Entry next;
    }
}
```

:::interview "Вопрос с собеседования"
**Почему нельзя создать массив дженерик-типа?** — Массивы ковариантны и проверяют тип элементов в рантайме (`ArrayStoreException`), а дженерики стираются и такой информации не имеют. Если бы `new List<String>[10]` был разрешён, можно было бы через `Object[]` положить туда `List<Integer>` без единой ошибки — система типов сломалась бы.
:::

## Что не рассказано в видео

- **`Iterator<T>` у своей коллекции.** Чтобы работал for-each, метод `iterator()` должен возвращать `Iterator<T>` — анонимный или вложенный класс с полем-индексом (см. урок [Iterator](#/lessons/j1-iterator)).
- **Тесты тоже надо параметризовать.** `CarList<Car> list = new CarArrayList<>();` — и все старые тесты из части 1 продолжают работать.
- **Интерфейсы JDK.** На практике свои коллекции пишут редко: можно реализовать `java.util.List<T>` через `AbstractList<T>` — достаточно `get` и `size`, остальное даст JDK.

## Домашнее задание

:::task video "Параметризуйте все коллекции — из видео"
Повторите за автором: сделайте `CarCollection`, `CarList`, `CarSet`, `CarQueue`, `CarMap` и все их реализации обобщёнными и прогоните тесты из части 1. {{t j2 16:46}}
??? Подсказка
Заменяйте `Car` на `T` сверху вниз: сначала интерфейсы, потом реализации, потом тесты. Для `Node`/`Entry` уберите `static` или дайте им свой параметр. Разбор: {{t j2 18:56}}
:::

:::task easy "Обобщённый стек"
Напишите `MyStack<T>` на основе `Object[]` с методами `push`, `pop`, `peek`, `isEmpty` и автоматическим расширением массива. Обработайте `pop` из пустого стека (бросьте `NoSuchElementException`).
:::

:::task medium "Массив нужного типа"
Добавьте в `CarArrayList<T>` метод `T[] toArray(Class<T> type)`, который возвращает **настоящий** массив `T[]` (через `Array.newInstance`). Покажите, что вариант с `(T[]) new Object[size]` при присваивании в `String[]` снаружи падает с `ClassCastException`, а ваш — нет.
:::

:::task hard "Своя List поверх AbstractList"
Реализуйте неизменяемый `Range extends AbstractList<Integer>` — числа от `from` до `to`, не храня их в памяти. Проверьте, что работают `contains`, `indexOf`, `subList`, for-each и `stream()`, хотя вы написали только `get` и `size`.
:::
