/* JavaStudy — точка входа приложения */
import { esc, fetchJSON } from './utils.js';
import { LANGS, detectLang, setLang, getLang, t, translateStatic } from './i18n.js';
import { parseHash, buildHash, ARTICLE_KINDS } from './router.js';
import { loadCourse, findItem, firstOfKind } from './course.js';
import { initSettings, openSettings, toggleTheme } from './settings.js';
import { onProgressChange } from './progress.js';
import { initPlayer, bindTimecodes } from './player.js';
import { renderSidebar, setActive, refreshSidebar } from './views/sidebar.js';
import { renderArticle } from './views/article.js';
import { renderHome } from './views/home.js';
import { renderRoadmap } from './views/roadmap.js';

const slots = Object.fromEntries([...document.querySelectorAll('[data-slot]')].map((el) => [el.dataset.slot, el]));
let config = null;
let renderedLang = null;
let lastPageKey = null;

const NAV = [
  { key: 'tools', icon: '🧰', href: (l) => buildHash(l, 'tools', firstOfKind('tools')?.id), match: (r) => r.view === 'tools' },
  { key: 'course', icon: '☕', href: (l) => buildHash(l, 'lessons', firstOfKind('lessons')?.id), match: (r) => r.view === 'lessons' || r.view === 'extra' },
  { key: 'roadmap', icon: '🗺️', href: (l) => buildHash(l, 'roadmap'), match: (r) => r.view === 'roadmap' },
  { key: 'career', icon: '🧭', href: (l) => buildHash(l, 'page', 'career'), match: (r) => r.view === 'page' && r.id === 'career' },
  { key: 'ai', icon: '🤖', href: (l) => buildHash(l, 'page', 'ai'), match: (r) => r.view === 'page' && r.id === 'ai' },
  { key: 'levels', icon: '📈', href: (l) => buildHash(l, 'page', 'levels'), match: (r) => r.view === 'page' && r.id === 'levels' },
];

function renderChrome(route) {
  const lang = getLang();
  slots.nav.innerHTML = NAV.map((n) => {
    const active = n.match(route);
    return `<li class="nav__item"><a class="nav__link${active ? ' nav__link--active' : ''}" href="${n.href(lang)}" ${active ? 'aria-current="page"' : ''}><span class="nav__icon" aria-hidden="true">${n.icon}</span><span class="nav__label">${esc(t(`nav.${n.key}`))}</span></a></li>`;
  }).join('');

  if (renderedLang !== lang) {
    slots.lang.innerHTML = LANGS.map(
      (l) => `<button class="lang-switch__btn${l === lang ? ' lang-switch__btn--active' : ''}" type="button" data-lang="${l}" lang="${l}" aria-pressed="${l === lang}" title="${esc(t(`lang.${l}`))}">${l}</button>`,
    ).join('');
    translateStatic();
    renderSidebar(slots.sidebar);
    renderFooter();
    document.querySelector('.header__logo').setAttribute('href', buildHash(lang));
    renderedLang = lang;
  }
}

function renderFooter() {
  slots.footer.innerHTML = `<div class="footer__inner">
    <p class="footer__text">${t('footer.text')}</p>
    <ul class="footer__links">
      <li><a class="footer__link" href="${buildHash(getLang(), 'page', 'about')}">${esc(t('footer.about'))}</a></li>
      <li><a class="footer__link" href="https://youtu.be/${esc(config.videos.j1.youtubeId)}" target="_blank" rel="noopener">${esc(t('video.part1'))} ↗</a></li>
      <li><a class="footer__link" href="https://youtu.be/${esc(config.videos.j2.youtubeId)}" target="_blank" rel="noopener">${esc(t('video.part2'))} ↗</a></li>
      <li><a class="footer__link" href="https://roadmap.sh/java" target="_blank" rel="noopener">roadmap.sh ↗</a></li>
      <li><span class="footer__link">v${esc(config.version)}</span></li>
    </ul>
  </div>`;
}

function notFound() {
  slots.main.innerHTML = `<div class="notice notice--center">
    <h1>${esc(t('notFound.title'))}</h1>
    <p>${esc(t('notFound.text'))}</p>
    <p><a href="${buildHash(getLang())}">${esc(t('notFound.home'))}</a></p>
  </div>`;
  document.title = `${t('notFound.title')} — JavaStudy`;
}

function scrollToAnchor(anchor, smooth = false) {
  if (!anchor) return false;
  const target = document.getElementById(anchor);
  if (!target) return false;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  return true;
}

async function route() {
  const parsed = parseHash();
  if (!parsed.lang) {
    const lang = detectLang();
    const rest = location.hash.replace(/^#\/?/, '');
    location.replace(`#/${lang}${rest ? '/' + rest : ''}`);
    return;
  }

  if (parsed.lang !== getLang() || !renderedLang) await setLang(parsed.lang);
  renderChrome(parsed);
  closeSidebar();

  const pageKey = `${parsed.lang}/${parsed.view}/${parsed.id ?? ''}`;
  if (pageKey === lastPageKey && parsed.anchor) {
    scrollToAnchor(parsed.anchor, true);
    return;
  }
  lastPageKey = pageKey;

  const videos = config.videos;
  let activePath = null;
  slots.main.setAttribute('aria-busy', 'true');

  try {
    if (parsed.view === 'home') {
      await renderHome(slots.main, { videos });
    } else if (ARTICLE_KINDS.includes(parsed.view)) {
      const item = findItem(parsed.view, parsed.id);
      if (!item) return notFound();
      activePath = item.path;
      await renderArticle(slots.main, { folder: item.kind, id: item.id, item, videos });
    } else if (parsed.view === 'page' && parsed.id) {
      await renderArticle(slots.main, { folder: 'pages', id: parsed.id, videos });
    } else if (parsed.view === 'roadmap') {
      await renderRoadmap(slots.main, parsed.id || 'java');
    } else {
      notFound();
    }
  } catch (error) {
    console.error(error);
    notFound();
  } finally {
    slots.main.removeAttribute('aria-busy');
  }

  setActive(activePath);
  if (!scrollToAnchor(parsed.anchor)) {
    window.scrollTo({ top: 0 });
    slots.main.focus({ preventScroll: true });
  }
  updateReadProgress();
}

/* ---------- Сайдбар на мобильных ---------- */

function openSidebar() {
  slots.sidebar.classList.add('sidebar--open');
  document.querySelector('.layout__backdrop').hidden = false;
  document.querySelector('[data-action="toggle-sidebar"]').setAttribute('aria-expanded', 'true');
  slots.sidebar.querySelector('.search__input')?.focus();
}

function closeSidebar() {
  slots.sidebar.classList.remove('sidebar--open');
  document.querySelector('.layout__backdrop').hidden = true;
  document.querySelector('[data-action="toggle-sidebar"]').setAttribute('aria-expanded', 'false');
}

/* На больших экранах меню курса сворачивается в узкую закладку; состояние запоминается */
const COLLAPSE_KEY = 'javastudy.sidebarCollapsed';

function applyDesktopSidebar(collapsed) {
  document.documentElement.classList.toggle('sidebar-collapsed', collapsed);
  document.querySelector('[data-action="toggle-sidebar"]').setAttribute('aria-expanded', String(!collapsed));
}

function toggleDesktopSidebar() {
  const collapsed = !document.documentElement.classList.contains('sidebar-collapsed');
  applyDesktopSidebar(collapsed);
  try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch { /* приватный режим */ }
}

try { if (localStorage.getItem(COLLAPSE_KEY) === '1') document.documentElement.classList.add('sidebar-collapsed'); } catch { /* ignore */ }

/* ---------- Глобальные обработчики ---------- */

function bindEvents() {
  document.addEventListener('click', async (event) => {
    const actionEl = event.target.closest('[data-action]');
    const langBtn = event.target.closest('[data-lang]');

    if (langBtn) {
      const route = parseHash();
      const segments = [route.view === 'home' ? null : route.view, route.id, route.anchor];
      location.hash = buildHash(langBtn.dataset.lang, ...segments);
      return;
    }
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    if (action === 'toggle-sidebar' && window.matchMedia('(min-width: 1100px)').matches) {
      toggleDesktopSidebar();
    } else if (action === 'toggle-sidebar') {
      slots.sidebar.classList.contains('sidebar--open') ? closeSidebar() : openSidebar();
    } else if (action === 'close-sidebar') {
      closeSidebar();
    } else if (action === 'toggle-theme') {
      toggleTheme();
    } else if (action === 'open-settings') {
      openSettings();
    } else if (action === 'copy-code') {
      const code = actionEl.closest('.code-block')?.querySelector('code')?.textContent ?? '';
      try {
        await navigator.clipboard.writeText(code);
        actionEl.textContent = t('copied');
      } catch (e) {
        actionEl.textContent = '✕';
      }
      setTimeout(() => (actionEl.textContent = t('copy')), 1500);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && slots.sidebar.classList.contains('sidebar--open')) closeSidebar();
  });

  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', updateReadProgress, { passive: true });
  onProgressChange(() => refreshSidebar());
}

function updateReadProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0;
  slots['read-progress'].style.width = `${pct}%`;
}

/* Реальная высота шапки (на мобильных навигация уходит во вторую строку) — для якорей и sticky-элементов */
function trackHeaderHeight() {
  const header = document.querySelector('.header');
  const set = () => document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  set();
  if ('ResizeObserver' in window) new ResizeObserver(set).observe(header);
}

async function start() {
  trackHeaderHeight();
  initSettings(slots.settings);
  config = await fetchJSON('content/config.json');
  await loadCourse();
  initPlayer(slots.player, config.videos);
  bindTimecodes(document.body);
  bindEvents();
  await route();
}

start().catch((error) => {
  console.error(error);
  slots.main.innerHTML = '<p class="notice notice--center">Failed to load JavaStudy. Please run the site through a web server (see README).</p>';
});
