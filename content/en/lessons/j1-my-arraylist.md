An array can be neither enlarged nor shrunk. Before using Java's ready-made collections, the author writes **his own collection** `MyArrayList` — a dynamic array of strings. Once you understand how it works, you'll know exactly how the real `ArrayList` works.

## Video timestamps

- {{t j1 3:24:18}} — collections: why we need them
- {{t j1 3:25:20}} — an array of employees
- {{t j1 3:26:15}} — adding an element to an array: create a new one, copy
- {{t j1 3:28:05}} — removing an element: a new array again
- {{t j1 3:30:03}} — the idea of our own collection: an array of 10 + `size`
- {{t j1 3:31:49}} — the `MyArrayList` class
- {{t j1 3:32:21}} — the `add` method and doubling the array
- {{t j1 3:34:36}} — `remove(int index)` with shifting elements
- {{t j1 3:36:25}} — `getSize()` and `get(int index)`
- {{t j1 3:37:00}} — using the collection in `main`, adding 100 employees
- {{t j1 3:39:32}} — index checks in `remove` and `get`
- {{t j1 3:40:39}} — an overloaded `remove(String)` searching with `equals`
- {{t j1 3:42:59}} — summary: you've written an `ArrayList` clone

## The problem with arrays

To "add" an element to an array you have to create a new array one element longer and copy everything over. To "remove" one — a new array one shorter, copying everything except the removed element. Every time by hand, with the risk of messing up indexes. A collection hides this work inside.

## Our own collection

```java
public class MyArrayList {
    private String[] array = new String[10];   // internal storage
    private int size;                          // how many elements are actually stored

    public void add(String s) {
        array[size] = s;
        size++;
        if (size == array.length) {            // no room left — double the array
            String[] newArray = new String[array.length * 2];
            for (int i = 0; i < array.length; i++) {
                newArray[i] = array[i];
            }
            array = newArray;
        }
    }

    public void remove(int index) {
        if (index >= 0 && index < size) {
            for (int i = index; i < size - 1; i++) {
                array[i] = array[i + 1];       // shift the tail to the left
            }
            size--;
        }
    }

    public void remove(String s) {
        int index = -1;
        for (int i = 0; i < size; i++) {
            if (s.equals(array[i])) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            remove(index);
        }
    }

    public String get(int index) {
        if (index >= 0 && index < size) {
            return array[index];
        }
        return "Element not found";
    }

    public int getSize() {
        return size;
    }
}
```

```text
size = 4, removing index = 1:
[ Nikita | Igor | Vanya | Alexey | … ]
          ◄──── shift ────
[ Nikita | Vanya | Alexey | Alexey | … ]   size = 3 → the last "extra" element is ignored
```

The key idea: **capacity** (`array.length`) and **size** (`size`) are different things. The array is always a bit bigger than needed, so `add` is usually instant and the expensive copying happens rarely.

## What the video doesn't cover

### Operation complexity (Big O)

| Operation | Complexity | Why |
|---|---|---|
| `get(index)` | O(1) | Direct array access by index |
| `add(element)` at the end | O(1) amortised | Usually just a write; occasionally an O(n) copy |
| `remove(index)` | O(n) | Shifting every element to the right |
| `remove(String)` / search | O(n) | Linear scan |

This is a classic interview topic ("how does `ArrayList` differ from `LinkedList`"), covered in detail in part 2 of the course.

### How the real ArrayList does it

- The initial capacity is 10 (allocated on the first add), and it grows **by 1.5×** (`oldCapacity + (oldCapacity >> 1)`), not 2×.
- Copying uses the fast native `System.arraycopy` / `Arrays.copyOf`, not a loop.
- `get` with a wrong index **throws** an `IndexOutOfBoundsException` instead of returning a placeholder string. Returning "Element not found" is dangerous: the caller can't tell the placeholder from a real string.

### A memory leak on removal

The author says the last element doesn't need to be set to `null` after shifting. That's true for correct *behaviour*, but not for **memory**: the array keeps a reference to the object, so the garbage collector can't free it ("loitering"). The real `ArrayList` does `elementData[--size] = null;`.

### Why it can't be used in for-each

for-each works with arrays and with objects implementing the `Iterable` interface. For `for (String s : myList)` to work, `MyArrayList` must implement `Iterable<String>` — interfaces come in later lessons, and you'll write your own iterator in part 2 of the course.

### Generics

`MyArrayList` stores only `String`s. For one collection to fit any type — `MyArrayList<T>` — you need generics (part 2 of the course).

## Homework

The video has no separate task — the author advises you to **delete all the code and write the collection again on your own**. That's the first task.

:::task easy "Write it again"
Without peeking, rewrite `MyArrayList` with `add`, `remove(int)`, `remove(String)`, `get`, `getSize`. Test it: add 25 elements (the array must grow twice), remove the first, the last and a middle one.
:::

:::task easy "contains and indexOf"
Add `boolean contains(String s)` and `int indexOf(String s)` (returns −1 if not found). Rewrite `remove(String)` using `indexOf`.
:::

:::task medium "add at an index and set"
Add `add(int index, String s)` — insertion that shifts elements to the right — and `set(int index, String s)` — replacement. Don't forget to grow the array on insertion.
??? Hint
First make sure there's room (if `size == array.length`, grow it), then shift from the end: `for (int i = size; i > index; i--) array[i] = array[i - 1];`.
:::

:::task medium "Proper errors and memory"
Change `get` and `remove(int)` so that a wrong index throws an `IndexOutOfBoundsException` with a message like `Index: 12, Size: 5`. In `remove`, null out the freed cell. Add a `toString()` returning `[a, b, c]`.
:::

:::task hard "MyIntList and a speed comparison"
Create a similar collection for `int` (`MyIntList`). Add 10 million numbers and measure the time (`System.nanoTime()`) for 2× and 1.5× growth, and compare with `ArrayList<Integer>`. Why does `ArrayList<Integer>` take noticeably more memory?
??? Hint
`ArrayList<Integer>` stores references to `Integer` objects, not numbers (autoboxing — next lesson): each number is a separate object with a header. `int[]` stores the values contiguously.
:::
