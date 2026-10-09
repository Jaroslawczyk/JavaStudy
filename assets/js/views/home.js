/* Главная: вступление из pages/home.md + карточки разделов с прогрессом */
import { esc } from '../utils.js';
import { t, pick, getLang } from '../i18n.js';
import { sections } from '../course.js';
import { countDone } from '../progress.js';
import { buildHash } from '../router.js';
import { renderArticle } from './article.js';

function sectionCard(section) {
  const lang = getLang();
  const first = section.items[0];
  const done = countDone(section.items.map((i) => i.path));
  const total = section.items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `<a class="card" href="${buildHash(lang, first.kind, first.id)}">
    <span class="card__icon" aria-hidden="true">${esc(section.icon || '☕')}</span>
    <span class="card__title">${esc(pick(section.title))}</span>
    ${section.desc ? `<span class="card__text">${esc(pick(section.desc))}</span>` : ''}
    <span class="card__meta">${esc(t('home.progress', { done, total }))}</span>
    <span class="card__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${esc(pick(section.title))}"><span class="card__progress-fill" style="width:${pct}%"></span></span>
  </a>`;
}

function pageCard(icon, href, title, text) {
  return `<a class="card" href="${href}">
    <span class="card__icon" aria-hidden="true">${icon}</span>
    <span class="card__title">${esc(title)}</span>
    <span class="card__text">${esc(text)}</span>
  </a>`;
}

export async function renderHome(main, { videos }) {
  await renderArticle(main, { folder: 'pages', id: 'home', videos });
  const lang = getLang();
  const body = main.querySelector('.article__body');
  body.insertAdjacentHTML(
    'beforeend',
    `<h2 id="sections">${esc(t('home.cardsTitle'))}</h2>
    <div class="card-grid">${sections().map(sectionCard).join('')}</div>
    <h2 id="more">${esc(t('home.moreTitle'))}</h2>
    <div class="card-grid">
      ${pageCard('🗺️', buildHash(lang, 'roadmap'), t('nav.roadmap'), t('home.cards.roadmap'))}
      ${pageCard('📝', buildHash(lang, 'page', 'cheatsheet'), t('nav.cheatsheet'), t('home.cards.cheatsheet'))}
      ${pageCard('🧭', buildHash(lang, 'page', 'career'), t('nav.career'), t('home.cards.career'))}
      ${pageCard('🤖', buildHash(lang, 'page', 'ai'), t('nav.ai'), t('home.cards.ai'))}
      ${pageCard('📈', buildHash(lang, 'page', 'levels'), t('nav.levels'), t('home.cards.levels'))}
    </div>`,
  );
  document.title = 'JavaStudy — Java';
}
