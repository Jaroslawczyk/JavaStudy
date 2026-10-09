/* Страница урока / статьи / информационной страницы из Markdown */
import { esc, fetchText } from '../utils.js';
import { t, pick, getLang, DEFAULT_LANG } from '../i18n.js';
import { renderMarkdown, readingMinutes, timecodeHTML } from '../markdown.js';
import { neighbours } from '../course.js';
import { isDone, setDone } from '../progress.js';
import { buildHash, localizeHref } from '../router.js';

const PART_LABEL = { j1: 'video.part1', j2: 'video.part2' };

/** Загружает Markdown для текущего языка, с откатом на русский */
async function loadSource(folder, id) {
  const lang = getLang();
  try {
    return { src: await fetchText(`content/${lang}/${folder}/${id}.md`), fallback: false };
  } catch (e) {
    if (lang === DEFAULT_LANG) throw e;
    return { src: await fetchText(`content/${DEFAULT_LANG}/${folder}/${id}.md`), fallback: true };
  }
}

/** Заголовок H1 из первой строки "# ..." (если есть) — отделяем от тела */
function splitTitle(src) {
  const m = src.match(/^\s*#\s+(.+)\n/);
  if (!m) return { title: null, body: src };
  return { title: m[1].trim(), body: src.slice(m[0].length) };
}

function tocHTML(headings, base, inline) {
  if (headings.length < 2) return '';
  const list = headings
    .map(
      (h) => `<li class="toc__item toc__item--${h.level}"><a class="toc__link" href="${base}/${encodeURIComponent(h.id)}" data-toc="${esc(h.id)}">${esc(h.text)}</a></li>`,
    )
    .join('');
  if (inline) {
    return `<details class="toc toc--inline"><summary class="toc__title">${esc(t('article.toc'))}</summary><ul class="toc__list">${list}</ul></details>`;
  }
  return `<nav class="toc" aria-label="${esc(t('article.toc'))}"><p class="toc__title">${esc(t('article.toc'))}</p><ul class="toc__list">${list}</ul></nav>`;
}

function pagerHTML(item) {
  const { prev, next } = neighbours(item);
  const lang = getLang();
  const link = (it, dir) =>
    `<a class="pager__link pager__link--${dir}" href="${buildHash(lang, it.kind, it.id)}" rel="${dir}">
      <span class="pager__dir">${dir === 'prev' ? '← ' + esc(t('article.prev')) : esc(t('article.next')) + ' →'}</span>
      <span class="pager__title">${esc(pick(it.title))}</span>
    </a>`;
  return `<nav class="pager" aria-label="${esc(t('article.pager'))}">${prev ? link(prev, 'prev') : ''}${next ? link(next, 'next') : ''}</nav>`;
}

function doneToggleHTML(item) {
  const done = isDone(item.path);
  return `<label class="done-toggle${done ? ' done-toggle--checked' : ''}">
    <input class="done-toggle__input" type="checkbox" data-done="${esc(item.path)}" ${done ? 'checked' : ''}>
    <span class="done-toggle__label">${esc(done ? t('article.done') : t('article.markDone'))}</span>
  </label>`;
}

function metaHTML(item, minutes, videos) {
  const parts = [];
  if (item?.video) {
    const label = `${t('video.watchSegment')} ${item.start}${item.end ? ' – ' + item.end : ''}`;
    parts.push(timecodeHTML(videos, item.video, item.start, label, 'timecode--large'));
    parts.push(`<span class="badge badge--video"><span class="badge__icon" aria-hidden="true">▶</span>${esc(t(PART_LABEL[item.video]))}</span>`);
  } else if (item) {
    parts.push(`<span class="badge badge--article"><span class="badge__icon" aria-hidden="true">■</span>${esc(t('article.article'))}</span>`);
  }
  parts.push(`<span class="badge"><span class="badge__icon" aria-hidden="true">◷</span>${esc(t('article.readingTime', { n: minutes }))}</span>`);
  if (item && isDone(item.path)) {
    parts.push(`<span class="badge badge--done"><span class="badge__icon" aria-hidden="true">✓</span>${esc(t('article.done'))}</span>`);
  }
  return `<div class="article__meta">${parts.join('')}</div>`;
}

function enhance(container, lang) {
  container.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href.startsWith('#/')) a.setAttribute('href', localizeHref(href, lang));
    else if (/^https?:/.test(href) && !a.classList.contains('timecode')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });
}

/**
 * @param {HTMLElement} main
 * @param {{folder:string,id:string,item?:object,videos:object,anchor?:string}} opts
 */
export async function renderArticle(main, { folder, id, item = null, videos }) {
  const lang = getLang();
  const { src, fallback } = await loadSource(folder, id);
  const { title: mdTitle, body } = splitTitle(src);
  const title = item ? pick(item.title) : mdTitle || '';
  const html = renderMarkdown(body, { videos });
  const minutes = readingMinutes(body);
  const base = item ? buildHash(lang, item.kind, item.id) : buildHash(lang, 'page', id);

  const crumbs = [`<li class="breadcrumbs__item"><a class="breadcrumbs__link" href="${buildHash(lang)}">${esc(t('nav.home'))}</a></li>`];
  if (item) crumbs.push(`<li class="breadcrumbs__item">${esc(pick(item.section.title))}</li>`);
  crumbs.push(`<li class="breadcrumbs__item" aria-current="page">${esc(title)}</li>`);

  const kicker = item ? `${item.no} · ${pick(item.section.title)}` : '';

  main.innerHTML = `<article class="article">
    <div class="article__main">
      <nav class="breadcrumbs" aria-label="Breadcrumbs"><ol class="breadcrumbs__list">${crumbs.join('')}</ol></nav>
      <header class="article__header">
        ${kicker ? `<p class="article__kicker">${esc(kicker)}</p>` : ''}
        <h1 class="article__title">${esc(title)}</h1>
        ${metaHTML(item, minutes, videos)}
      </header>
      ${fallback ? `<p class="notice notice--warning" role="status">${esc(t('article.fallback'))}</p>` : ''}
      <div data-slot="toc-inline"></div>
      <div class="article__body">${html}</div>
      ${item ? `<footer class="article__footer">${doneToggleHTML(item)}${pagerHTML(item)}</footer>` : ''}
    </div>
    <aside class="article__aside" data-slot="toc"></aside>
  </article>`;

  const bodyEl = main.querySelector('.article__body');
  enhance(main, lang);

  const headings = [...bodyEl.querySelectorAll('h2, h3')].map((h) => ({
    id: h.id,
    level: h.tagName.toLowerCase(),
    text: h.textContent.replace(/#$/, '').trim(),
  }));
  main.querySelector('[data-slot="toc"]').innerHTML = tocHTML(headings, base, false);
  main.querySelector('[data-slot="toc-inline"]').innerHTML = tocHTML(headings, base, true);

  /* Якоря заголовков → роутер */
  bodyEl.querySelectorAll('.heading-anchor').forEach((a) => {
    a.setAttribute('href', `${base}/${encodeURIComponent(a.dataset.anchor)}`);
  });

  main.querySelector('[data-done]')?.addEventListener('change', (event) => {
    setDone(event.target.dataset.done, event.target.checked);
    const label = event.target.closest('.done-toggle');
    label.classList.toggle('done-toggle--checked', event.target.checked);
    label.querySelector('.done-toggle__label').textContent = event.target.checked ? t('article.done') : t('article.markDone');
  });

  observeToc(main);
  document.title = `${title} — JavaStudy`;
}

let observer = null;

function observeToc(main) {
  observer?.disconnect();
  const links = main.querySelectorAll('.toc__link');
  if (!links.length || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('toc__link--active', l.dataset.toc === entry.target.id));
      });
    },
    { rootMargin: '-80px 0px -70% 0px' },
  );
  main.querySelectorAll('.article__body h2, .article__body h3').forEach((h) => observer.observe(h));
}
