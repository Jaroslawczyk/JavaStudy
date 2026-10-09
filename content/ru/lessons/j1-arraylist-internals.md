Самый частый вопрос на Java-собеседованиях — про коллекции. В этом уроке мы проектируем систему учёта автомобилей на парковке: сначала **интерфейс**, потом **тесты**, потом **реализацию** `CarArrayList` — аналог `ArrayList`. И разбираем алгоритмическую сложность операций (Big O).

## Таймкоды видео

- {{t j1 6:10:14}} — почему на собеседованиях всегда спрашивают коллекции
- {{t j1 6:11:25}} — задача: система учёта автомобилей, требования
- {{t j1 6:12:06}} — класс `Car` (марка и номер)
- {{t j1 6:12:44}} — SOLID: проектируем на уровне абстракций
- {{t j1 6:13:18}} — интерфейс `CarList`
- {{t j1 6:14:42}} — сначала тесты: `CarListTest`
- {{t j1 6:15:33}} — тест: добавили 100 — размер 100
- {{t j1 6:16:52}} — тест: удаление по индексу уменьшает размер
- {{t j1 6:19:08}} — тест: удаление объекта; удаление несуществующего возвращает `false`
- {{t j1 6:21:42}} — тесты `clear` и выхода за границы
- {{t j1 6:24:02}} — TDD: тесты до реализации
- {{t j1 6:24:20}} — `CarArrayList implements CarList`
- {{t j1 6:26:03}} — `get` и `throw new IndexOutOfBoundsException()`
- {{t j1 6:27:39}} — `add` с расширением массива и `Arrays.copyOf`
- {{t j1 6:29:50}} — `removeAt`: сдвиг влево
- {{t j1 6:31:36}} — `remove(car)` и `equals`
- {{t j1 6:34:25}} — новое требование: вставка по индексу
- {{t j1 6:37:13}} — реализация: сдвиг вправо
- {{t j1 6:40:36}} — сложность алгоритмов: O(1) и O(n)
- {{t j1 6:44:35}} — массив не уменьшается при удалении
- {{t j1 6:45:41}} — `System.arraycopy` и native-методы
- {{t j1 6:50:03}} — домашнее задание

## Сначала интерфейс

```java
public interface CarList {
    Car get(int index);
    void add(Car car);
    void add(Car car, int index);
    boolean remove(Car car);
    boolean removeAt(int index);
    int size();
    void clear();
}
```

Принцип из SOLID (Dependency Inversion): код зависит от **абстракции**, а не от реализации. Тесты пишутся на интерфейс — потом в них подставляется любая реализация (`CarArrayList`, `CarLinkedList`), и все тесты должны пройти.

## Тесты до реализации (TDD)

```java
class CarListTest {
    private CarList carList;

    @BeforeEach
    void setUp() {
        carList = new CarArrayList();
        for (int i = 0; i < 100; i++) {
            carList.add(new Car("Brand" + i, i));
        }
    }

    @Test
    void whenAdded100ElementsThenSizeMustBe100() {
        assertEquals(100, carList.size());
    }

    @Test
    void whenElementRemovedByIndexThenSizeMustBeDecreased() {
        assertTrue(carList.removeAt(5));
        assertEquals(99, carList.size());
    }

    @Test
    void whenNonExistentElementRemovedThenReturnFalse() {
        assertFalse(carList.remove(new Car("Toyota", 15)));
        assertEquals(100, carList.size());
    }

    @Test
    void whenIndexOutOfBoundsThenThrowException() {
        assertThrows(IndexOutOfBoundsException.class, () -> carList.get(100));
    }

    @Test
    void insertIntoMiddle() {
        carList.add(new Car("BMW", 1), 50);
        assertEquals("BMW", carList.get(50).getBrand());
    }
}
```

## Реализация CarArrayList

```java
public class CarArrayList implements CarList {
    private Car[] array = new Car[10];
    private int size = 0;

    @Override
    public Car get(int index) {
        checkIndex(index);
        return array[index];
    }

    @Override
    public void add(Car car) {
        increaseArray();
        array[size] = car;
        size++;
    }

    @Override
    public void add(Car car, int index) {
        if (index < 0 || index > size) {          // index == size — вставка в конец, допустимо
            throw new IndexOutOfBoundsException();
        }
        increaseArray();
        System.arraycopy(array, index, array, index + 1, size - index);   // сдвиг вправо
        array[index] = car;
        size++;
    }

    @Override
    public boolean remove(Car car) {
        for (int i = 0; i < size; i++) {
            if (array[i].equals(car)) {
                return removeAt(i);
            }
        }
        return false;
    }

    @Override
    public boolean removeAt(int index) {
        checkIndex(index);
        for (int i = index; i < size - 1; i++) {   // сдвиг влево
            array[i] = array[i + 1];
        }
        size--;
        return true;
    }

    @Override
    public int size() { return size; }

    @Override
    public void clear() {
        array = new Car[10];
        size = 0;
    }

    private void checkIndex(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
    }

    private void increaseArray() {
        if (size >= array.length) {
            array = Arrays.copyOf(array, array.length * 2);
        }
    }
}
```

`ArrayList` — это просто **надстройка над массивом**, «динамический массив».

## Сложность операций (Big O)

**Big O** описывает, как растёт время операции при росте числа элементов `n`:

- **O(1)** — константное время: не зависит от размера коллекции.
- **O(n)** — линейное: в 10 раз больше элементов — примерно в 10 раз дольше.
- **O(log n)** — логарифмическое (деревья, бинарный поиск) — встретится в `TreeSet`.

| Операция `ArrayList` | Сложность | Почему |
|---|---|---|
| `get(index)` | **O(1)** | Прямой доступ к ячейке массива |
| `add(e)` в конец | **O(1)** амортизированно | Запись в ячейку; редкое расширение копирует массив за O(n) |
| `add(e, index)` в начало/середину | **O(n)** | Сдвиг всех элементов правее |
| `removeAt(index)` / `remove(e)` | **O(n)** | Сдвиг (и поиск для `remove(e)`) |
| `contains(e)` | **O(n)** | Перебор |

Плюсы `ArrayList`: быстрый доступ по индексу и добавление в конец. Минусы: вставка/удаление в начале и середине.

### System.arraycopy

IDEA подсвечивает ручной цикл копирования и предлагает заменить на `System.arraycopy(src, srcPos, dest, destPos, length)`. Это `native`-метод (реализован на C/C++ в JVM), который копирует блок памяти целиком — намного быстрее цикла. **Сложность при этом остаётся O(n)**, просто константа меньше.

## Что не рассказано в видео

:::note "Про «утечку памяти» в ArrayList"
Автор говорит, что из-за неуменьшающегося массива возникает «утечка памяти». Точнее: память, занятая **ёмкостью** (capacity), не освобождается автоматически — это ожидаемое поведение, а не утечка. Если нужно сжать массив, есть `arrayList.trimToSize()`. Настоящая утечка — когда в ячейках после удаления остаются ссылки на объекты; JDK-реализация обнуляет освободившуюся ячейку: `elementData[--size] = null;` — сделайте так же в своей.
:::

- Настоящий `ArrayList` растёт в **1,5 раза**, а не в 2, и выделяет массив лениво — при первом добавлении.
- Если заранее известен размер, создавайте `new ArrayList<>(10_000)` — без лишних расширений.
- `ArrayList` не потокобезопасен: для многопоточности — `Collections.synchronizedList` или `CopyOnWriteArrayList` (часть 2).
- Не путайте с устаревшим `Vector` — синхронизированный «старший брат» `ArrayList` из Java 1.0, в новом коде не используется.

## Домашнее задание

:::task video "remove через System.arraycopy — из видео"
Перепишите `removeAt` так, чтобы сдвиг выполнялся через `System.arraycopy`. Сначала вручную, потом сравните с вариантом, который предложит IDEA (<kbd>Alt+Enter</kbd> → *Replace with System.arraycopy*). Тесты должны остаться зелёными. {{t j1 6:50:03}}
??? Подсказка
Сдвигаем влево элементы правее удаляемого: `System.arraycopy(array, index + 1, array, index, size - index - 1);`, затем `array[--size] = null;`.
:::

:::task easy "Обнуление и trimToSize"
Добавьте в `CarArrayList` обнуление освобождающейся ячейки при удалении и метод `trimToSize()`, уменьшающий массив до `size`. Напишите тест: после добавления 100 и удаления 90 элементов `trimToSize()` не ломает `get`.
:::

:::task medium "Рост в 1,5 раза"
Измените стратегию роста на 1,5× (`oldCapacity + (oldCapacity >> 1)`). Добавьте счётчик расширений и сравните, сколько раз массив расширяется при добавлении 1 000 000 элементов при росте ×2 и ×1,5. Почему JDK выбрал 1,5?
:::

:::task hard "Замер сложности"
Напишите программу, которая для `n` = 10 000, 100 000 и 1 000 000 измеряет (через `System.nanoTime()`) время: 1000 вставок в начало, 1000 вставок в конец и 1000 `get` по случайному индексу — для `ArrayList`. Постройте таблицу и убедитесь, что вставка в начало растёт линейно с `n`, а остальные операции — почти нет.
??? Подсказка
Перед замером «прогрейте» JVM несколькими прогонами — иначе JIT-компиляция исказит результаты. Для серьёзных замеров используют **JMH** (Java Microbenchmark Harness).
:::
