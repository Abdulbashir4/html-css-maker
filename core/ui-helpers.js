import { makeDraggable } from './drag-drop.js';
import { state } from './state.js';

/* =========================
   ADD REMOVE BUTTON + DRAG
========================= */
export function addRemoveButton(el) {
  // make widget draggable
  makeDraggable(el);

  // mark as widget (important for drag rules)
  if (!el.dataset.canvasBlock) {
    el.dataset.canvasBlock = 'widget';
  }

  // wrapper safety
  el.style.position = el.style.position || 'relative';

  // remove button
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerHTML = '✕';
  btn.className = `
    el-remove-btn
    absolute -top-2 -right-2
    w-5 h-5
    bg-black text-white text-xs
    rounded-full
    flex items-center justify-center
    cursor-pointer
  `;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    el.remove();
    if (state.selected === el) {
      state.selected = null;
    }
  });

  el.appendChild(btn);
}
