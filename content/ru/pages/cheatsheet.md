# Конспект Java: коротко и по фактам

Шпаргалка для быстрого повторения. Подробности — в уроках курса.

## Основы

- Java — компилируемый в **байт-код** язык; выполняется в **JVM** (`.java` → `javac` → `.class` → `java`).
- **JDK** = JRE + инструменты (`javac`, `jar`); **JRE** = JVM + библиотеки.
- Точка входа: `public static void main(String[] args)`.
- Имена: классы `PascalCase`, методы и переменные `camelCase`, константы `UPPER_SNAKE`, пакеты `lowercase`.
- Регистр важен. Файл с `public class Foo` называется `Foo.java`.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

## Типы данных

| Тип | Размер | Диапазон / примечание |
|---|---|---|
| `byte` | 8 бит | −128…127 |
| `short` | 16 бит | −32 768…32 767 |
| `int` | 32 бита | ≈ ±2,1 млрд (по умолчанию для целых) |
| `long` | 64 бита | суффикс `L` |
| `float` | 32 бита | суффикс `f` |
| `double` | 64 бита | по умолчанию для дробных |
| `char` | 16 бит | UTF-16, `'a'` |
| `boolean` | — | `true` / `false` |

- Всё остальное — **ссылочные типы** (объекты, массивы, `String`). Значение по умолчанию: `null`; у полей-примитивов — `0` / `false`.
- **Обёртки:** `Integer`, `Long`, `Double`, `Boolean`… Автоупаковка/распаковка. `Integer` кэшируется в диапазоне −128…127: `==` для больших значений сравнивает ссылки → используйте `equals`.
- Расширение (`int → long`) — автоматически; сужение — явный каст: `(int) 3.9` → `3`.
- Переполнение `int` молча «заворачивается». Для денег — `BigDecimal`, не `double`.
- `var x = 10;` — вывод типа (только локальные переменные).
- Деление `int / int` — целочисленное: `7 / 2 == 3`, `7 % 2 == 1`.

## Операторы и управление

- Сравнение: `==` (примитивы / ссылки), `equals()` (значение объектов).
- Логика: `&&`, `||` — **ленивые**; `&`, `|` — вычисляют обе части.
- `i++` (сначала значение, потом +1), `++i` (сначала +1).
- Тернарный: `a > b ? a : b`.

```java
for (int i = 0; i < n; i++) { }
for (String s : list) { }          // for-each
while (cond) { }
do { } while (cond);
break; continue;                    // выход / следующая итерация

// switch-выражение (Java 14+)
String name = switch (day) {
    case 1, 7 -> "weekend";
    case 2, 3, 4, 5, 6 -> "work";
    default -> "?";
};
```

## Строки

- `String` **неизменяем** (immutable), литералы хранятся в String Pool.
- Сравнение: `s1.equals(s2)`, `equalsIgnoreCase`. Не `==`!
- Частые методы: `length()`, `charAt(i)`, `substring(a, b)`, `indexOf`, `contains`, `split`, `trim`/`strip`, `isBlank`, `toUpperCase`, `replace`, `join`, `repeat`.
- Много конкатенаций в цикле → `StringBuilder` (не потокобезопасен; `StringBuffer` — потокобезопасен, медленнее).
- Text block: `""" ... """` (Java 15+). Форматирование: `"%s = %d".formatted(a, b)`.

## Массивы

```java
int[] a = new int[5];          // нули
int[] b = {1, 2, 3};
int[][] m = new int[3][4];
a.length;                      // поле, не метод
Arrays.sort(b); Arrays.toString(b); Arrays.fill(a, 0);
Arrays.copyOf(b, 10); Arrays.equals(a, b); Arrays.asList(1, 2, 3);
```

- Размер фиксирован. Выход за границы → `ArrayIndexOutOfBoundsException`.

## ООП

**4 принципа:** инкапсуляция (скрыть данные: `private` + геттеры/сеттеры), наследование (`extends`), полиморфизм (один интерфейс — разное поведение), абстракция.

```java
class Animal {
    protected String name;
    Animal(String name) { this.name = name; }
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override void speak() { System.out.println("Woof"); }
}
Animal a = new Dog("Rex");   // восходящее приведение
a.speak();                   // Woof — динамическая диспетчеризация
```

- **Модификаторы доступа:** `private` (класс) < package-private (пакет) < `protected` (пакет + наследники) < `public` (всем).
- **Конструктор:** имя класса, нет типа возврата. Если не написан — есть пустой по умолчанию. `this(...)` / `super(...)` — первой строкой.
- **Перегрузка (overload):** одно имя, разные параметры (решается при компиляции). **Переопределение (override):** тот же метод в наследнике (решается в рантайме).
- `static` — принадлежит классу, а не объекту. `final` — переменную нельзя переприсвоить, метод — переопределить, класс — наследовать.
- Наследовать можно только один класс, но реализовать много интерфейсов.
- `Object`: `equals`, `hashCode`, `toString`, `getClass`. **Контракт:** равные объекты → равные `hashCode`. Переопределяя одно — переопределяйте оба.
- `instanceof` + pattern matching: `if (o instanceof String s) { s.length(); }`.

### Абстрактный класс vs интерфейс

| | `abstract class` | `interface` |
|---|---|---|
| Состояние (поля) | да | только `static final` константы |
| Конструктор | да | нет |
| Наследование | один | много (`implements`) |
| Методы | абстрактные и обычные | `abstract`, `default`, `static`, `private` |
| Когда | общая база («является») | контракт («умеет») |

### Вложенные классы, enum, record

- Вложенные: `static nested`, inner (держит ссылку на внешний объект), local, anonymous (`new Interface() { ... }`).
- `enum` — набор констант, может иметь поля и методы; `values()`, `valueOf()`, `ordinal()`.
- `record Point(int x, int y) {}` — неизменяемый носитель данных (конструктор, геттеры `x()`, `equals`, `hashCode`, `toString` генерируются).
- `sealed interface Shape permits Circle, Square {}` — ограничивает наследников.

## Исключения

```text
Throwable
├── Error                 (OutOfMemoryError, StackOverflowError — не ловим)
└── Exception
    ├── checked           (IOException, SQLException — обязаны обработать)
    └── RuntimeException  (unchecked: NPE, IllegalArgument, IndexOutOfBounds, ClassCast, Arithmetic)
```

```java
try (var in = new FileInputStream("f.txt")) {   // try-with-resources: автоматический close()
    // ...
} catch (IOException | IllegalStateException e) {
    log(e);
} finally {
    // выполнится почти всегда
}
throw new IllegalArgumentException("bad");
void read() throws IOException { }               // объявляем checked-исключение
```

- Ловите **конкретные** исключения, не глотайте молча. Сначала узкие `catch`, потом широкие.
- Своё исключение: `class MyEx extends RuntimeException`.
- `finally` не выполнится при `System.exit()` или падении JVM.

## Коллекции

```text
Iterable → Collection ─┬─ List  (ArrayList, LinkedList)
                       ├─ Set   (HashSet, LinkedHashSet, TreeSet)
                       └─ Queue (ArrayDeque, PriorityQueue)
Map (HashMap, LinkedHashMap, TreeMap)   — не наследует Collection
```

| Структура | Порядок | Дубли | Сложность | Заметки |
|---|---|---|---|---|
| `ArrayList` | вставки | да | get O(1), add в конец O(1)*, вставка/удаление в середине O(n) | массив внутри, дефолт для List |
| `LinkedList` | вставки | да | get O(n), add/remove по ссылке O(1) | нужен редко |
| `HashSet` | нет | нет | O(1) | на основе `HashMap` |
| `LinkedHashSet` | вставки | нет | O(1) | |
| `TreeSet` | сортировка | нет | O(log n) | красно-чёрное дерево |
| `HashMap` | нет | ключи уникальны | O(1) | один `null`-ключ разрешён |
| `TreeMap` | по ключу | — | O(log n) | |
| `ArrayDeque` | — | да | O(1) с концов | стек и очередь |
| `PriorityQueue` | по приоритету | да | O(log n) | куча |

\* амортизированно.

**HashMap изнутри:** `hashCode()` → индекс корзины → внутри цепочка (список; при ≥ 8 элементов и таблице ≥ 64 — дерево). Load factor `0.75`, при превышении — resize ×2. Поэтому ключи должны иметь корректные `equals` + `hashCode` и быть неизменяемыми.

```java
List<String> list = new ArrayList<>(List.of("a", "b"));   // List.of — неизменяемый
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.getOrDefault("x", 0);
map.merge("a", 1, Integer::sum);
map.computeIfAbsent("k", k -> 0);
for (Map.Entry<String, Integer> e : map.entrySet()) { }

list.sort(Comparator.comparing(String::length).thenComparing(Comparator.naturalOrder()));
Collections.sort(list);
Collections.unmodifiableList(list);
```

- Удаление в `for-each` → `ConcurrentModificationException`. Используйте `Iterator.remove()` или `removeIf`.
- `Comparable` (естественный порядок, `compareTo`) vs `Comparator` (внешний, `compare`).
- Потокобезопасные: `ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue`.

## Дженерики

```java
class Box<T extends Number> { T value; }
<T> T first(List<T> list) { return list.get(0); }
List<? extends Number> read;     // producer: читаем (extends)
List<? super Integer> write;     // consumer: пишем (super)  — PECS
```

- Стираются при компиляции (**type erasure**): в рантайме `List<String>` = `List`. Нельзя `new T()`, `new T[]`, примитивы в параметрах (`List<int>`).
- `List<Object>` не является родителем `List<String>` (инвариантность).

## Лямбды и Stream API

- **Функциональный интерфейс** — ровно один абстрактный метод (`@FunctionalInterface`): `Runnable`, `Supplier<T>`, `Consumer<T>`, `Function<T,R>`, `Predicate<T>`, `BiFunction`, `UnaryOperator`.
- Ссылки на методы: `String::length`, `System.out::println`, `ArrayList::new`.

```java
List<String> result = people.stream()
    .filter(p -> p.age() >= 18)         // промежуточные операции (ленивые)
    .map(Person::name)
    .sorted()
    .distinct()
    .limit(10)
    .toList();                           // терминальная операция запускает конвейер

int sum = nums.stream().mapToInt(Integer::intValue).sum();
Map<String, List<Person>> byCity = people.stream().collect(Collectors.groupingBy(Person::city));
String s = names.stream().collect(Collectors.joining(", "));
boolean any = list.stream().anyMatch(x -> x > 5);   // allMatch, noneMatch
```

- Стрим одноразовый. Не меняйте источник внутри. `parallelStream()` — только для тяжёлых независимых операций.
- `Optional<T>`: `of`, `ofNullable`, `empty`, `map`, `orElse`, `orElseGet`, `orElseThrow`, `ifPresent`. Не использовать как поле класса и параметр.

## Многопоточность

```java
Thread t = new Thread(() -> work());
t.start();                          // start(), не run()!
t.join();

ExecutorService pool = Executors.newFixedThreadPool(4);
Future<Integer> f = pool.submit(() -> compute());
f.get();
pool.shutdown();

CompletableFuture.supplyAsync(() -> load()).thenApply(this::parse).thenAccept(System.out::println);
```

- Состояния потока: NEW → RUNNABLE → BLOCKED / WAITING / TIMED_WAITING → TERMINATED.
- **`synchronized`** — взаимное исключение по монитору объекта (метод или блок), заодно гарантирует видимость.
- **`volatile`** — видимость изменений между потоками и запрет переупорядочивания; **не** атомарность (`count++` небезопасен).
- Атомарность: `AtomicInteger`, `LongAdder`; блокировки: `ReentrantLock`, `ReadWriteLock`; синхронизаторы: `CountDownLatch`, `Semaphore`, `CyclicBarrier`.
- **Проблемы:** race condition, deadlock (взаимная блокировка), livelock, starvation.
- `wait()` / `notify()` — только внутри `synchronized`. `sleep()` монитор не отпускает.
- Java 21: **виртуальные потоки** — `Thread.ofVirtual().start(...)`, `Executors.newVirtualThreadPerTaskExecutor()` — дешёвые потоки для I/O-задач.

## Память и JVM

- **Stack** (на поток): кадры вызовов, локальные примитивы и ссылки. **Heap** (общая): объекты. **Metaspace**: метаданные классов.
- Java **передаёт всё по значению**: для объектов копируется *ссылка* — состояние объекта изменить можно, подменить сам объект у вызывающего — нет.
- **Garbage Collector** удаляет недостижимые объекты. Поколения: Young (Eden + Survivor) → Old. Сборщики: G1 (по умолчанию), ZGC, Shenandoah, Parallel.
- Утечки памяти: статические коллекции, незакрытые ресурсы, забытые слушатели, `ThreadLocal`.
- Ссылки: strong, `SoftReference`, `WeakReference`, `PhantomReference`.
- Ошибки: `StackOverflowError` (глубокая рекурсия), `OutOfMemoryError`.
- Загрузчики классов: Bootstrap → Platform → Application (делегирование родителю).
- Сериализация: `Serializable`, `transient` исключает поле. Рефлексия: `Class<?> c = obj.getClass();`.

## Ввод-вывод и время

```java
Path p = Path.of("data.txt");
List<String> lines = Files.readAllLines(p);
String text = Files.readString(p);
Files.writeString(p, "hi");
try (BufferedReader r = Files.newBufferedReader(p)) { r.readLine(); }
```

- Байты: `InputStream` / `OutputStream`; символы: `Reader` / `Writer`. Оборачивайте в `Buffered*`. Всегда закрывайте (try-with-resources).
- Время (`java.time`, неизменяемое): `LocalDate`, `LocalTime`, `LocalDateTime`, `ZonedDateTime`, `Instant`, `Duration`, `Period`, `DateTimeFormatter`. Старые `Date` и `Calendar` не использовать.

## Версии Java

| Версия | Главное |
|---|---|
| 8 (LTS) | лямбды, Stream API, `Optional`, `java.time`, default-методы |
| 9 | модули, `List.of` / `Map.of` |
| 10 / 11 (LTS) | `var`; `String.isBlank`, `HttpClient` |
| 14–17 (LTS) | switch-выражения, text blocks, `record`, `sealed`, `instanceof` pattern |
| 21 (LTS) | виртуальные потоки, pattern matching в `switch`, record patterns, sequenced collections |

## Практические правила

- Предпочитайте интерфейс в типе: `List<String> l = new ArrayList<>();`.
- Делайте классы неизменяемыми, где можно (`final` поля, без сеттеров).
- Из методов возвращайте пустую коллекцию, а не `null`; для опционального значения — `Optional`.
- Сравнивайте через `equals`, константу ставьте слева: `"a".equals(s)` (защита от NPE).
- Ресурсы закрывайте через try-with-resources.
- Композиция лучше наследования. Принципы: DRY, KISS, SOLID.

### SOLID в одной строке

- **S** — у класса одна причина для изменения.
- **O** — открыт для расширения, закрыт для изменения.
- **L** — наследник заменяет родителя без поломок.
- **I** — несколько узких интерфейсов лучше одного широкого.
- **D** — зависим от абстракций, а не от реализаций.
