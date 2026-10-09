/* Прогресс обучения: список пройденных уроков в localStorage (только в этом браузере) */
import { storage } from './utils.js';

const KEY = 'javastudy.progress';
const listeners = new Set();
let done = new Set(storage.get(KEY, []));

export function isDone(path) {
  return done.has(path);
}

export function setDone(path, value) {
  if (value) done.add(path);
  else done.delete(path);
  storage.set(KEY, [...done]);
  listeners.forEach((fn) => fn(path, value));
}

export function countDone(paths) {
  return paths.filter((p) => done.has(p)).length;
}

export function onProgressChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* Синхронизация между вкладками */
window.addEventListener('storage', (event) => {
  if (event.key !== KEY) return;
  done = new Set(storage.get(KEY, []));
  listeners.forEach((fn) => fn(null, null));
});
