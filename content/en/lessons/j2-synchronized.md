We cure the race condition with **synchronisation**: the `synchronized` keyword, the concepts of a **monitor** and a **critical section**, and why it sometimes pays to have several monitors. In the homework — an ATM that goes negative without synchronisation.

## Video timestamps

- {{t j2 1:50:42}} — how to fix a race: synchronised methods
- {{t j2 1:51:07}} — `synchronized` in the signature: always 0
- {{t j2 1:51:42}} — what a monitor is: the toilet-cubicle example
- {{t j2 1:52:21}} — the critical section
- {{t j2 1:52:45}} — your own monitor: `private final Object monitor`
- {{t j2 1:53:14}} — the `synchronized (monitor) { … }` block
- {{t j2 1:55:05}} — the monitor of a `synchronized` method is `this`
- {{t j2 1:55:46}} — why own monitors: two independent counters
- {{t j2 1:57:41}} — measurement: one monitor vs two
- {{t j2 2:00:54}} — interview questions
- {{t j2 2:01:49}} — which of the four methods can run at the same time
- {{t j2 2:02:22}} — homework: an ATM
- {{t j2 2:04:17}} — solution: the race, `join`, `synchronized`, own monitor

## A synchronized method

```java
public class Counter {
    private int value;
    public synchronized void increment() { value++; }
    public synchronized void decrement() { value--; }
    public synchronized int getValue() { return value; }
}
```

Now the result is always 0: while one thread runs `increment`, another can't enter **any** `synchronized` method of the same object.

## Monitor and critical section

The analogy from the video: a train toilet cubicle with a "free/occupied" sign.

- A **critical section** is a piece of code that only one thread can be in at a time (the cubicle).
- A **monitor** (synchronisation object, lock) is the "sign": it stores whether the section is free or occupied and by which thread. **Any object** can be a monitor — every Java object has a built-in monitor.

```java
public class Counter {
    private final Object monitor = new Object();
    private int value;

    public void increment() {
        // code before the block can run in parallel
        synchronized (monitor) {          // take the monitor or wait
            value++;                      // critical section
        }                                 // the monitor is released (even on exception)
    }
}
```

| Declaration | Monitor |
|---|---|
| `synchronized void m()` | `this` — the object itself |
| `static synchronized void m()` | `Counter.class` — the class object |
| `synchronized (lock) { … }` | the given `lock` object |

## Why several monitors

If a class has two **independent** counters and all methods synchronise on `this`, a thread changing the first counter needlessly waits for a thread changing the second. The fix — a separate monitor for each independent group of data:

```java
private final Object lock1 = new Object(), lock2 = new Object();
private int value1, value2;

public void increment1() { synchronized (lock1) { value1++; } }
public void increment2() { synchronized (lock2) { value2++; } }
```

In the video this version was faster: 10 seconds vs 16 ({{t j2 2:00:46}}).

:::tip "Rules for monitors"
- Make monitors `private final`: if the monitor reference is replaced, threads start synchronising on different objects (IDEA highlights this with a warning — {{t j2 2:10:28}}).
- Don't synchronise on string literals, `Integer`s and other "shared" objects — other code may use them too.
- Synchronising on `this` is open to the world: any external code can do `synchronized (yourObject)` and get in your way. A private monitor is safer.
:::

## Interview questions

:::interview "How does a synchronized method differ from a regular one?"
Only one thread at a time can run it (per monitor). {{t j2 2:01:00}}
:::

:::interview "What is a monitor and what can be one?"
An object threads synchronise on: if the monitor is taken, a thread waits for it to be released. Any object can be a monitor. A `synchronized` method's monitor is `this`, a static one's is the `Class` object. {{t j2 2:01:11}}
:::

:::interview "Which methods can run at the same time?"
Method 1 is unsynchronised, methods 2 and 3 use the same monitor, method 4 uses another. 1, 2, 4 or 1, 3, 4 can run simultaneously: methods 2 and 3 block each other. {{t j2 2:01:49}}
:::

## What the video doesn't cover

- **Reentrancy.** A thread that already owns a monitor can enter `synchronized` on the same monitor again (e.g. one `synchronized` method calls another) — it won't block itself.
- **Visibility.** `synchronized` guarantees not only mutual exclusion but also that changes made inside the block are seen by the next thread that takes the same monitor (happens-before). That's why **reading** a shared field (`getValue()`) must be synchronised too.
- **`ReentrantLock`** from `java.util.concurrent.locks` — an explicit lock with `tryLock(timeout)`, interruptible waiting and a fair queue. Always released in `finally`:

```java
private final ReentrantLock lock = new ReentrantLock();
public void increment() {
    lock.lock();
    try { value++; } finally { lock.unlock(); }
}
```

- **`ReadWriteLock`** — many readers at once, only one writer.

:::note "Virtual threads and synchronized"
In Java 21–23 a virtual thread blocked inside `synchronized` "pinned" its carrier thread, so `ReentrantLock` was recommended. **Since Java 24 (JEP 491) this is fixed**, and `synchronized` can again be used with virtual threads without worry.
:::

## Homework

:::task video "An ATM — from the video"
An `Atm` class with an amount of money and a method `withdraw(String name, int amount)`: it prints "name came to the ATM", sleeps 2 seconds, then dispenses money and prints the balance, or reports that there isn't enough money. Create several client threads so that someone runs short — you'll see a negative balance. Fix it: 1) with `join`, 2) with a `synchronized` method (monitor `this`), 3) with your own monitor. {{t j2 2:02:22}}
??? Hint
The race happens between the check `amount <= this.amount` and the subtraction — the whole "check and withdraw" section must be synchronised. Solution: {{t j2 2:04:17}}
:::

:::task easy "A synchronised counter"
Fix the `Counter` class from the previous lesson three ways (a `synchronized` method, a block with your own monitor, `ReentrantLock`) and make sure 100 runs in a row give 0.
:::

:::task medium "Two counters — two monitors"
Repeat the measurement from the video: 4 threads, two counters, 100 million operations. Compare the time for one shared monitor and two separate ones. Add a third version — `AtomicInteger` (next lesson).
:::

:::task hard "A bank transfer"
An `Account` class with a balance and a method `static void transfer(Account from, Account to, int amount)`. Make it thread-safe by synchronising on **both** accounts. Run 1000 random transfers between 10 accounts in 20 threads and check that the total stays the same. If the program hangs — you've met a deadlock, covered in a [lesson below](#/lessons/j2-deadlock).
:::
