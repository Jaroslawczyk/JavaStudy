Встроенные коллекции Java: **`ArrayList`** — динамический список, **`HashSet`** — множество без повторов, **`TreeSet`** — отсортированное множество. Плюс обобщённые типы в угловых скобках `<>` и то, что в видео не вошло, но нужно с первого дня, — **`HashMap`**.

## Таймкоды видео

- {{t j1 3:54:51}} — минус нашей коллекции: только строки
- {{t j1 3:55:12}} — встроенная коллекция `ArrayList`
- {{t j1 3:55:41}} — список без типа хранит что угодно — это плохо
- {{t j1 3:55:52}} — тип элементов в угловых скобках `<String>`
- {{t j1 3:56:32}} — `add`, `size()`, `get(index)`
- {{t j1 3:57:45}} — `remove` по индексу и по значению
- {{t j1 3:58:20}} — перебор в for-each
- {{t j1 3:58:59}} — `List<Integer>`: примитивы нельзя, нужны обёртки
- {{t j1 4:00:14}} — сумма чисел из списка
- {{t j1 4:00:50}} — массив или список?
- {{t j1 4:02:26}} — `HashSet`: без повторов и без порядка
- {{t j1 4:04:40}} — `TreeSet`: отсортированное множество
- {{t j1 4:06:17}} — домашнее задание

## ArrayList

```java
import java.util.ArrayList;
import java.util.List;

List<String> employees = new ArrayList<>();
employees.add("Сергей");
employees.add("Наталья");
employees.add("Олег");

System.out.println(employees.size());   // 3
System.out.println(employees.get(0));   // Сергей

employees.remove(0);            // по индексу
employees.remove("Наталья");    // по значению (через equals)

for (String name : employees) {
    System.out.println(name);
}
```

- `List<String>` — **дженерик** (обобщённый тип): компилятор не даст положить в список ничего, кроме строк.
- `new ArrayList<>()` — «ромб» (diamond): тип справа выводится из объявления слева.
- Без `<…>` (сырой тип, raw type) список принимает любые `Object` — так писали до Java 5, сейчас это предупреждение и источник ошибок.

### Только ссылочные типы

```java
List<int> nums;            // ошибка компиляции
List<Integer> numbers = new ArrayList<>();
for (int i = 0; i <= 1000; i++) {
    numbers.add(i);        // автоупаковка int → Integer
}
int sum = 0;
for (int n : numbers) {    // автораспаковка
    sum += n;
}
System.out.println(sum);   // 500500
```

### Самые нужные методы List

| Метод | Что делает |
|---|---|
| `add(e)` / `add(i, e)` | Добавить в конец / по индексу |
| `get(i)` / `set(i, e)` | Получить / заменить |
| `remove(i)` / `remove(obj)` | Удалить по индексу / по значению |
| `size()` / `isEmpty()` | Размер / пуст ли |
| `contains(obj)` / `indexOf(obj)` | Есть ли / где находится |
| `clear()` | Очистить |
| `sort(null)` или `Collections.sort(list)` | Сортировка |
| `getFirst()` / `getLast()` / `reversed()` | Первый / последний / обратный порядок (Java 21+) |

:::warning "remove(1) для List<Integer>"
`numbers.remove(1)` удалит элемент **с индексом 1**, а не число 1. Чтобы удалить значение: `numbers.remove(Integer.valueOf(1))`. Классическая ловушка с перегрузкой `remove(int)` / `remove(Object)`.
:::

## Массив или список?

Автор цитирует совет «всегда используйте список вместо массивов» и сам применяет массивы только для маленьких, неизменных наборов (кадры анимации в игре). На практике:

- **`List`** — по умолчанию для бизнес-логики: удобные методы, расширяется сам.
- **Массив** — для фиксированных данных, примитивов в больших объёмах (`int[]` гораздо экономнее `List<Integer>`), низкоуровневой производительности.

## HashSet и TreeSet

**Set** (множество) не хранит повторов.

```java
Set<String> names = new HashSet<>();
names.add("Ольга");
names.add("Иван");
names.add("Ольга");                 // не добавится
System.out.println(names.size());   // 2
```

| | `HashSet` | `LinkedHashSet` | `TreeSet` |
|---|---|---|---|
| Повторы | нет | нет | нет |
| Порядок | **никакого** (может меняться) | порядок добавления | **отсортирован** |
| Скорость `add`/`contains` | O(1) | O(1) | O(log n) |
| `get(index)` | нет | нет | нет — только перебор |

:::note "Строки сортируются как строки"
В видео `TreeSet` со строками `"15"`, `"3"`, `"4"` выдал порядок `15, 3, 4` — строки сравниваются **посимвольно** (лексикографически). С `TreeSet<Integer>` числа сортируются по значению.
:::

## Что не рассказано в видео

### Программируйте на уровне интерфейсов

```java
List<String> list = new ArrayList<>();   // хорошо: тип переменной — интерфейс
ArrayList<String> list2 = new ArrayList<>(); // хуже: привязка к реализации
```

Так реализацию легко поменять (`ArrayList` → `LinkedList`), не трогая остальной код.

### Неизменяемые коллекции (Java 9+)

```java
List<String> days = List.of("Пн", "Вт", "Ср");
Set<Integer> primes = Set.of(2, 3, 5, 7);
days.add("Чт");   // UnsupportedOperationException
```

### Удаление во время перебора

```java
for (String name : employees) {
    if (name.startsWith("О")) employees.remove(name);   // ConcurrentModificationException!
}
employees.removeIf(name -> name.startsWith("О"));       // правильно (лямбды — часть 2)
```

### HashMap — словарь «ключ → значение»

Автор говорит, что в курсе будет использоваться только `ArrayList`, но в реальных проектах **`Map` используется не реже `List`**:

```java
Map<String, Integer> salaries = new HashMap<>();
salaries.put("Иван", 5000);
salaries.put("Анна", 6500);
salaries.put("Иван", 5500);                      // ключ уникален: значение перезапишется

System.out.println(salaries.get("Анна"));        // 6500
System.out.println(salaries.getOrDefault("Пётр", 0)); // 0
System.out.println(salaries.containsKey("Иван")); // true

for (Map.Entry<String, Integer> e : salaries.entrySet()) {
    System.out.println(e.getKey() + " → " + e.getValue());
}
```

Как `HashMap` устроен внутри (хеш-функция, корзины, `equals`/`hashCode`) — подробно во **второй части курса**, где автор пишет собственные реализации всех основных коллекций.

### Карта Collections Framework

```text
Iterable
 └─ Collection
     ├─ List   → ArrayList, LinkedList
     ├─ Set    → HashSet, LinkedHashSet, TreeSet
     └─ Queue  → ArrayDeque, PriorityQueue, LinkedList
Map (отдельная иерархия) → HashMap, LinkedHashMap, TreeMap
```

## Домашнее задание

:::task video "Три коллекции — из видео"
Создайте три коллекции: первая хранит числа от 1 до 10; вторая — имена студентов (столько же, сколько чисел); третья — строки вида «номер, имя», которые заполняются в цикле из первых двух коллекций. Выведите третью коллекцию циклом for-each. {{t j1 4:06:17}}
??? Подсказка
Используйте обычный `for` по индексу, чтобы брать элементы обеих коллекций одновременно: `result.add(numbers.get(i) + ", " + students.get(i));`.
:::

:::task easy "Уникальные слова"
Дана строка-предложение. Выведите количество слов и количество **уникальных** слов (без учёта регистра), используя `split` и `HashSet`. Затем выведите уникальные слова в алфавитном порядке через `TreeSet`.
:::

:::task medium "Частота слов"
Посчитайте, сколько раз встречается каждое слово в тексте, с помощью `HashMap<String, Integer>`. Выведите 3 самых частых слова.
??? Подсказка
`counts.put(word, counts.getOrDefault(word, 0) + 1);` — или короче `counts.merge(word, 1, Integer::sum);`.
:::

:::task medium "Чистка списка"
Заполните `List<Integer>` 20 случайными числами от 1 до 50. Удалите все чётные (через `Iterator` или `removeIf`), затем удалите дубликаты, **сохранив порядок** (подсказка: `LinkedHashSet`). Выведите результат после каждого шага.
:::

:::task hard "Телефонная книга"
Реализуйте класс `PhoneBook` на основе `Map<String, List<String>>`: у одного человека может быть несколько номеров. Методы: `add(name, phone)`, `List<String> find(name)` (пустой список, если нет), `removeNumber(phone)`, `printAll()` — в алфавитном порядке имён. Подумайте, какую `Map` выбрать, чтобы вывод был отсортирован без отдельной сортировки.
??? Подсказка
`TreeMap` хранит ключи отсортированными. Для добавления: `book.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);` — или вручную: `if (!book.containsKey(name)) book.put(name, new ArrayList<>());`.
:::
