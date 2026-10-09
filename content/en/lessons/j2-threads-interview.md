An interim "interview" on concurrency basics. As usual: read the question, **answer out loud**, then open the answer. The answers are extended with modern details — they'll earn you extra points in an interview.

## Video timestamps

- {{t j2 2:18:10}} — the interview format
- {{t j2 2:18:23}} — questions 1–5: concurrency, stopping a thread, `join`
- {{t j2 2:19:53}} — questions 6–7: a reference to the main thread, `InterruptedException`
- {{t j2 2:20:32}} — questions 8–10: synchronisation and monitors
- {{t j2 2:21:49}} — questions 11–14: daemons, creating threads, `run` and `start`
- {{t j2 2:23:04}} — wrap-up

## Questions

:::task video "1. What is multithreading?"
{{t j2 2:18:23}}
??? Answer
A program's ability to run several tasks at the same time in different threads. Threads of one process share memory (the heap), but each has its own stack.
:::

:::task video "2. Can you stop a thread after it starts? How?"
{{t j2 2:18:36}}
??? Answer
Via `interrupt()` — cooperatively: the thread checks the flag itself or gets an `InterruptedException`. The deprecated `stop()` throws `UnsupportedOperationException` since Java 20 (the video still mentions it as working but not recommended).
:::

:::task video "3. Why shouldn't you stop a thread with stop()?"
{{t j2 2:18:57}}
??? Answer
The thread is cut off at an arbitrary point: data (a file, a DB record, an object under a monitor) is left in an inconsistent state.
:::

:::task video "4. What happens when interrupt() is called? Why is it safer?"
{{t j2 2:19:17}}
??? Answer
The interrupt flag is set; if the thread is sleeping/waiting it gets an `InterruptedException`. The thread decides how to finish correctly, so data stays intact.
:::

:::task video "5. What does join() do?"
{{t j2 2:19:40}}
??? Answer
Pauses the thread it's called in until the thread it's called on finishes. There's a timeout version.
:::

:::task video "6. How do you get a reference to the main thread?"
{{t j2 2:19:53}}
??? Answer
Call `Thread.currentThread()` in the main thread (the static method returns the current thread). The reference can be stored and passed to other threads.
:::

:::task video "7. Why must sleep() and join() be wrapped in try-catch?"
{{t j2 2:20:14}}
??? Answer
They throw the checked `InterruptedException` if the thread is interrupted while waiting. Handling: finish the work or restore the flag with `Thread.currentThread().interrupt()`.
:::

:::task video "8. What synchronisation methods do you know?"
{{t j2 2:20:32}}
??? Answer
`synchronized` in a method signature and a `synchronized` block with a monitor object. In addition (not from the video): `ReentrantLock`/`ReadWriteLock`, atomics, thread-safe collections, `volatile` for visibility.
:::

:::task video "9. What is the monitor of a synchronized method?"
{{t j2 2:21:00}}
??? Answer
`this` — the object the method is called on. For `static synchronized` — the class object (`MyClass.class`).
:::

:::task video "10. One thread is in a synchronized method. Can another call another synchronized or a regular method?"
{{t j2 2:21:11}}
??? Answer
A regular one — yes, as often as you like. Another `synchronized` method on the **same** monitor — no, the thread will wait. On a different monitor — yes.
:::

:::task video "11. What is a daemon thread?"
{{t j2 2:21:49}}
??? Answer
A background thread that ends automatically when all user (non-daemon) threads have finished. Set with `setDaemon(true)` before `start()`.
:::

:::task video "12. What ways of creating a thread do you know?"
{{t j2 2:22:04}}
??? Answer
Extend `Thread` or implement `Runnable`. Modern: `ExecutorService` with `Runnable`/`Callable`, `CompletableFuture`, `Thread.ofVirtual()` (Java 21).
:::

:::task video "13. Which way is preferable and why?"
{{t j2 2:22:15}}
??? Answer
`Runnable`: the class stays free to extend something else, and the task is separated from the execution mechanism (it can be handed to a pool or a virtual thread).
:::

:::task video "14. How do run() and start() differ?"
{{t j2 2:22:30}}
??? Answer
`start()` creates a new thread and calls `run()` in it. Calling `run()` directly executes the code in the current thread. A second `start()` throws `IllegalThreadStateException`.
:::

## Extra questions (not from the video, but common)

:::task easy "What states can a thread be in?"
List the values of `Thread.State`.
??? Answer
`NEW`, `RUNNABLE`, `BLOCKED`, `WAITING`, `TIMED_WAITING`, `TERMINATED`.
:::

:::task medium "volatile vs synchronized"
How do they differ, and can one replace the other?
??? Answer
`volatile` gives visibility and ordering but no mutual exclusion and no atomicity of compound operations. `synchronized` gives both mutual exclusion and visibility. You can replace `synchronized` with `volatile` only when the operation is a single write/read (a flag).
:::

:::task medium "What is happens-before?"
Explain with an example.
??? Answer
A Java Memory Model guarantee: if action A happens-before B, A's results are visible to B. Examples: exiting `synchronized` → entering on the same monitor; a `volatile` write → a later read; `start()` → the first action in the thread; a thread's last action → return from `join()`.
:::

:::task hard "Why is wait() called in a loop?"
Explain (the topic of upcoming lessons).
??? Answer
"Spurious wakeups" are possible, and while the thread was waking up another thread may have changed the condition. So the condition is rechecked: `while (!condition) lock.wait();`.
:::
