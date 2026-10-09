The last concurrency lesson — two more synchronisers: a **`Semaphore`** limits how many threads work with a resource at once, and a **`CyclicBarrier`** gathers threads at one point. At the end — a big "car race with a tunnel" task where everything you've learned comes in handy.

## Video timestamps

- {{t j2 3:31:28}} — why limit the number of threads (downloading 100 files)
- {{t j2 3:32:41}} — a "work with the file system" method
- {{t j2 3:35:37}} — 10 threads hit the file system at once
- {{t j2 3:35:59}} — an attempt with a 3-thread pool — we lose parallelism
- {{t j2 3:36:57}} — `Semaphore(3)`: `acquire()` and `release()`
- {{t j2 3:38:19}} — `release()` goes in `finally`
- {{t j2 3:40:48}} — `CyclicBarrier`: preparing data in 10 threads
- {{t j2 3:42:15}} — the same with `CountDownLatch`
- {{t j2 3:43:04}} — waiting in pairs: `CountDownLatch` doesn't fit
- {{t j2 3:44:13}} — `CyclicBarrier` resets and works again
- {{t j2 3:46:09}} — homework: the race
- {{t j2 3:48:36}} — the solution

## Semaphore

A semaphore holds a number of "permits". `acquire()` takes a permit (or waits if there are none), `release()` returns it.

```java
private static final Semaphore semaphore = new Semaphore(3);   // at most 3 threads

static void workWithFileSystem() {
    String name = Thread.currentThread().getName();
    try {
        semaphore.acquire();                   // −1 or wait
        try {
            System.out.println(name + " works with the file system");
            Thread.sleep(1000);
        } finally {
            semaphore.release();               // +1, even on failure
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}
```

All 10 threads do "their own" work in parallel, but at most three get into the critical section at once. A 3-thread pool can't do that: it would limit **all** the work ({{t j2 3:36:36}}).

:::warning "release — strictly in finally and strictly after a successful acquire"
If `acquire()` was interrupted, no permit was obtained — and `release()` must not be called, otherwise there'll be more permits than before. So `release` goes in the **inner** `try` after `acquire`, not the outer one.
:::

Where it's used: limiting simultaneous requests to an external API, connection pools, rate limiting. `new Semaphore(n, true)` — "fair" mode (FIFO).

## CyclicBarrier

A barrier for N parties: each one that reaches the point calls `await()` and waits; once all N have gathered, the barrier opens and they all continue at once. Then the barrier is **automatically re-armed**.

```java
CyclicBarrier barrier = new CyclicBarrier(2, () -> System.out.println("Pair ready!"));

executor.execute(() -> {
    prepareData();
    try {
        barrier.await();                  // wait for one more
    } catch (InterruptedException | BrokenBarrierException e) {
        throw new RuntimeException(e);
    }
    System.out.println(Thread.currentThread().getName() + " continues");
});
```

The second constructor argument is an action run each time the barrier opens. If one of the waiters is interrupted, the barrier "breaks" and the others get a `BrokenBarrierException`.

| | `CountDownLatch` | `CyclicBarrier` | `Semaphore` |
|---|---|---|---|
| Idea | wait for N events | N threads wait for each other | at most N threads inside |
| Who waits | any threads via `await()` | the parties themselves | those wanting to enter |
| Reusable | ❌ single-use | ✅ resets | ✅ |

:::note "Phaser and Exchanger"
The video mentions "a few other classes". **`Phaser`** (Java 7) is a flexible barrier with a variable number of parties and many phases. **`Exchanger`** is a point where two threads swap data.
:::

## The race solution (in brief)

- 10 cars = 10 tasks in an `ExecutorService`.
- Start simultaneously after preparation → `CyclicBarrier(10)` (or `CountDownLatch`).
- No more than 3 cars in the tunnel → `Semaphore(3)` around the "tunnel" stage.
- Results → `ConcurrentHashMap<Integer, Long>`.
- Wait for everyone to finish → `CountDownLatch(10)`.
- The winner is the first to finish: a `synchronized` block (or `AtomicInteger.compareAndSet(-1, index)`) around "if there's no winner yet — it's me".

## Homework

:::task video "A race with a tunnel — from the video"
10 car threads. Each prepares for a random time; they all start at once. Route: road → tunnel → road, each stage taking a random time; no more than 3 cars in the tunnel at once. At the end, print the winner with their time and a table of all results. {{t j2 3:46:09}}
??? Hint
`CyclicBarrier` for the start, `Semaphore` for the tunnel, `ConcurrentHashMap` for results, `CountDownLatch` for the finish. Solution: {{t j2 3:48:36}}
:::

:::task easy "A car park"
A car park with 3 spaces (`Semaphore(3)`), 10 car threads: they arrive, wait for a space, stay a random time, leave. Log "entered / left / free spaces: N" (`availablePermits()`).
:::

:::task medium "A request limiter"
Write a `RateLimiter` that lets through at most 5 simultaneous calls to an "external API" and refuses if the wait exceeds 1 second (`tryAcquire(1, SECONDS)`). Load it with 50 threads and count successes and refusals.
:::

:::task hard "A phased parallel matrix"
A 1000×1000 matrix, 4 threads, each handling its own quarter of the rows. A 10-iteration algorithm: on each iteration a cell's value = the average of its neighbours from the **previous** iteration. Use `CyclicBarrier(4, swapBuffers)` so all threads finish an iteration before the next one starts. Compare the result with the single-threaded one.
:::
