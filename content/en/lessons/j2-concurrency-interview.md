The final "interview" on concurrency — one of the main topics in a Java developer interview. Answer out loud, mark your weak spots and go back to the lessons. The answers are refined where the video simplifies or is out of date.

## Video timestamps

- {{t j2 4:00:31}} — start of the interview
- {{t j2 4:00:47}} — creating threads
- {{t j2 4:01:24}} — `wait`, `notify`, `notifyAll`, monitors, deadlock
- {{t j2 4:02:37}} — synchronised collections
- {{t j2 4:03:07}} — `ExecutorService`, `submit`/`execute`, `Callable`, pools, `ThreadFactory`
- {{t j2 4:05:10}} — daemons, atomics, `volatile`
- {{t j2 4:06:31}} — `Semaphore`, `CountDownLatch`, `CyclicBarrier`
- {{t j2 4:08:06}} — end of the section

## Questions

:::task video "1. What ways of creating threads do you know? Which is better?"
{{t j2 4:00:47}}
??? Answer
Extend `Thread` or implement `Runnable` (better — no single-inheritance limit, the task is separated from the executor). Also: `Callable` + `ExecutorService`, `CompletableFuture`, virtual threads (`Thread.ofVirtual()`, Java 21).
:::

:::task video "2. Tell me about wait, notify, notifyAll. On which objects can they be called?"
{{t j2 4:01:24}}
??? Answer
`Object` methods for coordinating threads via a monitor. Called on the object used as the monitor, **only inside `synchronized` on it** (otherwise `IllegalMonitorStateException`).
:::

:::task video "3. What does wait() do?"
{{t j2 4:01:44}}
??? Answer
Puts the thread into waiting and **releases the monitor**. The thread wakes on `notify/notifyAll`, `interrupt` or a timeout (`wait(ms)`), then re-acquires the monitor. Called in a loop that checks the condition.
:::

:::task video "4. What do notify() and notifyAll() do?"
{{t j2 4:01:53}}
??? Answer
They wake threads waiting on this monitor: `notify` — one arbitrary thread, `notifyAll` — all (they'll take the monitor one at a time).
:::

:::task video "5. What is the monitor of a synchronized method?"
{{t j2 4:02:13}}
??? Answer
`this`; for a static method — the `Class` object.
:::

:::task video "6. What is a deadlock?"
{{t j2 4:02:21}}
??? Answer
Mutual blocking: threads hold resources and wait forever for each other's resources. (The video says "all threads are waiting"; more precisely — circular waiting.) Prevention: a single lock-acquisition order, `tryLock` with a timeout. Diagnosis — `jstack`.
:::

:::task video "7. What do you know about synchronised collections?"
{{t j2 4:02:37}}
??? Answer
`Collections.synchronizedList/Set/Map` — wrappers with one monitor for all methods. Optimised ones come from `java.util.concurrent`: `ConcurrentHashMap`, `CopyOnWriteArrayList/Set`, `BlockingQueue` queues, `ConcurrentLinkedQueue`.
:::

:::task video "8. Why do we need ExecutorService?"
{{t j2 4:03:07}}
??? Answer
It runs tasks on a pool of reusable threads, manages the task queue and the pool's life cycle, and returns results via `Future`.
:::

:::task video "9. How do submit() and execute() differ?"
{{t j2 4:03:30}}
??? Answer
`execute(Runnable)` returns nothing. `submit(Runnable/Callable)` returns a `Future`; the result or the exception (wrapped in `ExecutionException`) is obtained via `get()`.
:::

:::task video "10. How do Runnable and Callable differ?"
{{t j2 4:03:53}}
??? Answer
`Runnable.run()` returns `void` and can't throw checked exceptions. `Callable<V>.call()` returns `V` and can throw `Exception`.
:::

:::task video "11. What kinds of thread pools do you know?"
{{t j2 4:04:07}}
??? Answer
`newSingleThreadExecutor` (1 thread), `newFixedThreadPool(n)`, `newCachedThreadPool` (grows on demand, idle threads removed after 60 s), `newScheduledThreadPool`, `newWorkStealingPool`, `newVirtualThreadPerTaskExecutor` (Java 21).
:::

:::task video "12. How can you influence the threads an ExecutorService creates?"
{{t j2 4:04:44}}
??? Answer
Pass your own `ThreadFactory` to the `Executors` factory: it creates a `Thread` from a `Runnable` and configures it (`setDaemon`, name, priority, exception handler).
:::

:::task video "13. What is a daemon thread?"
{{t j2 4:05:10}}
??? Answer
A background thread that ends automatically when all user threads have finished. `finally` isn't guaranteed in it.
:::

:::task video "14. What are atomic types for?"
{{t j2 4:05:30}}
??? Answer
They perform compound read-modify-write operations atomically without locks — using CAS. Example: `AtomicInteger.incrementAndGet()` instead of `count++`.
:::

:::task video "15. The volatile keyword: why and where?"
{{t j2 4:06:08}}
??? Answer
It guarantees that writes are visible across threads and forbids reordering around field accesses. It doesn't make `++` atomic. Used for flags and safe publication of references when there's no other synchronisation.
:::

:::task video "16. Semaphore, CountDownLatch, CyclicBarrier — what's the difference?"
{{t j2 4:06:31}}
??? Answer
`Semaphore` lets at most N threads into a section. `CountDownLatch` — threads wait until N operations call `countDown()`; single-use. `CyclicBarrier` — N threads wait for each other at a point, then the barrier resets and can be reused.
:::

## Extra questions (not from the video)

:::task easy "What is ThreadLocal?"
Where is it used and what's the danger?
??? Answer
A variable with its own value in each thread (e.g. a `SimpleDateFormat`, a request/transaction context). The danger: in pools threads live long — forget `remove()` and you get a memory leak and "someone else's" data in the next request. Java 25 introduced **Scoped Values** (JEP 506) for many of these cases.
:::

:::task medium "synchronized vs ReentrantLock"
When to choose which?
??? Answer
`synchronized` is simpler, released automatically, and since Java 24 doesn't pin virtual threads. `ReentrantLock` — when you need `tryLock` with a timeout, interruptible waiting, a fair queue, several `Condition`s. Release strictly in `finally`.
:::

:::task medium "What is CompletableFuture?"
Why is it better than a plain `Future`?
??? Answer
It lets you build non-blocking chains (`thenApply`, `thenCompose`, `thenCombine`, `allOf`), handle errors (`exceptionally`, `handle`) and timeouts without calling the blocking `get()`.
:::

:::task hard "Virtual threads: when do they help and when don't they?"
Explain with examples.
??? Answer
They help with tasks where threads mostly **wait** (HTTP, DB, files): you can hold hundreds of thousands of concurrent tasks with "a thread per request". They don't speed up **computation** (CPU-bound) — the core count is the same. They aren't pooled; limit access to resources with semaphores. Beware of large `ThreadLocal`s in each of a million threads.
:::
