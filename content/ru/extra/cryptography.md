Криптография в бэкенде — это хранение паролей, проверка целостности данных, шифрование секретов, подписи и TLS. Главное правило: **никогда не придумывайте свою криптографию** — используйте проверенные алгоритмы и библиотеки. Разберём, что есть в JDK (Java Cryptography Architecture, JCA) и как применять это правильно.

## Хеширование

Хеш-функция превращает данные любой длины в отпечаток фиксированной длины. Используется для проверки целостности файлов, ключей кешей, дедупликации.

```java
MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
byte[] hash = sha256.digest("hello".getBytes(StandardCharsets.UTF_8));
String hex = HexFormat.of().formatHex(hash);       // HexFormat — Java 17
```

:::warning "MD5 и SHA-1 — не для безопасности"
MD5 и SHA-1 взломаны (найдены коллизии). Для контрольных сумм используйте SHA-256/SHA-3, а для безопасности — только их и специальные алгоритмы ниже.
:::

## Пароли: только медленные хеши с солью

Пароли **нельзя** хранить ни в открытом виде, ни зашифрованными, ни простым SHA-256: быстрый хеш перебирается на видеокарте миллиардами вариантов в секунду. Нужен **медленный** алгоритм с **солью** (случайная добавка для каждого пользователя):

| Алгоритм | Где |
|---|---|
| **Argon2id** | современный выбор (Spring Security `Argon2PasswordEncoder`, Bouncy Castle) |
| **bcrypt** | очень распространён (`BCryptPasswordEncoder`) |
| **PBKDF2** | есть прямо в JDK: `PBKDF2WithHmacSHA256` |

```java
// Spring Security
PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
String stored = encoder.encode("s3cret!");          // {bcrypt}$2a$10$...
boolean ok = encoder.matches("s3cret!", stored);
```

## Случайные числа

Для токенов, паролей сброса, ключей — только `SecureRandom`, не `Random`/`Math.random()` (они предсказуемы):

```java
SecureRandom rnd = new SecureRandom();
byte[] token = new byte[32];
rnd.nextBytes(token);
String urlSafe = Base64.getUrlEncoder().withoutPadding().encodeToString(token);
```

## Симметричное шифрование: AES-GCM

```java
KeyGenerator kg = KeyGenerator.getInstance("AES");
kg.init(256);
SecretKey key = kg.generateKey();

byte[] iv = new byte[12];
new SecureRandom().nextBytes(iv);                    // новый IV для КАЖДОГО сообщения

Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));
byte[] encrypted = cipher.doFinal("секрет".getBytes(StandardCharsets.UTF_8));
// храните iv вместе с шифротекстом; GCM ещё и проверяет целостность
```

Никогда не используйте режим `ECB` (`"AES"` без режима по умолчанию часто означает ECB) и не повторяйте IV с тем же ключом.

## Асимметричная криптография и подписи

```java
KeyPairGenerator kpg = KeyPairGenerator.getInstance("Ed25519");    // Java 15+
KeyPair pair = kpg.generateKeyPair();

Signature signer = Signature.getInstance("Ed25519");
signer.initSign(pair.getPrivate());
signer.update(data);
byte[] signature = signer.sign();
```

Публичный ключ проверяет подпись, приватный — создаёт. Так устроены JWT (RS256/ES256), подпись JAR-файлов, TLS-сертификаты. Ключи и сертификаты хранят в **KeyStore** (PKCS12) или в менеджерах секретов (Vault, AWS KMS).

:::note "Постквантовая криптография в JDK"
Квантовые компьютеры в будущем смогут ломать RSA и ECC. JDK уже готовится: в **Java 24** появились постквантовые алгоритмы ML-KEM и ML-DSA (JEP 496, 497), в **Java 25** — API функций вывода ключей KDF (JEP 510), а **Java 27** включает гибридный постквантовый обмен ключами в TLS. Для прикладного разработчика это в основном работает «под капотом».
:::

## Что обычно делает фреймворк

- **TLS/HTTPS** — терминируется на балансировщике/Ingress или настраивается в Spring Boot (`server.ssl.*`, SSL bundles).
- **Аутентификация** — Spring Security, OAuth 2.0/OpenID Connect (Keycloak, Auth0), JWT (библиотеки jjwt, Nimbus).
- **Секреты** — не в коде и не в Git: переменные окружения, Vault, менеджеры секретов облаков.

## Домашнее задание

:::task easy "Контрольная сумма файла"
Посчитайте SHA-256 большого файла потоково (читая через `DigestInputStream` или `update` блоками по 8 КБ, а не загружая целиком) и сравните с выводом `sha256sum`/`Get-FileHash`.
:::

:::task medium "Хранение паролей"
Реализуйте регистрацию и вход с хранением паролей через PBKDF2 (`SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")`, 600 000 итераций, соль 16 байт). Формат хранения: `iterations:salt:hash` в Base64. Сравнивайте хеши через `MessageDigest.isEqual` (защита от атак по времени) — объясните зачем.
:::

:::task hard "Шифрованное хранилище заметок"
Консольное приложение хранит заметки в файле, зашифрованном AES-GCM. Ключ выводится из мастер-пароля через PBKDF2 с солью, сохранённой в заголовке файла. Проверьте, что изменение одного байта файла обнаруживается при расшифровке (`AEADBadTagException`), а неверный пароль не даёт прочитать данные.
:::
