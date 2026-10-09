**Modyfikatory dostępu** określają, kto może korzystać z pól, metod i klas. Na nich opiera się **enkapsulacja** — jedna z czterech zasad OOP. Tu także gettery, settery, pakiety i `import`.

## Znaczniki czasu wideo

- {{t j1 2:55:18}} — cztery modyfikatory dostępu
- {{t j1 2:55:41}} — klasa `Man` z publicznymi polami
- {{t j1 2:57:43}} — problem: wiek −40
- {{t j1 2:58:22}} — otwarte pola łamią enkapsulację
- {{t j1 2:58:32}} — modyfikator `private`
- {{t j1 2:59:47}} — settery
- {{t j1 3:00:44}} — sprawdzanie wartości w setterze
- {{t j1 3:01:52}} — gettery
- {{t j1 3:02:55}} — pole „tylko do odczytu”
- {{t j1 3:03:35}} — generowanie getterów i setterów: <kbd>Alt+Insert</kbd>
- {{t j1 3:04:10}} — czym jest enkapsulacja: samochód i bankomat
- {{t j1 3:06:04}} — zasada: wszystko, co się da, — `private`
- {{t j1 3:06:30}} — pakiety
- {{t j1 3:08:31}} — `import` i <kbd>Alt+Enter</kbd>
- {{t j1 3:09:40}} — modyfikator domyślny (default)
- {{t j1 3:10:59}} — zadanie domowe

## Cztery poziomy dostępu

| Modyfikator | Wewnątrz klasy | W tym samym pakiecie | W podklasie (inny pakiet) | Wszędzie |
|---|:---:|:---:|:---:|:---:|
| `private` | ✓ | — | — | — |
| *(brak)* — default / package-private | ✓ | ✓ | — | — |
| `protected` | ✓ | ✓ | ✓ | — |
| `public` | ✓ | ✓ | ✓ | ✓ |

`protected` omówimy w lekcji o dziedziczeniu.

## Problem otwartych pól

```java
Man man = new Man("Iwan", 27);
man.age = -40;      // nic nie przeszkadza wpisać bzdury
```

Jeśli pole jest `public`, dowolny kod może włożyć do niego cokolwiek — i obiekt znajdzie się w niepoprawnym stanie. Rozwiązanie: **zamknąć pola** i dać dostęp przez metody.

## Gettery i settery

```java
public class Man {
    private String name;
    private int age;

    public Man(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {          // getter — tylko odczyt
        return name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {      // setter — zapis ze sprawdzeniem
        if (age > 0) {
            this.age = age;
        } else {
            System.out.println("Wiek musi być większy od zera");
        }
    }
}
```

- **Getter** — publiczna metoda bez parametrów zwracająca wartość pola: `getName()`, `getAge()`. Dla `boolean` przyjęło się `isActive()`.
- **Setter** — publiczna metoda ustawiająca wartość: `setAge(int age)`. Główna zaleta — **sprawdzenie** przed zapisem.
- Brak settera — pole jest **tylko do odczytu** (`name` powyżej).

<kbd>Alt+Insert</kbd> → *Getter*, *Setter* lub *Getter and Setter* — IDEA wygeneruje je w sekundę.

## Enkapsulacja

Samochodem steruje się pedałami i kierownicą, a nie linką gazu i gaźnikiem. Bankomat wydaje pieniądze przez przyciski, a nie z otwartej szafy z banknotami. **Enkapsulacja to ukrywanie implementacji**: klasa chowa wewnętrzną budowę i udostępnia tylko czytelny, bezpieczny zestaw metod.

:::tip "Zasada"
Wszystkie pola — `private`. W ogóle wszystko, co może być `private`, rób `private`. Otwieraj (`public`) tylko to, czego naprawdę potrzebują użytkownicy klasy.
:::

## Pakiety i import

**Pakiet** to folder na klasy o podobnym przeznaczeniu. Pierwsza linia pliku wskazuje pakiet:

```java
package com.example.shop.model;

import com.example.shop.util.PriceFormatter;   // klasa z innego pakietu
import java.util.List;

public class Product { … }
```

- Klasy z własnego pakietu i z `java.lang` (`String`, `Math`, `System`…) są dostępne bez `import`.
- <kbd>Alt+Enter</kbd> na czerwonej nazwie klasy → *Import class*. Nieużywane importy IDEA pokazuje na szaro — usuwaj je (<kbd>Ctrl+Alt+O</kbd> — Optimize Imports).
- Bez modyfikatora (**default**) element jest widoczny tylko w swoim pakiecie. Dlatego po przeniesieniu `Box` do innego pakietu autor dostał błąd `Box is not public`.

## Czego nie ma w wideo

### Jak nazywa się pakiety

Pakiety nazywa się **odwróconą nazwą domeny**: `com.google.gson`, `org.springframework.web`, `pl.mojafirma.bank`. Tylko małe litery. Struktura wewnątrz — według funkcji (`order`, `payment`, `user`) lub warstw (`controller`, `service`, `repository`).

### Modyfikatory klas

Klasa najwyższego poziomu może być tylko `public` lub default. `private` i `protected` mają tylko klasy zagnieżdżone (patrz artykuł [Klasy zagnieżdżone](#/extra/nested-classes)).

### Setter powinien rzucać wyjątek, a nie wypisywać

W wideo setter wypisuje komunikat i po cichu zostawia starą wartość. W prawdziwym kodzie wywołujący nie dowie się wtedy o błędzie. Lepiej:

```java
public void setAge(int age) {
    if (age <= 0) {
        throw new IllegalArgumentException("Wiek musi być większy od zera: " + age);
    }
    this.age = age;
}
```

### Nie każde pole potrzebuje settera

Generowanie getterów i setterów „do wszystkiego” to częsty błąd: enkapsulacja jest wtedy tylko formalna. Lepiej dawać **sensowne** metody: nie `setBalance(...)`, tylko `deposit(...)` i `withdraw(...)`. Pola, które nie powinny się zmieniać, rób `final` i nie dawaj im setterów.

### Lombok i rekordy

- **Lombok**: `@Getter`, `@Setter`, `@Data` generują metody podczas kompilacji — bardzo popularne w projektach Spring.
- **record**: pola są automatycznie `private final`, a metody dostępu nazywają się jak pola: `person.name()`, bez `get`.

### Moduły (Java 9+)

Nad pakietami jest jeszcze jeden poziom — moduły (`module-info.java`), które decydują, które pakiety w ogóle widzą inne moduły. Szczegóły w artykule [Modules](#/extra/modules).

## Zadanie domowe

:::task video "Poprawne modyfikatory w Box — z wideo"
Zmień klasę `Box` tak, aby wszędzie były poprawne modyfikatory dostępu. Żadne pole nie może być `public`; gdzie potrzebny jest dostęp — utwórz gettery i/lub settery. Sprawdź, że `Box` da się użyć z klasy `Main` w innym pakiecie. {{t j1 3:10:59}}
??? Podpowiedź
Pola — `private`, konstruktory i metody potrzebne na zewnątrz — `public`. Settery wymiarów powinny odrzucać wartości ujemne.
:::

:::task easy "Struktura pakietów"
Utwórz pakiety `com.<twoje_imię>.app`, `com.<twoje_imię>.model`, `com.<twoje_imię>.util`. Rozłóż w nich `Main`, `Box`/`Man` i klasę pomocniczą z metodami `static`. Doprowadź do kompilacji, dodając `public` i `import`.
:::

:::task medium "Konto bankowe bez setterów"
Klasa `BankAccount`: `private final String number`, `private double balance`. Żadnego `setBalance` — tylko `deposit(double)`, `withdraw(double)` (ze sprawdzeniem i wyjątkami) oraz `getBalance()`. Napisz w `main` scenariusz, w którym próba wypłaty większej kwoty niż saldo jest obsłużona poprawnie.
:::

:::task hard "Sprawdzanie dostępu w praktyce"
W pakiecie `a` utwórz klasę `A` z czterema polami — `private`, default, `protected`, `public`. W pakiecie `a` klasę `SamePackage`, w pakiecie `b` klasę `OtherPackage` i klasę `Child extends A`. W każdej spróbuj odwołać się do wszystkich czterech pól i wypełnij tabelę: gdzie się kompiluje, a gdzie nie. Porównaj z tabelą na początku lekcji.
??? Podpowiedź
W `Child` do pola `protected` można odwołać się bezpośrednio lub przez `this`, ale **nie** przez inny obiekt typu `A` (`new A().protectedField` z innego pakietu się nie skompiluje) — subtelność, którą lubią rekruterzy.
:::
