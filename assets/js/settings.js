/* Тема, режим для дальтоников и настройки чтения */
import { esc, storage } from './utils.js';
import { t } from './i18n.js';

const KEY = 'javastudy.settings';
const root = document.documentElement;

const DEFAULTS = {
  theme: null, // null → по системной теме
  cvd: false,
  fontSize: 'm',
  lineHeight: 'normal',
  width: 'normal',
  readableFont: false,
};

let settings = { ...DEFAULTS, ...storage.get(KEY, {}) };
let dialog = null;

function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'github-dark' : 'coffee';
}

export function currentTheme() {
  return settings.theme || systemTheme();
}

export function apply() {
  root.dataset.theme = currentTheme();
  toggleAttr('cvd', settings.cvd ? 'on' : null);
  toggleAttr('fontSize', settings.fontSize !== 'm' ? settings.fontSize : null);
  toggleAttr('lineHeight', settings.lineHeight !== 'normal' ? settings.lineHeight : null);
  toggleAttr('width', settings.width !== 'normal' ? settings.width : null);
  toggleAttr('readableFont', settings.readableFont ? 'on' : null);
}

function toggleAttr(name, value) {
  if (value) root.dataset[name] = value;
  else delete root.dataset[name];
}

function save() {
  storage.set(KEY, settings);
  apply();
}

export function update(patch) {
  settings = { ...settings, ...patch };
  save();
}

export function toggleTheme() {
  update({ theme: currentTheme() === 'coffee' ? 'github-dark' : 'coffee' });
  syncDialog();
}

window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
  if (!settings.theme) apply();
});

/* ---------- Диалог настроек ---------- */

function radioGroup(name, legend, options) {
  const value = name === 'theme' ? currentTheme() : settings[name];
  return `<fieldset class="settings__group">
    <legend class="settings__legend">${esc(legend)}</legend>
    <div class="settings__options">
      ${options
        .map(
          ([val, label]) => `<label class="settings__option">
            <input class="settings__radio" type="radio" name="${name}" value="${val}" ${value === val ? 'checked' : ''}>
            <span class="settings__chip">${esc(label)}</span>
          </label>`,
        )
        .join('')}
    </div>
  </fieldset>`;
}

function switchRow(name, label, hint) {
  return `<label class="settings__switch">
    <input class="settings__checkbox" type="checkbox" name="${name}" ${settings[name] ? 'checked' : ''}>
    <span class="settings__switch-text">
      <span class="settings__switch-label">${esc(label)}</span>
      <span class="settings__hint">${esc(hint)}</span>
    </span>
  </label>`;
}

function renderDialog() {
  dialog.innerHTML = `
    <form method="dialog" class="settings__form">
      <div class="settings__header">
        <h2 class="settings__title" id="settings-title">${esc(t('settings.title'))}</h2>
        <button class="icon-btn" type="submit" value="close" aria-label="${esc(t('settings.close'))}" title="${esc(t('settings.close'))}"><span class="icon-btn__icon" aria-hidden="true">✕</span></button>
      </div>
      <div class="settings__body">
        ${radioGroup('theme', t('settings.theme'), [
          ['coffee', `☕ ${t('settings.themeCoffee')}`],
          ['github-dark', `🌙 ${t('settings.themeDark')}`],
        ])}
        <div class="settings__group">
          ${switchRow('cvd', t('settings.cvd'), t('settings.cvdHint'))}
          <div class="settings__swatches" aria-hidden="true">
            <span class="badge badge--easy"><span class="badge__icon">●</span>${esc(t('task.easy'))}</span>
            <span class="badge badge--medium"><span class="badge__icon">▲</span>${esc(t('task.medium'))}</span>
            <span class="badge badge--hard"><span class="badge__icon">◆</span>${esc(t('task.hard'))}</span>
            <span class="badge badge--outdated"><span class="badge__icon">↻</span>${esc(t('callout.outdated'))}</span>
          </div>
        </div>
        ${radioGroup('fontSize', t('settings.fontSize'), [
          ['s', 'A−'],
          ['m', 'A'],
          ['l', 'A+'],
          ['xl', 'A++'],
        ])}
        ${radioGroup('lineHeight', t('settings.lineHeight'), [
          ['normal', t('settings.lineNormal')],
          ['relaxed', t('settings.lineRelaxed')],
        ])}
        ${radioGroup('width', t('settings.width'), [
          ['narrow', t('settings.widthNarrow')],
          ['normal', t('settings.widthNormal')],
          ['wide', t('settings.widthWide')],
        ])}
        ${switchRow('readableFont', t('settings.readableFont'), t('settings.readableFontHint'))}
      </div>
      <div class="settings__footer">
        <button class="settings__btn" type="button" data-settings="reset">${esc(t('settings.reset'))}</button>
        <button class="settings__btn settings__btn--primary" type="submit" value="close">${esc(t('settings.done'))}</button>
      </div>
    </form>`;
}

function syncDialog() {
  if (dialog?.open) renderDialog();
}

export function initSettings(dialogEl) {
  dialog = dialogEl;
  apply();

  dialog.addEventListener('change', (event) => {
    const input = event.target;
    if (!input.name) return;
    update({ [input.name]: input.type === 'checkbox' ? input.checked : input.value });
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close(); // клик по подложке
    if (event.target.closest('[data-settings="reset"]')) {
      settings = { ...DEFAULTS };
      save();
      renderDialog();
    }
  });
}

export function openSettings() {
  renderDialog();
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}
