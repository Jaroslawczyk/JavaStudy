/* Плавающий YouTube-плеер (youtube-nocookie.com, грузится только по клику пользователя) */
import { esc, formatTime } from './utils.js';
import { t } from './i18n.js';

const PART_LABEL = { j1: 'video.part1', j2: 'video.part2' };

let root = null;
let videos = {};
let state = { video: null, seconds: 0, minimized: false };

export function initPlayer(slot, videoConfig) {
  root = slot;
  videos = videoConfig || {};

  root.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-player]');
    if (!btn) return;
    const action = btn.dataset.player;
    if (action === 'close') close();
    if (action === 'minimize') {
      state.minimized = !state.minimized;
      root.classList.toggle('player--minimized', state.minimized);
      btn.setAttribute('aria-pressed', String(state.minimized));
      btn.title = t(state.minimized ? 'video.restore' : 'video.minimize');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !root.hidden && !document.querySelector('dialog[open]')) close();
  });
}

function frameSrc(id, seconds) {
  const params = new URLSearchParams({
    start: String(seconds),
    autoplay: '1',
    rel: '0',
    enablejsapi: '1',
    origin: location.origin,
  });
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;
}

function render(id) {
  const part = t(PART_LABEL[state.video] || 'video.part1');
  root.innerHTML = `
    <div class="player__bar">
      <span class="player__title">▶ ${esc(part)} · <span data-player-time>${formatTime(state.seconds)}</span></span>
      <a class="player__btn" data-player-link href="https://youtu.be/${esc(id)}?t=${state.seconds}" target="_blank" rel="noopener" title="${esc(t('video.openOnYoutube'))}" aria-label="${esc(t('video.openOnYoutube'))}">↗</a>
      <button class="player__btn" type="button" data-player="minimize" aria-pressed="false" title="${esc(t('video.minimize'))}" aria-label="${esc(t('video.minimize'))}">▁</button>
      <button class="player__btn" type="button" data-player="close" title="${esc(t('video.close'))}" aria-label="${esc(t('video.close'))}">✕</button>
    </div>
    <div class="player__frame-wrap">
      <iframe class="player__frame" src="${frameSrc(id, state.seconds)}" title="${esc(part)}"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"></iframe>
    </div>
    <p class="player__note">${esc(t('video.note'))}</p>`;
}

function command(func, args = []) {
  const frame = root.querySelector('.player__frame');
  frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
}

export function openAt(video, seconds) {
  const id = videos[video]?.youtubeId;
  if (!id || !root) return false;

  const sameVideo = state.video === video && !root.hidden && root.querySelector('.player__frame');
  state.video = video;
  state.seconds = seconds;

  if (sameVideo) {
    command('seekTo', [seconds, true]);
    command('playVideo');
    const time = root.querySelector('[data-player-time]');
    if (time) time.textContent = formatTime(seconds);
    const link = root.querySelector('[data-player-link]');
    if (link) link.href = `https://youtu.be/${id}?t=${seconds}`;
  } else {
    render(id);
  }

  root.hidden = false;
  if (state.minimized) {
    state.minimized = false;
    root.classList.remove('player--minimized');
  }
  return true;
}

export function close() {
  if (!root) return;
  root.hidden = true;
  root.innerHTML = '';
  state = { video: null, seconds: 0, minimized: false };
}

/** Делегирование кликов по таймкодам на всей странице */
export function bindTimecodes(container) {
  container.addEventListener('click', (event) => {
    const link = event.target.closest('a.timecode[data-video]');
    if (!link) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    if (openAt(link.dataset.video, Number(link.dataset.t))) event.preventDefault();
  });
}
