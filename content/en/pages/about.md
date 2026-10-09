# About

**JavaStudy** is a free, open Java textbook in Russian, English and Polish. It's built around Andrey Sumin's video course and extended with what the videos don't cover: current versions of Java and tools, an interactive Roadmap, articles on the backend stack, careers and AI.

## Sources

- **Video course**: Andrey Sumin — "Java" ([part 1](https://youtu.be/wW03OzTnBR0)) and "Java level 2" ([part 2](https://youtu.be/RXF-vZgkxcE)) on YouTube (in Russian). The rights to the videos belong to their author. This site doesn't copy or redistribute the videos: it links to YouTube and embeds the official player. The notes, explanations, tasks and translations are the site's own materials.
- **Roadmap**: the structure of the maps is inspired by the open projects [roadmap.sh/java](https://roadmap.sh/java) and [roadmap.sh/backend](https://roadmap.sh/backend). The layout, texts and links to lessons are our own.
- **Version facts** (Java, Spring, JUnit, etc.) were checked against official documentation as of October 2026. Technologies change quickly — if you spot something outdated, check the primary source.

## Third-party components and licences

| Component | Purpose | Licence |
|---|---|---|
| [marked](https://github.com/markedjs/marked) | Markdown rendering | MIT |
| [highlight.js](https://highlightjs.org/) | code highlighting | BSD-3-Clause |
| [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) | a high-legibility font | SIL Open Font License 1.1 |

All libraries and the font are hosted together with the site (no CDN); the licence texts are in the `assets/vendor` and `assets/fonts` folders.

## Privacy

- The site uses **no cookies, analytics or trackers**.
- Settings (language, theme, reading mode) and lesson-completion marks are stored only in **your browser's localStorage** and sent nowhere. You can clear them in your browser settings.
- **YouTube videos** load only after you click a timestamp, via the `youtube-nocookie.com` domain (privacy-enhanced mode). Before you click, not a single request is sent to Google's servers. Once the player loads, [Google's privacy policy](https://policies.google.com/privacy) applies.

## Accessibility

- Two themes (coffee light and a GitHub-style dark theme) with contrast of at least WCAG AA.
- **Colour-blind mode**: the Okabe–Ito palette, icons and text labels instead of colour-only differences.
- Reading settings: font size, line spacing, line width, the Atkinson Hyperlegible font.
- Keyboard navigation, a "Skip to content" link, visible focus, `prefers-reduced-motion` support.

Open the settings with the **Aa** button in the header.

## How to use it

Start from the [home page](#/) and the [Tools](#/tools/ide) section, then go through the lessons in order and mark what you've completed — your progress shows in the menu and on the [Roadmap](#/roadmap).
