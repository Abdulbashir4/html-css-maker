import { enableDropTarget } from './drag-drop.js';
import { addRemoveButton } from './ui-helpers.js';

/* =========================
   CREATE BLOCK (ENTRY)
========================= */
export function createBlock(type) {
           let el = null;
           if (type === 'div') {
            el = document.createElement('div');
            el.className = 'el-section block-wrapper border border-dashed relative p-4 min-h-[120px]';
            el.dataset.canvasBlock = 'div';
            el.dataset.isContainer = 'true';
            el.innerHTML = `<div class="el-section-toolbar">
                <button data-action="add-col">＋ Column</button>
                <button data-action="remove">✕</button>
              </div>
              <div class="el-section-inner"></div>`;
              const inner = el.querySelector(".el-section-inner");

            // default column
            inner.appendChild(createColumn(true));

            enableDropTarget(inner);

            el.querySelector('[data-action="remove"]').onclick =
              () => el.remove();

            el.querySelector('[data-action="add-col"]').onclick =
              () => inner.appendChild(createColumn());

            return el;

           }

            /* ===== SECTION ===== */
          else if (type === 'section') {

            el = document.createElement('div');
            el.className =
              'el-section block-wrapper border border-dashed relative p-4 min-h-[120px]';
            el.dataset.canvasBlock = 'section';
            el.dataset.isContainer = 'true';

            el.innerHTML = `
              <div class="el-section-toolbar">
                <button data-action="add-col">＋ Column</button>
                <button data-action="remove">✕</button>
              </div>

              <div class="el-section-inner"></div>
            `;

            const inner = el.querySelector(".el-section-inner");

            // default column
            inner.appendChild(createColumn(true));

            enableDropTarget(inner);

            el.querySelector('[data-action="remove"]').onclick =
              () => el.remove();

            el.querySelector('[data-action="add-col"]').onclick =
              () => inner.appendChild(createColumn());

            return el;
          }


          /*=====For Div block========= */




  /* ===== COLUMN ===== */
  if (type === 'column') return createColumn();

  /* ===== TEXT ===== */
  if (type === 'text') {
    el = document.createElement('p');
    el.textContent = 'Edit text';
    el.contentEditable = true;
    el.dataset.canvasBlock = 'text';
    addRemoveButton(el);
    return el;
  }

  /* =========================
button block
============================ */

        if (type === 'button') {
        const btn = document.createElement('button');
        btn.textContent = 'Click me';
        btn.dataset.canvasBlock = 'button';

        // default tailwind
        btn.dataset.tw = 'px-4 py-2 bg-blue-600 text-white rounded';

        addRemoveButton(btn);
        return btn;
        }


  return null;
}






/* =========================
   COLUMN
========================= */
export function createColumn(full = false) {
  const col = document.createElement('div');
  col.className =
    'el-column block-wrapper border border-dashed p-4 min-h-[120px] relative';
  col.dataset.canvasBlock = 'column';
  col.dataset.isContainer = 'true';

  const width = full ? 100 : 50;
  col.style.flex = `0 0 ${width}%`;
  col.style.maxWidth = `${width}%`;

  col.innerHTML = `
    <div class="el-column-toolbar">
      <button class="col-remove">✕</button>
    </div>
    <div class="el-column-inner"></div>
  `;

  const inner = col.querySelector('.el-column-inner');
  enableDropTarget(inner);

  col.querySelector('.col-remove').onclick = () => col.remove();

  return col;
}
