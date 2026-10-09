How do you make a thread **sleep while there's no work** and wake up when work appears? We write our own blocking task queue with `wait()` and `notify()`, then find its ready-made counterpart — `BlockingQueue`. In the homework, three threads print `ABCABC…` strictly in turn.

## Video timestamps

- {{t j2 2:53:47}} — task: a blocking task queue `BlockingQueue`
- {{t j2 2:54:39}} — `add` and `take` on top of a `Queue<Runnable>`
- {{t j2 2:55:25}} — an infinite handler loop in a separate thread
- {{t j2 2:57:34}} — the problem: the loop spins constantly and eats the CPU
- {{t j2 2:58:55}} — hundreds of thousands of empty iterations in seconds
- {{t j2 2:59:05}} — a shared monitor for `add` and `take`
- {{t j2 2:59:48}} — `while (queue.isEmpty()) monitor.wait()`
- {{t j2 3:00:21}} — `monitor.notify()` when adding a task
- {{t j2 3:00:48}} — now the loop ran 11 times, the thread sleeps
- {{t j2 3:02:57}} — `wait()` releases the monitor
- {{t j2 3:03:15}} — where `wait`, `notify`, `notifyAll` come from
- {{t j2 3:03:30}} — question: `notify` vs `notifyAll`
- {{t j2 3:04:27}} — the ready-made `BlockingQueue` interface and `LinkedBlockingQueue`
- {{t j2 3:05:24}} — homework: `ABC` five times
- {{t j2 3:06:17}} — the solution
- {{t j2 3:10:37}} — why `notify()` hangs the program here

## Busy waiting is bad

```java
while (true) {
    Runnable task = queue.take();      // returns null if empty
    if (task != null) new Thread(task).start();
}
```

The loop spins non-stop even when there are no tasks: 100% of one core, a drained phone battery. This is called **busy waiting**.

## wait() and notify()

```java
public class MyBlockingQueue {
    private final Object monitor = new Object();
    private final Queue<Runnable> queue = new LinkedList<>();

    public void put(Runnable task) {
        synchronized (monitor) {
            queue.add(task);
            monitor.notify();                 // wake up a waiter
        }
    }

    public Runnable take() throws InterruptedException {
        synchronized (monitor) {
            while (queue.isEmpty()) {         // while, not if!
                monitor.wait();               // sleep and RELEASE the monitor
            }
            return queue.poll();
        }
    }
}
```

- `wait()` — the thread goes to sleep (state `WAITING`) and **releases the monitor**, so another thread can enter `put`.
- `notify()` wakes **one** arbitrary thread waiting on this monitor; `notifyAll()` — **all** of them. A woken thread first re-acquires the monitor, then continues from where it fell asleep.
- The methods are declared in `Object` — because any object can be a monitor.
- They can only be called **inside `synchronized` on the same object**, otherwise `IllegalMonitorStateException`.

:::warning "Why while and not if"
1) **Spurious wakeups** happen — a thread may wake without `notify`. 2) While the woken thread was waiting for the monitor, another thread may have taken the task. The condition is always rechecked in a loop.
:::

## notify or notifyAll

In the `ABC` task three threads wait on one monitor, but each needs its own condition ("it's my letter now"). `notify()` may wake "the wrong one" — it checks the condition and goes back to sleep, while the right thread never wakes: the program hangs ({{t j2 3:10:37}}). `notifyAll()` wakes everyone — each checks the condition, and exactly one proceeds.

Rule: `notify()` is safe only if all waiters wait for **the same** condition and any of them can proceed. Otherwise use `notifyAll()` (or a `Condition` with separate wait queues).

## The ready-made solution: BlockingQueue

```java
BlockingQueue<Runnable> queue = new LinkedBlockingQueue<>();
queue.put(task);                 // waits if the queue is full (for a bounded one)
Runnable next = queue.take();    // waits if empty — never returns null
```

| Method | Full/empty queue |
|---|---|
| `put` / `take` | Waits |
| `offer` / `poll` | Returns `false`/`null` immediately |
| `offer(e, t, unit)` / `poll(t, unit)` | Waits up to a timeout |

Implementations: `ArrayBlockingQueue` (bounded), `LinkedBlockingQueue`, `PriorityBlockingQueue`, `DelayQueue`, `SynchronousQueue` (no buffer — a hand-to-hand transfer). The thread pools from the previous lesson are built on `BlockingQueue`.

:::interview "Interview questions"
**What does `wait()` do?** — Puts the thread into waiting and releases the monitor until it's woken by `notify`/`notifyAll` or `interrupt`.

**How do `notify()` and `notifyAll()` differ?** — `notify` wakes one waiting thread, `notifyAll` wakes all; the woken threads take the monitor one at a time.

**Why are these methods in `Object` and not in `Thread`?** — Threads wait on a monitor, not on a thread, and any object can be a monitor.
:::

## What the video doesn't cover

- **`Lock` + `Condition`** — the modern replacement for `wait/notify`: several conditions on one lock (`notFull`, `notEmpty`) and `signal()` to the right group of threads.
- **Producer–consumer** — the classic pattern; real code almost always writes it with a `BlockingQueue`, not bare `wait/notify`.

## Homework

:::task video "ABCABC… — from the video"
Three threads, each printing its own letter (`A`, `B`, `C`) five times. Set them up so the console shows `ABCABCABCABCABC`. No `sleep` or `join` — only `wait` and `notifyAll`. {{t j2 3:05:24}}
??? Hint
A shared monitor and a shared variable `nextLetter`. Thread: `while (!nextLetter.equals("A")) monitor.wait();` → print → `nextLetter = "B"` → `monitor.notifyAll()`. Solution: {{t j2 3:06:17}}
:::

:::task easy "A bounded queue"
Extend `MyBlockingQueue` from the lesson: a maximum size `capacity`; `put` waits if the queue is full. Check: a fast producer and a slow consumer — the queue never holds more than `capacity` elements.
:::

:::task medium "Producer–consumer with BlockingQueue"
Two producers generate random numbers, three consumers take them and print the square. Use `ArrayBlockingQueue(10)`. Design a correct shutdown: for example, a "poison pill" — a special element that makes a consumer finish when it sees it.
:::

:::task hard "ABC with Condition"
Solve the task from the video with a `ReentrantLock` and **three** `Condition`s (one per letter): each thread wakes only the next one (`signal()`), not everyone. Generalise to `N` threads and an arbitrary string.
:::
