What can you do with a thread that's already running? Stop it (the right way and the wrong way), put it to sleep, wait for it to finish. We cover `stop()`, `interrupt()`, `sleep()`, `join()`, learn to measure time and speed up a computation twice by splitting an array into two halves.

## Video timestamps

- {{t j2 1:14:08}} — question: can you stop, pause, restart a thread
- {{t j2 1:14:36}} — `stop()` — deprecated and dangerous
- {{t j2 1:15:23}} — `interrupt()` doesn't stop a thread, it sets a flag
- {{t j2 1:16:27}} — `Thread.currentThread().isInterrupted()`
- {{t j2 1:17:34}} — a finished thread can't be started again
- {{t j2 1:17:56}} — a timer: `Thread.sleep(1000)`
- {{t j2 1:18:28}} — `InterruptedException`
- {{t j2 1:19:35}} — why `try` should wrap the whole loop
- {{t j2 1:21:13}} — three collections filled in three threads
- {{t j2 1:23:39}} — wrong sizes: the main thread doesn't wait
- {{t j2 1:24:13}} — `join()`: wait for a thread to finish
- {{t j2 1:25:33}} — the start order of threads isn't guaranteed
- {{t j2 1:27:19}} — a bug from relying on order: `NullPointerException`
- {{t j2 1:28:31}} — fixing it with `join()`
- {{t j2 1:29:14}} — measuring time: `System.currentTimeMillis()`
- {{t j2 1:30:24}} — homework: computing an array in one and in two threads
- {{t j2 1:31:58}} — the solution
- {{t j2 1:39:18}} — result: almost twice as fast with threads

## Stopping a thread

### stop() — don't

`stop()` kills a thread instantly at any point: if it was writing a file or a DB record, the data stays corrupted, and monitors are released mid-operation.

:::outdated "Thread.stop() no longer works"
In the video `stop()` is struck through but still works. **Since Java 20 `Thread.stop()` always throws `UnsupportedOperationException`.** `suspend()`/`resume()` (pause/resume) are out of use too. The only correct way is cooperative stopping via `interrupt()`.
:::

### interrupt() — a polite request

`interrupt()` only sets the thread's **interrupt flag**. The thread itself must check it and decide how to finish:

```java
Thread counter = new Thread(() -> {
    for (int i = 0; i < 1_000_000; i++) {
        if (Thread.currentThread().isInterrupted()) {
            System.out.println("Interrupted at " + i);
            break;
        }
        System.out.println(i);
    }
});
counter.start();
Thread.sleep(10);
counter.interrupt();
```

If at that moment the thread is **sleeping** (`sleep`), **waiting** (`join`, `wait`) or blocked on a queue, the method immediately throws `InterruptedException`, and the flag is **cleared**.

## sleep() and handling InterruptedException

```java
Thread timer = new Thread(() -> {
    try {
        int seconds = 0;
        while (true) {                          // the whole loop inside try
            System.out.println(seconds++);
            Thread.sleep(1000);
        }
    } catch (InterruptedException e) {
        System.out.println("Timer stopped");
    }
});
```

If only `sleep` is wrapped in `try`, the exception is caught but the loop continues — the thread "doesn't hear" the request to stop ({{t j2 1:19:35}}).

:::warning "Don't swallow InterruptedException"
If you catch `InterruptedException` but can't finish right there (e.g. in a library method), **restore the flag**: `Thread.currentThread().interrupt();` — otherwise the calling code never learns about the interruption. An empty `catch` is a classic code-review finding.
:::

## join() — wait for a thread

```java
List<Integer> list1 = new ArrayList<>(), list2 = new ArrayList<>();
Thread t1 = new Thread(() -> { for (int i = 0; i < 1_000_000; i++) list1.add(i); });
Thread t2 = new Thread(() -> { for (int i = 0; i < 1_000_000; i++) list2.add(i); });
t1.start(); t2.start();

t1.join();      // the main thread waits for t1
t2.join();      // …and t2
System.out.println(list1.size() + " " + list2.size());   // 1000000 1000000
```

`join()` pauses **the thread it's called in** until **the thread it's called on** finishes. There's a timeout version: `t.join(500)` or `t.join(Duration.ofSeconds(1))` (Java 19+).

## Thread order isn't guaranteed

Calling `start()` on three threads in a row doesn't mean they'll run in that order: `1 3 2`, `2 1 3` — anything goes. If thread B depends on A's result, synchronise them explicitly (`join`, `CountDownLatch`, `Future`…) instead of relying on start order.

## Thread life cycle

| State (`Thread.State`) | When |
|---|---|
| `NEW` | Created, `start()` not called yet |
| `RUNNABLE` | Running or ready to run |
| `BLOCKED` | Waiting for a monitor (`synchronized`) |
| `WAITING` | `join()`, `wait()` without a timeout |
| `TIMED_WAITING` | `sleep()`, `join(ms)`, `wait(ms)` |
| `TERMINATED` | `run()` has finished — can't be restarted |

## The solution: an array in two threads

```java
static final int SIZE = 10_000_000, HALF = SIZE / 2;

static void withConcurrency() throws InterruptedException {
    float[] arr = new float[SIZE];
    Arrays.fill(arr, 1f);
    long before = System.currentTimeMillis();

    float[] a = new float[HALF], b = new float[HALF];
    System.arraycopy(arr, 0, a, 0, HALF);
    System.arraycopy(arr, HALF, b, 0, HALF);

    Thread t1 = new Thread(() -> calc(a, 0));
    Thread t2 = new Thread(() -> calc(b, HALF));    // index offset!
    t1.start(); t2.start();
    t1.join(); t2.join();

    System.arraycopy(a, 0, arr, 0, HALF);
    System.arraycopy(b, 0, arr, HALF, HALF);
    System.out.println("With threads: " + (System.currentTimeMillis() - before) + " ms");
}

static void calc(float[] part, int offset) {
    for (int i = 0; i < part.length; i++) {
        float f = i + offset;
        part[i] = (float) (part[i] * Math.sin(0.2f + f / 5) * Math.cos(0.2f + f / 5) * Math.cos(0.4f + f / 2));
    }
}
```

:::warning "A subtlety the video misses"
In the second half the index `i` starts from zero, while in the single-threaded version those positions had values `5,000,000…`. For both methods to give the same result, pass an **offset**. Check: `Arrays.equals(result1, result2)`.
:::

:::tip "How to measure time properly"
`System.currentTimeMillis()` is "wall-clock time" and can be thrown off by clock changes. For measurements use `System.nanoTime()`. For honest benchmarks — **JMH** (it accounts for JIT warm-up): the first runs in a JVM are always slower.
:::

## Homework

:::task video "An array in one and in two threads — from the video"
Create a `float` array of 10 million elements, fill it with ones and recompute each element using the formula from the video. Method 1 — in a single thread; method 2 — split the array into two halves (`System.arraycopy`), compute them in two threads, glue them back. Compare the time. {{t j2 1:30:24}}
??? Hint
Wait for both threads with `join()` before gluing. Solution: {{t j2 1:31:58}}
:::

:::task easy "A stoppable timer"
Start a timer that prints seconds, and stop it from `main` after 5 seconds with `interrupt()`. The timer should print "Stopped" and finish cleanly.
:::

:::task medium "N threads instead of two"
Generalise the task from the video to `N` threads (`N = availableProcessors()`). Compare the time for `N = 1, 2, 4, 8, 16`. When does the speed-up stop growing, and why?
:::

:::task hard "Thread states"
Write a program that prints `getState()` of one thread in all six states: `NEW`, `RUNNABLE`, `TIMED_WAITING` (sleep), `WAITING` (join on another thread), `BLOCKED` (waiting for a `synchronized` held by the main thread), `TERMINATED`.
??? Hint
For `BLOCKED`: the main thread enters `synchronized (lock)`, starts a thread that also tries to enter `synchronized (lock)`, sleeps a little and prints its state.
:::
