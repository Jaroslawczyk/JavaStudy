Teraz zapisujemy do pliku: `OutputStream` i `FileOutputStream`, tryb dopisywania. Następnie — buforowanie (`BufferedInputStream`/`BufferedOutputStream`), które przyspiesza odczyt setki razy, metoda `flush()` i klasa `Scanner` do wprowadzania danych z konsoli.

## Znaczniki czasu wideo

- {{t j2 5:59:38}} — zapis do pliku: `OutputStream`
- {{t j2 6:00:18}} — `FileOutputStream` w try-with-resources
- {{t j2 6:00:46}} — `write(names.getBytes())`
- {{t j2 6:01:37}} — plik jest nadpisywany przy każdym uruchomieniu
- {{t j2 6:01:46}} — dopisywanie: drugi parametr `append = true`
- {{t j2 6:02:12}} — `BufferedInputStream` i `BufferedOutputStream`
- {{t j2 6:02:48}} — jak działa bufor 8 KB
- {{t j2 6:03:35}} — pomiar: 9,5 s bez bufora → 35 ms z buforem
- {{t j2 6:06:26}} — zapis przez bufor
- {{t j2 6:06:47}} — dane z bufora trafią do pliku przy `close()` lub `flush()`
- {{t j2 6:07:23}} — klasa `Scanner`
- {{t j2 6:07:53}} — `System.in` i `System.out`
- {{t j2 6:08:40}} — `nextLine()`
- {{t j2 6:09:37}} — `nextInt()`: suma dwóch liczb
- {{t j2 6:10:50}} — wpisano napis zamiast liczby — program się wywraca
- {{t j2 6:11:07}} — zadanie domowe: wpisywanie imion do „stop”
- {{t j2 6:11:48}} — omówienie rozwiązania
- {{t j2 6:13:09}} — ucieczka cudzysłowów `\"`

## Zapis do pliku

```java
String names = "John Nick Helen\n";
try (OutputStream out = new FileOutputStream(file, true)) {   // true = dopisywać
    out.write(names.getBytes(StandardCharsets.UTF_8));
} catch (IOException e) {
    e.printStackTrace();
}
```

- Bez drugiego parametru (lub z `false`) plik jest **nadpisywany** przy otwarciu.
- `write(int)` zapisuje jeden bajt, `write(byte[])` — tablicę, `write(byte[], off, len)` — część tablicy.
- `getBytes()` bez argumentu używa kodowania domyślnego — podawaj `UTF_8` jawnie.

## Buforowanie

Strumień buforowany to opakowanie, które sięga do systemu dużymi porcjami (domyślnie 8192 bajty), a tobie oddaje bajty ze swojej pamięci:

```java
try (InputStream in = new BufferedInputStream(new FileInputStream(file))) {
    int b;
    while ((b = in.read()) != -1) { … }      // read() bierze teraz bajt z bufora
}
```

W wideo odczyt dużego pliku po jednym bajcie przyspieszył z 9,5 sekundy do 35 milisekund — **bez zmiany logiki odczytu**.

Przy zapisie `BufferedOutputStream` gromadzi dane w buforze i zapisuje je na dysk, gdy bufor jest pełny. To, co zostało w buforze, trafi do pliku przy `close()` albo jawnym **`flush()`**. Zapomniałeś zamknąć strumień — straciłeś ostatnie dane.

:::interview "Pytanie rekrutacyjne"
**Jakie klasy przyspieszają odczyt i zapis dzięki buforowi?** — `BufferedInputStream`, `BufferedOutputStream` dla bajtów oraz `BufferedReader`, `BufferedWriter` dla znaków. Zmniejszają liczbę wywołań systemowych, czytając/zapisując blokami.
:::

## Scanner i konsola

- `System.out` — `PrintStream` (podklasa `OutputStream`), wyjście na konsolę.
- `System.in` — `InputStream`, wejście z klawiatury.
- `System.err` — strumień błędów (w IDE — na czerwono).

```java
Scanner scanner = new Scanner(System.in);
System.out.print("Enter A: ");
int a = scanner.nextInt();
System.out.print("Enter B: ");
int b = scanner.nextInt();
System.out.println("Sum: " + (a + b));
```

Metody `nextLine()`, `next()` (słowo), `nextInt()`, `nextDouble()`, `hasNextInt()`… blokują wątek, dopóki użytkownik nie wprowadzi danych. Wpisano „abc” zamiast liczby — `InputMismatchException`.

:::warning "Pułapka nextInt() + nextLine()"
`nextInt()` czyta liczbę, ale zostawia w buforze znak nowej linii. Następne `nextLine()` od razu zwróci pusty napis. Rozwiązania: po `nextInt()` wywołać dodatkowe `nextLine()` albo zawsze czytać `nextLine()` i parsować `Integer.parseInt(...)`. Przed `nextInt()` wygodnie sprawdzać `hasNextInt()`.
:::

:::outdated "IO.readln i IO.println (Java 25)"
Dla programów edukacyjnych w Javie 25 pojawiła się klasa `java.lang.IO` (JEP 512): `String name = IO.readln("Imię: "); IO.println("Cześć, " + name);` — bez `Scanner` i `System.out`. Razem z „kompaktowymi” plikami źródłowymi (`void main()`) to standardowy styl pierwszych programów; w kodzie produkcyjnym wejście z konsoli zdarza się rzadko.
:::

## Czego nie ma w wideo

- **Zapis znakowy:** `Files.writeString(path, text, StandardOpenOption.APPEND, StandardOpenOption.CREATE)`, `Files.newBufferedWriter(path)`, `PrintWriter` z `printf`.
- **`PrintStream` nie rzuca `IOException`** — błędy sprawdza się przez `checkError()`. Dlatego `System.out.println` nie wymaga `try`.
- **Atomowy zapis:** pisz do pliku tymczasowego i zmieniaj nazwę `Files.move(tmp, target, ATOMIC_MOVE)` — wtedy plik nie zostanie „w połowie zapisany” przy awarii.

## Zadanie domowe

:::task video "Wpisywanie imion do stop — z wideo"
Program pyta o imię raz za razem, dopóki nie wpisze się `stop`. Każde imię jest dopisywane do pliku (bez nadpisywania poprzednich uruchomień). Po `stop` wypisz wszystkie zapisane imiona z pliku. {{t j2 6:11:07}}
??? Podpowiedź
`new BufferedOutputStream(new FileOutputStream(file, true))`, pętla `while (!next.equals("stop"))`, po każdym imieniu — `"\n"`. Odczyt — osobnym try-with-resources po zapisie. Omówienie: {{t j2 6:11:48}}
:::

:::task easy "Tabliczka mnożenia do pliku"
Zapisz tabliczkę mnożenia 10×10 do pliku `table.txt` przez `PrintWriter`/`printf` z wyrównaniem kolumn, potem przeczytaj i wypisz plik.
:::

:::task medium "Bezpieczne wprowadzanie liczby"
Napisz metodę `int readInt(Scanner sc, String prompt, int min, int max)`, która powtarza pytanie, dopóki użytkownik nie wpisze liczby całkowitej z zakresu. Żadnych wywrotek na „abc” i pustym wierszu.
:::

:::task hard "Dziennik z rotacją"
Napisz `SimpleLogger`, który dopisuje wiersze z czasem do `app.log` przez `BufferedWriter`; gdy plik przekroczy 1 MB, zmienia jego nazwę na `app.1.log` (przesuwając starsze do `app.5.log`) i zaczyna nowy. Obciąż go 4 wątkami — zapis musi być bezpieczny wątkowo, wiersze nie mogą się mieszać. (W prawdziwych projektach są do tego Logback/Log4j2 — zob. [Logowanie](#/extra/logging).)
:::
