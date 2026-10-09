**Serializacja** to zamiana obiektu w strumień bajtów (by zapisać go do pliku lub przesłać przez sieć), **deserializacja** — proces odwrotny. Omawiamy `Serializable`, `ObjectOutputStream`/`ObjectInputStream`, zasady dla pól i rodziców, `transient`, `Externalizable` i `serialVersionUID` — częste pytania rekrutacyjne. I ważne uzupełnienie: dlaczego wbudowanej serializacji dziś prawie się nie używa.

## Znaczniki czasu wideo

- {{t j2 6:27:59}} — zapisywanie i odtwarzanie obiektów
- {{t j2 6:29:25}} — jak zapisać obiekt `User` do pliku
- {{t j2 6:29:41}} — `ObjectOutputStream` na `FileOutputStream`
- {{t j2 6:31:07}} — `writeObject()` i `NotSerializableException`
- {{t j2 6:31:19}} — czym jest serializacja
- {{t j2 6:31:43}} — `Serializable` to interfejs-znacznik
- {{t j2 6:32:22}} — `ObjectInputStream` i `readObject()`
- {{t j2 6:33:35}} — deserializacja
- {{t j2 6:34:04}} — przy deserializacji konstruktor nie jest wywoływany
- {{t j2 6:35:46}} — zmieniono klasę — stare dane się nie wczytują
- {{t j2 6:36:38}} — wszystkie pola muszą być serializowalne
- {{t j2 6:37:36}} — `transient`
- {{t j2 6:38:28}} — klasa rodzica `Person`
- {{t j2 6:39:52}} — zasada dla rodziców: serializowalni albo konstruktor bezparametrowy
- {{t j2 6:40:52}} — `Externalizable`
- {{t j2 6:41:47}} — skąd Java wie, że klasa się zmieniła
- {{t j2 6:42:48}} — `serialVersionUID`
- {{t j2 6:44:36}} — po co deklarować go ręcznie
- {{t j2 6:45:15}} — podsumowanie
- {{t j2 6:46:48}} — zadanie domowe: kolekcja kotów
- {{t j2 6:47:27}} — omówienie rozwiązania

## Serializacja i deserializacja

```java
public class User implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String name;
    private int age;
    private transient String password;     // nie jest zapisywane
    // konstruktor, gettery, toString
}

// zapis
try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("users.bin"))) {
    out.writeObject(new User("John", 25, "secret"));
}

// odczyt
try (ObjectInputStream in = new ObjectInputStream(new FileInputStream("users.bin"))) {
    User user = (User) in.readObject();    // ClassNotFoundException, IOException
    System.out.println(user);              // password = null
}
```

## Zasady (o nie pytają)

1. Klasa implementuje **`Serializable`** (interfejs-znacznik bez metod) lub `Externalizable`. Inaczej — `NotSerializableException`.
2. Wszystkie pola też są serializowalne (`String`, typy proste, `ArrayList` itd.) **albo** oznaczone `transient`. Serializowany jest cały graf obiektów dostępnych przez referencje.
3. Pola `transient` po odtworzeniu dostają wartości domyślne: `null`, `0`, `false`. Pola `static` w ogóle nie są serializowane — należą do klasy.
4. Jeśli **rodzic nie jest serializowalny**, musi mieć dostępny konstruktor bezparametrowy: przy deserializacji jest wywoływany dla „nieserializowalnej części”, a jej pola nie są odtwarzane ({{t j2 6:43:41}} — imię i nazwisko stały się `null`).
5. **Konstruktor klasy serializowalnej nie jest wywoływany** — obiekt jest składany bezpośrednio z bajtów.

:::note "Poprawka do wideo"
Autor mówi, że „kompilator patrzy na numer wersji”. Porównanie `serialVersionUID` wykonuje nie kompilator, lecz JVM **w czasie deserializacji**. Jeśli numer nie jest zadeklarowany jawnie, jest wyliczany ze struktury klasy (pola, metody, interfejsy), dlatego każda zmiana klasy psuje odczyt starych danych: `InvalidClassException: local class incompatible`.
:::

## serialVersionUID

```java
@Serial                                           // Java 14: kompilator sprawdzi deklarację
private static final long serialVersionUID = 1L;
```

- Deklaruj go **zawsze jawnie** w klasach serializowalnych — inaczej ID zależy od kompilatora i najmniejszej zmiany klasy.
- Zmiana zgodna (dodano pole) — zostaw numer; nowe pole przy odczycie starych danych dostanie wartość domyślną.
- Niezgodna (zmieniono typ pola) — zwiększ numer, żeby stare dane były jawnie odrzucane.

## Serializable vs Externalizable

| | `Serializable` | `Externalizable` |
|---|---|---|
| Metody | brak (znacznik) | `writeExternal`, `readExternal` |
| Kto zapisuje dane | JVM automatycznie | ty ręcznie |
| Konstruktor przy odczycie | nie jest wywoływany | wywoływany **public bezparametrowy** |

Wariant pośredni — prywatne metody `writeObject(ObjectOutputStream)` / `readObject(ObjectInputStream)` w klasie `Serializable`: można dopisać do automatycznej serializacji własną logikę (szyfrowanie, sprawdzanie niezmienników).

:::warning "Wbudowana serializacja jest niebezpieczna"
Deserializacja niezaufanych danych to jedna z najbardziej znanych podatności Javy: spreparowany strumień bajtów może przy `readObject()` wykonać dowolny kod przez łańcuchy klas z bibliotek na classpath (gadget chains). Architekci Javy nazywali serializację „okropnym błędem”. Jeśli mimo to jest potrzebna, używaj **filtrów deserializacji** (`ObjectInputFilter`, Java 9; fabryka filtrów — Java 17, JEP 415) i nigdy nie czytaj obiektów z sieci/od użytkownika bez nich.
:::

:::outdated "Czego używa się zamiast Serializable"
- **JSON** (Jackson, Gson, JSON-B) — REST API, konfiguracje, przechowywanie;
- **Protocol Buffers, Avro** — zwarte formaty binarne dla serwisów i Kafki;
- **rekordy** serializują się bezpieczniej: przy odczycie wywoływany jest konstruktor kanoniczny z jego sprawdzeniami.

`Serializable` trzeba znać na rozmowy i do starego kodu (RMI, cache, sesje), ale w nowym kodzie wybieraj jawny format danych.
:::

## Zadanie domowe

:::task video "Kolekcja kotów — z wideo"
Klasa `Cat` (imię, rasa, waga). Utwórz listę kotów, zapisz **całą listę** do pliku jednym `writeObject`, potem odczytaj ją i wypisz imiona w pętli. {{t j2 6:46:48}}
??? Podpowiedź
`ArrayList` jest serializowalna, jeśli serializowalne są elementy. Przy odczycie — `(List<Cat>) in.readObject()` (ostrzeżenie `unchecked`). Omówienie: {{t j2 6:47:27}}
:::

:::task easy "transient i static"
Dodaj do `Cat` pole `transient int mood` i `static int count`. Zapisz obiekt, zmień `count`, odczytaj obiekt. Co stało się z każdym polem i dlaczego?
:::

:::task medium "Ewolucja klasy"
Zapisz `User` z jawnym `serialVersionUID = 1L`. Dodaj pole `email` — odczytaj stary plik (co jest w `email`?). Potem zmień typ `age` na `String` i spróbuj znowu. Powtórz eksperyment bez jawnego UID.
:::

:::task hard "JSON zamiast Serializable"
Dodaj Jacksona (`com.fasterxml.jackson.core:jackson-databind`) i zapisz tę samą listę kotów jako JSON przez `ObjectMapper` (`writeValue`/`readValue` z `TypeReference<List<Cat>>`). Zrób `Cat` rekordem (`record`). Porównaj rozmiary plików i czytelność; wyjaśnij, dlaczego JSON jest bezpieczniejszy przy odbieraniu danych z zewnątrz.
:::
