The most frequent topic in Java interviews is collections. In this lesson we design a parking-lot car registry: first an **interface**, then **tests**, then an implementation `CarArrayList` — an `ArrayList` clone. And we analyse the algorithmic complexity of its operations (Big O).

## Video timestamps

- {{t j1 6:10:14}} — why interviews always ask about collections
- {{t j1 6:11:25}} — the task: a car registry, requirements
- {{t j1 6:12:06}} — the `Car` class (brand and number)
- {{t j1 6:12:44}} — SOLID: design at the level of abstractions
- {{t j1 6:13:18}} — the `CarList` interface
- {{t j1 6:14:42}} — tests first: `CarListTest`
- {{t j1 6:15:33}} — test: added 100 — size is 100
- {{t j1 6:16:52}} — test: removing by index decreases the size
- {{t j1 6:19:08}} — test: removing an object; removing a missing one returns `false`
- {{t j1 6:21:42}} — tests for `clear` and out-of-bounds access
- {{t j1 6:24:02}} — TDD: tests before the implementation
- {{t j1 6:24:20}} — `CarArrayList implements CarList`
- {{t j1 6:26:03}} — `get` and `throw new IndexOutOfBoundsException()`
- {{t j1 6:27:39}} — `add` with array growth and `Arrays.copyOf`
- {{t j1 6:29:50}} — `removeAt`: shifting left
- {{t j1 6:31:36}} — `remove(car)` and `equals`
- {{t j1 6:34:25}} — a new requirement: insertion at an index
- {{t j1 6:37:13}} — implementation: shifting right
- {{t j1 6:40:36}} — algorithmic complexity: O(1) and O(n)
- {{t j1 6:44:35}} — the array doesn't shrink on removal
- {{t j1 6:45:41}} — `System.arraycopy` and native methods
- {{t j1 6:50:03}} — homework

## Interface first

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

A SOLID principle (Dependency Inversion): code depends on an **abstraction**, not an implementation. Tests are written against the interface — later any implementation (`CarArrayList`, `CarLinkedList`) is plugged in, and all tests must pass.

## Tests before the implementation (TDD)

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

## The CarArrayList implementation

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
        if (index < 0 || index > size) {          // index == size means appending — allowed
            throw new IndexOutOfBoundsException();
        }
        increaseArray();
        System.arraycopy(array, index, array, index + 1, size - index);   // shift right
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
        for (int i = index; i < size - 1; i++) {   // shift left
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

`ArrayList` is simply a **wrapper around an array** — a "dynamic array".

## Operation complexity (Big O)

**Big O** describes how an operation's time grows as the number of elements `n` grows:

- **O(1)** — constant time: independent of the collection's size.
- **O(n)** — linear: 10× more elements — roughly 10× slower.
- **O(log n)** — logarithmic (trees, binary search) — you'll meet it with `TreeSet`.

| `ArrayList` operation | Complexity | Why |
|---|---|---|
| `get(index)` | **O(1)** | Direct access to an array cell |
| `add(e)` at the end | **O(1)** amortised | A write to a cell; the rare growth copies the array in O(n) |
| `add(e, index)` at the start/middle | **O(n)** | Shifting every element to the right |
| `removeAt(index)` / `remove(e)` | **O(n)** | Shifting (plus searching for `remove(e)`) |
| `contains(e)` | **O(n)** | Linear scan |

`ArrayList` pros: fast index access and appending. Cons: inserting/removing at the start and middle.

### System.arraycopy

IDEA highlights a manual copy loop and offers to replace it with `System.arraycopy(src, srcPos, dest, destPos, length)`. It's a `native` method (implemented in C/C++ inside the JVM) that copies a whole memory block — much faster than a loop. **The complexity stays O(n)**; only the constant factor is smaller.

## What the video doesn't cover

:::note "About the ArrayList "memory leak""
The author says the non-shrinking array causes a "memory leak". More precisely: memory occupied by the **capacity** isn't released automatically — expected behaviour, not a leak. To shrink the array there's `arrayList.trimToSize()`. A real leak is when cells keep references to objects after removal; the JDK nulls out the freed cell: `elementData[--size] = null;` — do the same in yours.
:::

- The real `ArrayList` grows by **1.5×**, not 2×, and allocates its array lazily — on the first add.
- If you know the size in advance, create `new ArrayList<>(10_000)` — no extra growth steps.
- `ArrayList` isn't thread-safe: for multithreading use `Collections.synchronizedList` or `CopyOnWriteArrayList` (part 2).
- Don't confuse it with the legacy `Vector` — `ArrayList`'s synchronised "big brother" from Java 1.0, not used in new code.

## Homework

:::task video "remove via System.arraycopy — from the video"
Rewrite `removeAt` so the shift is done with `System.arraycopy`. Do it by hand first, then compare with what IDEA suggests (<kbd>Alt+Enter</kbd> → *Replace with System.arraycopy*). The tests must stay green. {{t j1 6:50:03}}
??? Hint
Shift left the elements to the right of the removed one: `System.arraycopy(array, index + 1, array, index, size - index - 1);`, then `array[--size] = null;`.
:::

:::task easy "Nulling out and trimToSize"
Add nulling of the freed cell on removal to `CarArrayList` and a `trimToSize()` method shrinking the array to `size`. Write a test: after adding 100 and removing 90 elements, `trimToSize()` doesn't break `get`.
:::

:::task medium "1.5× growth"
Change the growth strategy to 1.5× (`oldCapacity + (oldCapacity >> 1)`). Add a growth counter and compare how many times the array grows while adding 1,000,000 elements with ×2 and ×1.5 growth. Why did the JDK choose 1.5?
:::

:::task hard "Measuring complexity"
Write a program that, for `n` = 10,000, 100,000 and 1,000,000, measures (with `System.nanoTime()`) the time of 1000 insertions at the start, 1000 appends and 1000 `get`s at random indexes — for `ArrayList`. Build a table and confirm that insertion at the start grows linearly with `n`, while the other operations barely change.
??? Hint
"Warm up" the JVM with a few runs before measuring — otherwise JIT compilation distorts the results. Serious benchmarks use **JMH** (Java Microbenchmark Harness).
:::
