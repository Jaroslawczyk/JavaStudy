/* Интерактивные roadmap: Java (узлы → уроки/статьи) и Backend (узлы → разделы страницы «Карьера») */
import { esc, fetchJSON } from '../utils.js';
import { t, pick, getLang } from '../i18n.js';
import { findByPath } from '../course.js';
import { isDone } from '../progress.js';
import { buildHash, localizeHref } from '../router.js';

const MAPS = {
  java: 'content/roadmap-java.json',
  backend: 'content/roadmap-backend.json',
};

function nodeHTML(node, lang) {
  const target = node.to ? findByPath(node.to) : null;
  const done = target && isDone(target.path);
  let kind = 'article';
  if (target?.video) kind = 'video';
  if (node.optional) kind = 'optional';
  const cls = ['roadmap-node', `roadmap-node--${kind}`, done && 'roadmap-node--done'].filter(Boolean).join(' ');
  const icon = done ? '✓' : kind === 'video' ? '▶' : kind === 'optional' ? '○' : '■';
  const href = localizeHref(`#/${node.to}`, lang);
  const kindText = t(`roadmap.legend.${kind}`);
  return `<li>
    <a class="${cls}" href="${href}">
      <span class="roadmap-node__icon" aria-hidden="true">${icon}</span>
      <span class="roadmap-node__title">${esc(pick(node.title))}</span>
      <span class="visually-hidden">(${esc(done ? t('roadmap.legend.done') : kindText)})</span>
    </a>
  </li>`;
}

function stepHTML(step, index, lang) {
  const total = step.nodes.length;
  const done = step.nodes.filter((n) => n.to && isDone(n.to)).length;
  const complete = total > 0 && done === total;
  return `<li class="roadmap__step${complete ? ' roadmap__step--done' : ''}" id="step-${esc(step.id)}">
    <span class="roadmap__step-marker" aria-hidden="true">${complete ? '✓' : index + 1}</span>
    <div class="roadmap__step-card">
      <div class="roadmap__step-head">
        <h2 class="roadmap__step-title">${esc(pick(step.title))}</h2>
        ${step.nodes.some((n) => findByPath(n.to)) ? `<span class="roadmap__step-count">${done}/${total}</span>` : ''}
      </div>
      ${step.desc ? `<p class="roadmap__step-desc">${esc(pick(step.desc))}</p>` : ''}
      <ul class="roadmap__nodes">${step.nodes.map((n) => nodeHTML(n, lang)).join('')}</ul>
    </div>
  </li>`;
}

function legendItem(kind, icon) {
  return `<li class="roadmap__legend-item"><span class="roadmap-node roadmap-node--${kind}" aria-hidden="true"><span class="roadmap-node__icon">${icon}</span></span>${esc(t(`roadmap.legend.${kind}`))}</li>`;
}

export async function renderRoadmap(main, which = 'java') {
  const lang = getLang();
  const key = MAPS[which] ? which : 'java';
  const map = await fetchJSON(MAPS[key]);
  const title = t(`roadmap.${key}.title`);

  main.innerHTML = `<section class="roadmap">
    <nav class="tabs" aria-label="Roadmap">
      <ul class="tabs__list">
        <li><a class="tabs__link${key === 'java' ? ' tabs__link--active' : ''}" href="${buildHash(lang, 'roadmap')}" ${key === 'java' ? 'aria-current="page"' : ''}>☕ ${esc(t('roadmap.java.tab'))}</a></li>
        <li><a class="tabs__link${key === 'backend' ? ' tabs__link--active' : ''}" href="${buildHash(lang, 'roadmap', 'backend')}" ${key === 'backend' ? 'aria-current="page"' : ''}>🧭 ${esc(t('roadmap.backend.tab'))}</a></li>
      </ul>
    </nav>
    <header class="roadmap__header">
      <h1 class="roadmap__title">${esc(title)}</h1>
      <p class="roadmap__intro">${esc(t(`roadmap.${key}.intro`))}</p>
      <ul class="roadmap__legend">
        ${key === 'java' ? legendItem('video', '▶') : ''}
        ${legendItem('article', '■')}
        ${legendItem('optional', '○')}
        ${legendItem('done', '✓')}
      </ul>
    </header>
    <ol class="roadmap__track">${map.steps.map((s, i) => stepHTML(s, i, lang)).join('')}</ol>
    <p class="roadmap__footer">${t('roadmap.attribution')}</p>
  </section>`;

  document.title = `${title} — JavaStudy`;
}
