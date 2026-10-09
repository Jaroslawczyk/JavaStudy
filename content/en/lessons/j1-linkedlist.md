In `ArrayList`, inserting and removing at the start and middle is expensive. **`LinkedList`** solves it differently: no array at all — just a chain of nodes where each knows its neighbours. We write our own `CarLinkedList` and examine the famous question "ArrayList or LinkedList?" — with corrections that matter in a 2026 interview.

## Video timestamps

- {{t j1 6:50:27}} — `ArrayList`'s problems → a linked list
- {{t j1 6:51:27}} — a popular question: `ArrayList` vs `LinkedList`
- {{t j1 6:51:34}} — the `Node` class: `previous`, `value`, `next`; the `first`, `last`, `size` fields
- {{t j1 6:52:04}} — adding the first and subsequent elements
- {{t j1 6:53:02}} — getting an element: walking along `next`
- {{t j1 6:53:24}} — inserting in the middle: relinking references
- {{t j1 6:53:58}} — removal: nobody references the node anymore
- {{t j1 6:54:23}} — `CarLinkedList implements CarList`
- {{t j1 6:55:04}} — a nested `private static class Node`
- {{t j1 6:56:28}} — the `add` method
- {{t j1 6:59:10}} — `add(car, index)` and a helper `getNode(index)`
- {{t j1 7:03:20}} — a special case: inserting at the start
- {{t j1 7:05:38}} — `removeAt` and edge cases (first/last)
- {{t j1 7:09:51}} — `remove(car)`, `get`, `clear`
- {{t j1 7:12:28}} — the same tests pass for the new implementation
- {{t j1 7:13:19}} — comparing `ArrayList` and `LinkedList`
- {{t j1 7:15:54}} — interview questions

## How LinkedList works

```text
first                                              last
  ↓                                                  ↓
[null | 5 | ●]  ⇄  [● | 7 | ●]  ⇄  [● | 100 | ●]  ⇄  [● | 3 | null]
 prev value next
```

Each **node** (`Node`) holds a value and two references — to the previous and the next node (a doubly linked list). The collection keeps references to the first and last nodes plus the size.

```java
public class CarLinkedList implements CarList {
    private Node first;
    private Node last;
    private int size = 0;

    private static class Node {          // static: a node needs no access to the list's fields
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
            first = newNode;                 // inserting at the start
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
            node = node.next;                // walking the chain — that's O(n)!
        }
        return node;
    }

    // remove(car), size(), clear() — see the video
}
```

A removed node becomes unreachable — the garbage collector reclaims it, and the memory is freed right away.

## ArrayList vs LinkedList

Here's the comparison as stated in the video — and how it should be refined:

| Operation | `ArrayList` | `LinkedList` (video) | `LinkedList` (precisely) |
|---|---|---|---|
| `get(index)` | O(1) | O(n) | O(n) |
| `add(e)` at the end | O(1)* | O(1) | O(1) |
| `add(index, e)` at the start/middle | O(n) | O(1) | **O(n)** to find the node + O(1) relinking; at the start/end — O(1) |
| `remove(index)` | O(n) | O(1) | **O(n)** to find the node + O(1) relinking |
| `remove(e)` / `contains(e)` | O(n) | O(n) | O(n) |
| Memory per element | ~4–8 bytes (a reference) | — | ~24–40 bytes (a node + 3 references) |

\* amortised.

:::warning "The main correction to the video"
The video says inserting in the middle and removing by index are O(1) for `LinkedList`. But to insert at position `index` you first have to **walk** there — look at your own `getNode`: it's a loop, O(n). Only the **relinking** is O(1), once the node is found: when working with the start/end of the list or while traversing with a `ListIterator`. If you answer "inserting in the middle is O(1)" without that caveat, a good interviewer will immediately ask: "And how do you find the middle?"
:::

### What to choose in practice

- **Almost always `ArrayList`.** An array is contiguous in memory and plays well with the CPU cache; `System.arraycopy` shifts thousands of elements very quickly. In real benchmarks `ArrayList` often beats `LinkedList` even on middle insertions.
- Need a **queue or a stack** — `ArrayDeque` (faster than `LinkedList` and the legacy `Stack`).
- `LinkedList` fits rarely: frequent insertions/removals while iterating, when you already hold a position. Even its author, Joshua Bloch, admitted he doesn't use it himself.

## Interview questions

:::interview "From the video — with refined answers"
1. **How do ArrayList and LinkedList differ?** — `ArrayList` is backed by a dynamic array, `LinkedList` by a doubly linked list of nodes. `LinkedList` also implements `Deque` (a double-ended queue).
2. **Complexity of get by index?** — `ArrayList` O(1), `LinkedList` O(n).
3. **Complexity of removal by index?** — `ArrayList` O(n) due to shifting; `LinkedList` O(n) due to finding the node (the relinking itself is O(1)). Removing the first/last element of a `LinkedList` is O(1).
4. **When is LinkedList better than ArrayList?** — With many insertions/removals at the start of the list or during iterator traversal. Otherwise `ArrayList`; for queues `ArrayDeque`.
5. **What problems does ArrayList have with mass additions and removals?** — The array doesn't shrink by itself: the capacity stays large (`trimToSize()` fixes that), and insertions/removals at the start are O(n).
:::

## Homework

The video has no separate task — the author advises writing `LinkedList` on your own, even if it takes several days.

:::task easy "Write it again"
Without hints, implement `CarLinkedList` (all `CarList` methods) and run the tests from the previous lesson against it, changing only the line that creates the collection in `setUp`.
:::

:::task medium "getNode from the nearer end"
Optimise `getNode`: if `index < size / 2`, walk forward from `first`, otherwise backward from `last`. On average that halves the steps (exactly how the JDK does it). Add a test checking `get` on the last elements.
:::

:::task medium "addFirst, removeFirst, removeLast"
Add methods running in O(1): `addFirst`, `removeFirst`, `removeLast`. Use them to implement a stack (LIFO) and a queue (FIFO) on top of your list.
:::

:::task hard "Reversing a list and an honest benchmark"
Write a `reverse()` method that reverses the doubly linked list **in place** in O(n) without creating new nodes. Then compare the JDK's `ArrayList` and `LinkedList` on 100,000 middle insertions: (a) via `add(size/2, e)`, (b) via a `ListIterator` positioned in the middle. Explain the results.
??? Hint
In (a) `LinkedList` searches for the middle every time — O(n) per insertion — and may lose to `ArrayList`. In (b) the iterator is already in place, and insertion really is O(1).
:::
