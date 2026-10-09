**Полиморфизм** — один и тот же вызов ведёт себя по-разному в зависимости от реального объекта. **Интерфейсы** описывают, что объект *умеет делать*, и позволяют обойти запрет на множественное наследование. Разбираем upcast, downcast и `implements`.

## Таймкоды видео

- {{t j1 4:44:50}} — тема урока: интерфейсы
- {{t j1 4:45:21}} — абстрактный класс `Animal` с методом `eat()`
- {{t j1 4:45:51}} — собака, кошка, рыба, птица
- {{t j1 4:47:54}} — задача: накормить всех животных в цикле
- {{t j1 4:48:36}} — `List<Animal>` — общий тип для всех
- {{t j1 4:49:38}} — полиморфизм: один интерфейс — много реализаций
- {{t j1 4:49:53}} — upcast: приведение к родительскому типу
- {{t j1 4:50:59}} — после upcast доступны только методы родителя
- {{t j1 4:51:59}} — downcast: явное приведение к дочернему типу
- {{t j1 4:53:11}} — `ClassCastException` при неверном downcast
- {{t j1 4:54:09}} — задача: заставить бегать только тех, кто умеет
- {{t j1 4:55:03}} — множественного наследования классов в Java нет
- {{t j1 4:55:18}} — интерфейс `CanRun`
- {{t j1 4:56:15}} — `implements` и реализация через <kbd>Ctrl+I</kbd>
- {{t j1 4:57:04}} — `List<CanRun>`: рыба туда не попадёт
- {{t j1 4:59:20}} — upcast к интерфейсу
- {{t j1 5:00:19}} — второй интерфейс `Flyable`: реализуем несколько
- {{t j1 5:01:42}} — домашнее задание

## Полиморфизм

```java
public abstract class Animal {
    public abstract void eat();
}

public class Dog extends Animal {
    @Override public void eat() { System.out.println("Кость"); }
    public void run() { System.out.println("Собака бежит"); }
}
public class Cat extends Animal {
    @Override public void eat() { System.out.println("Вискас"); }
}
```

```java
List<Animal> animals = new ArrayList<>();
animals.add(new Dog());
animals.add(new Cat());
animals.add(new Fish());
animals.add(new Bird());

for (Animal animal : animals) {
    animal.eat();     // Кость, Вискас, Рыбий корм, Птичий корм
}
```

Один и тот же вызов `animal.eat()` — разное поведение. JVM во время выполнения смотрит на **реальный класс объекта** и вызывает его реализацию (динамическое связывание).

## Upcast и downcast

```java
Animal animal = new Dog();     // upcast — автоматически, всегда безопасно
animal.eat();                  // OK — метод есть в Animal
// animal.run();               // ошибка компиляции: в Animal нет run()

Dog dog = (Dog) animal;        // downcast — только явно
dog.run();                     // теперь доступно
```

- **Upcast** (к родителю): объект «выглядит» как родитель, видны только методы родителя. Сам объект при этом не меняется — это по-прежнему собака.
- **Downcast** (к потомку): нужно явное приведение `(Dog)`, и вы **отвечаете** за правильность.

:::warning "ClassCastException"
```java
Animal animal = new Cat();
Dog dog = (Dog) animal;        // компилируется, но при запуске — ClassCastException
```
Компилятор не может проверить downcast — ошибка вылезет только во время выполнения.
:::

## Интерфейсы

Задача: заставить бегать собак, котов и птиц, но не рыб. Добавить `run()` в `Animal` — рыбы «побегут». Создать класс `RunningAnimal` — а если птица умеет и бегать, и летать? Наследоваться от двух классов в Java **нельзя**. Решение — **интерфейс**:

```java
public interface CanRun {
    void run();          // public abstract — подразумевается
}

public interface Flyable {
    void fly();
}

public class Dog extends Animal implements CanRun { … }
public class Bird extends Animal implements CanRun, Flyable {   // сколько угодно интерфейсов
    @Override public void eat() { System.out.println("Птичий корм"); }
    @Override public void run() { System.out.println("Птица бежит"); }
    @Override public void fly() { System.out.println("Птица летит"); }
}
```

```java
List<CanRun> runners = new ArrayList<>();
runners.add(new Dog());
runners.add(new Cat());
runners.add(new Bird());
// runners.add(new Fish());   // ошибка: Fish не реализует CanRun

for (CanRun runner : runners) {
    runner.run();
}
```

Интерфейс — **контракт**: «кто меня реализует, обязан уметь вот это». Класс может наследовать один класс, но реализовывать **сколько угодно** интерфейсов. Названия часто оканчиваются на `-able`: `Comparable`, `Runnable`, `Serializable`, `Flyable`.

## Что не рассказано в видео

### instanceof и pattern matching

Перед downcast безопасно проверить тип:

```java
if (animal instanceof Dog) {          // классический вариант
    Dog dog = (Dog) animal;
    dog.run();
}

if (animal instanceof Dog dog) {      // Java 16+: проверка и приведение в одном шаге
    dog.run();
}
```

А ещё лучше — проектировать так, чтобы downcast не требовался (полиморфизм вместо проверок типа).

### Интерфейсы в современной Java

С Java 8 интерфейс может содержать не только абстрактные методы:

```java
public interface CanRun {
    void run();

    default void runTwice() {        // default-метод: реализация по умолчанию (Java 8)
        run();
        run();
    }

    static CanRun nobody() {         // статический метод (Java 8)
        return () -> System.out.println("…");
    }

    int MAX_SPEED = 120;             // константа: public static final
}
```

С Java 9 есть и `private`-методы в интерфейсах (для общего кода default-методов).

### Абстрактный класс или интерфейс? (вопрос с собеседования)

| | Абстрактный класс | Интерфейс |
|---|---|---|
| Наследование | Только один | Сколько угодно |
| Поля | Любые (состояние объекта) | Только константы `public static final` |
| Конструктор | Есть | Нет |
| Методы | Любые, с любым доступом | Абстрактные, `default`, `static`, `private` |
| Смысл | «Является» (общая основа, общий код) | «Умеет» (способность, контракт) |

Правило: описываете **способность** или **контракт** — интерфейс; общий **код и состояние** для близких классов — абстрактный класс. Часто комбинируют: интерфейс + абстрактная базовая реализация.

### Интерфейсы, которые вы будете встречать постоянно

`Comparable<T>` (сравнение), `Comparator<T>`, `Runnable` (задача для потока), `Iterable<T>` (for-each), `List`/`Map`/`Set` (коллекции — это тоже интерфейсы!), `AutoCloseable` (try-with-resources). Интерфейс с одним абстрактным методом — **функциональный**, его можно реализовать лямбдой — это следующий шаг после анонимных классов (часть 2).

## Домашнее задание

:::task video "Работники — из видео"
Класс `Worker` с полем `name`, конструктором, геттером и методом `voice()`, который печатает имя. Подклассы `Programmer`, `Driver`, `Cook` (конструктор принимает только имя). Интерфейсы `Codeable` (`writeCode()`), `Cookable` (`cook()`), `Driveable` (`drive()`); каждый работник реализует свой. В `main` создайте по три работника каждой профессии, проведите перекличку (`voice()` у всех), затем заставьте всех работать — понадобится ещё три цикла. {{t j1 5:01:42}}
??? Подсказка
Для переклички подойдёт `List<Worker>`, для работы — `List<Codeable>`, `List<Cookable>`, `List<Driveable>`. Один и тот же объект может лежать в двух списках разных типов.
:::

:::task easy "instanceof"
В списке `List<Animal>` заставьте бегать тех, кто умеет, используя `instanceof CanRun runner` (pattern matching), а остальным выведите «не умеет бегать».
:::

:::task medium "Платёжные способы"
Интерфейс `PaymentMethod` с методами `boolean pay(double amount)` и `default String receipt(double amount)`. Реализации: `Card` (лимит), `Cash` (сдача), `Blik` (код из 6 цифр). Процесс оплаты корзины работает только с интерфейсом и не знает о конкретных классах.
:::

:::task hard "Своё Comparable"
Сделайте, чтобы класс `Box` реализовывал `Comparable<Box>` (сравнение по объёму). Отсортируйте `List<Box>` вызовом `Collections.sort(boxes)`. Затем отсортируйте тот же список **по длине** с помощью отдельного класса, реализующего `Comparator<Box>`. Объясните, когда что использовать.
??? Подсказка
`public int compareTo(Box other) { return Double.compare(volume(), other.volume()); }` — помните метод `compare` из урока об объектах как параметрах? Это та же идея, только по стандарту JDK.
:::
