/* Общие утилиты */

const cache = new Map();

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function fetchText(url) {
  if (cache.has(url)) return cache.get(url);
  const promise = fetch(url, { cache: 'no-cache' }).then((res) => {
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.text();
  });
  cache.set(url, promise);
  promise.catch(() => cache.delete(url));
  return promise;
}

export async function fetchJSON(url) {
  return JSON.parse(await fetchText(url));
}

/** "1:02:34" | "12:28" → секунды */
export function parseTime(str) {
  return String(str)
    .split(':')
    .map(Number)
    .reduce((acc, n) => acc * 60 + n, 0);
}

/** секунды → "1:02:34" / "12:28" */
export function formatTime(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return (h ? `${h}:` : '') + `${mm}:${String(s).padStart(2, '0')}`;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;|&#\d+;/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* приватный режим / хранилище недоступно — работаем без сохранения */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      /* ignore */
    }
  },
};
