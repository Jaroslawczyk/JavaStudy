/* Markdown → HTML: marked + highlight.js + собственные директивы.
   Директивы:
     {{t j1 12:28}} / {{t j2 1:02:34 подпись}}   — таймкод видео
     :::note|tip|warning|outdated|interview "Заголовок"  …  :::   — выноска
     :::task easy|medium|hard|video "Заголовок"  …  ??? Подсказка  …  :::   — задача с подсказкой */
import { Marked } from '../vendor/marked/marked.esm.js';
import hljs from '../vendor/highlight/core.min.js';
import java from '../vendor/highlight/languages/java.min.js';
import bash from '../vendor/highlight/languages/bash.min.js';
import shell from '../vendor/highlight/languages/shell.min.js';
import xml from '../vendor/highlight/languages/xml.min.js';
import json from '../vendor/highlight/languages/json.min.js';
import yaml from '../vendor/highlight/languages/yaml.min.js';
import kotlin from '../vendor/highlight/languages/kotlin.min.js';
import groovy from '../vendor/highlight/languages/groovy.min.js';
import sql from '../vendor/highlight/languages/sql.min.js';
import properties from '../vendor/highlight/languages/properties.min.js';
import plaintext from '../vendor/highlight/languages/plaintext.min.js';
import { esc, parseTime, formatTime, slugify } from './utils.js';
import { t } from './i18n.js';

Object.entries({ java, bash, shell, xml, json, yaml, kotlin, groovy, sql, properties, plaintext }).forEach(
  ([name, lang]) => hljs.registerLanguage(name, lang),
);
hljs.registerAliases(['html', 'pom'], { languageName: 'xml' });
hljs.registerAliases(['sh', 'console', 'powershell', 'ps'], { languageName: 'bash' });
hljs.registerAliases(['gradle'], { languageName: 'groovy' });
hljs.registerAliases(['kts'], { languageName: 'kotlin' });
hljs.registerAliases(['text', 'txt', 'output'], { languageName: 'plaintext' });

let usedSlugs = new Map();

function uniqueSlug(base) {
  const n = usedSlugs.get(base) || 0;
  usedSlugs.set(base, n + 1);
  return n ? `${base}-${n}` : base;
}

const marked = new Marked({ gfm: true });

marked.use({
  renderer: {
    heading(text, level, raw) {
      let id;
      const custom = /\s*\{#([\w-]+)\}\s*$/;
      const match = raw.match(custom);
      if (match) {
        id = match[1];
        text = text.replace(custom, '');
      } else {
        id = slugify(raw);
      }
      id = uniqueSlug(id);
      return `<h${level} id="${id}">${text}<a class="heading-anchor" href="#${id}" data-anchor="${id}" aria-hidden="true" tabindex="-1">#</a></h${level}>\n`;
    },
    code(code, infostring) {
      const lang = (infostring || '').trim().split(/\s+/)[0].toLowerCase() || 'plaintext';
      const known = hljs.getLanguage(lang);
      const html = known ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value : esc(code);
      const label = lang === 'plaintext' || lang === 'text' || lang === 'output' ? (lang === 'output' ? 'output' : 'text') : lang;
      return `<div class="code-block">
<div class="code-block__bar"><span class="code-block__lang">${esc(label)}</span><button class="code-block__copy" type="button" data-action="copy-code">${esc(t('copy'))}</button></div>
<pre class="code-block__pre"><code class="code-block__code hljs language-${esc(lang)}">${html}</code></pre>
</div>\n`;
    },
    table(header, body) {
      return `<div class="table" role="region" tabindex="0"><table class="table__el"><thead>${header}</thead><tbody>${body}</tbody></table></div>\n`;
    },
  },
});

/* ---------- Таймкоды ---------- */

const PART_LABEL = { j1: 'video.part1', j2: 'video.part2' };

export function timecodeHTML(videos, video, time, label, extraClass = '') {
  const seconds = parseTime(time);
  const shown = formatTime(seconds);
  const part = t(PART_LABEL[video] || 'video.part1');
  const text = label ? esc(label) : shown;
  const id = videos?.[video]?.youtubeId;
  const cls = `timecode${extraClass ? ` ${extraClass}` : ''}`;
  if (!id) {
    return `<span class="${cls} timecode--disabled" title="${esc(t('video.notConfigured'))}"><span class="timecode__icon" aria-hidden="true">▶</span>${text}</span>`;
  }
  const href = `https://youtu.be/${encodeURIComponent(id)}?t=${seconds}`;
  const aria = `${t('video.watchFrom')} ${shown} (${part})`;
  return `<a class="${cls}" href="${href}" target="_blank" rel="noopener" data-video="${video}" data-t="${seconds}" aria-label="${esc(aria)}" title="${esc(part)} · ${shown}"><span class="timecode__icon" aria-hidden="true">▶</span>${text}</a>`;
}

function replaceTimecodes(src, videos) {
  return src.replace(
    /\{\{t\s+(j[12])\s+(\d{1,2}(?::\d{2}){1,2})(?:\s+([^}]+?))?\s*\}\}/g,
    (m, video, time, label) => timecodeHTML(videos, video, time, label),
  );
}

/* ---------- Директивы ::: ---------- */

const CALLOUTS = {
  note: 'i',
  tip: '✓',
  warning: '!',
  outdated: '↻',
  interview: '?',
};

const LEVELS = {
  easy: '●',
  medium: '▲',
  hard: '◆',
  video: '▶',
};

function renderInner(src) {
  return marked.parse(src);
}

function splitHints(lines) {
  const body = [];
  const hints = [];
  let target = body;
  for (const line of lines) {
    const m = line.match(/^\?\?\?\s*(.*)$/);
    if (m) {
      const hint = { title: m[1].trim() || t('task.hint'), lines: [] };
      hints.push(hint);
      target = hint.lines;
    } else {
      target.push(line);
    }
  }
  return { body: body.join('\n'), hints };
}

function hintsHTML(hints) {
  return hints
    .map(
      (h) => `<details class="task__hint"><summary class="task__hint-summary">${esc(h.title)}</summary><div class="task__hint-body">${renderInner(h.lines.join('\n'))}</div></details>`,
    )
    .join('');
}

function directiveHTML(type, modifier, title, lines, state) {
  if (type === 'task') {
    const level = LEVELS[modifier] ? modifier : 'easy';
    state.task += 1;
    const { body, hints } = splitHints(lines);
    return `<article class="task task--${level}">
<header class="task__header">
<span class="badge badge--${level}"><span class="badge__icon" aria-hidden="true">${LEVELS[level]}</span>${esc(t(`task.${level}`))}</span>
<span class="task__number">${esc(t('task.label'))} ${state.task}</span>
${title ? `<h4 class="task__title">${esc(title)}</h4>` : ''}
</header>
<div class="task__body">${renderInner(body)}</div>${hintsHTML(hints)}
</article>`;
  }

  const kind = CALLOUTS[type] ? type : 'note';
  const { body, hints } = splitHints(lines);
  return `<aside class="callout callout--${kind}">
<div class="callout__header"><span class="callout__icon" aria-hidden="true">${CALLOUTS[kind]}</span><span class="callout__label">${esc(t(`callout.${kind}`))}</span>${title ? `<span class="callout__title">${esc(title)}</span>` : ''}</div>
<div class="callout__body">${renderInner(body)}${hintsHTML(hints)}</div>
</aside>`;
}

function processDirectives(src) {
  const lines = src.split('\n');
  const out = [];
  const blocks = [];
  const state = { task: 0 };
  let inFence = false;
  let current = null;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;

    if (!inFence && !current) {
      const open = line.match(/^:::(\w+)(?:\s+([\w-]+))?(?:\s+"(.*)")?\s*$/);
      if (open) {
        current = { type: open[1], modifier: open[2] || '', title: open[3] || '', lines: [] };
        continue;
      }
    } else if (!inFence && current && /^:::\s*$/.test(line)) {
      blocks.push(directiveHTML(current.type, current.modifier, current.title, current.lines, state));
      out.push('', `<div data-directive="${blocks.length - 1}"></div>`, '');
      current = null;
      continue;
    }

    if (current) current.lines.push(line);
    else out.push(line);
  }

  if (current) {
    blocks.push(directiveHTML(current.type, current.modifier, current.title, current.lines, state));
    out.push('', `<div data-directive="${blocks.length - 1}"></div>`, '');
  }

  return { text: out.join('\n'), blocks };
}

/** Полный рендер документа */
export function renderMarkdown(src, { videos } = {}) {
  usedSlugs = new Map();
  const normalized = replaceTimecodes(src.replace(/\r\n?/g, '\n'), videos);
  const { text, blocks } = processDirectives(normalized);
  let html = marked.parse(text);
  html = html.replace(/<div data-directive="(\d+)"><\/div>/g, (m, i) => blocks[Number(i)]);
  return html;
}

/** Время чтения (минуты) */
export function readingMinutes(src) {
  const words = src.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
