Закрепляем наследование на фигурах и знакомимся с **абстрактными классами и методами** (`abstract`), многоуровневым наследованием и запретами через **`final`** для методов и классов.

## Таймкоды видео

- {{t j1 4:30:06}} — задача: фигура, прямоугольник и треугольник
- {{t j1 4:31:19}} — класс `Figure` с полями `a`, `b` и методом `area()`
- {{t j1 4:32:35}} — `Rect extends Figure`
- {{t j1 4:32:46}} — ошибка: у родителя нет конструктора без параметров
- {{t j1 4:33:49}} — переопределение `area()` через геттеры
- {{t j1 4:34:11}} — `Triangle` и третья сторона `c`
- {{t j1 4:35:38}} — площадь по формуле Герона
- {{t j1 4:38:02}} — проблема: забыли переопределить — площадь 0
- {{t j1 4:38:18}} — абстрактный метод и абстрактный класс
- {{t j1 4:39:06}} — почему нельзя создать «просто фигуру»
- {{t j1 4:40:14}} — компилятор требует реализацию: <kbd>Ctrl+I</kbd>
- {{t j1 4:41:23}} — многоуровневое наследование: `ColorRect extends Rect`
- {{t j1 4:42:41}} — `final` у метода — запрет переопределения
- {{t j1 4:43:35}} — `final` у класса — запрет наследования
- {{t j1 4:43:51}} — три применения `final`

## Абстрактный класс

```java
public abstract class Figure {
    private final double a;
    private final double b;

    public Figure(double a, double b) {
        this.a = a;
        this.b = b;
    }

    public abstract double area();      // нет тела — только «обещание»

    public final double getA() { return a; }
    public final double getB() { return b; }
}
```

```java
public class Rect extends Figure {
    public Rect(double a, double b) { super(a, b); }
    public Rect(double size) { super(size, size); }

    @Override
    public double area() {
        return getA() * getB();
    }
}

public class Triangle extends Figure {
    private final double c;

    public Triangle(double a, double b, double c) {
        super(a, b);
        this.c = c;
    }

    public Triangle(double size) {
        this(size, size, size);
    }

    @Override
    public double area() {                               // формула Герона
        double p = (getA() + getB() + c) / 2;
        return Math.sqrt(p * (p - getA()) * (p - getB()) * (p - c));
    }
}
```

```java
Figure rect = new Rect(5, 10);
Figure triangle = new Triangle(10);
System.out.println(rect.area());       // 50.0
System.out.println(triangle.area());   // 43.30…
// new Figure(5, 5);                   // ошибка: Figure is abstract; cannot be instantiated
```

### Что дают abstract

| | Абстрактный метод | Абстрактный класс |
|---|---|---|
| Запись | `public abstract double area();` — без тела | `public abstract class Figure` |
| Смысл | Каждый наследник **обязан** реализовать | Нельзя создать объект, только наследоваться |
| Правило | Есть хоть один абстрактный метод → класс должен быть абстрактным | Может содержать поля, конструкторы и обычные методы |

Абстрактный класс описывает то, что в реальности существует только в конкретных формах: «просто фигур» не бывает — бывают треугольники, прямоугольники, круги. Компилятор не даст забыть реализацию: наследник без `area()` не скомпилируется (если сам не `abstract`). <kbd>Ctrl+I</kbd> (Implement Methods) создаст заготовки.

## Многоуровневое наследование

```java
public class ColorRect extends Rect {
    private final String color;

    public ColorRect(double a, double b, String color) {
        super(a, b);
        this.color = color;
    }
}
```

`ColorRect` — это и `Rect`, и `Figure`. `area()` переопределять не нужно: используется реализация из `Rect`.

## final у методов и классов

| Где | Что запрещает | Пример |
|---|---|---|
| Переменная / поле | Повторное присваивание | `final double PI = 3.14;` |
| Метод | Переопределение в наследниках | `public final double getA()` |
| Класс | Наследование от него | `public final class Rect`, `String`, `Integer` |

Зачем запрещать: чтобы никто не «сломал» поведение, на которое рассчитывает остальной код. Например, переопределённый `getA()`, всегда возвращающий 10, запутал бы всех пользователей класса.

## Что не рассказано в видео

### Абстрактный класс может иметь конструктор

Частый вопрос на собеседовании: «Есть ли конструктор у абстрактного класса, если его объект нельзя создать?» — **Да**. Он вызывается через `super(...)` из конструкторов наследников и инициализирует общие поля.

### Полиморфизм на фигурах

```java
List<Figure> figures = List.of(new Rect(5, 10), new Triangle(10), new Rect(3));
double total = 0;
for (Figure f : figures) {
    total += f.area();           // вызовется реализация конкретной фигуры
}
```

Подробно о полиморфизме — в следующем уроке.

### Паттерн «Шаблонный метод»

Абстрактный класс часто задаёт **алгоритм**, а наследники — шаги:

```java
public abstract class Report {
    public final void print() {          // final: алгоритм не меняется
        printHeader();
        printBody();                      // шаг, который определяет наследник
        printFooter();
    }
    protected abstract void printBody();
    private void printHeader() { System.out.println("=== Отчёт ==="); }
    private void printFooter() { System.out.println("============"); }
}
```

### Ограничение иерархии — sealed

Вместо `final` (никто не наследует) можно разрешить наследоваться только конкретным классам — `sealed ... permits` (Java 17+), см. урок о наследовании.

## Домашнее задание

Задание по теме автор выдал в прошлом уроке, а этот урок — его разбор. Задачи для закрепления абстракций:

:::task easy "Круг"
Добавьте к иерархии фигур класс `Circle` (радиус). Как быть с полями `a` и `b` из `Figure`? Предложите решение: передать радиус как `a` и `b`, или перепроектировать `Figure` так, чтобы в ней не было сторон вовсе.
??? Подсказка
Второй вариант чище: `Figure` содержит только `abstract double area()` и, например, `abstract double perimeter()`, а стороны хранят сами наследники.
:::

:::task medium "Периметр и сортировка"
Добавьте в `Figure` абстрактный метод `perimeter()` и реализуйте его везде. Создайте список из 6 разных фигур и выведите их, отсортировав по площади (сортировку можно сделать вручную или через `figures.sort(...)`).
:::

:::task medium "Шаблонный метод"
Реализуйте абстрактный класс `Beverage` с `final`-методом `prepare()`: вскипятить воду → `brew()` → налить в чашку → `addCondiments()`. Наследники `Tea` и `Coffee` реализуют абстрактные шаги. Убедитесь, что порядок шагов изменить невозможно.
:::

:::task hard "Абстрактный транспорт"
Спроектируйте абстрактный класс `Vehicle` (модель, макс. скорость, абстрактный `double travelTime(double km)`, `final`-метод `describe()`), подклассы `Car`, `Bicycle`, `Train` со своей логикой (например, у поезда — остановки, у велосипеда — усталость после 30 км). Сделайте `Train` `final`. Посчитайте, кто быстрее доберётся на 100 км, и выведите рейтинг.
:::
