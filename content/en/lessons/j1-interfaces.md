**Polymorphism** means the same call behaves differently depending on the actual object. **Interfaces** describe what an object *can do* and let you work around the ban on multiple inheritance. We cover upcasting, downcasting and `implements`.

## Video timestamps

- {{t j1 4:44:50}} — today's topic: interfaces
- {{t j1 4:45:21}} — an abstract `Animal` class with an `eat()` method
- {{t j1 4:45:51}} — a dog, a cat, a fish, a bird
- {{t j1 4:47:54}} — task: feed all animals in a loop
- {{t j1 4:48:36}} — `List<Animal>` — a common type for all
- {{t j1 4:49:38}} — polymorphism: one interface — many implementations
- {{t j1 4:49:53}} — upcasting to the parent type
- {{t j1 4:50:59}} — after an upcast only the parent's methods are available
- {{t j1 4:51:59}} — downcasting: an explicit cast to the child type
- {{t j1 4:53:11}} — `ClassCastException` on a wrong downcast
- {{t j1 4:54:09}} — task: make only those who can run, run
- {{t j1 4:55:03}} — Java has no multiple inheritance of classes
- {{t j1 4:55:18}} — the `CanRun` interface
- {{t j1 4:56:15}} — `implements` and implementing with <kbd>Ctrl+I</kbd>
- {{t j1 4:57:04}} — `List<CanRun>`: a fish won't get in
- {{t j1 4:59:20}} — upcasting to an interface
- {{t j1 5:00:19}} — a second interface `Flyable`: implementing several
- {{t j1 5:01:42}} — homework

## Polymorphism

```java
public abstract class Animal {
    public abstract void eat();
}

public class Dog extends Animal {
    @Override public void eat() { System.out.println("A bone"); }
    public void run() { System.out.println("The dog runs"); }
}
public class Cat extends Animal {
    @Override public void eat() { System.out.println("Cat food"); }
}
```

```java
List<Animal> animals = new ArrayList<>();
animals.add(new Dog());
animals.add(new Cat());
animals.add(new Fish());
animals.add(new Bird());

for (Animal animal : animals) {
    animal.eat();     // A bone, Cat food, Fish food, Bird seed
}
```

The same call `animal.eat()` — different behaviour. At run time the JVM looks at the object's **actual class** and calls its implementation (dynamic binding).

## Upcast and downcast

```java
Animal animal = new Dog();     // upcast — automatic, always safe
animal.eat();                  // OK — the method exists in Animal
// animal.run();               // compile error: Animal has no run()

Dog dog = (Dog) animal;        // downcast — explicit only
dog.run();                     // now available
```

- **Upcast** (to the parent): the object "looks like" the parent; only the parent's methods are visible. The object itself doesn't change — it's still a dog.
- **Downcast** (to a child): needs an explicit `(Dog)` cast, and you're **responsible** for its correctness.

:::warning "ClassCastException"
```java
Animal animal = new Cat();
Dog dog = (Dog) animal;        // compiles, but throws ClassCastException at run time
```
The compiler can't verify a downcast — the error appears only at run time.
:::

## Interfaces

The task: make dogs, cats and birds run, but not fish. Adding `run()` to `Animal` would make fish "run". Creating a `RunningAnimal` class — but what if a bird can both run and fly? Extending two classes is **not allowed** in Java. The solution is an **interface**:

```java
public interface CanRun {
    void run();          // implicitly public abstract
}

public interface Flyable {
    void fly();
}

public class Dog extends Animal implements CanRun { … }
public class Bird extends Animal implements CanRun, Flyable {   // as many interfaces as you like
    @Override public void eat() { System.out.println("Bird seed"); }
    @Override public void run() { System.out.println("The bird runs"); }
    @Override public void fly() { System.out.println("The bird flies"); }
}
```

```java
List<CanRun> runners = new ArrayList<>();
runners.add(new Dog());
runners.add(new Cat());
runners.add(new Bird());
// runners.add(new Fish());   // error: Fish doesn't implement CanRun

for (CanRun runner : runners) {
    runner.run();
}
```

An interface is a **contract**: "whoever implements me must be able to do this". A class can extend one class but implement **any number** of interfaces. Names often end in `-able`: `Comparable`, `Runnable`, `Serializable`, `Flyable`.

## What the video doesn't cover

### instanceof and pattern matching

Check the type before downcasting:

```java
if (animal instanceof Dog) {          // the classic way
    Dog dog = (Dog) animal;
    dog.run();
}

if (animal instanceof Dog dog) {      // Java 16+: check and cast in one step
    dog.run();
}
```

Even better — design so that no downcast is needed (polymorphism instead of type checks).

### Interfaces in modern Java

Since Java 8 an interface can contain more than abstract methods:

```java
public interface CanRun {
    void run();

    default void runTwice() {        // a default method: an implementation by default (Java 8)
        run();
        run();
    }

    static CanRun nobody() {         // a static method (Java 8)
        return () -> System.out.println("…");
    }

    int MAX_SPEED = 120;             // a constant: public static final
}
```

Since Java 9 interfaces may also have `private` methods (for code shared by default methods).

### Abstract class or interface? (an interview question)

| | Abstract class | Interface |
|---|---|---|
| Inheritance | Only one | Any number |
| Fields | Any (object state) | Only `public static final` constants |
| Constructor | Yes | No |
| Methods | Any, with any access | Abstract, `default`, `static`, `private` |
| Meaning | "Is-a" (common base, shared code) | "Can-do" (capability, contract) |

The rule: describing a **capability** or **contract** — an interface; shared **code and state** for related classes — an abstract class. They're often combined: an interface + an abstract base implementation.

### Interfaces you'll meet constantly

`Comparable<T>` (comparison), `Comparator<T>`, `Runnable` (a task for a thread), `Iterable<T>` (for-each), `List`/`Map`/`Set` (collections are interfaces too!), `AutoCloseable` (try-with-resources). An interface with one abstract method is **functional** and can be implemented with a lambda — the next step after anonymous classes (part 2).

## Homework

:::task video "Workers — from the video"
A `Worker` class with a `name` field, a constructor, a getter and a `voice()` method printing the name. Subclasses `Programmer`, `Driver`, `Cook` (the constructor takes only the name). Interfaces `Codeable` (`writeCode()`), `Cookable` (`cook()`), `Driveable` (`drive()`); each worker implements their own. In `main` create three workers of each profession, hold a roll call (`voice()` for everyone), then make everyone work — you'll need three more loops. {{t j1 5:01:42}}
??? Hint
A `List<Worker>` works for the roll call; `List<Codeable>`, `List<Cookable>`, `List<Driveable>` for the work. The same object can sit in two lists of different types.
:::

:::task easy "instanceof"
In a `List<Animal>`, make those who can run run, using `instanceof CanRun runner` (pattern matching), and print "can't run" for the rest.
:::

:::task medium "Payment methods"
A `PaymentMethod` interface with `boolean pay(double amount)` and `default String receipt(double amount)`. Implementations: `Card` (a limit), `Cash` (change), `Blik` (a 6-digit code). The basket checkout works only with the interface and knows nothing about concrete classes.
:::

:::task hard "Your own Comparable"
Make `Box` implement `Comparable<Box>` (comparison by volume). Sort a `List<Box>` with `Collections.sort(boxes)`. Then sort the same list **by length** using a separate class implementing `Comparator<Box>`. Explain when to use which.
??? Hint
`public int compareTo(Box other) { return Double.compare(volume(), other.volume()); }` — remember the `compare` method from the lesson on objects as parameters? Same idea, just by the JDK standard.
:::
