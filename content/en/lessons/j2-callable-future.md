Tasks are usually needed not to print to the console but for their **result**: load a user's name, compute a report. Meet `Callable`, `Future` and the `submit` method, plus `ThreadFactory` — a way to configure pool threads (for example, make them daemons).

## Video timestamps

- {{t j2 2:39:44}} — task: a daemon timer in an `ExecutorService`
- {{t j2 2:42:10}} — the problem: `Runnable` has no `setDaemon`
- {{t j2 2:42:32}} — `ThreadFactory`: we create the pool's threads ourselves
- {{t j2 2:44:13}} — task: loading a user's name and age
- {{t j2 2:46:29}} — `run()` returns nothing
- {{t j2 2:46:48}} — `submit()` returns a `Future<T>`
- {{t j2 2:47:41}} — `Callable<T>` and the `call()` method
- {{t j2 2:48:39}} — `call()` can throw checked exceptions
- {{t j2 2:49:01}} — `future.get()` waits for the result
- {{t j2 2:50:46}} — mini-task: load the age
- {{t j2 2:52:33}} — a trap: the timer took the pool's only thread
- {{t j2 2:53:15}} — summary: `execute` vs `submit`, `Runnable` vs `Callable`, `ThreadFactory`

## ThreadFactory: how a pool creates threads

A pool creates its threads itself, so you can't call `setDaemon` on them directly. But every `Executors` factory accepts a `ThreadFactory`:

```java
ThreadFactory daemonFactory = runnable -> {
    Thread t = new Thread(runnable);
    t.setDaemon(true);
    t.setName("timer-" + t.threadId());
    return t;
};
ExecutorService executor = Executors.newFixedThreadPool(3, daemonFactory);
```

Every task now runs in a daemon thread. A factory also sets thread names (very helpful in logs and dumps), priorities and an `UncaughtExceptionHandler`.

:::tip "Ready-made builders"
Since Java 21 a factory can come from a builder: `Thread.ofPlatform().daemon().name("timer-", 0).factory()` — names `timer-0`, `timer-1`… with no manual code.
:::

## Callable and Future

```java
Future<String> futureName = executor.submit(() -> {   // Callable<String>
    Thread.sleep(5000);                               // simulated loading
    return "John";
});
Future<Integer> futureAge = executor.submit(() -> {
    Thread.sleep(4000);
    return 25;
});

String name = futureName.get();    // wait for the result (blocks the current thread)
int age = futureAge.get();
System.out.println("\nName: " + name + ", age: " + age);   // ~5 s, not 9: the tasks ran in parallel
```

| | `Runnable` | `Callable<V>` |
|---|---|---|
| Method | `void run()` | `V call() throws Exception` |
| Result | none | yes |
| Checked exceptions | can't throw | can |

| | `execute(Runnable)` | `submit(Runnable / Callable)` |
|---|---|---|
| Returns | `void` | `Future<?>` / `Future<V>` |
| Exception in the task | printed, the pool thread dies | stored in the `Future`, rethrown from `get()` as `ExecutionException` |

`Future` methods: `get()`, `get(timeout, unit)`, `isDone()`, `cancel(mayInterrupt)`, `isCancelled()`; since Java 19 — `resultNow()`, `exceptionNow()`, `state()`.

:::warning "The trap from the video: a one-thread pool"
In the video the timer's infinite loop took the only thread of `newSingleThreadExecutor`, and the loading tasks **never started** ({{t j2 2:52:33}}). Rule: long-lived tasks shouldn't share a bounded pool with short ones — otherwise the pool "starves" (thread starvation). Use a separate pool for the timer or more threads.
:::

## What the video doesn't cover

### invokeAll and invokeAny

```java
List<Callable<Integer>> tasks = List.of(() -> 1, () -> 2, () -> 3);
List<Future<Integer>> results = executor.invokeAll(tasks);   // waits for all
Integer fastest = executor.invokeAny(tasks);                 // the first successful one
```

### CompletableFuture — asynchronous chains

`Future.get()` blocks the thread. `CompletableFuture` (Java 8) lets you describe **what to do when the result is ready** without blocking:

```java
CompletableFuture<String> name = CompletableFuture.supplyAsync(() -> loadName());
CompletableFuture<Integer> age = CompletableFuture.supplyAsync(() -> loadAge());

name.thenCombine(age, (n, a) -> n + ", " + a)
    .thenAccept(System.out::println)
    .exceptionally(ex -> { log(ex); return null; })
    .join();
```

Methods: `thenApply` (transform), `thenCompose` (the next async task), `thenCombine` (combine two), `allOf`/`anyOf`, `orTimeout` (Java 9).

### Structured concurrency (preview)

`StructuredTaskScope` runs subtasks as a single unit: if one fails the others are cancelled, and the tasks' lifetime is bounded by a block. As of 2026 the API is still in **preview** and changes from version to version — check the JEP before using it.

## Homework

:::task video "Name and age — from the video"
Using an `ExecutorService` with a daemon thread factory, start a timer printing "loading" dots, plus two `Callable` tasks: load the name (5 s) and the age (4 s). Print "Name: …, age: …" and make sure the timer stopped by itself. {{t j2 2:50:46}}
??? Hint
The pool needs at least 3 threads — the infinite timer occupies one. Solution: {{t j2 2:51:05}}
:::

:::task easy "A sum in a Callable"
Split the sum of numbers from 1 to 100,000,000 into 4 parts, compute each in a `Callable<Long>` via `invokeAll`, add up the results. Check against the formula `n * (n + 1) / 2`.
:::

:::task medium "Timeout and cancellation"
Submit a task that sleeps 10 seconds. Call `future.get(2, SECONDS)`, catch the `TimeoutException`, cancel the task with `cancel(true)` and prove (by printing in a `catch (InterruptedException)` inside the task) that it really was interrupted.
:::

:::task hard "A price aggregator with CompletableFuture"
Simulate three "shops", each returning a product price after a random 0.5–3 s delay (and sometimes an exception). Using `CompletableFuture`, query all three in parallel, ignore the failed ones (`exceptionally`/`handle`), limit each request to 2 seconds (`completeOnTimeout`) and print the lowest price. The total time should be no more than ~2 s.
:::
