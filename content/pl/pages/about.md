# O stronie

**JavaStudy** to darmowy, otwarty podręcznik Javy po rosyjsku, angielsku i polsku. Zbudowany jest wokół kursu wideo Andrieja Sumina i uzupełniony o to, czego w wideo nie ma: aktualne wersje Javy i narzędzi, interaktywną Roadmapę, artykuły o stosie backendowym, karierze i AI.

## Źródła

- **Kurs wideo**: Andriej Sumin — „Java” ([część 1](https://youtu.be/wW03OzTnBR0)) i „Java poziom 2” ([część 2](https://youtu.be/RXF-vZgkxcE)) na YouTube (po rosyjsku). Prawa do wideo należą do autora. Strona nie kopiuje ani nie rozpowszechnia wideo: odsyła do YouTube i osadza oficjalny odtwarzacz. Notatki, wyjaśnienia, zadania i tłumaczenia są własnymi materiałami strony.
- **Roadmapa**: struktura map jest inspirowana otwartymi projektami [roadmap.sh/java](https://roadmap.sh/java) i [roadmap.sh/backend](https://roadmap.sh/backend). Układ, teksty i powiązania z lekcjami są własne.
- **Fakty o wersjach** (Java, Spring, JUnit itd.) sprawdzono w oficjalnej dokumentacji na październik 2026 roku. Technologie szybko się zmieniają — jeśli znajdziesz coś nieaktualnego, sprawdź źródło pierwotne.

## Komponenty zewnętrzne i licencje

| Komponent | Przeznaczenie | Licencja |
|---|---|---|
| [marked](https://github.com/markedjs/marked) | renderowanie Markdown | MIT |
| [highlight.js](https://highlightjs.org/) | podświetlanie kodu | BSD-3-Clause |
| [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) | czcionka o podwyższonej czytelności | SIL Open Font License 1.1 |

Wszystkie biblioteki i czcionka są umieszczone razem ze stroną (bez CDN), teksty licencji — w folderach `assets/vendor` i `assets/fonts`.

## Prywatność

- Strona **nie używa cookies, analityki ani trackerów**.
- Ustawienia (język, motyw, tryb czytania) i oznaczenia ukończonych lekcji są przechowywane tylko w **localStorage twojej przeglądarki** i nigdzie nie są wysyłane. Możesz je wyczyścić w ustawieniach przeglądarki.
- **Wideo z YouTube** ładuje się dopiero po kliknięciu znacznika czasu, przez domenę `youtube-nocookie.com` (tryb rozszerzonej prywatności). Przed kliknięciem do serwerów Google nie jest wysyłane ani jedno żądanie. Po załadowaniu odtwarzacza obowiązuje [polityka prywatności Google](https://policies.google.com/privacy).

## Dostępność

- Dwa motywy (kawowy jasny i ciemny w stylu GitHub) z kontrastem co najmniej WCAG AA.
- **Tryb dla daltonistów**: paleta Okabe–Ito, ikony i etykiety tekstowe zamiast różnic samym kolorem.
- Ustawienia czytania: rozmiar czcionki, interlinia, szerokość wiersza, czcionka Atkinson Hyperlegible.
- Nawigacja klawiaturą, link „Przejdź do treści”, widoczny fokus, obsługa `prefers-reduced-motion`.

Ustawienia otwiera przycisk **Aa** w nagłówku.

## Jak korzystać

Zacznij od [strony głównej](#/) i działu [Narzędzia](#/tools/ide), potem przechodź lekcje po kolei i oznaczaj ukończone — postęp widać w menu i na [Roadmapie](#/roadmap).
