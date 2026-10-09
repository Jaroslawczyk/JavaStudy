**Serialisation** turns an object into a stream of bytes (to save it to a file or send it over a network); **deserialisation** is the reverse. We cover `Serializable`, `ObjectOutputStream`/`ObjectInputStream`, the rules for fields and parents, `transient`, `Externalizable` and `serialVersionUID` — frequent interview questions. And an important addition: why built-in serialisation is hardly used today.

## Video timestamps

- {{t j2 6:27:59}} — saving and restoring objects
- {{t j2 6:29:25}} — how to save a `User` object to a file
- {{t j2 6:29:41}} — `ObjectOutputStream` on top of `FileOutputStream`
- {{t j2 6:31:07}} — `writeObject()` and `NotSerializableException`
- {{t j2 6:31:19}} — what serialisation is
- {{t j2 6:31:43}} — `Serializable` is a marker interface
- {{t j2 6:32:22}} — `ObjectInputStream` and `readObject()`
- {{t j2 6:33:35}} — deserialisation
- {{t j2 6:34:04}} — the constructor isn't called on deserialisation
- {{t j2 6:35:46}} — the class changed — old data can't be read
- {{t j2 6:36:38}} — all fields must be serialisable
- {{t j2 6:37:36}} — `transient`
- {{t j2 6:38:28}} — the parent class `Person`
- {{t j2 6:39:52}} — the rule for parents: serialisable or a no-arg constructor
- {{t j2 6:40:52}} — `Externalizable`
- {{t j2 6:41:47}} — how Java knows a class has changed
- {{t j2 6:42:48}} — `serialVersionUID`
- {{t j2 6:44:36}} — why declare it by hand
- {{t j2 6:45:15}} — summary
- {{t j2 6:46:48}} — homework: a collection of cats
- {{t j2 6:47:27}} — the solution

## Serialisation and deserialisation

```java
public class User implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String name;
    private int age;
    private transient String password;     // not saved
    // constructor, getters, toString
}

// writing
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("users.bin"))) {
    out.writeObject(new User("John", 25, "secret"));
}

// reading
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("users.bin"))) {
    User user = (User) in.readObject();    // ClassNotFoundException, IOException
    System.out.println(user);              // password = null
}
```

## The rules (they get asked)

1. The class implements **`Serializable`** (a marker interface with no methods) or `Externalizable`. Otherwise — `NotSerializableException`.
2. All fields are serialisable too (`String`, primitives, `ArrayList`, etc.) **or** marked `transient`. The whole graph of objects reachable by references is serialised.
3. `transient` fields get default values on restore: `null`, `0`, `false`. `static` fields aren't serialised at all — they belong to the class.
4. If the **parent isn't serialisable**, it must have an accessible no-arg constructor: it's called during deserialisation for the "non-serialisable part", and that part's fields aren't restored ({{t j2 6:43:41}} — the first and last names became `null`).
5. **The serialisable class's constructor isn't called** — the object is assembled directly from the bytes.

:::note "A correction to the video"
The author says "the compiler looks at the version number". The `serialVersionUID` comparison is done not by the compiler but by the JVM **during deserialisation**. If the number isn't declared explicitly, it's computed from the class structure (fields, methods, interfaces), so any change to the class breaks reading old data: `InvalidClassException: local class incompatible`.
:::

## serialVersionUID

```java
@Serial                                           // Java 14: the compiler checks the declaration
private static final long serialVersionUID = 1L;
```

- **Always declare it explicitly** in serialisable classes — otherwise the ID depends on the compiler and the slightest change to the class.
- A compatible change (a field was added) — keep the number; the new field gets its default value when old data is read.
- An incompatible one (a field's type changed) — bump the number so old data is rejected explicitly.

## Serializable vs Externalizable

| | `Serializable` | `Externalizable` |
|---|---|---|
| Methods | none (marker) | `writeExternal`, `readExternal` |
| Who writes the data | the JVM automatically | you, by hand |
| Constructor on read | not called | a **public no-arg** one is called |

A middle ground — private methods `writeObject(ObjectOutputStream)` / `readObject(ObjectInputStream)` in a `Serializable` class: you can add your own logic to the automatic serialisation (encryption, invariant checks).

:::warning "Built-in serialisation is dangerous"
Deserialising untrusted data is one of Java's best-known vulnerabilities: a crafted byte stream can execute arbitrary code during `readObject()` via chains of classes from libraries on the classpath (gadget chains). Java's architects have called serialisation a "horrible mistake". If you do need it, use **deserialisation filters** (`ObjectInputFilter`, Java 9; a filter factory — Java 17, JEP 415) and never read objects from the network/from users without them.
:::

:::outdated "What's used instead of Serializable"
- **JSON** (Jackson, Gson, JSON-B) — REST APIs, configs, storage;
- **Protocol Buffers, Avro** — compact binary formats for services and Kafka;
- **records** serialise more safely: reading calls the canonical constructor with its checks.

You need to know `Serializable` for interviews and legacy code (RMI, caches, sessions), but in new code choose an explicit data format.
:::

## Homework

:::task video "A collection of cats — from the video"
A `Cat` class (name, breed, weight). Create a list of cats, save **the whole list** to a file with one `writeObject`, then read it back and print the names in a loop. {{t j2 6:46:48}}
??? Hint
An `ArrayList` is serialisable if its elements are. On read — `(List<Cat>) in.readObject()` (an `unchecked` warning). Solution: {{t j2 6:47:27}}
:::

:::task easy "transient and static"
Add a field `transient int mood` and `static int count` to `Cat`. Save an object, change `count`, read the object. What happened to each field and why?
:::

:::task medium "Class evolution"
Save a `User` with an explicit `serialVersionUID = 1L`. Add an `email` field — read the old file (what's in `email`?). Then change `age`'s type to `String` and try again. Repeat the experiment without an explicit UID.
:::

:::task hard "JSON instead of Serializable"
Add Jackson (`com.fasterxml.jackson.core:jackson-databind`) and save the same list of cats as JSON via `ObjectMapper` (`writeValue`/`readValue` with `TypeReference<List<Cat>>`). Make `Cat` a `record`. Compare the file sizes and readability; explain why JSON is safer when receiving data from outside.
:::
