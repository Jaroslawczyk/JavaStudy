/* Модель курса: content/course.json → разделы и плоский список уроков */
import { fetchJSON } from './utils.js';

let data = null;
let flat = [];

export async function loadCourse() {
  data = await fetchJSON('content/course.json');
  flat = [];
  let lessonNo = 0;
  data.sections.forEach((section) => {
    section.items.forEach((item) => {
      item.section = section;
      item.path = `${item.kind}/${item.id}`;
      if (item.kind === 'lessons') item.no = ++lessonNo;
      item.index = flat.length;
      flat.push(item);
    });
  });
  return data;
}

export function sections() {
  return data?.sections ?? [];
}

export function items() {
  return flat;
}

export function findItem(kind, id) {
  return flat.find((item) => item.kind === kind && item.id === id) || null;
}

export function findByPath(path) {
  return flat.find((item) => item.path === path) || null;
}

export function neighbours(item) {
  return {
    prev: item.index > 0 ? flat[item.index - 1] : null,
    next: item.index < flat.length - 1 ? flat[item.index + 1] : null,
  };
}

export function firstOfKind(kind) {
  return flat.find((item) => item.kind === kind) || null;
}
