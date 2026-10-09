/* Интернационализация: строки интерфейса из content/{lang}/ui.json */
import { fetchJSON, storage } from './utils.js';

export const LANGS = ['ru', 'en', 'pl'];
export const DEFAULT_LANG = 'ru';
const STORAGE_KEY = 'javastudy.lang';

const dictionaries = {};
let current = DEFAULT_LANG;

export function detectLang() {
  const saved = storage.get(STORAGE_KEY, null);
  if (LANGS.includes(saved)) return saved;
  const nav = (navigator.language || '').toLowerCase();
  if (/^(ru|be|uk|kk)/.test(nav)) return 'ru';
  if (nav.startsWith('pl')) return 'pl';
  return nav ? 'en' : DEFAULT_LANG;
}

export async function setLang(lang) {
  if (!LANGS.includes(lang)) lang = DEFAULT_LANG;
  if (!dictionaries[lang]) dictionaries[lang] = await fetchJSON(`content/${lang}/ui.json`);
  if (!dictionaries[DEFAULT_LANG]) dictionaries[DEFAULT_LANG] = await fetchJSON(`content/${DEFAULT_LANG}/ui.json`);
  current = lang;
  storage.set(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  return lang;
}

export function getLang() {
  return current;
}

function lookup(dict, key) {
  return key.split('.').reduce((obj, part) => (obj == null ? undefined : obj[part]), dict);
}

/** Строка интерфейса по ключу "a.b.c" с подстановкой {var} */
export function t(key, vars) {
  let value = lookup(dictionaries[current], key);
  if (value == null) value = lookup(dictionaries[DEFAULT_LANG], key);
  if (value == null) return key;
  if (vars) value = String(value).replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
  return value;
}

/** Значение из объекта вида {ru, en, pl} для текущего языка */
export function pick(obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[current] ?? obj[DEFAULT_LANG] ?? obj.en ?? '';
}

/** Перевод статической разметки с data-i18n / data-i18n-title */
export function translateStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
    el.setAttribute('aria-label', t(el.dataset.i18nTitle));
  });
}
