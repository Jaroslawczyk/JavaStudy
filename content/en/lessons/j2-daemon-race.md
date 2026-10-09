Two important concepts: **daemon threads** — background threads that don't keep a program from exiting, and the **race condition** — the main cause of "mysterious" bugs in multithreaded programs.

## Video timestamps

- {{t j2 1:40:16}} — daemon threads: a timer for the homework
- {{t j2 1:42:18}} — the program doesn't exit while the timer is running
- {{t j2 1:42:36}} — user ("important") threads and daemons ("unimportant")
- {{t j2 1:43:30}} — `setDaemon(true)`
- {{t j2 1:44:25}} — a common mistake: daemons end not with `main` but with all user threads
- {{t j2 1:45:53}} — a `Counter` class: `increment()` and `decrement()`
- {{t j2 1:47:51}} — a counter in two threads gives random numbers
- {{t j2 1:49:08}} — the race condition: how it happens
- {{t j2 1:50:27}} — summary: daemons and race conditions

## Daemon threads

The JVM exits when **all user (non-daemon) threads** have finished. An infinite timer in a regular thread "holds" the program forever. The fix is to make it a daemon:

```java
Thread timer = new Thread(() -> {
    try {
        int seconds = 0;
        while (true) {
            System.out.println(seconds++);
            Thread.sleep(1000);
        }
    } catch (InterruptedException ignored) { }
});
timer.setDaemon(true);      // BEFORE start(), otherwise IllegalThreadStateException
timer.start();
```

- Daemons **end automatically** when all user threads have finished — **not just `main`** ({{t j2 1:44:25}}).
- A thread inherits "daemon-ness" from the thread that created it.
- Typical JVM daemons are the garbage collector and JIT compiler threads.

:::warning "A daemon is cut off mid-sentence"
When the JVM exits, daemons get neither `interrupt()` nor a chance to run `finally`. Never give a daemon the job of writing to a file or a DB — the data will be left half-written. Daemons are fine for monitoring, timers, background cache cleanup.
:::

## Race condition

```java
public class Counter {
    private int value;
    public void increment() { value++; }
    public void decrement() { value--; }
    public int getValue() { return value; }
}

Counter counter = new Counter();
Thread t1 = new Thread(() -> { for (int i = 0; i < 1000; i++) counter.increment(); });
Thread t2 = new Thread(() -> { for (int i = 0; i < 1000; i++) counter.decrement(); });
t1.start(); t2.start();
t1.join(); t2.join();
System.out.println(counter.getValue());   // 9, 296, -251… but not always 0
```

`value++` is **three** operations: read `value`, add 1, write back. The lost-update scenario:

| Step | Thread 1 | Thread 2 | `value` |
|---|---|---|---|
| 1 | reads 0 | | 0 |
| 2 | | reads 0 | 0 |
| 3 | writes 0 + 1 | | 1 |
| 4 | | writes 0 − 1 | **−1** |

One increment "got lost". The result depends on how the scheduler interleaves the threads — so it differs on every run, and in tests the bug may stay hidden for months.

:::interview "Interview question"
**What is a race condition?** — A situation where the result depends on the order in which threads working with shared data run. The typical example is a non-atomic read-modify-write operation (`count++`). Fixed with synchronisation (`synchronized`, `Lock`), atomics (`AtomicInteger`) or by avoiding shared mutable state.
:::

## What the video doesn't cover

- **Data race vs race condition.** A data race is concurrent unsynchronised access to a variable where at least one thread writes (a memory-model violation). A race condition is broader: a logic bug caused by operation order (even with thread-safe methods: `if (!map.containsKey(k)) map.put(k, v)` — "check-then-act").
- **Check-then-act** is the second classic kind of race. For collections, use atomic methods: `map.putIfAbsent`, `map.computeIfAbsent`, `map.merge`.
- **The best synchronisation is none at all.** Immutable objects (`record`, `final` fields), local variables and splitting data between threads remove races at the design level.
- **Virtual threads are always daemons** (Java 21+) — `setDaemon(false)` throws for them.

## Homework

The video has no task for this lesson — let's practise with our own.

:::task easy "Daemon or not"
Start an infinite timer twice: as a regular thread and as a daemon. In `main`, after starting the timer, sleep 3 seconds and print "main finished". Explain the difference in the program's behaviour.
:::

:::task medium "A daemon outlives main"
Reproduce the example from the video ({{t j2 1:44:25}}): `main` starts a daemon timer and two user threads with long work (5 seconds each), then exits immediately. Prove that the timer keeps running while the user threads are alive.
:::

:::task medium "Catch the race"
Run the counter example 100 times in a row and count how many runs give a non-zero result. Increase the iterations to 100,000 — how did the error rate change?
:::

:::task hard "Check-then-act"
Write a "lazy singleton" `if (instance == null) instance = new Service();` and prove in a test with 50 threads and a `CountDownLatch` (simultaneous start) that sometimes more than one object is created (count in the constructor with an `AtomicInteger`). Then fix it three ways: a `synchronized` method, a holder class, an `enum`.
:::
