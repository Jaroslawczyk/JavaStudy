# JavaStudy — Java с нуля до Junior+

Бесплатный учебный сайт по Java на **русском, английском и польском** языках. Построен на видеокурсе Андрея Сумина (две части, ≈ 17,5 часа) и дополнен актуальными материалами 2026 года.

## Что внутри

- **Инструменты**: IDE, плагины, JDK, экосистема (Maven/Gradle, Git, Docker…).
- **70 уроков по видео** (36 по первой части, 34 по второй): таймкоды на каждую подтему (встроенный плеер открывается с нужной секунды), подробный конспект, «что не рассказано в видео», блоки «Устарело» с актуальными версиями, вопросы с собеседований, домашние задания из видео + собственные задачи от лёгких к сложным.
- **22 дополнительные статьи** по темам Java Roadmap, которых нет в видео (records, enum, JMM, виртуальные потоки, сеть, криптография, Spring Boot, JPA, логирование, тестирование…).
- **Интерактивные Roadmap**: Java (узлы → уроки и статьи, отметки о прохождении) и Backend (узлы → разделы страницы «Карьера»).
- **Страницы**: Карьера (стек 2026, Европа, удалёнка, Варшава), ИИ, Уровни, О сайте.
- **Доступность**: тема «кофейная светлая» и тёмная GitHub, режим для дальтоников (палитра Okabe–Ito + значки), настройки шрифта и интервалов, шрифт Atkinson Hyperlegible, клавиатурная навигация.

## Технологии

Чистые HTML + CSS + JavaScript (ES-модули), **без сборки и без зависимостей от CDN**. CSS по методологии **BEM**. Хеш-роутинг (`#/ru/lessons/j1-setup`), поэтому сайт работает на любом статическом хостинге.

```
index.html, 404.html, .nojekyll
assets/
  css/   main.css → base/ (reset, tokens, typography…), themes/ (coffee-light, github-dark, cvd, reading), blocks/ (BEM-блоки)
  js/    app.js, router.js, i18n.js, markdown.js, player.js, settings.js, progress.js, course.js, views/
  vendor/ marked, highlight.js (с лицензиями)
  fonts/ atkinson-hyperlegible (OFL)
content/
  config.json            версия сайта и ID видео YouTube
  course.json            разделы и уроки (id, таймкоды начала/конца, названия на 3 языках)
  roadmap-java.json, roadmap-backend.json
  ru/ en/ pl/            ui.json + tools/, lessons/, extra/, pages/ (Markdown)
```

## Запуск локально

Нужен любой статический сервер (из-за ES-модулей файл нельзя открыть двойным щелчком):

```bash
python -m http.server 8080
```

Откройте <http://localhost:8080>.

## Деплой на GitHub Pages (бесплатно)

1. Создайте репозиторий на GitHub и отправьте проект:
   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. В репозитории: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, ветка **main**, папка **/ (root)** → **Save**.
3. Через минуту сайт будет доступен по адресу `https://<user>.github.io/<repo>/`.

Файл `.nojekyll` отключает обработку Jekyll, а `404.html` перенаправляет неверные адреса на главную.

## Как редактировать контент

- **Видео**: ID роликов YouTube — в `content/config.json` (`videos.j1.youtubeId`, `videos.j2.youtubeId`). Если оставить ID пустым, таймкоды превращаются в неактивные метки.
- **Урок**: файл `content/<язык>/lessons/<id>.md` + запись в `content/course.json`.
- **Директивы Markdown**:
  - `{{t j1 12:28}}` — кнопка-таймкод (видео `j1`/`j2`, время, необязательная подпись);
  - `:::note|tip|warning|outdated|interview "Заголовок"` … `:::` — выноски;
  - `:::task easy|medium|hard|video "Заголовок"` … `??? Подсказка` … `:::` — задача со скрытой подсказкой;
  - `## Заголовок {#anchor}` — свой якорь; ссылки `[текст](#/lessons/id)` автоматически получают текущий язык.
- **Roadmap**: узлы в `content/roadmap-*.json` (`"to": "lessons/id"`, `"extra/id"`, `"page/career/anchor"`, флаг `"optional": true`).

## Приватность

Без cookies, аналитики и трекеров. Настройки и прогресс — только в `localStorage` браузера. Плеер YouTube (`youtube-nocookie.com`) загружается лишь после нажатия на таймкод.

## Лицензии и атрибуция

- Видеокурс © Андрей Сумин ([часть 1](https://youtu.be/wW03OzTnBR0), [часть 2](https://youtu.be/RXF-vZgkxcE)); сайт только ссылается на видео и встраивает официальный плеер. Конспекты, задачи и переводы — собственные материалы.
- Структура карт вдохновлена [roadmap.sh](https://roadmap.sh) (java, backend); вёрстка и тексты — собственные.
- [marked](https://github.com/markedjs/marked) — MIT; [highlight.js](https://highlightjs.org/) — BSD-3-Clause; [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) — SIL OFL 1.1. Тексты лицензий лежат рядом с файлами в `assets/vendor/` и `assets/fonts/`.
