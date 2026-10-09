# AI and the Java developer

In a couple of years AI assistants have become an ordinary developer tool — like an IDE or Git. They complete code, explain errors, write tests and even carry out whole tasks. This changes both how you learn and what's expected of a Junior. Let's look at it without the hype: what tools exist, how to use them so you **learn rather than unlearn**, and which AI technologies have appeared in the Java stack itself.

## Kinds of AI assistants {#assistants}

| Kind | What it does | Examples |
|---|---|---|
| **Completion** | suggests the next line/block right in the editor | GitHub Copilot, JetBrains AI (Full Line and cloud completion), Tabnine |
| **Chat in the IDE** | explains code, answers questions, generates snippets on request | JetBrains AI Assistant, Copilot Chat, Gemini Code Assist, Amazon Q Developer |
| **Agents** | read the project themselves, change several files, run the build and tests, fix errors | Claude Code, JetBrains Junie, Copilot agent mode, Cursor |
| **General-purpose chatbots** | explanations, concept breakdowns, interview prep | Claude, ChatGPT, Gemini |

**For IntelliJ IDEA**: the built-in AI Assistant and JetBrains' Junie agent (there's a free tier with a limited quota; extended features need a subscription), the GitHub Copilot and Claude Code plugins. **VS Code**: Copilot, Claude Code, Continue (you can plug in local models via Ollama). Plugin details — in the [Plugins](#/tools/plugins) article.

:::warning "What not to send to AI"
Your employer's code and data — only into tools approved by the company. Never paste passwords, API keys, customers' personal data (that's also a GDPR/RODO violation) or trade secrets into public chatbots. Many companies use corporate versions of assistants that prohibit training on their code.
:::

## How to learn with AI without unlearning {#learning}

AI can solve any task from this course in seconds. If you let it, you'll get green tests — and an empty head at the interview. Rules that work:

1. **Yourself first.** Work on the task without AI for at least 20–30 minutes. Stuck? Ask for a **hint**, not a solution: "Don't write code. Point me in the right direction."
2. **Ask for explanations, not answers.** "Explain why there's a `ConcurrentModificationException` here", "How does `HashMap` differ from `ConcurrentHashMap` internally?" — AI is an excellent patient tutor.
3. **AI code goes to review.** Read every line you paste. If you can't explain a line, don't paste it. Assistants are confidently wrong: they use outdated APIs, invent methods, miss edge cases.
4. **Check against facts.** Documentation (docs.oracle.com, docs.spring.io), running the code and tests are the source of truth, not the model's answer.
5. **Reverse mode.** Write the solution yourself, then ask AI to find bugs in it and suggest improvements — that way you learn from your own code.
6. **Practise interviews.** "Interview me on Java concurrency, ask one question at a time and grade my answers" — great practice before a real interview.

:::tip "A good prompt"
Give context and constraints: the Java and Spring versions, what you've already tried, the full error text, the result you need. Compare: "HashMap doesn't work" and "Java 25, my own `Point` class as a HashMap key, `get` returns null after changing the `x` field — why?".
:::

## AI in the Java stack itself {#stack}

AI isn't only an IDE helper — it's also part of the applications you'll write. Typical backend tasks: a support chatbot, search over company documents, ticket classification, extracting data from PDFs, generating product descriptions.

| Technology | What it is |
|---|---|
| **Spring AI** | the official Spring project: a unified API for models (OpenAI, Anthropic, Google, Mistral, Ollama and others), structured output into Java objects, tool calling, RAG, vector DB integration |
| **LangChain4j** | a popular Java library for LLM applications: AI Services, chat memory, tools, RAG; integrations with Quarkus and Spring |
| **Official SDKs** | Java SDKs from OpenAI, Anthropic, Google — direct API access |
| **Vector databases** | **pgvector** (a PostgreSQL extension), Elasticsearch/OpenSearch, Qdrant, Weaviate, Milvus |
| **RAG** | Retrieval-Augmented Generation: documents are split into chunks and turned into embeddings; similar chunks are found by search and passed to the model as context |
| **MCP** | the Model Context Protocol — an open standard for connecting AI agents to tools and data; there's an official Java SDK and Spring AI integration |
| **Local models** | Ollama, LM Studio — run open models on your own machine without sending data anywhere |

```java
// Spring AI: the model's answer straight into a Java object
record Sentiment(String label, double score) {}

Sentiment s = chatClient.prompt()
        .user("Rate the sentiment of this review: " + review)
        .call()
        .entity(Sentiment.class);
```

For a Junior in 2026, knowing Spring AI or LangChain4j is a noticeable plus on a CV: build a small "Q&A over your own documents" project with Spring Boot + pgvector.

:::note "AI regulation in the EU"
The EU AI Act introduces requirements for AI systems in stages: for example, users must be told they're interacting with AI, and generated content must be labelled in some cases. For high-risk systems (credit scoring, hiring, medicine) the requirements are much stricter. If you build AI features for users in the EU, take this into account from the start.
:::

## How AI is changing work and hiring {#jobs}

- **Less routine code is written**, more time goes into framing the task, design, review and verifying the result. The ability to **read and assess other people's code** has become even more important.
- **The bar for Juniors has risen.** Companies expect a newcomer to use AI productively but to understand the fundamentals: AI is usually not available in an interview, and live coding and Java SE questions remain. The course and the tasks on this site are exactly that foundation.
- **New skills in job ads**: "experience with GitHub Copilot/AI tools", "LLM integration", "Spring AI/LangChain4j", "RAG".
- **Responsibility stays with you.** You commit AI-generated code — and you answer for its correctness, security and licensing.

:::interview "What you may be asked about AI in an interview"
"How do you use AI at work?" — A good answer shows maturity: what you use it for (tests, routine, explanations, finding bugs), how you verify the result (review, tests, documentation), what you don't do (send secrets, commit code you don't understand).
:::

## In short

- Use AI as a **tutor and pair partner**, not as someone who does your homework.
- Everything generated — **read it, understand it, test it**.
- Learn at least one AI framework for Java (**Spring AI** or **LangChain4j**) — a timely addition to the stack from the [Career](#/page/career) section.
