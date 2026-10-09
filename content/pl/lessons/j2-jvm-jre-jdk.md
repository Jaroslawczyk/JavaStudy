Ostatni dział kursu — teoria, o którą pytają niemal na każdej rozmowie. Zaczynamy od podstaw: **jak działa Java** — od kodu źródłowego do kodu maszynowego — i czym różnią się **JDK, JRE i JVM**. Wideo opisuje klasyczny schemat; poniżej — jak wszystko wygląda w 2026 roku (JIT, brak osobnego JRE, jlink, GraalVM).

## Znaczniki czasu wideo

- {{t j2 6:55:43}} — ostatni dział: tylko teoria
- {{t j2 6:56:16}} — jak działa Java: instrukcje dla maszyny
- {{t j2 6:56:50}} — procesor rozumie tylko kod maszynowy
- {{t j2 6:57:11}} — kompilator: Java → bajtkod
- {{t j2 6:57:27}} — `.java` → `.class`
- {{t j2 6:57:38}} — dlaczego bajtkod, a nie od razu kod maszynowy
- {{t j2 6:57:52}} — „napisz raz, uruchamiaj wszędzie”: JVM
- {{t j2 6:58:38}} — biblioteka klas, JRE
- {{t j2 6:59:07}} — pytanie: czym różnią się JRE i JVM
- {{t j2 6:59:19}} — JDK
- {{t j2 6:59:36}} — podsumowanie

## Od kodu źródłowego do wykonania

```
Main.java ──javac──▶ Main.class (bajtkod) ──JVM──▶ kod maszynowy procesora
```

1. **`javac`** (kompilator) sprawdza kod i tłumaczy go na **bajtkod** — instrukcje dla maszyny wirtualnej, jednakowe dla wszystkich systemów i procesorów.
2. **JVM** ładuje klasy (`ClassLoader`), weryfikuje bajtkod (verifier) i go wykonuje.
3. Ten sam `.class`/`.jar` działa na Windows, Linux, macOS, x86 i ARM — potrzebna jest tylko JVM dla platformy. To właśnie **WORA** — write once, run anywhere.

### Interpreter i JIT

Wideo mówi, że JVM „zamienia bajtkod na kod maszynowy”. Jak dokładnie:

- Najpierw bajtkod jest **interpretowany** — wolno, ale start jest natychmiastowy.
- JVM liczy, które metody są wywoływane często („gorące”), a **kompilator JIT** (C1, potem optymalizujący C2) zamienia je w zoptymalizowany kod maszynowy w trakcie działania — z uwzględnieniem rzeczywistego zachowania programu (inlining, usuwanie zbędnych sprawdzeń).
- Dlatego program w Javie „rozpędza się” po starcie (rozgrzewka, warm-up), a długo działające serwery w Javie są bardzo szybkie.

W JVM żyją też **garbage collector** (GC) zarządzający stertą, wątki i model pamięci.

## JDK, JRE, JVM

| | Co to jest | Dla kogo |
|---|---|---|
| **JVM** | Maszyna wirtualna: wykonuje bajtkod, JIT, GC | — |
| **JRE** | JVM + standardowa biblioteka klas | uruchomić program |
| **JDK** | JRE + narzędzia: `javac`, `java`, `jar`, `jshell`, `javadoc`, `jlink`, `jcmd`, `jfr`… | programista |

:::interview "Pytanie rekrutacyjne"
**Czym różnią się JDK, JRE i JVM?** — JVM wykonuje bajtkod. JRE = JVM + biblioteka klas — wystarczy do uruchomienia. JDK = JRE + narzędzia programistyczne (kompilator, debugowanie, profilowanie). Warto dodać: od Javy 11 osobne JRE nie jest już dystrybuowane — instaluje się JDK albo buduje własne środowisko przez `jlink`.
:::

:::outdated "Przestarzałe: „JVM jest prawie na każdym urządzeniu”"
W czasach apletów Javę instalowano osobno na każdym komputerze, a autor mówi, że JVM jest „zainstalowana domyślnie praktycznie wszędzie”. Dziś tak nie jest:
- **Osobnego JRE nie ma od Javy 11.** Oracle i inni dostawcy dostarczają JDK; publiczna „Java dla przeglądarki” zniknęła razem z apletami (Applet API usunięto w Javie 26).
- Aplikację dostarcza się **razem ze środowiskiem uruchomieniowym**: obraz Docker z JDK, `jlink` (okrojone środowisko tylko z potrzebnymi modułami, dziesiątki MB), `jpackage` (instalator `.msi`/`.dmg`/`.deb`).
- **GraalVM Native Image** kompiluje program z wyprzedzeniem (AOT) do natywnego pliku bez JVM: start w milisekundach, mało pamięci — popularne dla mikroserwisów i CLI. Cena — dłuższa kompilacja i ograniczenia refleksji.
- JVM przyspiesza start także bez plików AOT: archiwa CDS i **Project Leyden** (cache AOT od Javy 24–25).

Jakie JDK wybrać — w artykule [JDK](#/tools/jdk).
:::

## Czego nie ma w wideo

- **Bajtkod można obejrzeć:** `javap -c Main.class`. Widać instrukcje maszyny stosowej: `iload`, `iadd`, `invokevirtual`…
- **Inne języki na JVM:** Kotlin, Scala, Groovy, Clojure kompilują się do tego samego bajtkodu i używają tej samej biblioteki — dlatego JVM nazywa się platformą, a nie tylko „maszyną dla Javy”.
- **Uruchamianie bez kompilacji:** od Javy 11 można `java Main.java` (kompilacja w pamięci), od Javy 22 — programy z wielu plików.
- **Pamięć JVM:** sterta (obiekty, GC), stosy wątków (zmienne lokalne, wywołania), Metaspace (metadane klas). Flagi `-Xmx`, `-Xms`.

## Zadanie domowe

W wideo nie ma zadań — praktyka na własną rękę.

:::task easy "Kompilacja ręcznie"
Bez IDE: napisz `Hello.java`, skompiluj `javac Hello.java`, uruchom `java Hello`. Następnie uruchom od razu `java Hello.java`. Znajdź plik `.class` i obejrzyj jego bajtkod `javap -c Hello`.
:::

:::task medium "Rozgrzewka JIT"
Napisz metodę liczącą sumę kwadratów 1–10 000 000 i wywołaj ją 20 razy z rzędu, mierząc `System.nanoTime()`. Narysuj wykres czasu według iteracji. Powtórz z flagą `-Xint` (tylko interpreter) i `-XX:+PrintCompilation`. Wyjaśnij wynik.
:::

:::task hard "Własne małe środowisko"
Zrób aplikację modułową (`module-info.java`, zależną tylko od `java.base`), zbuduj środowisko `jlink --add-modules … --output myjre`, porównaj rozmiar `myjre` z pełnym JDK i uruchom program przez `myjre/bin/java`. Bonus: zbuduj instalator przez `jpackage`. Więcej o modułach — [JPMS](#/extra/modules).
:::
