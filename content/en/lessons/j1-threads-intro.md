So far all code has run **in one thread** — line after line. **Multithreading** lets several tasks run at the same time: a timer ticks while the program does something else. A first look at `Thread`, `Runnable` and `Thread.sleep` — and the end of the course's first level.

## Video timestamps

- {{t j1 5:32:36}} — what multithreading is
- {{t j1 5:33:09}} — the `Thread` class and the `Runnable` interface
- {{t j1 5:33:44}} — creating a `timer` thread
- {{t j1 5:34:30}} — a `RunnableTimer implements Runnable` class
- {{t j1 5:35:40}} — starting a thread: `start()`
- {{t j1 5:35:54}} — the main and side threads run simultaneously
- {{t j1 5:36:36}} — a `Runnable` as an anonymous class
- {{t j1 5:37:02}} — a timer: pausing between outputs
- {{t j1 5:37:42}} — `Thread.sleep(1000)`
- {{t j1 5:37:51}} — the mandatory handling of `InterruptedException`
- {{t j1 5:38:39}} — why the whole loop goes inside `try`
- {{t j1 5:39:24}} — two timers at once
- {{t j1 5:40:02}} — an infinite `while (true)` loop
- {{t j1 5:41:13}} — a variable shared by two threads
- {{t j1 5:42:28}} — a static field instead of a local variable
- {{t j1 5:42:56}} — homework: a thread guesses a number
- {{t j1 5:43:40}} — the solution
- {{t j1 5:44:56}} — wrap code in try-catch: <kbd>Ctrl+Alt+T</kbd>
- {{t j1 5:47:45}} — the end of level 1: where to go next

## A thread and a task

- **`Runnable`** — an interface with a single `run()` method: **what** to do.
- **`Thread`** — a thread of execution: **who** does it.

```java
Thread timer = new Thread(new Runnable() {
    @Override
    public void run() {
        try {
            int i = 0;
            while (true) {
                System.out.println(i++);
                Thread.sleep(1000);          // sleep for 1 second
            }
        } catch (InterruptedException e) {
            System.out.println("Timer stopped");
        }
    }
});
timer.start();                               // run in a separate thread

for (int i = 0; i < 5; i++) {
    System.out.println("The main thread is working");
}
```

- `start()` creates a **new thread** and calls `run()` in it. Calling `run()` directly just executes the code in the current thread — a common beginner mistake.
- The code in `main` runs in the **main thread**; others are side threads. Their output interleaves unpredictably.
- `Thread.sleep(ms)` throws a **checked** `InterruptedException` — it must be handled.

:::tip "Why try wraps the whole loop"
If only `Thread.sleep` is wrapped in `try-catch`, an interrupted thread catches the exception and… carries on looping. An interrupt (`interrupt()`) is a request to stop, so the right thing is to leave the loop: wrap the whole loop (as in the video) or check `Thread.currentThread().isInterrupted()`.
:::

## A variable shared by two threads

```java
public class Main {
    private static volatile boolean isFive = false;   // no volatile in the video — see below

    public static void main(String[] args) {
        Thread timer = new Thread(() -> {
            for (int i = 0; ; i++) {
                System.out.println(i);
                if (i == 5) isFive = true;
                sleepSecond();
            }
        });
        Thread timer2 = new Thread(() -> {
            while (!isFive) {
                System.out.println("second timer");
                sleepSecond();
            }
        });
        timer.start();
        timer2.start();
    }

    private static void sleepSecond() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

A method's local variable can't be changed from an anonymous class/lambda (only effectively final ones are allowed), so the flag is a class field — and `static` because it's used from the static `main`.

:::warning "The video doesn't mention volatile"
Without the **`volatile`** keyword there's no guarantee that a change to `isFive` in one thread **becomes visible** to another: a thread may cache the value, and `while (!isFive)` may never end. In tiny examples it "happens to work", but in production it causes hangs. The rule: a flag written by one thread and read by another must be `volatile` (or an `AtomicBoolean`). Details in the multithreading section of part 2 and in the [JMM and volatile](#/extra/jmm-volatile) article.
:::

## What the video doesn't cover

### A lambda instead of an anonymous class

`Runnable` is a functional interface, so:

```java
Thread t = new Thread(() -> System.out.println("Working in " + Thread.currentThread().getName()));
t.start();
t.join();     // wait for the thread to finish
```

### Modern concurrency

| Approach | When |
|---|---|
| `new Thread(...)` | Learning examples, rare in real code |
| `ExecutorService` / thread pools | The standard for server tasks (part 2 of the course) |
| **Virtual threads** (Java 21+) | Thousands to millions of lightweight threads for I/O tasks: `Thread.ofVirtual().start(task)` or `Executors.newVirtualThreadPerTaskExecutor()` |
| `CompletableFuture` | Asynchronous task pipelines |

The [Virtual Threads](#/extra/virtual-threads) article covers Java 21's biggest change.

### What awaits you in part 2

Data races, `synchronized`, `wait/notify`, deadlock, `ExecutorService`, thread-safe collections — all covered in detail in [part 2](#/lessons/j2-generics) of the course.

## The end of level 1

At {{t j1 5:47:45}} the author congratulates you on finishing the basics and suggests two paths: Android (Kotlin/Java) or in-depth Java for web and servers. On this site "Java level 2" comes next — tests, how collections work inside and interview preparation — and then the second part of the course. Where to go after the whole course: the [Career](#/page/career) page and the [Roadmap](#/roadmap).

## Homework

:::task video "Guess the number in a thread — from the video"
In the main thread pick a random number from 0 to 1,000,000. Create two threads: the first is a timer printing every second how many seconds have passed; the second tries to **guess** the number by generating random numbers. When the number is guessed, the timer stops and the secret number is printed. Use a shared `boolean` variable. {{t j1 5:42:56}}
??? Hint
A flag `private static volatile boolean win;`. The timer: `while (!win) { … Thread.sleep(1000); }`. The player: inside `while (!win)` generates a number and sets `win = true` on a match. If it guesses "in 0 seconds", widen the range as in the walkthrough: {{t j1 5:43:40}}
:::

:::task easy "Three counter threads"
Start three threads, each printing its name (`Thread.currentThread().getName()`) 5 times with a random 300–700 ms pause. See how the output interleaves across runs. Wait for all threads with `join()` and print "Done".
:::

:::task medium "Interrupting a timer"
Run an infinite timer in a separate thread and stop it from the main thread after 5 seconds by calling `timer.interrupt()`. The timer must leave its loop cleanly and print "Timer stopped".
:::

:::task hard "Racing for a counter"
Create a static `int counter` field. Start 4 threads, each running `counter++` 100,000 times. After `join()` print the result — why is it less than 400,000? Fix it three ways: a `synchronized` method, an `AtomicInteger`, and splitting the work without shared state (each thread counts its own, then sum up). Compare the timings.
??? Hint
`counter++` is three operations (read, add, write). Two threads may read the same value, and one increment gets "lost". This is called a **race condition**.
:::
