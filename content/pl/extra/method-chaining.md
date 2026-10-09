**Łańcuch wywołań** (method chaining, fluent interface) to styl, w którym metody zwracają obiekt, pozwalając wywoływać kolejne metody „po kropce”. Już z niego korzystałeś: `new StringBuilder().append("a").append("b")`, `list.stream().filter(…).map(…).toList()`. Zobaczmy, jak pisać takie API samemu, oraz wzorzec **Builder**.

## Zwracanie this

```java
public class HttpRequestSpec {
    private String url;
    private String method = "GET";
    private final Map<String, String> headers = new LinkedHashMap<>();

    public HttpRequestSpec url(String url) { this.url = url; return this; }
    public HttpRequestSpec method(String m) { this.method = m; return this; }
    public HttpRequestSpec header(String k, String v) { headers.put(k, v); return this; }
}

var spec = new HttpRequestSpec()
        .url("https://api.example.com/users")
        .method("POST")
        .header("Content-Type", "application/json");
```

## Wzorzec Builder

Gdy obiekt ma wiele parametrów (część obowiązkowych, część opcjonalnych), konstruktor z 8 argumentami jest nieczytelny: `new User("Ann", null, 25, true, false, null, "PL", 3)`. Builder to rozwiązuje i pozwala, by sam obiekt był **niezmienny**:

```java
public final class User {
    private final String name;
    private final int age;
    private final String country;

    private User(Builder b) {
        this.name = b.name;
        this.age = b.age;
        this.country = b.country;
    }

    public static Builder builder(String name) { return new Builder(name); }

    public static final class Builder {
        private final String name;          // obowiązkowy — w konstruktorze buildera
        private int age;
        private String country = "PL";      // wartość domyślna

        private Builder(String name) { this.name = Objects.requireNonNull(name); }
        public Builder age(int age) { this.age = age; return this; }
        public Builder country(String c) { this.country = c; return this; }

        public User build() {
            if (age < 0) throw new IllegalStateException("age < 0");   // sprawdzenie spójności
            return new User(this);
        }
    }
}

User u = User.builder("Ann").age(25).build();
```

:::tip "Bez ręcznego kodu"
Lombok generuje builder adnotacją `@Builder`. Dla małych niezmiennych danych często wystarczy `record` z kilkoma statycznymi fabrykami lub metodami-„witherami”: `money.withAmount(…)` zwraca nowy obiekt zamiast zmieniać bieżący.
:::

## Gdzie uważać

- **Debugowanie i stack trace'y:** w długim łańcuchu trudno zrozumieć, na którym wywołaniu nastąpiła wywrotka (`NullPointerException` w linii z 10 wywołaniami). Od Javy 14 „helpful NPE” podpowiada, które wyrażenie było `null`; stawiaj każde wywołanie w osobnej linii.
- **Prawo Demeter:** łańcuch w rodzaju `order.getCustomer().getAddress().getCity().getName()` to nie fluent API, lecz zapach kodu: wywołujący za dużo wie o wewnętrznej budowie obiektów.
- **Dziedziczenie:** jeśli metoda rodzica zwraca `Parent`, łańcuch „gubi” metody potomka. Rozwiązania — nadpisanie z kowariantnym typem zwracanym albo generyczny typ `self` (`<T extends Builder<T>>`).

## Zadanie domowe

:::task easy "Własny StringBuilder-lite"
Napisz `TextBuilder` z metodami `add(String)`, `space()`, `newLine()`, `repeat(String, int)`, z których każda zwraca `this`, oraz `build()`. Złóż krótki wiersz jednym łańcuchem.
:::

:::task medium "Builder ze sprawdzeniami"
Utwórz niezmienną klasę `Pizza` (rozmiar obowiązkowy, ciasto domyślnie „cienkie”, do 5 dodatków) z zagnieżdżonym `Builder`. `build()` rzuca wyjątek przy złamaniu reguł. Napisz testy na przypadki brzegowe.
:::

:::task hard "Typobezpieczny builder krokowy"
Zaimplementuj step builder dla `Email`: najpierw obowiązkowo `from(…)`, potem `to(…)`, potem `subject(…)`, i dopiero wtedy dostępne są opcjonalne `cc(…)`, `body(…)` i `build()`. Użyj łańcucha interfejsów (`FromStep → ToStep → SubjectStep → OptionalStep`), żeby zła kolejność wywołań się nie kompilowała.
:::
