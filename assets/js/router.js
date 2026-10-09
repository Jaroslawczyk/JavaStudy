/* Hash-роутер: #/{lang}/{view}/{id}/{anchor}
   Примеры: #/ru  ·  #/en/lessons/j1-arrays  ·  #/pl/lessons/j1-arrays/tablice
            #/ru/roadmap  ·  #/ru/roadmap/backend  ·  #/ru/page/career/apis */
import { LANGS } from './i18n.js';

export const ARTICLE_KINDS = ['tools', 'lessons', 'extra'];

export function parseHash(hash = location.hash) {
  const parts = hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((p) => decodeURIComponent(p));

  let lang = null;
  if (LANGS.includes(parts[0])) lang = parts.shift();

  const [view = 'home', id = null, anchor = null] = parts;
  return { lang, view, id, anchor };
}

export function buildHash(lang, ...segments) {
  const rest = segments.filter((s) => s != null && s !== '').map((s) => encodeURIComponent(s));
  return `#/${[lang, ...rest].join('/')}`;
}

/** Ссылки из Markdown вида "#/lessons/x" → "#/{lang}/lessons/x" */
export function localizeHref(href, lang) {
  if (!href || !href.startsWith('#/')) return href;
  const first = href.slice(2).split('/')[0];
  if (LANGS.includes(first)) return href;
  return `#/${lang}/${href.slice(2)}`;
}
