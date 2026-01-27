import { state } from './state.js';

let draggedEl = null;

/* =========================
   MAKE ANY ELEMENT DRAGGABLE
========================= */
export function makeDraggable(el) {
  el.draggable = true;

  el.addEventListener('dragstart', e => {
    draggedEl = el;
    state.isDragging = true;

    // required for Firefox
    e.dataTransfer.setData('text/plain', '');

    el.classList.add('opacity-50');
  });

  el.addEventListener('dragend', () => {
    draggedEl = null;
    state.isDragging = false;
    el.classList.remove('opacity-50');
  });
}

/* =========================
   ENABLE DROP TARGET
========================= */
export function enableDropTarget(target) {
  target.addEventListener('dragover', e => {
    e.preventDefault();
  });

  target.addEventListener('drop', e => {
    e.preventDefault();

    if (!draggedEl) return;

    const draggedType = draggedEl.dataset.canvasBlock;

    /* =========================
       RULES (ELEMENTOR STYLE)
    ========================= */

    // ❌ widgets cannot be dropped into section directly
    if (
      target.dataset.canvasBlock === 'section' &&
      draggedType !== 'section'
    ) {
      return;
    }

    // ✅ widgets can be dropped only into column inner
    if (target.classList.contains('el-column-inner')) {
      target.appendChild(draggedEl);
      return;
    }

    // ❌ prevent invalid drops
    return;
  });
}
