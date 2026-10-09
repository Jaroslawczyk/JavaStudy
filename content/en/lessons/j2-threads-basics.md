The hardest section of the course begins — **concurrency**. Part 1 was just an introduction; now we look at processes and threads, the two ways to create a thread and the eternal interview question: how does `start()` differ from `run()`?

## Video timestamps

- {{t j2 1:03:43}} — intro: one of the hardest topics
- {{t j2 1:04:06}} — why we need concurrency
- {{t j2 1:04:52}} — process-based multitasking
- {{t j2 1:05:27}} — thread-based multitasking
- {{t j2 1:06:08}} — a new `concurrency` project, printing numbers without threads
- {{t j2 1:07:44}} — the main thread
- {{t j2 1:08:07}} — way 1: extend `Thread`
- {{t j2 1:08:54}} — `start()`: the thread starts working
- {{t j2 1:09:48}} — the main and the new thread run in parallel
- {{t j2 1:10:15}} — way 2: implement `Runnable`
- {{t j2 1:11:24}} — `Runnable` as an anonymous class
- {{t j2 1:11:47}} — question: what ways of creating threads do you know
- {{t j2 1:12:18}} — question: why do we call `start()` and not `run()`

## Processes and threads

- A **process** is a running program with its own memory (a browser, an IDE, a player). The OS runs processes in parallel — **process-based multitasking**.
- A **thread** is a "line of execution" inside a process. Threads of one process **share memory** (the heap), but each has its own stack. That's **thread-based multitasking**: in one program a download runs, a progress bar is drawn and the remaining time is computed at the same time.

When the JVM starts a program it creates the **main thread**, which runs `main`. Until you create other threads, everything runs sequentially.

## Way 1: extending Thread

```java
public class MyThread extends Thread {
    @Override
    public void run() {                  // what to do in the new thread
        for (int i = 0; i < 1000; i++) {
            System.out.print(i + " ");
        }
    }
}

public static void main(String[] args) {
    System.out.println("Start");
    new MyThread().start();              // start a NEW thread
    for (int i = 0; i < 1000; i++) System.out.print("M");
    System.out.println("\nFinish");
}
```

The output differs each time: `Start`, the letters `M`, the numbers and `Finish` get mixed up. Creating a thread takes time, so the main thread often prints `Finish` before the new one prints its first number.

## Way 2: implementing Runnable

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        for (int i = 0; i < 1000; i++) System.out.print(i + " ");
    }
}

new Thread(new MyRunnable()).start();

// or an anonymous class / a lambda:
new Thread(() -> System.out.println("Working in " + Thread.currentThread().getName())).start();
```

**`Runnable` is preferable:** Java has no multiple class inheritance — once you extend `Thread` you can't extend anything else. Besides, `Runnable` separates the **task** ("what to do") from the **execution mechanism** ("who and how"): the same task can be handed to a thread pool or a virtual thread.

## start() and run()

```java
Thread t = new Thread(task);
t.run();     // ❌ just a method call in the CURRENT thread — no concurrency at all
t.start();   // ✅ the JVM creates a new thread and calls run() in it
```

`run()` is just a method you overrode yourself: it contains no thread-creation code. The thread is created by `start()` — a native method of `Thread`. You never call `run()` manually.

:::interview "Interview questions"
**What ways of creating a thread do you know?** — Extend `Thread` and override `run()`, or implement `Runnable` and pass it to the `Thread` constructor. `Runnable` is preferable. A modern answer should add: `Callable` + `ExecutorService` and virtual threads (Java 21).

**How do `start()` and `run()` differ?** — `start()` creates a new thread and calls `run()` in it (asynchronously). Calling `run()` directly executes the code in the current thread. Calling `start()` twice on the same object throws `IllegalThreadStateException`.
:::

## What the video doesn't cover

### Thread names and info

```java
Thread t = new Thread(task, "downloader");      // the name helps in logs
Thread current = Thread.currentThread();
System.out.println(current.getName() + " id=" + current.threadId());
```

:::outdated "getId() → threadId()"
`Thread.getId()` has been deprecated since Java 19 — use `threadId()`. Java 19 also added `Thread.sleep(Duration)`.
:::

### Concurrency vs parallelism

- **Parallelism** — tasks literally run at the same time on different cores.
- **Concurrency** — tasks interleave, creating the illusion of simultaneity (even on one core).

A multithreaded program on 8 cores can be both. Number of cores: `Runtime.getRuntime().availableProcessors()`.

### Virtual threads (Java 21+)

A regular (platform) Java thread = an OS thread: it's heavy (a ~1 MB stack), and thousands of them are already a problem. **Virtual threads** are lightweight threads managed by the JVM; you can create millions of them for tasks that wait a lot (network, DB, files):

```java
Thread.ofVirtual().start(() -> System.out.println("I'm virtual"));
Thread.ofPlatform().name("worker").start(task);    // a builder for regular ones too
```

More in the article [Virtual Threads](#/extra/virtual-threads).

## Homework

The video has no task in this lesson (the author says there isn't enough material yet) — let's practise with our own.

:::task easy "Two ways"
Create a thread that prints the numbers 1 to 10 in three ways: a `Thread` subclass, a class that `implements Runnable`, and a lambda. Print `Thread.currentThread().getName()` in each.
:::

:::task easy "run versus start"
Call `run()` on one thread and `start()` on another; print the current thread's name in both. Explain the difference in the output. Then call `start()` twice on the same object and read the exception.
:::

:::task medium "Output race"
Start 5 threads, each printing its own letter 20 times without pauses. Run the program 5 times and compare the output. Answer: can you guarantee that the thread started first prints first?
:::

:::task hard "10,000 threads"
Create 10,000 platform threads, each sleeping for 1 second (`Thread.sleep(Duration.ofSeconds(1))`), wait for all of them (`join`), and measure the time and peak memory. Repeat with `Thread.ofVirtual()`. Compare the results and explain the difference.
:::
