/* Боковая навигация по курсу с фильтром и отметками прогресса */
import { esc } from '../utils.js';
import { t, pick, getLang } from '../i18n.js';
import { sections } from '../course.js';
import { isDone, countDone } from '../progress.js';
import { buildHash } from '../router.js';

let el = null;
let activePath = null;
let query = '';
const openGroups = new Set();

function matches(item) {
  if (!query) return true;
  const q = query.toLowerCase();
  return ['ru', 'en', 'pl'].some((l) => (item.title[l] || '').toLowerCase().includes(q)) || item.id.includes(q);
}

function itemHTML(item) {
  const done = isDone(item.path);
  const active = item.path === activePath;
  const status = done ? '✓' : item.no;
  const cls = ['sidebar__link', active && 'sidebar__link--active', done && 'sidebar__link--done'].filter(Boolean).join(' ');
  return `<li class="sidebar__item">
    <a class="${cls}" href="${buildHash(getLang(), item.kind, item.id)}" ${active ? 'aria-current="page"' : ''}>
      <span class="sidebar__status" aria-hidden="true">${status}</span>
      <span class="sidebar__text">${esc(pick(item.title))}</span>
      ${item.video ? `<span class="sidebar__time" title="${esc(t('article.kindVideo'))}">${esc(item.start)}</span>` : ''}
      ${done ? `<span class="visually-hidden">(${esc(t('article.done'))})</span>` : ''}
    </a>
  </li>`;
}

function groupsHTML() {
  const html = sections()
    .map((section) => {
      const visible = section.items.filter(matches);
      if (!visible.length) return '';
      const containsActive = section.items.some((i) => i.path === activePath);
      if (containsActive) openGroups.add(section.id);
      const open = query || openGroups.has(section.id);
      const done = countDone(section.items.map((i) => i.path));
      return `<details class="sidebar__group" data-group="${section.id}" ${open ? 'open' : ''}>
        <summary class="sidebar__summary"><span class="sidebar__no" aria-hidden="true">${section.no}</span><span class="sidebar__group-title">${esc(pick(section.title))}</span><span class="sidebar__count">${done}/${section.items.length}</span></summary>
        <ul class="sidebar__list">${visible.map(itemHTML).join('')}</ul>
      </details>`;
    })
    .join('');
  return html || `<p class="sidebar__empty">${esc(t('search.empty'))}</p>`;
}

function renderGroups() {
  const box = el.querySelector('[data-slot="sidebar-groups"]');
  if (box) box.innerHTML = groupsHTML();
}

export function renderSidebar(container) {
  el = container;
  el.innerHTML = `<div class="sidebar__inner">
    <div class="sidebar__top">
    <button class="sidebar__collapse" type="button" data-action="toggle-sidebar" aria-controls="sidebar" title="${esc(t('sidebar.collapse'))}" aria-label="${esc(t('sidebar.collapse'))}">‹</button>
    <div class="search">
      <label class="visually-hidden" for="sidebar-search">${esc(t('search.label'))}</label>
      <span class="search__icon" aria-hidden="true">⌕</span>
      <input class="search__input" id="sidebar-search" type="search" placeholder="${esc(t('search.placeholder'))}" value="${esc(query)}" autocomplete="off">
    </div>
    </div>
    <nav data-slot="sidebar-groups" aria-label="${esc(t('sidebar.title'))}"></nav>
  </div>`;
  renderGroups();

  el.querySelector('.search__input').addEventListener('input', (event) => {
    query = event.target.value.trim();
    renderGroups();
  });

  el.addEventListener('toggle', (event) => {
    const group = event.target.closest?.('[data-group]');
    if (!group || query) return;
    if (group.open) openGroups.add(group.dataset.group);
    else openGroups.delete(group.dataset.group);
  }, true);
}

export function setActive(path) {
  activePath = path;
  if (el) {
    renderGroups();
    el.querySelector('.sidebar__link--active')?.scrollIntoView({ block: 'nearest' });
  }
}

export function refreshSidebar() {
  if (el) renderGroups();
}
