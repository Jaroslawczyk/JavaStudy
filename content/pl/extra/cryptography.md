Kryptografia w backendzie to przechowywanie haseł, sprawdzanie integralności danych, szyfrowanie sekretów, podpisy i TLS. Główna zasada: **nigdy nie wymyślaj własnej kryptografii** — używaj sprawdzonych algorytmów i bibliotek. Zobaczmy, co jest w JDK (Java Cryptography Architecture, JCA) i jak tego poprawnie używać.

## Haszowanie

Funkcja skrótu zamienia dane dowolnej długości w odcisk stałej długości. Służy do sprawdzania integralności plików, kluczy cache, deduplikacji.

```java
MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
byte[] hash = sha256.digest("hello".getBytes(StandardCharsets.UTF_8));
String hex = HexFormat.of().formatHex(hash);       // HexFormat — Java 17
```

:::warning "MD5 i SHA-1 — nie do bezpieczeństwa"
MD5 i SHA-1 są złamane (znaleziono kolizje). Do sum kontrolnych używaj SHA-256/SHA-3, a do bezpieczeństwa — tylko ich i specjalnych algorytmów poniżej.
:::

## Hasła: tylko wolne skróty z solą

Haseł **nie wolno** przechowywać ani jawnie, ani zaszyfrowanych, ani prostym SHA-256: szybki skrót łamie się na karcie graficznej miliardami prób na sekundę. Potrzebny jest **wolny** algorytm z **solą** (losowym dodatkiem dla każdego użytkownika):

| Algorytm | Gdzie |
|---|---|
| **Argon2id** | współczesny wybór (Spring Security `Argon2PasswordEncoder`, Bouncy Castle) |
| **bcrypt** | bardzo rozpowszechniony (`BCryptPasswordEncoder`) |
| **PBKDF2** | jest bezpośrednio w JDK: `PBKDF2WithHmacSHA256` |

```java
// Spring Security
PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
String stored = encoder.encode("s3cret!");          // {bcrypt}$2a$10$...
boolean ok = encoder.matches("s3cret!", stored);
```

## Liczby losowe

Do tokenów, linków resetu hasła, kluczy — tylko `SecureRandom`, nie `Random`/`Math.random()` (są przewidywalne):

```java
SecureRandom rnd = new SecureRandom();
byte[] token = new byte[32];
rnd.nextBytes(token);
String urlSafe = Base64.getUrlEncoder().withoutPadding().encodeToString(token);
```

## Szyfrowanie symetryczne: AES-GCM

```java
KeyGenerator kg = KeyGenerator.getInstance("AES");
kg.init(256);
SecretKey key = kg.generateKey();

byte[] iv = new byte[12];
new SecureRandom().nextBytes(iv);                    // nowy IV dla KAŻDEJ wiadomości

Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));
byte[] encrypted = cipher.doFinal("sekret".getBytes(StandardCharsets.UTF_8));
// przechowuj iv razem z szyfrogramem; GCM sprawdza też integralność
```

Nigdy nie używaj trybu `ECB` (`"AES"` bez trybu często oznacza domyślnie ECB) i nie powtarzaj IV z tym samym kluczem.

## Kryptografia asymetryczna i podpisy

```java
KeyPairGenerator kpg = KeyPairGenerator.getInstance("Ed25519");    // Java 15+
KeyPair pair = kpg.generateKeyPair();

Signature signer = Signature.getInstance("Ed25519");
signer.initSign(pair.getPrivate());
signer.update(data);
byte[] signature = signer.sign();
```

Klucz publiczny weryfikuje podpis, prywatny — go tworzy. Tak działają JWT (RS256/ES256), podpisywanie JAR-ów, certyfikaty TLS. Klucze i certyfikaty przechowuje się w **KeyStore** (PKCS12) albo w menedżerach sekretów (Vault, AWS KMS).

:::note "Kryptografia postkwantowa w JDK"
Komputery kwantowe w przyszłości będą mogły łamać RSA i ECC. JDK już się przygotowuje: w **Javie 24** pojawiły się algorytmy postkwantowe ML-KEM i ML-DSA (JEP 496, 497), w **Javie 25** — API funkcji wyprowadzania kluczy KDF (JEP 510), a **Java 27** włącza hybrydową postkwantową wymianę kluczy w TLS. Dla programisty aplikacji działa to głównie „pod maską”.
:::

## Co zwykle robi framework

- **TLS/HTTPS** — terminowany na load balancerze/Ingressie albo konfigurowany w Spring Boot (`server.ssl.*`, SSL bundles).
- **Uwierzytelnianie** — Spring Security, OAuth 2.0/OpenID Connect (Keycloak, Auth0), JWT (biblioteki jjwt, Nimbus).
- **Sekrety** — nie w kodzie i nie w Gicie: zmienne środowiskowe, Vault, menedżery sekretów chmur.

## Zadanie domowe

:::task easy "Suma kontrolna pliku"
Policz SHA-256 dużego pliku strumieniowo (czytając przez `DigestInputStream` lub `update` blokami po 8 KB, a nie wczytując całości) i porównaj z wynikiem `sha256sum`/`Get-FileHash`.
:::

:::task medium "Przechowywanie haseł"
Zaimplementuj rejestrację i logowanie z hasłami przechowywanymi przez PBKDF2 (`SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")`, 600 000 iteracji, sól 16 bajtów). Format przechowywania: `iterations:salt:hash` w Base64. Porównuj skróty przez `MessageDigest.isEqual` (ochrona przed atakami czasowymi) — wyjaśnij po co.
:::

:::task hard "Zaszyfrowany notatnik"
Aplikacja konsolowa przechowuje notatki w pliku zaszyfrowanym AES-GCM. Klucz jest wyprowadzany z hasła głównego przez PBKDF2 z solą zapisaną w nagłówku pliku. Sprawdź, że zmiana jednego bajtu pliku jest wykrywana przy odszyfrowaniu (`AEADBadTagException`), a złe hasło nie pozwala odczytać danych.
:::
