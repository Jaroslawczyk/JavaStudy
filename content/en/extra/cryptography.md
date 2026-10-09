Cryptography in the backend means storing passwords, checking data integrity, encrypting secrets, signatures and TLS. The main rule: **never invent your own cryptography** — use proven algorithms and libraries. Let's see what the JDK provides (the Java Cryptography Architecture, JCA) and how to use it correctly.

## Hashing

A hash function turns data of any length into a fixed-length fingerprint. It's used to check file integrity, for cache keys, for deduplication.

```java
MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
byte[] hash = sha256.digest("hello".getBytes(StandardCharsets.UTF_8));
String hex = HexFormat.of().formatHex(hash);       // HexFormat — Java 17
```

:::warning "MD5 and SHA-1 aren't for security"
MD5 and SHA-1 are broken (collisions have been found). For checksums use SHA-256/SHA-3, and for security — only those and the special algorithms below.
:::

## Passwords: only slow, salted hashes

Passwords must **not** be stored in plain text, encrypted, or with a simple SHA-256: a fast hash is brute-forced on a GPU at billions of guesses per second. You need a **slow** algorithm with a **salt** (a random addition per user):

| Algorithm | Where |
|---|---|
| **Argon2id** | the modern choice (Spring Security `Argon2PasswordEncoder`, Bouncy Castle) |
| **bcrypt** | very widespread (`BCryptPasswordEncoder`) |
| **PBKDF2** | available right in the JDK: `PBKDF2WithHmacSHA256` |

```java
// Spring Security
PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
String stored = encoder.encode("s3cret!");          // {bcrypt}$2a$10$...
boolean ok = encoder.matches("s3cret!", stored);
```

## Random numbers

For tokens, reset links and keys — only `SecureRandom`, not `Random`/`Math.random()` (they're predictable):

```java
SecureRandom rnd = new SecureRandom();
byte[] token = new byte[32];
rnd.nextBytes(token);
String urlSafe = Base64.getUrlEncoder().withoutPadding().encodeToString(token);
```

## Symmetric encryption: AES-GCM

```java
KeyGenerator kg = KeyGenerator.getInstance("AES");
kg.init(256);
SecretKey key = kg.generateKey();

byte[] iv = new byte[12];
new SecureRandom().nextBytes(iv);                    // a new IV for EVERY message

Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));
byte[] encrypted = cipher.doFinal("secret".getBytes(StandardCharsets.UTF_8));
// store the iv together with the ciphertext; GCM also checks integrity
```

Never use `ECB` mode (`"AES"` without a mode often means ECB by default) and never reuse an IV with the same key.

## Asymmetric cryptography and signatures

```java
KeyPairGenerator kpg = KeyPairGenerator.getInstance("Ed25519");    // Java 15+
KeyPair pair = kpg.generateKeyPair();

Signature signer = Signature.getInstance("Ed25519");
signer.initSign(pair.getPrivate());
signer.update(data);
byte[] signature = signer.sign();
```

The public key verifies a signature, the private key creates it. That's how JWTs (RS256/ES256), JAR signing and TLS certificates work. Keys and certificates are stored in a **KeyStore** (PKCS12) or in secret managers (Vault, AWS KMS).

:::note "Post-quantum cryptography in the JDK"
Future quantum computers will be able to break RSA and ECC. The JDK is already preparing: **Java 24** added the post-quantum algorithms ML-KEM and ML-DSA (JEP 496, 497), **Java 25** — the Key Derivation Function API (JEP 510), and **Java 27** enables hybrid post-quantum key exchange in TLS. For an application developer this mostly works "under the hood".
:::

## What a framework usually does

- **TLS/HTTPS** — terminated at the load balancer/Ingress or configured in Spring Boot (`server.ssl.*`, SSL bundles).
- **Authentication** — Spring Security, OAuth 2.0/OpenID Connect (Keycloak, Auth0), JWT (the jjwt and Nimbus libraries).
- **Secrets** — not in code and not in Git: environment variables, Vault, cloud secret managers.

## Homework

:::task easy "A file checksum"
Compute the SHA-256 of a large file in a streaming fashion (via `DigestInputStream` or `update` in 8 KB blocks, not loading it whole) and compare with the output of `sha256sum`/`Get-FileHash`.
:::

:::task medium "Storing passwords"
Implement registration and login with passwords stored via PBKDF2 (`SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")`, 600,000 iterations, a 16-byte salt). Storage format: `iterations:salt:hash` in Base64. Compare hashes with `MessageDigest.isEqual` (protection against timing attacks) — explain why.
:::

:::task hard "An encrypted notes vault"
A console app stores notes in a file encrypted with AES-GCM. The key is derived from a master password via PBKDF2 with a salt stored in the file header. Check that changing a single byte of the file is detected on decryption (`AEADBadTagException`), and that a wrong password can't read the data.
:::
