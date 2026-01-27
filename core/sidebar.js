import { state } from './state.js';
import { createBlock } from './block-factory.js';

export function bindSidebar() {
  document.querySelectorAll('.block-item').forEach(item => {

    // sidebar item draggable only on drag
    item.draggable = false;

    /* =====================
       CLICK → ADD BLOCK
    ===================== */
    item.addEventListener('click', e => {
      e.stopPropagation();
      if (state.isDragging) return;

      const type = item.dataset.type;
      const el = createBlock(type);
      if (!el) return;

      /* =====================
         SMART INSERT (NEW)
      ===================== */

      // widget (text, image etc.)
      if (type !== 'section') {
        // 1️⃣ if a column is selected
        if (state.selected?.dataset.canvasBlock === 'column') {
          const inner =
            state.selected.querySelector('.el-column-inner') ||
            state.selected;
          inner.appendChild(el);
          return;
        }

        // 2️⃣ fallback: first column in canvas
        const firstColumnInner =
          document.querySelector('.el-column-inner');
        if (firstColumnInner) {
          firstColumnInner.appendChild(el);
          return;
        }
      }

      // 3️⃣ default: add to canvas (section)
      state.canvas.appendChild(el);
    });

    /* =====================
       DRAG START
    ===================== */
    item.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      item.draggable = true;
    });

    item.addEventListener('dragstart', e => {
      state.isDragging = true;

      // pass block type
      e.dataTransfer.setData(
        'application/codgen-block',
        item.dataset.type
      );
    });

    /* =====================
       DRAG END
    ===================== */
    item.addEventListener('dragend', () => {
      item.draggable = false;
      state.isDragging = false;
    });

  });
}
