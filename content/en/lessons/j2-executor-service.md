Creating a thread for every task is expensive and inconvenient. Real programs take threads from a **pool** and use synchronisers to wait for a group of tasks. Meet `CountDownLatch` and `ExecutorService` — the foundation of all server-side concurrency in Java.

## Video timestamps

- {{t j2 2:23:19}} — 10 tasks in 10 threads
- {{t j2 2:24:12}} — a lambda/anonymous class sees only `final` and effectively final variables
- {{t j2 2:25:18}} — waiting for all threads: a list and `join()` in a loop
- {{t j2 2:27:08}} — `CountDownLatch`: `countDown()` and `await()`
- {{t j2 2:29:13}} — 100 tasks: creating threads is expensive
- {{t j2 2:29:21}} — the thread-pool idea: `ExecutorService`
- {{t j2 2:30:23}} — `Executors.newFixedThreadPool(5)`
- {{t j2 2:31:02}} — `execute(Runnable)`
- {{t j2 2:31:46}} — the program doesn't exit: `shutdown()`
- {{t j2 2:32:38}} — `newSingleThreadExecutor()` and `newCachedThreadPool()`
- {{t j2 2:33:39}} — homework: three tasks in a pool
- {{t j2 2:34:31}} — the solution
- {{t j2 2:38:58}} — `int` overflow → `long`

## Capturing variables in a lambda

```java
for (int i = 0; i < 10; i++) {
    final int index = i;                     // a copy that never changes
    new Thread(() -> System.out.println("Start " + index)).start();
    // using i inside is an error: i changes
}
```

Lambdas and anonymous classes see only **effectively final** local variables — those that don't change after initialisation. The value is copied into the lambda object.

## CountDownLatch

A "countdown latch": threads decrement a counter, and a waiting thread wakes up when the counter reaches zero.

```java
CountDownLatch latch = new CountDownLatch(10);
for (int i = 0; i < 10; i++) {
    final int index = i;
    new Thread(() -> {
        System.out.println("Start " + index);
        sleep(1000);
        System.out.println("Finish " + index);
        latch.countDown();                   // −1
    }).start();
}
latch.await();                               // wait until it's 0
System.out.println("All threads finished");
```

The difference from `join()`: we wait not for specific threads but for **N events**, which can happen in any threads (including a pool, where we have no thread references). The counter is **single-use** — it can't be reset (for reuse there's `CyclicBarrier`, see the [semaphore lesson](#/lessons/j2-semaphore-barrier)).

:::tip "countDown in finally"
If a task fails with an exception before `countDown()`, `await()` waits forever. Safer: `try { work(); } finally { latch.countDown(); }`. And use `await(timeout, unit)` so you never hang forever.
:::

## ExecutorService: a thread pool

A pool creates N threads up front. Tasks go into a **queue**, and a free thread takes the next task. Threads are reused — you don't pay for creating each one.

```java
ExecutorService executor = Executors.newFixedThreadPool(5);
CountDownLatch latch = new CountDownLatch(100);

for (int i = 0; i < 100; i++) {
    final int index = i;
    executor.execute(() -> {
        try {
            System.out.println("Task " + index + " in " + Thread.currentThread().getName());
        } finally {
            latch.countDown();
        }
    });
}
executor.shutdown();          // no new tasks accepted, the old ones finish
latch.await();
```

| Factory | Behaviour |
|---|---|
| `newFixedThreadPool(n)` | Exactly `n` threads, unbounded queue |
| `newSingleThreadExecutor()` | One thread: tasks strictly one after another |
| `newCachedThreadPool()` | Creates threads as needed, reuses idle ones |
| `newScheduledThreadPool(n)` | Delayed and scheduled tasks |
| `newVirtualThreadPerTaskExecutor()` | Java 21+: a new **virtual** thread per task |
| `newWorkStealingPool()` | A `ForkJoinPool` sized to the number of cores |

:::warning "A correction to the video about cachedThreadPool"
The author says a cached pool "doesn't shrink after tasks finish". That's not true: **idle threads are removed after 60 seconds**. The real danger is different — the pool is **unbounded**: 10,000 simultaneous tasks = 10,000 OS threads, which can exhaust memory. Production code creates a `ThreadPoolExecutor` with explicit limits and a bounded queue.
:::

## Shutting down a pool

- `shutdown()` — stop accepting tasks, let the current ones finish.
- `awaitTermination(timeout, unit)` — wait for completion.
- `shutdownNow()` — interrupt running tasks and return the pending ones.

:::outdated "ExecutorService in try-with-resources (Java 19+)"
Since Java 19 `ExecutorService` implements `AutoCloseable`: `close()` calls `shutdown()` and waits for all tasks. The forgotten `shutdown()` from the video ({{t j2 2:31:46}}) is no longer a problem:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 10_000; i++) {
        int id = i;
        executor.submit(() -> handle(id));
    }
}   // here all tasks have completed
```
:::

## What the video doesn't cover

- **Error handling.** An exception in a task passed via `execute` is printed and kills the pool thread (the pool creates a new one). With `submit` the exception is "hidden" in the `Future` — more on that below.
- **Pool size.** For computations (CPU-bound) — about the number of cores. For tasks that wait (I/O-bound) — more, and since Java 21 virtual threads are simpler.
- **`ThreadPoolExecutor`** — the configurable implementation: core/max size, queue, rejection policy (`CallerRunsPolicy`, `AbortPolicy`).

## Homework

:::task video "Three tasks in a pool — from the video"
Using `ExecutorService`, run three tasks: 1) the sum of even numbers from 0 to 1,000,000; 2) the sum of numbers divisible by 7 in the same range; 3) a list of 1000 random numbers from 0 to 1000 and the count of even ones in it. Wait for them with a `CountDownLatch` and measure the time. Compare a pool of 3 threads with a pool of 1. {{t j2 2:33:39}}
??? Hint
The sums don't fit in an `int` — use `long` ({{t j2 2:38:58}}). Solution: {{t j2 2:34:31}}
:::

:::task easy "A pool and thread names"
Submit 20 tasks to `newFixedThreadPool(4)`, each printing the thread name and sleeping 200 ms. Make sure only 4 threads are used. Repeat with `newCachedThreadPool()` and `newSingleThreadExecutor()`.
:::

:::task medium "A starting-gun latch"
Use **two** `CountDownLatch`es to organise a simultaneous start: 10 runner threads get ready, wait for the signal `startSignal.await()`, `main` fires `countDown()`, then waits for everyone to finish via the second latch.
:::

:::task hard "Your own ThreadPoolExecutor"
Create `new ThreadPoolExecutor(2, 4, 30, SECONDS, new ArrayBlockingQueue<>(10), new ThreadPoolExecutor.CallerRunsPolicy())`. Submit 50 long tasks and log `getPoolSize()`, `getQueue().size()` and the thread name. Explain when the pool grows from 2 to 4 threads and why some tasks run in `main`.
:::
