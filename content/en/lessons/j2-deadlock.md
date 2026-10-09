A **deadlock** is a situation where threads wait for each other forever. The program doesn't crash and prints no errors — it simply "freezes". We reproduce a deadlock with transfers between two accounts and learn how to prevent it. In the homework — a multifunction printer that can print and scan at the same time.

## Video timestamps

- {{t j2 3:12:12}} — what a deadlock is
- {{t j2 3:12:28}} — an `Account` class with two accounts and two monitors
- {{t j2 3:13:34}} — transfer 1→2: monitor 1, then monitor 2
- {{t j2 3:16:15}} — transfer 2→1: monitor 2, then monitor 1
- {{t j2 3:17:32}} — two threads transfer in opposite directions
- {{t j2 3:18:15}} — the program hangs
- {{t j2 3:18:24}} — breakdown: each thread holds its monitor and waits for the other's
- {{t j2 3:19:50}} — summary: deadlock
- {{t j2 3:20:06}} — a task on previous topics: the MFP
- {{t j2 3:21:18}} — solution: two monitors

## How a deadlock happens

```java
public class Account {
    private final Object monitor1 = new Object(), monitor2 = new Object();
    private int amount1, amount2;

    public void transfer1to2(int amount) {
        synchronized (monitor1) {
            sleep(2000);
            synchronized (monitor2) {             // waiting for monitor 2
                amount1 -= amount; amount2 += amount;
            }
        }
    }

    public void transfer2to1(int amount) {
        synchronized (monitor2) {
            sleep(2000);
            synchronized (monitor1) {             // waiting for monitor 1
                amount2 -= amount; amount1 += amount;
            }
        }
    }
}
```

| Time | Thread 1 (`transfer1to2`) | Thread 2 (`transfer2to1`) |
|---|---|---|
| t1 | took monitor 1 | took monitor 2 |
| t2 | waits for monitor 2 ⏳ | waits for monitor 1 ⏳ |
| ∞ | waiting… | waiting… |

### The four Coffman conditions

A deadlock is possible only if all four hold:
1. **Mutual exclusion** — a resource can be held by only one thread.
2. **Hold and wait** — a thread holds one resource and waits for another.
3. **No preemption** — a resource can't be taken away.
4. **Circular wait** — A waits for B, B waits for A.

Break any one — and a deadlock becomes impossible.

## How to prevent it

**1. A single lock order** (breaks circular wait) — the most common way:

```java
static void transfer(Account from, Account to, int amount) {
    Account first  = from.id < to.id ? from : to;   // always the smaller id first
    Account second = from.id < to.id ? to : from;
    synchronized (first) {
        synchronized (second) {
            from.balance -= amount;
            to.balance += amount;
        }
    }
}
```

**2. Try with a timeout** (breaks "hold and wait") — `ReentrantLock.tryLock(timeout)`: if you can't get the second lock, release the first and retry later.

**3. Fewer nested locks** — one monitor per operation, immutable data, message queues instead of shared objects.

:::tip "How to find a deadlock in a running program"
Take a thread dump: `jstack <pid>` (or `jcmd <pid> Thread.print`, or the "camera" button in the IntelliJ debugger). The JVM itself writes at the end: **"Found one Java-level deadlock"** — and shows which thread holds which monitor and what it waits for. It's also visible in VisualVM and JDK Mission Control.
:::

## Livelock and starvation

- **Livelock** — threads aren't blocked but endlessly give way to each other (two people in a corridor stepping to the same side). Fixed with a random delay before retrying.
- **Starvation** — a thread never gets a resource because others keep taking it. Fixed with "fair" locks (`new ReentrantLock(true)`) and bounded queues.

:::interview "Interview question"
**What is a deadlock and how do you avoid it?** — Mutual blocking: each thread holds a resource and waits for a resource held by another — forever. Avoid it by always acquiring locks in the same order, using `tryLock` with a timeout, and reducing lock nesting. Detect it with a thread dump (`jstack`).
:::

## Homework

:::task video "The MFP — from the video"
A multifunction printer class with methods `print(int pages)` and `scan(int pages)`: they print "Printed 1, 2, 3…" / "Scanned…" with a small delay. From different threads you can print and scan at the same time, but not run two prints or two scans at once. {{t j2 3:20:06}}
??? Hint
Two different monitors: `printMonitor` and `scanMonitor`. Solution: {{t j2 3:21:18}}
:::

:::task easy "Reproduce the deadlock"
Repeat the example from the video, then take a thread dump (`jstack` or the IDEA button) and find the deadlock line in it. Which monitors are listed?
:::

:::task medium "Fix the account"
Fix the `Account` class in two ways: a single monitor-acquisition order and `ReentrantLock.tryLock(100, MILLISECONDS)` with retries. Run 10,000 opposite transfers in 8 threads — the program must not hang and the total must be preserved.
:::

:::task hard "Dining philosophers"
The classic problem: 5 philosophers at a round table, one fork between neighbours; to eat you need both forks. Implement the "naive" solution (each takes the left fork, then the right) and get a deadlock. Then fix it: ordering forks by number, and a `Semaphore(4)` variant (a "waiter" lets no more than 4 sit down). Compare how many times each philosopher ate in 10 seconds.
:::
