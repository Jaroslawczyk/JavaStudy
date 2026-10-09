# AI a programista Javy

W ciągu kilku lat asystenci AI stali się zwykłym narzędziem programisty — jak IDE czy Git. Dopisują kod, wyjaśniają błędy, piszą testy, a nawet wykonują całe zadania. Zmienia to i sposób nauki, i oczekiwania wobec Juniora. Omówmy to bez hype'u: jakie są narzędzia, jak ich używać, by **uczyć się, a nie oduczyć**, i jakie technologie AI pojawiły się w samym stosie Javy.

## Rodzaje asystentów AI {#assistants}

| Rodzaj | Co robi | Przykłady |
|---|---|---|
| **Autouzupełnianie** | podpowiada następną linię/blok bezpośrednio w edytorze | GitHub Copilot, JetBrains AI (Full Line i uzupełnianie w chmurze), Tabnine |
| **Czat w IDE** | wyjaśnia kod, odpowiada na pytania, generuje fragmenty na żądanie | JetBrains AI Assistant, Copilot Chat, Gemini Code Assist, Amazon Q Developer |
| **Agenci** | sami czytają projekt, zmieniają kilka plików, uruchamiają budowanie i testy, poprawiają błędy | Claude Code, JetBrains Junie, Copilot agent mode, Cursor |
| **Chatboty ogólne** | wyjaśnienia, omawianie koncepcji, przygotowanie do rozmowy | Claude, ChatGPT, Gemini |

**Dla IntelliJ IDEA**: wbudowany AI Assistant i agent Junie od JetBrains (jest darmowy poziom z ograniczonym limitem, rozszerzone możliwości — w subskrypcji), wtyczki GitHub Copilot i Claude Code. **VS Code**: Copilot, Claude Code, Continue (można podłączyć lokalne modele przez Ollama). Szczegóły o wtyczkach — w artykule [Wtyczki](#/tools/plugins).

:::warning "Czego nie wysyłać do AI"
Kod i dane pracodawcy — tylko do narzędzi zatwierdzonych przez firmę. Nigdy nie wklejaj do publicznych chatbotów haseł, kluczy API, danych osobowych klientów (to także naruszenie RODO) ani tajemnic handlowych. Wiele firm używa korporacyjnych wersji asystentów z zakazem uczenia się na ich kodzie.
:::

## Jak uczyć się z AI i się nie oduczyć {#learning}

AI rozwiąże każde zadanie z tego kursu w kilka sekund. Jeśli mu na to pozwolisz, dostaniesz zielone testy — i pustą głowę na rozmowie. Zasady, które działają:

1. **Najpierw sam.** Rozwiązuj zadanie bez AI co najmniej 20–30 minut. Utknąłeś — proś o **podpowiedź**, a nie rozwiązanie: „Nie pisz kodu. Podpowiedz, w którą stronę myśleć”.
2. **Proś o wyjaśnienia, a nie odpowiedzi.** „Wyjaśnij, dlaczego tu jest `ConcurrentModificationException`”, „Czym `HashMap` różni się od `ConcurrentHashMap` w środku?” — AI to świetny, cierpliwy korepetytor.
3. **Kod AI — do review.** Czytaj każdą linię, którą wklejasz. Jeśli nie umiesz wyjaśnić linii — nie wklejaj jej. Asystenci pewnie się mylą: używają przestarzałego API, wymyślają metody, pomijają przypadki brzegowe.
4. **Sprawdzaj faktami.** Dokumentacja (docs.oracle.com, docs.spring.io), uruchomienie kodu i testy to źródło prawdy, a nie odpowiedź modelu.
5. **Tryb odwrotny.** Napisz rozwiązanie sam, potem poproś AI o znalezienie w nim błędów i propozycje ulepszeń — tak uczysz się na własnym kodzie.
6. **Trenuj rozmowy.** „Przeprowadź ze mną rozmowę rekrutacyjną z wielowątkowości w Javie, zadawaj po jednym pytaniu i oceniaj odpowiedzi” — świetna praktyka przed prawdziwą rozmową.

:::tip "Dobry prompt"
Dawaj kontekst i ograniczenia: wersję Javy i Springa, co już próbowałeś, pełny tekst błędu, jakiego wyniku potrzebujesz. Porównaj: „nie działa HashMap” i „Java 25, własna klasa `Point` jako klucz HashMap, `get` zwraca null po zmianie pola `x` — dlaczego?”.
:::

## AI w samym stosie Javy {#stack}

AI to nie tylko pomocnik w IDE, ale i część aplikacji, które będziesz pisać. Typowe zadania backendu: chatbot wsparcia, wyszukiwanie w dokumentach firmy, klasyfikacja zgłoszeń, wyciąganie danych z PDF, generowanie opisów produktów.

| Technologia | Co to jest |
|---|---|
| **Spring AI** | oficjalny projekt Springa: jednolite API dla modeli (OpenAI, Anthropic, Google, Mistral, Ollama i inne), structured output do obiektów Javy, tool calling, RAG, integracja z wektorowymi bazami |
| **LangChain4j** | popularna biblioteka Javy do aplikacji LLM: AI Services, pamięć czatu, narzędzia, RAG; integracje z Quarkusem i Springiem |
| **Oficjalne SDK** | SDK dla Javy od OpenAI, Anthropic, Google — bezpośredni dostęp do API |
| **Wektorowe bazy danych** | **pgvector** (rozszerzenie PostgreSQL), Elasticsearch/OpenSearch, Qdrant, Weaviate, Milvus |
| **RAG** | Retrieval-Augmented Generation: dokumenty dzieli się na fragmenty i zamienia w embeddingi, podobne fragmenty znajduje wyszukiwanie i przekazuje modelowi jako kontekst |
| **MCP** | Model Context Protocol — otwarty standard podłączania agentów AI do narzędzi i danych; jest oficjalne SDK dla Javy i integracja w Spring AI |
| **Modele lokalne** | Ollama, LM Studio — uruchamianie otwartych modeli na własnym komputerze, bez wysyłania danych na zewnątrz |

```java
// Spring AI: odpowiedź modelu od razu jako obiekt Javy
record Sentiment(String label, double score) {}

Sentiment s = chatClient.prompt()
        .user("Oceń wydźwięk opinii: " + review)
        .call()
        .entity(Sentiment.class);
```

Dla Juniora w 2026 roku znajomość Spring AI lub LangChain4j to wyraźny plus w CV: zrób mały projekt „pytania i odpowiedzi na podstawie własnych dokumentów” na Spring Boot + pgvector.

:::note "Regulacje AI w UE"
AI Act wprowadza wymagania wobec systemów AI etapami: np. użytkowników trzeba informować, że rozmawiają z AI, a wygenerowane treści w części przypadków muszą być oznaczone. Dla systemów wysokiego ryzyka (scoring kredytowy, rekrutacja, medycyna) wymagania są znacznie surowsze. Jeśli tworzysz funkcje AI dla użytkowników w UE, uwzględniaj to od początku.
:::

## Jak AI zmienia pracę i rekrutację {#jobs}

- **Rutynowego kodu pisze się mniej**, więcej czasu idzie na sformułowanie zadania, projektowanie, review i weryfikację wyniku. Umiejętność **czytania i oceniania cudzego kodu** stała się jeszcze ważniejsza.
- **Poprzeczka dla Juniorów poszła w górę.** Firmy oczekują, że nowicjusz produktywnie używa AI, ale rozumie podstawy: na rozmowie AI zwykle jest niedostępne, a live coding i pytania z Java SE zostały. Kurs i zadania na tej stronie to właśnie ta baza.
- **Nowe umiejętności w ofertach**: „doświadczenie z GitHub Copilot/narzędziami AI”, „integracja LLM”, „Spring AI/LangChain4j”, „RAG”.
- **Odpowiedzialność zostaje po twojej stronie.** Kod wygenerowany przez AI commitujesz ty — i odpowiadasz za jego poprawność, bezpieczeństwo i czystość licencyjną.

:::interview "O co mogą zapytać o AI na rozmowie"
„Jak używasz AI w pracy?” — Dobra odpowiedź pokazuje dojrzałość: do czego używasz (testy, rutyna, wyjaśnienia, szukanie błędów), jak weryfikujesz wynik (review, testy, dokumentacja), czego nie robisz (nie wysyłasz sekretów, nie commitujesz niezrozumianego kodu).
:::

## W skrócie

- Używaj AI jako **korepetytora i partnera**, a nie wykonawcy zadań domowych.
- Wszystko, co wygenerowane — **czytaj, rozumiej, testuj**.
- Poznaj co najmniej jeden framework AI dla Javy (**Spring AI** lub **LangChain4j**) — to aktualny dodatek do stosu z sekcji [Kariera](#/page/career).
