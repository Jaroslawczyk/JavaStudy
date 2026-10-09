**Virtual threads** (Java 21, JEP 444) are the biggest change to Java concurrency in years. They're lightweight threads managed by the JVM rather than the operating system. You can create a million of them, and they let you write simple blocking "thread-per-request" code that scales like asynchronous code.

## The problem with platform threads

A regular `Thread` = an OS thread: a ~1 MB stack, expensive creation and switching. A server with a pool of 200 threads handles at most 200 concurrent requests — even if each one spends 95% of its time just **waiting** for the database or an external API. This used to be solved with reactive programming (WebFlux, `CompletableFuture`), but such code is hard to write, read and debug.

## How virtual threads work

- A virtual thread runs on a **carrier thread** from a small `ForkJoinPool` (sized to the number of cores).
- When a virtual thread blocks on I/O (`socket.read`, JDBC, `Thread.sleep`, `BlockingQueue.take`), the JVM **unmounts** it from the carrier, storing its stack on the heap, and runs another virtual thread on the carrier.
- When the data arrives, the thread is mounted again on some carrier and continues.

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 100_000).forEach(i ->
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));     // a blocking call — and that's fine
            return i;
        }));
}   // 100,000 tasks finish in about a second

Thread.ofVirtual().name("worker-", 0).start(task);
Thread.startVirtualThread(task);
```

## Usage rules

| ✅ Do | ❌ Don't |
|---|---|
| A new virtual thread per task | Pool virtual threads — they're cheap, there's no point |
| Blocking code: JDBC, `HttpClient`, `sleep` | Expect a speed-up for CPU tasks — the core count is the same |
| Limit access to a resource with a `Semaphore` (e.g. 50 DB connections) | Limit parallelism through the pool size |
| `ReentrantLock` or `synchronized` (Java 24+) | Huge objects in `ThreadLocal` — there'll be millions of copies |

:::outdated "Pinning and synchronized"
In Java 21–23 blocking inside `synchronized` "pinned" a virtual thread to its carrier, and under load carriers ran out. The advice "replace `synchronized` with `ReentrantLock`" applied until **Java 24** — JEP 491 removed the problem. Pinning remains only when calling native code (JNI) and in rare cases; diagnose it with the JFR event `jdk.VirtualThreadPinned`.
:::

## In frameworks

- **Spring Boot 3.2+**: `spring.threads.virtual.enabled=true` — Tomcat/Jetty, `@Async` and schedulers switch to virtual threads.
- **Quarkus**: the `@RunOnVirtualThread` annotation.
- **Helidon 4** is built entirely on virtual threads.

For a typical REST service "request → DB → external API → response" this often means higher throughput without rewriting code.

## Nearby: Structured Concurrency and Scoped Values

- **Scoped Values** (finalised in Java 25, JEP 506) — an immutable replacement for `ThreadLocal` for passing context (user, trace id) down the call chain, suited to millions of threads.
- **Structured Concurrency** (`StructuredTaskScope`) — running subtasks as a unit with shared cancellation on failure. As of 2026 the API is still in preview.

:::interview "Interview questions"
**How does a virtual thread differ from a platform thread?** — A platform thread wraps an OS thread; it's heavy and limited in number. A virtual thread is managed by the JVM, is mounted on a carrier thread only while executing code, and releases the carrier when it blocks on I/O; you can create millions of them.

**Will virtual threads speed up sorting a large array?** — No: they help tasks that wait (I/O-bound), not computational ones (CPU-bound).
:::

## Homework

:::task easy "10,000 requests"
Simulate 10,000 "requests", each sleeping 200 ms. Run them via `newFixedThreadPool(100)` and via `newVirtualThreadPerTaskExecutor()`. Compare the total time.
:::

:::task medium "A parallel downloader"
Using `HttpClient` and virtual threads, download 50 pages (e.g. different Wikipedia articles) in parallel, but no more than 10 at a time (`Semaphore`). Print each page's size and the total time. Compare with sequential downloading.
:::

:::task hard "Find the pinning"
Write a service where virtual threads block inside `synchronized`, and run it on Java 21 and Java 25 with `-Djdk.tracePinnedThreads=full` (Java 21) or a JFR recording (`jdk.VirtualThreadPinned`). Compare throughput with 10,000 concurrent tasks and explain the difference in terms of JEP 491.
:::
