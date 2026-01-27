import { state } from './state.js';

export function setPreviewMode(mode) {
  state.previewMode = mode;
  document.querySelector('aside')
    .classList.toggle('hidden', mode === 'mobile');

  state.canvas.style.width = mode === 'mobile' ? '375px' : '100%';
}
